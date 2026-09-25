from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "ENERGIQ - AI Renewable & Industrial Load Orchestrator"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Supabase / Database settings (clean abstraction with seeded demo fallback)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    DATABASE_URL: Optional[str] = None
    
    # Plant Configuration Defaults
    DEFAULT_PLANT_ID: str = "plant-elcot-01"
    PLANT_LATITUDE: float = 13.08
    PLANT_LONGITUDE: float = 80.27
    DEFAULT_SOLAR_CAPACITY_KW: float = 650.0
    DEFAULT_WIND_CAPACITY_KW: float = 150.0
    DEFAULT_BESS_CAPACITY_KWH: float = 800.0
    DEFAULT_GRID_LIMIT_KW: float = 500.0
    
    model_config = {"env_file": ".env", "case_sensitive": True, "extra": "ignore"}

settings = Settings()
