from fastapi import APIRouter, Query
from app.forecasting.renewable_forecaster import renewable_forecaster
from app.forecasting.load_forecaster import load_forecaster
from app.models.schemas import ForecastData

router = APIRouter(tags=["Forecasting"])

@router.get("/forecast/renewable", response_model=ForecastData)
async def get_renewable_forecast(
    horizon: str = Query("24h", pattern="^(15m|30m|1h|6h|24h)$")
):
    """
    ML Renewable Generation Forecaster supporting horizons:
    15-minute, 30-minute, 1-hour, 6-hour, and 24-hour.
    Returns actuals, predictions, 10th/90th confidence intervals, MAE, and RMSE.
    """
    return renewable_forecaster.predict_horizon(horizon=horizon)

@router.get("/forecast/load")
async def get_load_forecast(horizon_hours: int = Query(24, ge=1, le=72)):
    """
    Industrial Load Forecast categorized by production shifts,
    critical CNC lines, and flexible pumping/EV loads.
    """
    return load_forecaster.predict_load_schedule(horizon_hours=horizon_hours)
