from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from google import genai
from dotenv import load_dotenv
import os
import json

from pydantic import BaseModel

class StartInterviewRequest(BaseModel):
    domain: str
    candidate_name: str


class ChatRequest(BaseModel):
    domain: str
    history: list
    user_message: str


class EvaluationRequest(BaseModel):
    transcript: list
    candidate_name: str
    domain: str
    
class ChatRequest(BaseModel):
    history: list
    user_message: str
    domain: str

class EvaluationRequest(BaseModel):
    transcript: list
    candidate_name: str
    domain: str

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
- Ask ONE question at a time.
- Ask follow-up questions when needed.
- Do not reveal future questions.
- Keep responses concise.

Previous conversation:
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

@app.post("/start-interview")
def start_interview(request: StartInterviewRequest):

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
        You are an interviewer for a {request.domain} role.

        Welcome the candidate named {request.candidate_name}.

        Then ask the first interview question.

        Return only the greeting and first question.
        """
    )

    return {
        "message": response.text
    }

@app.post("/evaluate")
def evaluate(request: EvaluationRequest):

    prompt = f"""
Evaluate this interview.

Candidate:
{request.candidate_name}

Role:
{request.domain}

Transcript:
{request.transcript}

Return ONLY JSON.

Format:

{{
  "technicalScore": 0,
  "communicationScore": 0,

  "feedback": [
    {{
      "type": "positive",
      "text": ""
    }}
  ],

  "modelAnswers": [
    {{
      "question": "",
      "answer": ""
    }}
  ]
}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        }
    )

    import json

    return json.loads(response.text)