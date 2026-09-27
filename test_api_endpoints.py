import pytest
from app.gis.engine import GISEngine


def test_health_and_ready_endpoints(client):
    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "HEALTHY"

    res_ready = client.get("/ready")
    assert res_ready.status_code == 200
    assert res_ready.json()["registered_states"] == 28


def test_states_endpoint(client):
    res = client.get("/api/v1/providers/states")
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data) == 28


def test_demo_scenarios_endpoint(client):
    res = client.get("/api/v1/demo/scenarios/scenario_a")
    assert res.status_code == 200
    payload = res.json()["data"]
    assert payload["state_code"] == "MH"
    assert payload["survey_number"] == "142/2"
    assert "DEMO / SYNTHETIC DATA" in payload["demo_label"]


def test_verification_endpoint(client):
    payload = {
        "state": "Maharashtra",
        "district": "Raigad",
        "tehsil": "Karjat",
        "village": "Shirdhon",
        "identifier": "42/1",
        "identifier_type": "SURVEY_NUMBER",
        "document_type": "7_12"
    }
    res = client.post("/api/v1/verify", json=payload)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["state_code"] == "MH"
    assert data["risk_band"] in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
    assert len(data["checks"]) > 0


def test_area_discrepancy_endpoint(client):
    poly = GISEngine.create_demo_polygon(18.91, 73.32, 0.0008)
    req = {
        "documented_area_sqm": 8500.0,
        "geometry_geojson": poly
    }
    res = client.post("/api/v1/gis/area-discrepancy", json=req)
    assert res.status_code == 200
    data = res.json()["data"]
    assert "discrepancy_percentage" in data
    assert "Possible spatial discrepancy detected" in data["message"] or "tolerance" in data["message"]
