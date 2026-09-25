from fastapi import APIRouter
from app.database.repository import repository
from app.models.schemas import ExecutiveDashboardKPIs, EnergyFlowData, PlantSummary

router = APIRouter(tags=["Dashboard"])

@router.get("/dashboard/kpis", response_model=ExecutiveDashboardKPIs)
async def get_kpis():
    """Retrieve executive real-time KPIs with trends and status context."""
    return repository.get_dashboard_kpis()

@router.get("/dashboard/plant", response_model=PlantSummary)
async def get_plant_summary():
    """Retrieve current plant profile, health and operating mode."""
    return repository.get_plant_summary()

@router.get("/energy-flow", response_model=EnergyFlowData)
async def get_energy_flow():
    """Retrieve directed energy routing flows (Solar, BESS, Grid, Loads, Curtailment)."""
    return repository.get_energy_flow()
