from flask import Blueprint, request, jsonify

from utils.hash_utils import generate_hash_from_stream
from utils.storage import get_submission

verify_bp = Blueprint('verify', __name__)


@verify_bp.route('/api/verify', methods=['POST'])
def verify_file():
    """Handle file verification.

    Expects multipart form data with:
        - file: The file to verify (required)
        - submission_id: The original submission ID (required)

    Returns:
        JSON with verification result, original hash, uploaded file hash,
        and original submission details.
    """
    # Validate inputs
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '' or file.filename is None:
        return jsonify({'error': 'No file selected'}), 400

    submission_id = request.form.get('submission_id')
    if not submission_id:
        return jsonify({'error': 'No submission_id provided'}), 400

    # Look up original submission
    original = get_submission(submission_id)
    if not original:
        return jsonify({'error': f'Submission not found: {submission_id}'}), 404

    # Hash uploaded content directly from the request stream.
    uploaded_hash = generate_hash_from_stream(file.stream)

    # Compare hashes
    is_verified = uploaded_hash == original['file_hash']

    return jsonify({
        'verified': is_verified,
        'status': '✅ Authentic — File is unmodified' if is_verified
                  else '❌ Tampered — File has been modified',
        'original_hash': original['file_hash'],
        'uploaded_hash': uploaded_hash,
        'submission': {
            'submission_id': original['submission_id'],
            'filename': original['filename'],
            'team_name': original['team_name'],
            'timestamp': original['timestamp'],
        }
    }), 200
