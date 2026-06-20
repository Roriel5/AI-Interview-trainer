from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from google import genai
from dotenv import load_dotenv
import os
import json

from pydantic import BaseModel


class ChatRequest(BaseModel):
    history: list
    user_message: str
    domain: str

class EvaluationRequest(BaseModel):
    transcript: list

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def chat(request: ChatRequest):

    prompt = f"""
You are a professional interviewer for a {request.domain} role.

Rules:
1. Ask ONE question at a time.
2. Never reveal future questions.
3. Do not give explanations unless asked.
4. Keep responses short.
5. Behave exactly like a real interviewer.
6. Ask follow-up questions when appropriate.

Conversation history:
{request.history}

Candidate's latest answer:
{request.user_message}

Continue the interview.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
        "bot_response": response.text
    }


@app.get("/")
def home():
    return {"message": "AIview backend running"}


@app.get("/test")
def test_gemini():

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello"
    )

    return {
        "response": response.text
    }

@app.post("/evaluate")
def evaluate(request: EvaluationRequest):

    prompt = f"""
You are an interview evaluator.

Analyze the transcript below.

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT surround with ```json.
Do NOT include explanations.

Format exactly:

{{
    "technical_score": 0,
    "communication_score": 0,
    "strengths": [],
    "weaknesses": [],
    "suggestions": []
}}

Transcript:
{request.transcript}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        }
    )

    return json.loads(response.text)