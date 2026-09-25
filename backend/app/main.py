from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config import settings
from app.api.routes_dashboard import router as dashboard_router
from app.api.routes_forecast import router as forecast_router
from app.api.routes_battery import router as battery_router
from app.api.routes_grid import router as grid_router
from app.api.routes_loads import router as loads_router
from app.api.routes_optimization import router as optimization_router
from app.api.routes_simulator import router as simulator_router
from app.api.routes_digital_twin import router as digital_twin_router
from app.api.routes_analytics import router as analytics_router
from app.api.routes_alerts import router as alerts_router

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("energiq")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Industrial Renewable Energy & Load Orchestration Platform with Formal MILP Optimizer and Explainable AI.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error on {request.url}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc),
            "path": str(request.url)
        }
    )

# Health Check
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "solver": "PuLP MILP CBC Solver",
        "mode": "Simulated & Seed Telemetry Ready"
    }

# Mount Routers under /api
api_prefix = settings.API_V1_STR
app.include_router(dashboard_router, prefix=api_prefix)
app.include_router(forecast_router, prefix=api_prefix)
app.include_router(battery_router, prefix=api_prefix)
app.include_router(grid_router, prefix=api_prefix)
app.include_router(loads_router, prefix=api_prefix)
app.include_router(optimization_router, prefix=api_prefix)
app.include_router(simulator_router, prefix=api_prefix)
app.include_router(digital_twin_router, prefix=api_prefix)
app.include_router(analytics_router, prefix=api_prefix)
app.include_router(alerts_router, prefix=api_prefix)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
