import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'personalized-academic-learning-secret-key-2026')
    DATABASE_PATH = os.path.join(BASE_DIR, 'academic_system.db')
    DEBUG = True
    JSON_SORT_KEYS = False
