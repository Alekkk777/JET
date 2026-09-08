"""Configurazione applicativa letta da variabili d'ambiente."""

from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    anthropic_api_key: str = ""
    # Haiku basta e avanza qui: il chatbot legge numeri già calcolati e li spiega in
    # prosa, non serve un modello di fascia alta. Costa 1/2 di Sonnet 5 a parità di token.
    anthropic_model: str = "claude-haiku-4-5"
    cors_allow_origins: list[str] = ["*"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
