import os

class Config:
    """Application configuration."""

    # Upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max file size
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'zip', 'rar',
                          'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'py', 'js',
                          'html', 'css', 'json', 'csv', 'md'}

    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'hashvault-dev-secret-key')
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'

    # Database settings (for future MySQL integration)
    # DB_HOST = os.environ.get('DB_HOST', 'localhost')
    # DB_PORT = int(os.environ.get('DB_PORT', 3306))
    # DB_USER = os.environ.get('DB_USER', 'root')
    # DB_PASSWORD = os.environ.get('DB_PASSWORD', '')
    # DB_NAME = os.environ.get('DB_NAME', 'hashvault')
