from fastapi import APIRouter, HTTPException
from typing import List
from app.database.repository import repository
from app.models.schemas import SystemAlert

router = APIRouter(tags=["Alerts"])

@router.get("/alerts", response_model=List[SystemAlert])
async def get_system_alerts():
    """Retrieve all active system alarms with severity, component, and recommended actions."""
    return repository.alerts

@router.post("/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    """Mark an alert as acknowledged by plant operator."""
    for a in repository.alerts:
        if a.id == alert_id:
            a.acknowledged = True
            return {"message": "Alert acknowledged", "alert": a}
    raise HTTPException(status_code=404, detail="Alert not found")
