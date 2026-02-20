from datetime import datetime, timezone

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename

from utils.hash_utils import generate_hash_from_stream, generate_submission_id
from utils.storage import get_all_submissions, save_submission

submit_bp = Blueprint('submit', __name__)


def _allowed_file(filename: str) -> bool:
    """Check if a filename has an allowed extension."""
    return '.' in filename and (
        filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']
    )


@submit_bp.route('/api/submit', methods=['POST'])
def submit_file():
    """Submit a file and store its blob + hash + anchor metadata in DB."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '' or file.filename is None:
        return jsonify({'error': 'No file selected'}), 400

    if not _allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    safe_name = secure_filename(file.filename) or 'uploaded_file'

    # Pure in-memory handling: no local file persistence.
    file_hash = generate_hash_from_stream(file.stream)
    file.stream.seek(0)
    file_bytes = file.stream.read()

    if not isinstance(file_bytes, (bytes, bytearray)):
        return jsonify({'error': 'Failed to read uploaded file'}), 400
    submission_id = generate_submission_id()
    timestamp = datetime.now(timezone.utc).isoformat()

    submission = save_submission(
        submission_id=submission_id,
        file_hash=file_hash,
        timestamp=timestamp,
        filename=safe_name,
        content_type=(file.mimetype or 'application/octet-stream'),
        file_bytes=file_bytes,
    )

    return jsonify({
        'message': 'File submitted successfully',
        'submission_id': submission['submission_id'],
        'filename': submission.get('filename'),
        'content_type': submission.get('content_type'),
        'file_size': submission.get('file_size'),
        'file_hash': submission['file_hash'],
        'timestamp': submission['timestamp'],
        'blockchain_anchor': {
            'anchored_at': submission.get('anchored_at'),
            'anchor_hash': submission.get('anchor_hash'),
            'previous_anchor_hash': submission.get('prev_anchor_hash'),
        },
    }), 201


@submit_bp.route('/api/submissions', methods=['GET'])
def list_submissions():
    """List all submission hash records (newest first)."""
    submissions = get_all_submissions()
    return jsonify({'count': len(submissions), 'submissions': submissions}), 200
