import hashlib
import uuid


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
