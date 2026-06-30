# AIview Backend — AI Interview Trainer

Production-ready FastAPI backend for AI-powered mock interviews. Integrates with Google Gemini API for intelligent interviewing and MongoDB Atlas for session persistence.

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Framework  | FastAPI + Pydantic      |
| AI         | Google Gemini 2.5 Flash |
| Database   | MongoDB Atlas (pymongo) |
| Deployment | Render                  |

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app, CORS, lifespan
│   ├── config.py          # Environment variable management
│   ├── models.py          # Pydantic request/response models
│   ├── routes.py          # All API endpoints
│   ├── dependencies.py    # Dependency injection
│   └── services/
│       ├── __init__.py
│       ├── ai_service.py  # Gemini AI interactions
│       └── db_service.py  # MongoDB CRUD operations
├── requirements.txt
├── .env                   # Your secrets (git-ignored)
├── .env.example           # Template for env vars
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your actual keys:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=YourApp
```

### 3. Run Locally

```bash
uvicorn app.main:app --reload --port 8000
```

The server starts at `http://localhost:8000`.

### 4. Verify

```bash
curl http://localhost:8000/
# → {"status":"running"}

curl http://localhost:8000/health
# → {"status":"healthy","mongodb":"connected","gemini":"initialized"}
```

---

## API Documentation

### Health & Status

#### `GET /`

Basic liveness check.

**Response:**
```json
{
  "status": "running"
}
```

---

#### `GET /health`

Deep health check — verifies MongoDB and Gemini.

**Response:**
```json
{
  "status": "healthy",
  "mongodb": "connected",
  "gemini": "initialized"
}
```

---

### Interview Flow

#### `POST /start-interview`

Start a new interview session. Returns a greeting and the first question.

**Request:**
```json
{
  "candidate_name": "Rohit",
  "domain": "Backend Developer"
}
```

**Response:**
```json
{
  "message": "Welcome Rohit! I'll be your interviewer today for the Backend Developer role. Let's begin — can you explain the difference between SQL and NoSQL databases?"
}
```

---

#### `POST /chat`

Continue an ongoing interview. The frontend sends the **entire** conversation history each time (stateless backend).

**Request:**
```json
{
  "domain": "Backend Developer",
  "history": [
    { "role": "interviewer", "text": "Welcome! Can you explain REST vs GraphQL?" },
    { "role": "user", "text": "REST uses endpoints while GraphQL uses a single endpoint with queries..." }
  ],
  "user_message": "I prefer REST for simple CRUD APIs and GraphQL for complex data requirements."
}
```

**Response:**
```json
{
  "bot_response": "That's a good distinction. Can you describe a scenario where you'd choose GraphQL over REST and explain the tradeoffs?"
}
```

---

#### `POST /evaluate`

Evaluate a completed interview. Sends the transcript to Gemini, saves to MongoDB, and returns structured scoring.

**Request:**
```json
{
  "candidate_name": "Rohit",
  "domain": "Backend Developer",
  "history": [
    { "role": "interviewer", "text": "Explain database indexing." },
    { "role": "user", "text": "Indexes are data structures that improve query speed..." }
  ]
}
```

**Response:**
```json
{
  "technicalScore": 8,
  "communicationScore": 9,
  "feedback": [
    { "type": "positive", "text": "Strong understanding of database fundamentals." },
    { "type": "positive", "text": "Clear and structured communication." },
    { "type": "improvement", "text": "Could elaborate more on trade-offs of indexing." },
    { "type": "improvement", "text": "Consider mentioning real-world examples." }
  ],
  "modelAnswers": [
    {
      "question": "Explain database indexing.",
      "answer": "Database indexes are data structures (typically B-trees or hash tables) that maintain sorted references to data rows, enabling O(log n) lookups instead of O(n) full table scans..."
    }
  ]
}
```

---

### History & Sessions

#### `GET /history/{candidate_name}`

Returns all previous interviews for a candidate, sorted newest first.

**Example:** `GET /history/Rohit`

**Response:**
```json
[
  {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "candidate_name": "Rohit",
    "domain": "Backend Developer",
    "timestamp": "2026-06-30T15:30:00+00:00",
    "transcript": [...],
    "evaluation": {...}
  }
]
```

---

#### `GET /session/{session_id}`

Returns a single interview session by MongoDB ObjectId.

**Example:** `GET /session/665f1a2b3c4d5e6f7a8b9c0d`

**Response:**
```json
{
  "id": "665f1a2b3c4d5e6f7a8b9c0d",
  "candidate_name": "Rohit",
  "domain": "Backend Developer",
  "timestamp": "2026-06-30T15:30:00+00:00",
  "transcript": [
    { "role": "interviewer", "text": "..." },
    { "role": "user", "text": "..." }
  ],
  "evaluation": {
    "technicalScore": 8,
    "communicationScore": 9,
    "feedback": [...],
    "modelAnswers": [...]
  }
}
```

---

#### `DELETE /session/{session_id}`

Deletes one interview session.

**Example:** `DELETE /session/665f1a2b3c4d5e6f7a8b9c0d`

**Response:**
```json
{
  "message": "Session deleted successfully"
}
```

**404 Response:**
```json
{
  "detail": "Session not found or already deleted"
}
```

---

## Deployment on Render

1. Push the `backend/` directory to a Git repository.

2. Create a new **Web Service** on Render.

3. Set the **Build Command:**
   ```bash
   pip install -r requirements.txt
   ```

4. Set the **Start Command:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

5. Add environment variables in the Render dashboard:
   - `GEMINI_API_KEY`
   - `MONGODB_URI`

6. Update the frontend API base URL to the Render URL:
   ```
   https://your-app.onrender.com
   ```

---

## Interactive Docs

Once running, visit:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## License

MIT
