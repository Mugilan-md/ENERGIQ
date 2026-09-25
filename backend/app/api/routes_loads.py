from fastapi import APIRouter, HTTPException
from typing import List
from app.database.repository import repository
from app.models.schemas import IndustrialLoad

router = APIRouter(tags=["Industrial Loads"])

@router.get("/loads", response_model=List[IndustrialLoad])
async def get_industrial_loads():
    """Retrieve all configurable industrial loads with priority, flexibility and telemetry."""
    return repository.loads

@router.put("/loads/{load_id}")
async def update_load_status(load_id: str, status: str):
    """Update load operational state or manual modulation."""
    for l in repository.loads:
        if l.id == load_id:
            if l.criticality == "CRITICAL" and status in ["SHED", "IDLE"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Safety Lock: Load {l.name} is designated CRITICAL and cannot be arbitrarily shed."
                )
            l.status = status # type: ignore
            return {"message": f"Load {l.name} updated to {status}", "load": l}
    raise HTTPException(status_code=404, detail="Load not found")
