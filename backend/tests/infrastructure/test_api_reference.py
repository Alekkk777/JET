from fastapi.testclient import TestClient

from app.infrastructure.api.main import app

client = TestClient(app)


def test_reference_data_lists_regions_and_cities() -> None:
    response = client.get("/api/v1/salary/reference-data")
    assert response.status_code == 200
    body = response.json()
    assert len(body["regions"]) == 20
    assert "Lombardia" in body["regions"]
    assert "Valle d'Aosta" in body["regions"]
    assert "Milano" in body["cities"]
    assert sorted(body["monthly_installments_options"]) == [12, 13, 14]


def test_reference_data_groups_cities_by_their_real_region() -> None:
    response = client.get("/api/v1/salary/reference-data")
    body = response.json()
    assert body["cities_by_region"]["Lombardia"] == ["Milano"]
    assert body["cities_by_region"]["Lazio"] == ["Roma"]
    assert "Milano" not in body["cities_by_region"].get("Sicilia", [])


def test_calculate_accepts_region_city_spouse_and_children() -> None:
    response = client.post(
        "/api/v1/salary/calculate",
        json={
            "gross_annual": 45000,
            "monthly_installments": 14,
            "region": "Lombardia",
            "city": "Milano",
            "has_dependent_spouse": True,
            "dependent_children_count": 2,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["region"] == "Lombardia"
    assert body["city"] == "Milano"
    assert body["monthly_installments"] == 14
    assert float(body["spouse_deduction"]) > 0
    assert float(body["children_deduction"]) > 0
    assert float(body["employer_cost"]) > float(body["gross_annual"])


def test_calculate_public_sector_uses_lower_inps_rate() -> None:
    private_response = client.post("/api/v1/salary/calculate", json={"gross_annual": 30000, "sector": "privato"})
    public_response = client.post("/api/v1/salary/calculate", json={"gross_annual": 30000, "sector": "pubblico"})
    assert private_response.status_code == 200
    assert public_response.status_code == 200
    private_inps = float(private_response.json()["inps_employee_contribution"])
    public_inps = float(public_response.json()["inps_employee_contribution"])
    assert public_inps < private_inps


def test_calculate_defaults_to_private_sector() -> None:
    response = client.post("/api/v1/salary/calculate", json={"gross_annual": 30000})
    assert response.status_code == 200
    assert response.json()["sector"] == "privato"


def test_calculate_rejects_unknown_sector() -> None:
    response = client.post("/api/v1/salary/calculate", json={"gross_annual": 30000, "sector": "misto"})
    assert response.status_code == 422
