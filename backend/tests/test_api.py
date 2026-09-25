import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "PuLP" in data["solver"]

def test_dashboard_kpis():
    response = client.get("/api/dashboard/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "renewable_generation" in data
    assert "industrial_demand" in data
    assert "grid_consumption" in data
    assert "battery_soc" in data

def test_energy_flow():
    response = client.get("/api/energy-flow")
    assert response.status_code == 200
    data = response.json()
    assert "flows" in data
    assert data["flows"]["renewable_to_load"] >= 0

def test_renewable_forecast_horizons():
    for h in ["15m", "30m", "1h", "6h", "24h"]:
        response = client.get(f"/api/forecast/renewable?horizon={h}")
        assert response.status_code == 200
        data = response.json()
        assert len(data["points"]) > 0
        assert data["mae"] > 0

def test_industrial_loads():
    response = client.get("/api/loads")
    assert response.status_code == 200
    loads = response.json()
    assert len(loads) >= 6
    critical_loads = [l for l in loads if l["criticality"] == "CRITICAL"]
    assert len(critical_loads) > 0

def test_critical_load_safety_lock():
    # Attempt to shed CNC load should return 400
    response = client.put("/api/loads/cnc-01?status=SHED")
    assert response.status_code == 400
    assert "Safety Lock" in response.json()["detail"]

def test_battery_state():
    response = client.get("/api/battery")
    assert response.status_code == 200
    data = response.json()
    assert 0 <= data["current_soc"] <= 100
    assert len(data["projected_soc_curve"]) == 24

def test_grid_tariff():
    response = client.get("/api/grid")
    assert response.status_code == 200
    data = response.json()
    assert data["current_tariff"] > 0
    assert len(data["schedule"]) == 24

def test_milp_optimization_solver():
    response = client.post("/api/optimization/run", json={"horizon_hours": 24})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPTIMAL"
    assert data["summary"]["cost_savings"] >= 0
    assert data["summary"]["production_feasibility"] == "100% SATISFIED"
    assert len(data["schedule"]) == 24

def test_what_if_simulator():
    payload = {
        "renewable_multiplier": 1.2,
        "demand_multiplier": 1.0,
        "initial_battery_soc": 70.0,
        "tariff_multiplier": 1.0,
        "grid_limit_kw": 500.0,
        "battery_reserve_pct": 20.0,
        "load_flexibility_pct": 15.0
    }
    response = client.post("/api/simulator/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "baseline" in data
    assert "optimized" in data
    assert data["comparison"]["savings_pct"] >= 0

def test_digital_twin_state():
    response = client.get("/api/digital-twin")
    assert response.status_code == 200
    data = response.json()
    assert data["hub_frequency_hz"] > 49.0
    assert data["hub_voltage_v"] > 400.0
    assert len(data["nodes"]) >= 6

def test_analytics_and_alerts():
    res_analytics = client.get("/api/analytics?timeframe=week")
    assert res_analytics.status_code == 200
    assert len(res_analytics.json()["daily_costs"]) == 7

    res_alerts = client.get("/api/alerts")
    assert res_alerts.status_code == 200
    assert len(res_alerts.json()) > 0
