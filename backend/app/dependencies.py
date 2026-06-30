"""
Shared FastAPI dependencies for AIview.

Provides dependency-injected access to services for route handlers.
"""

from app.services import ai_service, db_service


def get_ai_service():
    """Dependency that returns the AI service module."""
    return ai_service


def get_db_service():
    """Dependency that returns the database service module."""
    return db_service
