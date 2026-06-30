"""
Google Gemini AI service for AIview.

Encapsulates all interactions with the Gemini API:
  - Generating the first interview question
  - Continuing the interview conversation
  - Evaluating a completed interview with structured JSON output
"""

import json
from typing import Any

from google import genai
from google.genai.errors import ClientError

from app.config import settings


# ──────────────────────────── Client ────────────────────────────────────

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    """Lazy-initialize and return the Gemini client."""
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


def is_initialized() -> bool:
    """Check whether the Gemini client can be initialized."""
    try:
        _get_client()
        return True
    except Exception:
        return False


# ──────────────────────────── Interview Flow ────────────────────────────


def generate_first_question(candidate_name: str, domain: str) -> str:
    """
    Generate a welcome message and the first interview question.

    Args:
        candidate_name: The candidate's name.
        domain: The interview role / domain.

    Returns:
        A greeting with the first interview question.
    """
    prompt = (
        f"You are a professional, friendly interviewer for a {domain} role.\n\n"
        f"Welcome the candidate named {candidate_name} warmly.\n"
        f"Then ask the FIRST interview question relevant to the {domain} domain.\n\n"
        "Rules:\n"
        "- Be professional yet approachable.\n"
        "- Ask exactly ONE question.\n"
        "- Keep the greeting concise.\n"
        "- Do not reveal any future questions.\n"
        "- Return only the greeting and the first question."
    )

    try:
        response = _get_client().models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
        )
        return response.text
    except ClientError as e:
        print(f"Gemini API Error in start: {e}")
        return f"Hello {candidate_name}! I am your AI interviewer. Let's begin our discussion on {domain}. To start, could you tell me a little bit about your background in this field?"


def continue_interview(
    domain: str,
    history: list[dict],
    user_message: str,
) -> str:
    """
    Continue an ongoing interview conversation.

    The frontend sends the full history every time so the backend
    stays completely stateless.

    Args:
        domain: Interview role.
        history: Complete conversation so far.
        user_message: The candidate's latest answer.

    Returns:
        The interviewer's next response / question.
    """
    # Build a readable transcript from history
    transcript_lines: list[str] = []
    for entry in history:
        role = entry.get("role", "unknown")
        text = entry.get("text", "")
        label = "Interviewer" if role == "interviewer" else "Candidate"
        transcript_lines.append(f"{label}: {text}")

    transcript_text = "\n".join(transcript_lines)

    prompt = (
        f"You are a professional interviewer for a {domain} role.\n\n"
        "Rules:\n"
        "- Ask ONE question at a time.\n"
        "- Ask follow-up questions when the candidate's answer needs clarification.\n"
        "- Do not reveal future questions.\n"
        "- Stay in character as the interviewer at all times.\n"
        "- Keep responses concise and professional.\n"
        "- If the candidate goes off-topic, gently redirect.\n\n"
        f"Previous conversation:\n{transcript_text}\n\n"
        f"Candidate's latest answer:\n{user_message}\n\n"
        "Continue the interview."
    )

    try:
        response = _get_client().models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
        )
        return response.text
    except ClientError as e:
        print(f"Gemini API Error in chat: {e}")
        return "I am processing a lot of information right now. Could you please hold on for a moment, or simply repeat your last point so I can properly analyze it?"


def evaluate_interview(
    candidate_name: str,
    domain: str,
    history: list[dict],
) -> dict[str, Any]:
    """
    Evaluate a completed interview and return structured scoring.

    Uses response_mime_type="application/json" so Gemini returns
    valid JSON directly.

    Args:
        candidate_name: Name of the candidate.
        domain: Interview role.
        history: Full interview transcript.

    Returns:
        Parsed evaluation dict with scores, feedback, and model answers.
    """
    # Build transcript text
    transcript_lines: list[str] = []
    for entry in history:
        role = entry.get("role", "unknown")
        text = entry.get("text", "")
        label = "Interviewer" if role == "interviewer" else "Candidate"
        transcript_lines.append(f"{label}: {text}")

    transcript_text = "\n".join(transcript_lines)

    prompt = (
        "Evaluate this interview.\n\n"
        f"Candidate: {candidate_name}\n"
        f"Role: {domain}\n\n"
        f"Transcript:\n{transcript_text}\n\n"
        "Return ONLY valid JSON in this exact format:\n\n"
        "{\n"
        '  "technicalScore": <0-10>,\n'
        '  "communicationScore": <0-10>,\n'
        '  "feedback": [\n'
        "    {\n"
        '      "type": "positive",\n'
        '      "text": "..."\n'
        "    },\n"
        "    {\n"
        '      "type": "improvement",\n'
        '      "text": "..."\n'
        "    }\n"
        "  ],\n"
        '  "modelAnswers": [\n'
        "    {\n"
        '      "question": "...",\n'
        '      "answer": "..."\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "Rules:\n"
        "- technicalScore: Rate 0-10 based on technical knowledge demonstrated.\n"
        "- communicationScore: Rate 0-10 based on clarity and communication.\n"
        "- feedback: Provide at least 2 positive items and 2 improvement items.\n"
        "- modelAnswers: Provide ideal answers for every question asked.\n"
    )

    try:
        response = _get_client().models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config={"response_mime_type": "application/json"},
        )
    except ClientError as e:
        print(f"Gemini API Error in evaluate: {e}")
        return {
            "technicalScore": 5,
            "communicationScore": 5,
            "feedback": [
                {"type": "improvement", "text": "The evaluation could not be generated due to high AI service load."},
                {"type": "positive", "text": "You successfully completed the session."}
            ],
            "modelAnswers": []
        }

    try:
        return json.loads(response.text)
    except json.JSONDecodeError as e:
        print(f"Failed to parse Gemini JSON: {e}\nRaw output: {response.text}")
        return {
            "technicalScore": 0,
            "communicationScore": 0,
            "feedback": [
                {
                    "type": "improvement",
                    "text": "The AI evaluation engine returned an invalid format. We could not grade your interview properly."
                },
                {
                    "type": "positive",
                    "text": "You successfully completed the interview session."
                }
            ],
            "modelAnswers": []
        }
