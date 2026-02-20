"""JWT authentication middleware."""

from functools import wraps

import jwt
from flask import current_app, g, jsonify, request

from utils.db_utils import get_user_by_id_mysql


def auth_required(f):
    """Decorator that enforces a valid JWT Bearer token.

    On success the authenticated user dict is stored in ``g.current_user``.
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')

        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid Authorization header'}), 401

        token = auth_header[7:]  # strip "Bearer "

        try:
            payload = jwt.decode(
                token,
                current_app.config['JWT_SECRET'],
                algorithms=['HS256'],
            )
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        user = get_user_by_id_mysql(current_app.config, payload.get('user_id'))
        if not user:
            return jsonify({'error': 'User not found'}), 401

        g.current_user = user
        return f(*args, **kwargs)

    return decorated
