import os

class Settings:
    PROJECT_NAME: str = "CareerSense AI"
    PROJECT_VERSION: str = "1.0.0"
    DATABASE_URL: str = "sqlite:///./careersense.db"  # SQLite for local dev

settings = Settings()
