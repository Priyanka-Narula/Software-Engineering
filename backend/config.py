class Config():
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATIONS = False

class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.sqlite3"
    DEBUG = True
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = 'asdflly@123321'
    SECRET_KEY = "123321@asdflly"
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    SECURITY_TOKEN_MAX_AGE = 3600
    WTF_CSRF_ENABLED = False