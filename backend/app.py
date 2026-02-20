from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from config import Config
from routes.auth_routes import auth_bp
from routes.submit_routes import submit_bp
from routes.verify_routes import verify_bp
from utils.db_utils import init_database


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)
    app.config['ALLOWED_EXTENSIONS'] = Config.ALLOWED_EXTENSIONS

    # Enable CORS for configured origins
    CORS(app, origins=Config.CORS_ORIGINS)

    # Initialize MySQL schema.
    init_database(app.config)

    # Register route blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(submit_bp)
    app.register_blueprint(verify_bp)

    # --- Centralized error handlers ---

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'error': 'Bad request', 'message': str(e)}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({'error': 'Unauthorized', 'message': str(e)}), 401

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Not found', 'message': str(e)}), 404

    @app.errorhandler(413)
    def file_too_large(e):
        max_mb = Config.MAX_CONTENT_LENGTH // (1024 * 1024)
        return jsonify({
            'error': 'File too large',
            'message': f'Maximum file size is {max_mb} MB',
        }), 413

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'error': 'Internal server error'}), 500

    @app.errorhandler(Exception)
    def unhandled_exception(e):
        app.logger.exception('Unhandled exception: %s', e)
        return jsonify({'error': 'Internal server error'}), 500

    # Health check route
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {'status': 'ok', 'message': 'HashVault API is running'}, 200

    return app


if __name__ == '__main__':
    app = create_app()
    print("\n🛡️  HashVault API Server")
    print("   → Running on http://localhost:5000")
    print("   → Submit:  POST /api/submit")
    print("   → Verify:  POST /api/verify")
    print("   → Health:  GET  /api/health\n")
    app.run(host='0.0.0.0', port=5000, debug=Config.DEBUG)
