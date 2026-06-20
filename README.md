# AIview – Real-Time AI Interview Trainer

## Overview

AIview is an AI-powered mock interview platform designed to help students and job seekers practice technical and behavioral interviews in a realistic environment.

The system simulates a professional interviewer using Google's Gemini API and provides users with instant feedback and performance evaluation.

---

## Features

* AI-driven interview simulation
* Domain-specific interview questions
* Multi-turn conversational flow
* Real-time question generation
* Interview evaluation and scoring
* Technical and communication skill analysis
* Constructive feedback and improvement suggestions
* Speech-to-text support (planned)
* Session history tracking (planned)

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Web Speech API

### Backend

* FastAPI (Python)

### Database

* MongoDB Atlas

### AI Integration

* Google Gemini API (Gemini 2.5 Flash)

### Deployment

* Vercel (Frontend)
* Render / Railway (Backend)

---

## Project Structure

```text
AI-Interview-trainer/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│
├── .gitignore
└── README.md
```

---

## API Endpoints

### GET /

Checks whether the backend server is running.

### GET /test

Tests Gemini API connectivity.

### POST /chat

Generates interview questions based on the user's responses and selected domain.

### POST /evaluate

Analyzes the interview transcript and returns:

* Technical Score
* Communication Score
* Strengths
* Weaknesses
* Suggestions

---

## Installation

### Clone the repository

```bash
git clone https://github.com/Roriel5/AI-Interview-trainer.git
cd AI-Interview-trainer
```

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

### Create Environment Variables

Create a `.env` file inside the backend folder:

```env
GEMINI_API_KEY=YOUR_API_KEY
```

### Run Backend

```bash
uvicorn main:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

Swagger documentation:

```
http://127.0.0.1:8000/docs
```

---

## Future Improvements

* Authentication system
* Voice recording support
* Dashboard analytics
* Session history
* Resume-based interviews
* Personalized feedback

---

## Team Members

* Aadil B Prabhakar
* Rohit Rakesh
* Sidharth S
* S Sreeshankar
