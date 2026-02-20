import os
from datetime import datetime, timezone

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from utils.hash_utils import generate_hash, generate_submission_id
from utils.storage import save_submission

submit_bp = Blueprint('submit', __name__)


def _allowed_file(filename: str) -> bool:
    """Check if a filename has an allowed extension."""
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


@submit_bp.route('/api/submit', methods=['POST'])
def submit_file():
    """Handle file submission.

    Expects multipart form data with:
        - file: The file to submit (required)
        - team_name: Name of the submitting team (optional)

    Returns:
        JSON with submission_id, filename, file_hash, and timestamp.
    """
    # Validate file presence
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '' or file.filename is None:
        return jsonify({'error': 'No file selected'}), 400

    if not _allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    # Save file to uploads folder
    filename = secure_filename(file.filename)
    upload_folder = current_app.config['UPLOAD_FOLDER']
    file_path = os.path.join(upload_folder, filename)

    # Avoid overwriting — append timestamp if file exists
    if os.path.exists(file_path):
        name, ext = os.path.splitext(filename)
        timestamp_suffix = datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')
        filename = f"{name}_{timestamp_suffix}{ext}"
        file_path = os.path.join(upload_folder, filename)

    file.save(file_path)

    # Generate hash and submission ID
    file_hash = generate_hash(file_path)
    submission_id = generate_submission_id()
    timestamp = datetime.now(timezone.utc).isoformat()

    # Get optional team name
    team_name = request.form.get('team_name', '')

    # Store submission
    submission = save_submission(
        submission_id=submission_id,
        filename=filename,
        file_hash=file_hash,
        team_name=team_name,
        timestamp=timestamp,
    )

    return jsonify({
        'message': 'File submitted successfully',
        'submission_id': submission['submission_id'],
        'filename': submission['filename'],
        'file_hash': submission['file_hash'],
        'timestamp': submission['timestamp'],
    }), 201
