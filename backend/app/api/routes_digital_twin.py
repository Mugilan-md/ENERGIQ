from fastapi import APIRouter
from app.database.repository import repository
from app.models.schemas import DigitalTwinState

router = APIRouter(tags=["Digital Twin"])

@router.get("/digital-twin", response_model=DigitalTwinState)
async def get_digital_twin_telemetry():
    """
    Retrieve live Digital Twin nodal topology, electrical bus status,
    nodal efficiencies, power factors, and operational mode.
    """
    return repository.get_digital_twin_state()
