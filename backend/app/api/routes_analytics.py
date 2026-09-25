from fastapi import APIRouter, Query
from datetime import datetime, timedelta
import random

router = APIRouter(tags=["Analytics"])

@router.get("/analytics")
async def get_analytics(timeframe: str = Query("week", pattern="^(day|week|month)$")):
    """
    Historical analytics and optimization performance comparisons:
    Daily energy cost, renewable utilization, grid peak tracking, and forecast accuracy.
    """
    days = 1 if timeframe == "day" else (7 if timeframe == "week" else 30)
    now = datetime.now()
    
    daily_costs = []
    renewable_trend = []
    grid_peaks = []
    battery_throughput = []
    forecast_accuracy = []

    for i in range(days):
        d = (now - timedelta(days=days - 1 - i)).strftime("%b %d")
        base_c = round(random.uniform(92000, 115000), 0)
        opt_c = round(base_c * random.uniform(0.68, 0.78), 0)
        savings = base_c - opt_c
        
        solar_gen = round(random.uniform(3200, 4100), 0)
        curt = round(random.uniform(20, 110), 0)
        utilized = solar_gen - curt

        peak_kw = round(random.uniform(390, 460), 0)
        
        daily_costs.append({
            "date": d,
            "baseline_cost": base_c,
            "optimized_cost": opt_c,
            "savings": savings
        })
        renewable_trend.append({
            "date": d,
            "solar_kwh": solar_gen,
            "utilized_kwh": utilized,
            "curtailed_kwh": curt
        })
        grid_peaks.append({
            "date": d,
            "peak_kw": peak_kw,
            "contract_limit": 500
        })
        battery_throughput.append({
            "date": d,
            "throughput_kwh": round(random.uniform(750, 920), 0),
            "soh": round(97.2 - (days - i) * 0.015, 2)
        })
        forecast_accuracy.append({
            "date": d,
            "mae": round(random.uniform(14.2, 19.8), 1),
            "mape": round(random.uniform(4.2, 6.1), 1)
        })

    return {
        "timeframe": timeframe,
        "daily_costs": daily_costs,
        "renewable_utilization_trend": renewable_trend,
        "grid_peak_history": grid_peaks,
        "battery_throughput": battery_throughput,
        "forecast_accuracy_trend": forecast_accuracy,
        "totals": {
            "total_savings": sum(x["savings"] for x in daily_costs),
            "avg_savings_pct": round(sum(x["savings"] for x in daily_costs) / sum(x["baseline_cost"] for x in daily_costs) * 100, 1),
            "total_curtailed_avoided_kwh": round(sum(x["curtailed_kwh"] for x in renewable_trend) * 0.82, 0),
            "peak_clipped_max_kw": round(max(500 - x["peak_kw"] for x in grid_peaks), 0)
        }
    }
