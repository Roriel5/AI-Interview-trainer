import os
import json
from dotenv import load_dotenv
load_dotenv()

from app.services.ai_service import evaluate_interview

try:
    print("Testing with short history...")
    history = [
        {"role": "interviewer", "text": "What is Python?"},
        {"role": "user", "text": "A programming language."}
    ]
    res = evaluate_interview("TestUser", "Backend", history)
    print(json.dumps(res, indent=2))
except Exception as e:
    print(f"Error 1: {e}")

try:
    print("\nTesting with empty history...")
    res = evaluate_interview("TestUser", "Backend", [])
    print(json.dumps(res, indent=2))
except Exception as e:
    print(f"Error 2: {e}")
