from fastapi import APIRouter, Body
from app.optimization.milp_optimizer import milp_optimizer
from app.models.schemas import OptimizationResult

router = APIRouter(tags=["Optimization Engine"])

@router.post("/optimization/run", response_model=OptimizationResult)
async def run_optimization(
    horizon_hours: int = Body(24, embed=True),
    solar_capacity_kw: float = Body(650.0, embed=True),
    bess_capacity_kwh: float = Body(800.0, embed=True),
    initial_soc_pct: float = Body(65.0, embed=True),
    grid_limit_kw: float = Body(500.0, embed=True),
    load_flexibility_pct: float = Body(15.0, embed=True)
):
    """
    Execute formal Mixed-Integer Linear Programming (MILP) optimization solver.
    Returns optimal dispatch schedule, peak grid demand, cost savings, and explainable AI rationale.
    """
    return milp_optimizer.solve(
        horizon_hours=horizon_hours,
        solar_capacity_kw=solar_capacity_kw,
        bess_capacity_kwh=bess_capacity_kwh,
        initial_soc_pct=initial_soc_pct,
        grid_limit_kw=grid_limit_kw,
        load_flexibility_pct=load_flexibility_pct
    )

@router.get("/recommendations")
async def get_active_recommendations():
    """Get latest explainable AI recommendation card and rationale."""
    res = milp_optimizer.solve(horizon_hours=24)
    return res.explanation
