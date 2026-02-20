"""In-memory storage for submissions.

Temporary replacement for MySQL database. Stores submissions in a Python dict.
All functions have the same signatures that a future db_utils.py would use,
making it easy to swap later.
"""

# In-memory store: { submission_id: { ...submission_data } }
_submissions = {}


def save_submission(submission_id: str, filename: str, file_hash: str,
                    team_name: str, timestamp: str) -> dict:
    """Save a submission record.

    Args:
        submission_id: Unique submission identifier.
        filename: Original name of the uploaded file.
        file_hash: SHA-256 hash of the file.
        team_name: Name of the submitting team (optional).
        timestamp: ISO-format timestamp of submission.

    Returns:
        The saved submission dict.
    """
    submission = {
        'submission_id': submission_id,
        'filename': filename,
        'file_hash': file_hash,
        'team_name': team_name,
        'timestamp': timestamp,
    }
    _submissions[submission_id] = submission
    return submission


def get_submission(submission_id: str) -> dict | None:
    """Retrieve a submission by its ID.

    Args:
        submission_id: The unique submission identifier.

    Returns:
        Submission dict if found, None otherwise.
    """
    return _submissions.get(submission_id)


def get_all_submissions() -> list[dict]:
    """Retrieve all submissions.

    Returns:
        List of all submission dicts.
    """
    return list(_submissions.values())
