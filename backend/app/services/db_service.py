"""
MongoDB database service for AIview.

Provides reusable functions for CRUD operations on interview sessions.
All database logic is encapsulated here for clean separation of concerns.
"""

from datetime import datetime, timezone
from typing import Any

from bson import ObjectId
from pymongo import MongoClient, DESCENDING
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import certifi

from app.config import settings


# ──────────────────────────── Connection ────────────────────────────────

_client: MongoClient | None = None
_db = None
_collection = None


def connect_database() -> None:
    """
    Initialize the MongoDB connection.

    Called once at application startup. Sets module-level references
    to the database and sessions collection.
    """
    global _client, _db, _collection

    _client = MongoClient(
        settings.MONGODB_URI,
        serverSelectionTimeoutMS=5000,
        tlsCAFile=certifi.where()
    )
    _db = _client[settings.DB_NAME]
    _collection = _db[settings.COLLECTION_NAME]

    # Force a connection attempt so errors surface at startup
    _client.admin.command("ping")


def _get_collection():
    """Return the sessions collection, raising if not connected."""
    if _collection is None:
        raise RuntimeError("Database not connected. Call connect_database() first.")
    return _collection


# ──────────────────────────── CRUD Operations ───────────────────────────


def save_session(
    candidate_name: str,
    domain: str,
    transcript: list[dict],
    evaluation: dict,
) -> str:
    """
    Save a completed interview session to MongoDB.

    Returns the inserted document's ID as a string.
    """
    doc = {
        "candidate_name": candidate_name,
        "domain": domain,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "transcript": transcript,
        "evaluation": evaluation,
    }
    result = _get_collection().insert_one(doc)
    return str(result.inserted_id)


def get_session(session_id: str) -> dict[str, Any] | None:
    """
    Retrieve a single session by its ObjectId string.

    Returns None if not found.
    """
    try:
        doc = _get_collection().find_one({"_id": ObjectId(session_id)})
    except Exception:
        return None

    if doc is None:
        return None

    return _serialize(doc)


def get_candidate_history(candidate_name: str) -> list[dict[str, Any]]:
    """
    Return all sessions for a given candidate, sorted newest-first.
    """
    cursor = (
        _get_collection()
        .find({"candidate_name": candidate_name})
        .sort("timestamp", DESCENDING)
    )
    return [_serialize(doc) for doc in cursor]


def delete_session(session_id: str) -> bool:
    """
    Delete one session by ID.

    Returns True if a document was actually deleted.
    """
    try:
        result = _get_collection().delete_one({"_id": ObjectId(session_id)})
    except Exception:
        return False
    return result.deleted_count > 0


def health_check() -> bool:
    """
    Ping MongoDB to verify the connection is alive.
    """
    if _client is None:
        return False
    try:
        _client.admin.command("ping")
        return True
    except (ConnectionFailure, ServerSelectionTimeoutError):
        return False


# ──────────────────────────── Helpers ───────────────────────────────────


def _serialize(doc: dict) -> dict[str, Any]:
    """Convert a raw MongoDB document into a JSON-safe dict."""
    return {
        "id": str(doc["_id"]),
        "candidate_name": doc.get("candidate_name", ""),
        "domain": doc.get("domain", ""),
        "timestamp": doc.get("timestamp", ""),
        "transcript": doc.get("transcript", []),
        "evaluation": doc.get("evaluation", {}),
    }
