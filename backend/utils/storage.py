"""Submission storage backend.

All records are persisted in MySQL.
"""

from flask import current_app

from utils.db_utils import (
    get_all_submissions_mysql,
    get_submission_mysql,
    save_submission_mysql,
)


def save_submission(
    submission_id: str,
    file_hash: str,
    timestamp: str,
    filename: str,
    content_type: str,
    file_bytes: bytes,
) -> dict:
    """Save a submission record."""
    return save_submission_mysql(
        current_app.config,
        submission_id=submission_id,
        file_hash=file_hash,
        timestamp=timestamp,
        filename=filename,
        content_type=content_type,
        file_bytes=file_bytes,
    )


def get_submission(submission_id: str) -> dict | None:
    """Retrieve a submission by its ID.

    Args:
        submission_id: The unique submission identifier.

    Returns:
        Submission dict if found, None otherwise.
    """
    return get_submission_mysql(current_app.config, submission_id)


def get_all_submissions() -> list[dict]:
    """Retrieve all submissions.

    Returns:
        List of all submission dicts.
    """
    return get_all_submissions_mysql(current_app.config)
