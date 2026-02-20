import os

from flask import Flask
from flask_cors import CORS

from config import Config
from routes.submit_routes import submit_bp
from routes.verify_routes import verify_bp


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)
    app.config['ALLOWED_EXTENSIONS'] = Config.ALLOWED_EXTENSIONS

    # Enable CORS for React frontend
    CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])

    # Ensure uploads directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register route blueprints
    app.register_blueprint(submit_bp)
    app.register_blueprint(verify_bp)

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
