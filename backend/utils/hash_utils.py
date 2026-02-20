import hashlib
import uuid


def generate_hash(file_path: str) -> str:
    """Compute SHA-256 hash of a file.

    Reads the file in chunks to handle large files efficiently.

    Args:
        file_path: Absolute path to the file.

    Returns:
        Hex-encoded SHA-256 hash string.
    """
    sha256 = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha256.update(chunk)
    return sha256.hexdigest()


def generate_hash_from_stream(stream) -> str:
    """Compute SHA-256 hash from a binary stream.

    The stream is rewound to the original position after hashing when possible.
    """
    sha256 = hashlib.sha256()
    start_pos = None

    try:
        start_pos = stream.tell()
        stream.seek(0)
    except (AttributeError, OSError):
        start_pos = None

    for chunk in iter(lambda: stream.read(8192), b''):
        sha256.update(chunk)

    if start_pos is not None:
        try:
            stream.seek(start_pos)
        except OSError:
            pass

    return sha256.hexdigest()


def generate_submission_id() -> str:
    """Generate a unique submission ID.

    Returns:
        A UUID4-based string prefixed with 'HV-'.
    """
    return f"HV-{uuid.uuid4().hex[:12].upper()}"
