"""Entry point dell'applicazione FastAPI."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.infrastructure.api.routers import chat, reference, salary

settings = get_settings()

app = FastAPI(
    title="RAL Calculator API",
    description=(
        "Calcola lo stipendio netto a partire dalla RAL e spiega il calcolo tramite chatbot. "
        "Vedi BUSINESS_RULES.md per le regole di business e le semplificazioni adottate."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(salary.router)
app.include_router(reference.router)
app.include_router(chat.router)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
