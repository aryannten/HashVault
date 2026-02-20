"""Authentication routes — signup, login, and current-user lookup."""

from datetime import datetime, timezone, timedelta

import bcrypt
import jwt
from flask import Blueprint, current_app, g, jsonify, request

from utils.auth_middleware import auth_required
from utils.db_utils import (
    create_user_mysql,
    get_user_by_email_mysql,
    get_user_by_username_mysql,
)

auth_bp = Blueprint('auth', __name__)


def _generate_token(user_id: int) -> str:
    """Create a signed JWT for the given user."""
    expiry_hours = current_app.config.get('JWT_EXPIRY_HOURS', 24)
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=expiry_hours),
        'iat': datetime.now(timezone.utc),
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET'], algorithm='HS256')


@auth_bp.route('/api/auth/signup', methods=['POST'])
def signup():
    """Register a new user.

    Expects JSON: { username, email, password }
    Returns: { token, user: { id, username, email } }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Request body must be JSON'}), 400

    username = (data.get('username') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    # --- Validation ---
    errors = []
    if not username or len(username) < 3:
        errors.append('Username must be at least 3 characters')
    if not email or '@' not in email:
        errors.append('A valid email is required')
    if not password or len(password) < 6:
        errors.append('Password must be at least 6 characters')
    if errors:
        return jsonify({'error': 'Validation failed', 'details': errors}), 400

    # --- Check duplicates ---
    config = current_app.config
    if get_user_by_username_mysql(config, username):
        return jsonify({'error': 'Username already taken'}), 409
    if get_user_by_email_mysql(config, email):
        return jsonify({'error': 'Email already registered'}), 409

    # --- Hash password & create user ---
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user = create_user_mysql(config, username=username, email=email, password_hash=password_hash)

    token = _generate_token(user['id'])

    return jsonify({
        'message': 'Account created successfully',
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
        },
    }), 201


@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    """Authenticate a user.

    Expects JSON: { username, password }  (username can also be an email)
    Returns: { token, user: { id, username, email } }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Request body must be JSON'}), 400

    identifier = (data.get('username') or '').strip()
    password = data.get('password') or ''

    if not identifier or not password:
        return jsonify({'error': 'Username/email and password are required'}), 400

    config = current_app.config

    # Allow login with username or email
    user = get_user_by_username_mysql(config, identifier)
    if not user:
        user = get_user_by_email_mysql(config, identifier.lower())
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Verify password
    if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = _generate_token(user['id'])

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
        },
    }), 200


@auth_bp.route('/api/auth/me', methods=['GET'])
@auth_required
def me():
    """Return the currently authenticated user."""
    user = g.current_user
    return jsonify({
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'created_at': user.get('created_at'),
        },
    }), 200
