"""
API route handlers for AIview.

All endpoints are defined here and mounted on the FastAPI app in main.py.
Request/response contracts match the React frontend exactly.
"""

import logging

from fastapi import APIRouter, HTTPException, status

from app.models import (
    ChatRequest,
    ChatResponse,
    DeleteResponse,
    EvaluateRequest,
    EvaluationResponse,
    HealthResponse,
    StartInterviewRequest,
    StartInterviewResponse,
)
from app.services import ai_service, db_service

logger = logging.getLogger("aiview")

router = APIRouter()


# ──────────────────────────── Health & Status ───────────────────────────


@router.get("/")
def root():
    """Root endpoint — basic liveness check."""
    return {"status": "running"}


@router.get("/health", response_model=HealthResponse)
def health():
    """
    Deep health check.

    Verifies both MongoDB connectivity and Gemini initialization.
    """
    mongo_ok = db_service.health_check()
    gemini_ok = ai_service.is_initialized()

    overall = "healthy" if (mongo_ok and gemini_ok) else "degraded"

    return HealthResponse(
        status=overall,
        mongodb="connected" if mongo_ok else "disconnected",
        gemini="initialized" if gemini_ok else "not initialized",
    )


# ──────────────────────────── Interview Flow ────────────────────────────


@router.post("/start-interview", response_model=StartInterviewResponse)
def start_interview(request: StartInterviewRequest):
    """
    Start a new interview.

    Generates a welcome message and the first question for the candidate.
    """
    try:
        message = ai_service.generate_first_question(
            candidate_name=request.candidate_name,
            domain=request.domain,
        )
        return StartInterviewResponse(message=message)
    except Exception as exc:
        logger.exception("Failed to start interview")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate interview question: {str(exc)}",
        )


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Continue an ongoing interview.

    The frontend sends the full conversation history every time.
    The backend is stateless — it reconstructs context from the history.
    """
    try:
        bot_response = ai_service.continue_interview(
            domain=request.domain,
            history=request.history,
            user_message=request.user_message,
        )
        return ChatResponse(bot_response=bot_response)
    except Exception as exc:
        logger.exception("Chat error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate response: {str(exc)}",
        )


@router.post("/evaluate")
def evaluate(request: EvaluateRequest):
    """
    Evaluate a completed interview.

    1. Sends the transcript to Gemini for structured evaluation.
    2. Saves the session (transcript + evaluation) to MongoDB.
    3. Returns the evaluation JSON to the frontend.
    """
    try:
        # Step 1: Get AI evaluation
        evaluation = ai_service.evaluate_interview(
            candidate_name=request.candidate_name,
            domain=request.domain,
            history=request.history,
        )

        # Step 2: Save to MongoDB
        try:
            session_id = db_service.save_session(
                candidate_name=request.candidate_name,
                domain=request.domain,
                transcript=request.history,
                evaluation=evaluation,
            )
            logger.info("Session saved: %s", session_id)
        except Exception as db_exc:
            # Log but don't fail the evaluation — the candidate still gets their score
            logger.warning("Failed to save session to MongoDB: %s", db_exc)

        # Step 3: Return evaluation to frontend
        return evaluation

    except Exception as exc:
        logger.exception("Evaluation error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to evaluate interview: {str(exc)}",
        )


# ──────────────────────────── History & Sessions ────────────────────────


@router.get("/history/{candidate_name}")
def get_history(candidate_name: str):
    """
    Return all previous interviews for a candidate, sorted newest first.
    """
    try:
        sessions = db_service.get_candidate_history(candidate_name)
        return sessions
    except Exception as exc:
        logger.exception("History fetch error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch history: {str(exc)}",
        )


@router.get("/session/{session_id}")
def get_session(session_id: str):
    """
    Return a single interview session by ID.
    """
    session = db_service.get_session(session_id)
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )
    return session


@router.delete("/session/{session_id}", response_model=DeleteResponse)
def delete_session(session_id: str):
    """
    Delete a single interview session by ID.
    """
    deleted = db_service.delete_session(session_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or already deleted",
        )
    return DeleteResponse(message="Session deleted successfully")
