from fastapi import APIRouter
from app.database.repository import repository
from app.models.schemas import BatteryState

router = APIRouter(tags=["Battery Intelligence"])

@router.get("/battery", response_model=BatteryState)
async def get_battery_telemetry():
    """
    Retrieve real-time Battery Energy Storage System (BESS) telemetry,
    including SOC, capacity, reserve margin, degradation cost, and projected curve.
    """
    return repository.get_battery_state()
