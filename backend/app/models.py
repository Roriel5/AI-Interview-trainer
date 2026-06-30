"""
Pydantic models for request/response validation.

Every API contract is defined here so the frontend integration
stays consistent and type-safe.
"""

from pydantic import BaseModel, Field


# ──────────────────────────── Request Models ────────────────────────────


class StartInterviewRequest(BaseModel):
    """POST /start-interview request body."""
    candidate_name: str = Field(..., min_length=1, description="Name of the candidate")
    domain: str = Field(..., min_length=1, description="Interview domain / role")


class ChatRequest(BaseModel):
    """POST /chat request body.

    The frontend sends the ENTIRE conversation history with every request
    so the backend remains stateless.
    """
    domain: str = Field(..., min_length=1)
    history: list[dict] = Field(default_factory=list, description="Full conversation history")
    user_message: str = Field(..., min_length=1, description="Latest candidate message")


class EvaluateRequest(BaseModel):
    """POST /evaluate request body."""
    candidate_name: str = Field(..., min_length=1)
    domain: str = Field(..., min_length=1)
    history: list[dict] = Field(default_factory=list, description="Full interview transcript")


# ──────────────────────────── Response Models ───────────────────────────


class StartInterviewResponse(BaseModel):
    """POST /start-interview response."""
    message: str


class ChatResponse(BaseModel):
    """POST /chat response."""
    bot_response: str


class FeedbackItem(BaseModel):
    """One piece of feedback inside an evaluation."""
    type: str = Field(..., description="'positive' or 'improvement'")
    text: str


class ModelAnswer(BaseModel):
    """A model answer for one interview question."""
    question: str
    answer: str


class EvaluationResponse(BaseModel):
    """POST /evaluate response — structured interview evaluation."""
    technicalScore: int = Field(..., ge=0, le=10)
    communicationScore: int = Field(..., ge=0, le=10)
    feedback: list[FeedbackItem] = Field(default_factory=list)
    modelAnswers: list[ModelAnswer] = Field(default_factory=list)


class HealthResponse(BaseModel):
    """GET /health response."""
    status: str
    mongodb: str
    gemini: str


class SessionResponse(BaseModel):
    """GET /session/{session_id} response."""
    id: str
    candidate_name: str
    domain: str
    timestamp: str
    transcript: list[dict]
    evaluation: dict


class DeleteResponse(BaseModel):
    """DELETE /session/{session_id} response."""
    message: str
