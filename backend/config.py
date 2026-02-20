import os


class Config:
    """Application configuration."""

    # Upload settings
    MAX_CONTENT_LENGTH = 60 * 1024 * 1024  # 60 MB max file size
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'zip', 'rar',
                          'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'py', 'js',
                          'html', 'css', 'json', 'csv', 'md'}

    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'hashvault-dev-secret-key')
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

    # CORS origins (comma-separated list)
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get(
            'CORS_ORIGINS',
            'http://localhost:5173,http://127.0.0.1:5173',
        ).split(',')
        if origin.strip()
    ]

    # MySQL settings
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = int(os.environ.get('DB_PORT', 3306))
    DB_USER = os.environ.get('DB_USER', 'root')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', '')
    DB_NAME = os.environ.get('DB_NAME', 'hashvault')

    # JWT settings
    JWT_SECRET = os.environ.get('JWT_SECRET', 'hashvault-jwt-dev-secret')
    JWT_EXPIRY_HOURS = int(os.environ.get('JWT_EXPIRY_HOURS', 24))
