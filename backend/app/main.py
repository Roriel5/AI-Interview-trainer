"""
AIview — FastAPI application entry point.

Sets up middleware, connects to services, and mounts all routes.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import router
from app.services import db_service

# ──────────────────────────── Logging ───────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("aiview")


# ──────────────────────────── Lifespan ──────────────────────────────────


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup / shutdown lifecycle.

    - Validates environment variables.
    - Connects to MongoDB Atlas.
    """
    # ── Startup ──
    logger.info("Starting AIview backend...")

    # Validate env vars
    settings.validate()
    logger.info("Environment variables validated ✓")

    # Connect to MongoDB
    try:
        db_service.connect_database()
        logger.info("MongoDB connected ✓")
    except Exception as exc:
        logger.error("MongoDB connection failed: %s", exc)
        raise

    logger.info("AIview backend ready 🚀")

    yield

    # ── Shutdown ──
    logger.info("Shutting down AIview backend...")


# ──────────────────────────── App ───────────────────────────────────────

app = FastAPI(
    title="AIview — AI Interview Trainer",
    description="Production-ready backend for AI-powered mock interviews.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow the React frontend (local dev and deployed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routes
app.include_router(router)
