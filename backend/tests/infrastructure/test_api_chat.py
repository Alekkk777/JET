import pytest
from fastapi.testclient import TestClient

from app.application.use_cases.explain_calculation import ExplainCalculationUseCase
from app.infrastructure.api.dependencies import get_explain_calculation_use_case
from app.infrastructure.api.main import app
from app.infrastructure.llm.anthropic_explanation_adapter import AnthropicExplanationAdapter

client = TestClient(app)


def _use_case_without_api_key() -> ExplainCalculationUseCase:
    return ExplainCalculationUseCase(explanation_port=AnthropicExplanationAdapter(api_key="", model="claude-haiku-4-5"))


@pytest.fixture(autouse=True)
def _force_missing_api_key():
    # Questi test verificano il comportamento SENZA ANTHROPIC_API_KEY configurata,
    # indipendentemente da una chiave reale eventualmente presente in backend/.env
    # sulla macchina di sviluppo (serve lì per testare manualmente la chat).
    app.dependency_overrides[get_explain_calculation_use_case] = _use_case_without_api_key
    yield
    app.dependency_overrides.pop(get_explain_calculation_use_case, None)


def test_explain_without_api_key_returns_clean_service_unavailable_error() -> None:
    response = client.post("/api/v1/salary/explain", json={"gross_annual": 30000})
    assert response.status_code == 503
    assert "ANTHROPIC_API_KEY" in response.json()["detail"]


def test_explain_rejects_invalid_gross_annual_before_calling_llm() -> None:
    response = client.post("/api/v1/salary/explain", json={"gross_annual": -1})
    assert response.status_code == 422


def test_explain_accepts_conversation_history_shape() -> None:
    # Anche con uno storico di conversazione valorizzato, senza API key il fallimento
    # deve restare un 503 pulito (la richiesta stessa è valida e viene accettata).
    response = client.post(
        "/api/v1/salary/explain",
        json={
            "gross_annual": 30000,
            "messages": [
                {"role": "assistant", "content": "Il tuo netto annuale è 22267.16 EUR."},
                {"role": "user", "content": "perché pago così tanto di INPS?"},
            ],
        },
    )
    assert response.status_code == 503
