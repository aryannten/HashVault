"""MySQL helpers for submission persistence with blockchain-style anchoring."""

import hashlib
from datetime import datetime, timezone


def _cfg(config, key: str, default=None):
    if hasattr(config, 'get'):
        return config.get(key, default)
    return getattr(config, key, default)


def _require_pymysql():
    try:
        import pymysql  # type: ignore
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "MySQL backend requires 'pymysql'. Install dependencies from requirements.txt."
        ) from exc
    return pymysql


def _quote_identifier(name: str) -> str:
    return f"`{name.replace('`', '``')}`"


def _open_connection(config, with_database: bool):
    pymysql = _require_pymysql()
    params = {
        'host': _cfg(config, 'DB_HOST'),
        'port': int(_cfg(config, 'DB_PORT', 3306)),
        'user': _cfg(config, 'DB_USER'),
        'password': _cfg(config, 'DB_PASSWORD', ''),
        'charset': 'utf8mb4',
        'autocommit': False,
        'cursorclass': pymysql.cursors.DictCursor,
    }
    if with_database:
        params['database'] = _cfg(config, 'DB_NAME')
    return pymysql.connect(**params)


def _to_mysql_datetime(timestamp_iso: str) -> datetime:
    dt = datetime.fromisoformat(timestamp_iso.replace('Z', '+00:00'))
    if dt.tzinfo is not None:
        dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
    return dt


def _to_api_timestamp(value) -> str:
    if isinstance(value, datetime):
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        else:
            value = value.astimezone(timezone.utc)
        return value.isoformat()
    return str(value)


def _to_api_timestamp_or_none(value) -> str | None:
    if value is None:
        return None
    return _to_api_timestamp(value)


def _ensure_column(cur, db_name: str, table: str, column: str, ddl: str) -> None:
    cur.execute(
        """
        SELECT 1
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s
        LIMIT 1
        """,
        (db_name, table, column),
    )
    if cur.fetchone() is None:
        cur.execute(ddl)


def _make_nullable_if_exists(cur, db_name: str, table: str, column: str, column_type: str) -> None:
    cur.execute(
        """
        SELECT IS_NULLABLE
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s
        LIMIT 1
        """,
        (db_name, table, column),
    )
    row = cur.fetchone()
    if row and row.get('IS_NULLABLE') == 'NO':
        cur.execute(f"ALTER TABLE {table} MODIFY COLUMN {column} {column_type} NULL")


def init_database(config) -> None:
    """Create database/tables and keep schema compatible with existing installs."""
    db_name = _cfg(config, 'DB_NAME', 'hashvault')
    db_ident = _quote_identifier(db_name)

    conn = _open_connection(config, with_database=False)
    try:
        with conn.cursor() as cur:
            cur.execute(f"CREATE DATABASE IF NOT EXISTS {db_ident}")
        conn.commit()
    finally:
        conn.close()

    conn = _open_connection(config, with_database=True)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS submissions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    submission_id VARCHAR(100) NOT NULL UNIQUE,
                    filename VARCHAR(255) NULL,
                    content_type VARCHAR(255) NULL,
                    file_size BIGINT NULL,
                    file_blob LONGBLOB NULL,
                    file_hash CHAR(64) NOT NULL,
                    timestamp DATETIME(6) NOT NULL,
                    anchored_at DATETIME(6) NOT NULL,
                    anchor_hash CHAR(64) NOT NULL UNIQUE,
                    prev_anchor_hash CHAR(64) NULL
                )
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS anchors (
                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                    block_index BIGINT NOT NULL UNIQUE,
                    submission_id VARCHAR(100) NOT NULL UNIQUE,
                    file_hash CHAR(64) NOT NULL,
                    anchored_at DATETIME(6) NOT NULL,
                    prev_anchor_hash CHAR(64) NULL,
                    anchor_hash CHAR(64) NOT NULL UNIQUE
                )
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(100) NOT NULL UNIQUE,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                )
                """
            )

            # Compatibility for older table variants.
            _make_nullable_if_exists(cur, db_name, 'submissions', 'team_name', 'VARCHAR(255)')
            _make_nullable_if_exists(cur, db_name, 'submissions', 'filename', 'VARCHAR(255)')

            _ensure_column(
                cur, db_name, 'submissions', 'filename',
                'ALTER TABLE submissions ADD COLUMN filename VARCHAR(255) NULL'
            )
            _ensure_column(
                cur, db_name, 'submissions', 'content_type',
                'ALTER TABLE submissions ADD COLUMN content_type VARCHAR(255) NULL'
            )
            _ensure_column(
                cur, db_name, 'submissions', 'file_size',
                'ALTER TABLE submissions ADD COLUMN file_size BIGINT NULL'
            )
            _ensure_column(
                cur, db_name, 'submissions', 'file_blob',
                'ALTER TABLE submissions ADD COLUMN file_blob LONGBLOB NULL'
            )
            _ensure_column(
                cur, db_name, 'submissions', 'anchored_at',
                'ALTER TABLE submissions ADD COLUMN anchored_at DATETIME(6) NULL'
            )
            _ensure_column(
                cur, db_name, 'submissions', 'anchor_hash',
                'ALTER TABLE submissions ADD COLUMN anchor_hash CHAR(64) NULL'
            )
            _ensure_column(
                cur, db_name, 'submissions', 'prev_anchor_hash',
                'ALTER TABLE submissions ADD COLUMN prev_anchor_hash CHAR(64) NULL'
            )
        conn.commit()
    finally:
        conn.close()


def _get_latest_anchor(cur) -> tuple[int, str | None]:
    cur.execute(
        """
        SELECT block_index, anchor_hash
        FROM anchors
        ORDER BY block_index DESC
        LIMIT 1
        """
    )
    row = cur.fetchone()
    if not row:
        return 0, None
    return int(row['block_index']), row['anchor_hash']


def _build_anchor_hash(block_index: int, submission_id: str, file_hash: str,
                       anchored_at: datetime, prev_anchor_hash: str | None) -> str:
    payload = (
        f"{block_index}|{submission_id}|{file_hash}|"
        f"{anchored_at.isoformat()}|{prev_anchor_hash or ''}"
    )
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()


def save_submission_mysql(
    config,
    submission_id: str,
    file_hash: str,
    timestamp: str,
    filename: str,
    content_type: str,
    file_bytes: bytes,
) -> dict:
    submission_time = _to_mysql_datetime(timestamp)
    anchored_at = datetime.now(timezone.utc).replace(tzinfo=None)
    file_size = len(file_bytes)

    conn = _open_connection(config, with_database=True)
    try:
        with conn.cursor() as cur:
            last_block_index, prev_anchor_hash = _get_latest_anchor(cur)
            block_index = last_block_index + 1
            anchor_hash = _build_anchor_hash(
                block_index=block_index,
                submission_id=submission_id,
                file_hash=file_hash,
                anchored_at=anchored_at,
                prev_anchor_hash=prev_anchor_hash,
            )

            cur.execute(
                """
                INSERT INTO submissions (
                    submission_id, filename, content_type, file_size, file_blob,
                    file_hash, timestamp, anchored_at, anchor_hash, prev_anchor_hash
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    submission_id,
                    filename,
                    content_type,
                    file_size,
                    file_bytes,
                    file_hash,
                    submission_time,
                    anchored_at,
                    anchor_hash,
                    prev_anchor_hash,
                ),
            )
            cur.execute(
                """
                INSERT INTO anchors (
                    block_index, submission_id, file_hash, anchored_at, prev_anchor_hash, anchor_hash
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    block_index,
                    submission_id,
                    file_hash,
                    anchored_at,
                    prev_anchor_hash,
                    anchor_hash,
                ),
            )
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    return {
        'submission_id': submission_id,
        'filename': filename,
        'content_type': content_type,
        'file_size': file_size,
        'file_hash': file_hash,
        'timestamp': timestamp,
        'anchored_at': _to_api_timestamp(anchored_at),
        'anchor_hash': anchor_hash,
        'prev_anchor_hash': prev_anchor_hash,
    }


def get_submission_mysql(config, submission_id: str) -> dict | None:
    conn = _open_connection(config, with_database=True)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    submission_id,
                    filename,
                    content_type,
                    file_size,
                    file_hash,
                    timestamp,
                    anchored_at,
                    anchor_hash,
                    prev_anchor_hash
                FROM submissions
                WHERE submission_id = %s
                LIMIT 1
                """,
                (submission_id,),
            )
            row = cur.fetchone()
    finally:
        conn.close()

    if not row:
        return None

    row['timestamp'] = _to_api_timestamp(row['timestamp'])
    row['anchored_at'] = _to_api_timestamp_or_none(row.get('anchored_at'))
    return row


def get_all_submissions_mysql(config) -> list[dict]:
    conn = _open_connection(config, with_database=True)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    submission_id,
                    filename,
                    content_type,
                    file_size,
                    file_hash,
                    timestamp,
                    anchored_at,
                    anchor_hash,
                    prev_anchor_hash
                FROM submissions
                ORDER BY timestamp DESC
                """
            )
            rows = cur.fetchall()
    finally:
        conn.close()

    for row in rows:
        row['timestamp'] = _to_api_timestamp(row['timestamp'])
        row['anchored_at'] = _to_api_timestamp_or_none(row.get('anchored_at'))
    return rows


# --------------- User CRUD ---------------

def create_user_mysql(config, username: str, email: str, password_hash: str) -> dict:
    conn = _open_connection(config, with_database=True)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (username, email, password_hash)
                VALUES (%s, %s, %s)
                """,
                (username, email, password_hash),
            )
            user_id = cur.lastrowid
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    return {'id': user_id, 'username': username, 'email': email}


def get_user_by_username_mysql(config, username: str) -> dict | None:
    conn = _open_connection(config, with_database=True)
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, username, email, password_hash, created_at FROM users WHERE username = %s LIMIT 1",
                (username,),
            )
            row = cur.fetchone()
    finally:
        conn.close()
    if row and row.get('created_at'):
        row['created_at'] = _to_api_timestamp(row['created_at'])
    return row


def get_user_by_email_mysql(config, email: str) -> dict | None:
    conn = _open_connection(config, with_database=True)
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, username, email, password_hash, created_at FROM users WHERE email = %s LIMIT 1",
                (email,),
            )
            row = cur.fetchone()
    finally:
        conn.close()
    if row and row.get('created_at'):
        row['created_at'] = _to_api_timestamp(row['created_at'])
    return row


def get_user_by_id_mysql(config, user_id: int) -> dict | None:
    conn = _open_connection(config, with_database=True)
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, username, email, created_at FROM users WHERE id = %s LIMIT 1",
                (user_id,),
            )
            row = cur.fetchone()
    finally:
        conn.close()
    if row and row.get('created_at'):
        row['created_at'] = _to_api_timestamp(row['created_at'])
    return row
