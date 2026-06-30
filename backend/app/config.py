"""
Configuration module for AIview backend.

Loads environment variables and provides centralized app settings.
"""

import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    # Gemini AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # MongoDB
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DB_NAME: str = "aiview_db"
    COLLECTION_NAME: str = "sessions"

    # CORS — allow the React dev server and any deployed frontend
    CORS_ORIGINS: list[str] = ["*"]

    def validate(self) -> None:
        """Raise if required environment variables are missing."""
        missing: list[str] = []
        if not self.GEMINI_API_KEY:
            missing.append("GEMINI_API_KEY")
        if not self.MONGODB_URI:
            missing.append("MONGODB_URI")
        if missing:
            raise EnvironmentError(
                f"Missing required environment variables: {', '.join(missing)}"
            )


# Singleton settings instance
settings = Settings()
