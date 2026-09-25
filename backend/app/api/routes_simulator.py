from fastapi import APIRouter
from typing import List
from app.optimization.milp_optimizer import milp_optimizer
from app.models.schemas import WhatIfSimulationParams, SimulationResult, PredefinedScenario

router = APIRouter(tags=["What-If Simulator"])

PREDEFINED_SCENARIOS = [
    {
        "id": "sc-01",
        "name": "High Solar Availability (Clear Sky)",
        "description": "Solar irradiance peaks at 980 W/m². High surplus generation available for BESS charging.",
        "tag": "RENEWABLE SURPLUS",
        "params": {
            "renewable_multiplier": 1.35,
            "demand_multiplier": 1.0,
            "initial_battery_soc": 55.0,
            "tariff_multiplier": 1.0,
            "grid_limit_kw": 500.0,
            "battery_reserve_pct": 20.0,
            "load_flexibility_pct": 15.0
        }
    },
    {
        "id": "sc-02",
        "name": "Cloudy Day / Low Irradiance",
        "description": "Heavy cloud cover drops solar output by 50%. High dependence on grid and stored energy.",
        "tag": "LOW RENEWABLE",
        "params": {
            "renewable_multiplier": 0.45,
            "demand_multiplier": 1.0,
            "initial_battery_soc": 70.0,
            "tariff_multiplier": 1.0,
            "grid_limit_kw": 500.0,
            "battery_reserve_pct": 20.0,
            "load_flexibility_pct": 20.0
        }
    },
    {
        "id": "sc-03",
        "name": "High Grid Tariff Spike",
        "description": "Peak electricity rates jump by 50% (up to ₹18.75/kWh). Optimizer prioritizes aggressive peak-shaving.",
        "tag": "HIGH TARIFF",
        "params": {
            "renewable_multiplier": 1.0,
            "demand_multiplier": 1.0,
            "initial_battery_soc": 80.0,
            "tariff_multiplier": 1.5,
            "grid_limit_kw": 500.0,
            "battery_reserve_pct": 20.0,
            "load_flexibility_pct": 25.0
        }
    },
    {
        "id": "sc-04",
        "name": "Emergency Production Surge",
        "description": "Urgent customer orders ramp CNC and compressor demand by +30%. Tests grid limit and BESS discharge capacity.",
        "tag": "HIGH DEMAND",
        "params": {
            "renewable_multiplier": 1.0,
            "demand_multiplier": 1.3,
            "initial_battery_soc": 85.0,
            "tariff_multiplier": 1.0,
            "grid_limit_kw": 500.0,
            "battery_reserve_pct": 20.0,
            "load_flexibility_pct": 10.0
        }
    },
    {
        "id": "sc-05",
        "name": "Depleted Battery Reserve (Low SOC)",
        "description": "BESS starts at 22% (near emergency reserve). System must manage peak hours without relying on immediate discharge.",
        "tag": "BATTERY RESERVE",
        "params": {
            "renewable_multiplier": 1.0,
            "demand_multiplier": 1.0,
            "initial_battery_soc": 22.0,
            "tariff_multiplier": 1.0,
            "grid_limit_kw": 500.0,
            "battery_reserve_pct": 20.0,
            "load_flexibility_pct": 25.0
        }
    },
    {
        "id": "sc-06",
        "name": "Constrained Grid Substation Event",
        "description": "Utility lowers factory import cap from 500 kW to 360 kW due to regional grid maintenance.",
        "tag": "PEAK RISK",
        "params": {
            "renewable_multiplier": 1.1,
            "demand_multiplier": 1.0,
            "initial_battery_soc": 75.0,
            "tariff_multiplier": 1.0,
            "grid_limit_kw": 360.0,
            "battery_reserve_pct": 20.0,
            "load_flexibility_pct": 25.0
        }
    }
]

@router.get("/scenarios")
async def get_predefined_scenarios():
    """Retrieve catalog of predefined industrial operating scenarios."""
    return PREDEFINED_SCENARIOS

@router.post("/simulator/run", response_model=SimulationResult)
async def run_simulator(params: WhatIfSimulationParams):
    """
    Execute What-If simulation comparing unoptimized baseline vs MILP optimized dispatch.
    Returns side-by-side cost, peak demand, renewable utilization, curtailment, and savings.
    """
    return milp_optimizer.run_simulation(params)
