from flask import Blueprint, jsonify, request

from utils.hash_utils import generate_hash_from_stream
from utils.storage import get_submission

verify_bp = Blueprint('verify', __name__)


@verify_bp.route('/api/verify', methods=['POST'])
def verify_file():
    """Verify an uploaded file against the anchored hash for a submission."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '' or file.filename is None:
        return jsonify({'error': 'No file selected'}), 400

    submission_id = request.form.get('submission_id')
    if not submission_id:
        return jsonify({'error': 'No submission_id provided'}), 400

    original = get_submission(submission_id)
    if not original:
        return jsonify({'error': f'Submission not found: {submission_id}'}), 404

    uploaded_hash = generate_hash_from_stream(file.stream)
    uploaded_matches_original = uploaded_hash == original['file_hash']

    return jsonify({
        'verified': uploaded_matches_original,
        'status': 'Authentic - File is unmodified' if uploaded_matches_original
                  else 'Tampered - File has been modified',
        'submission_id': original['submission_id'],
        'original_hash': original['file_hash'],
        'uploaded_hash': uploaded_hash,
        'timestamp': original['timestamp'],
        'blockchain_anchor': {
            'anchored_at': original.get('anchored_at'),
            'anchor_hash': original.get('anchor_hash'),
            'previous_anchor_hash': original.get('prev_anchor_hash'),
        },
    }), 200
