from fastapi import APIRouter
from app.database.repository import repository
from app.models.schemas import GridTariffInfo

router = APIRouter(tags=["Grid & Tariff Intelligence"])

@router.get("/grid", response_model=GridTariffInfo)
async def get_grid_tariff_info():
    """
    Retrieve dynamic electricity tariff structure, current pricing tier,
    hourly ToU schedule, monthly peak demand, and demand charge exposure.
    """
    return repository.get_tariffs()
