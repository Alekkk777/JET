from fastapi.testclient import TestClient

from app.infrastructure.api.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_calculate_returns_breakdown() -> None:
    response = client.post("/api/v1/salary/calculate", json={"gross_annual": 30000})
    assert response.status_code == 200
    body = response.json()
    assert body["gross_annual"] == "30000.00" or body["gross_annual"] == 30000.0
    assert "net_annual" in body
    assert "net_monthly" in body


def test_calculate_rejects_non_positive_gross_annual() -> None:
    response = client.post("/api/v1/salary/calculate", json={"gross_annual": -1})
    assert response.status_code == 422


def test_calculate_rejects_unsupported_fiscal_year() -> None:
    response = client.post("/api/v1/salary/calculate", json={"gross_annual": 30000, "fiscal_year": 1999})
    assert response.status_code == 422
