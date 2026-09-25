-- ==============================================================================
-- ENERGIQ PLATFORM: RELATIONAL & TIME-SERIES POSTGRESQL / SUPABASE SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Plants / Facilities Table
CREATE TABLE IF NOT EXISTS plants (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity_solar_kw NUMERIC(10, 2) NOT NULL DEFAULT 650.0,
    capacity_bess_kwh NUMERIC(10, 2) NOT NULL DEFAULT 800.0,
    grid_contract_kw NUMERIC(10, 2) NOT NULL DEFAULT 500.0,
    current_mode VARCHAR(32) NOT NULL DEFAULT 'NORMAL',
    system_health VARCHAR(32) NOT NULL DEFAULT 'OPTIMAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Industrial Loads Catalog
CREATE TABLE IF NOT EXISTS industrial_loads (
    id VARCHAR(64) PRIMARY KEY,
    plant_id VARCHAR(64) REFERENCES plants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    criticality VARCHAR(32) NOT NULL, -- 'CRITICAL', 'HIGH', 'MEDIUM', 'FLEXIBLE'
    min_power_kw NUMERIC(10, 2) NOT NULL,
    max_power_kw NUMERIC(10, 2) NOT NULL,
    nominal_power_kw NUMERIC(10, 2) NOT NULL,
    flexibility_type VARCHAR(128) NOT NULL,
    operating_schedule VARCHAR(255) NOT NULL,
    production_dependency TEXT,
    is_sheddable BOOLEAN NOT NULL DEFAULT FALSE,
    is_modulatable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Telemetry Energy Readings (Time-series table)
CREATE TABLE IF NOT EXISTS energy_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_id VARCHAR(64) REFERENCES plants(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    solar_generation_kw NUMERIC(10, 2) NOT NULL,
    wind_generation_kw NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    total_renewable_kw NUMERIC(10, 2) NOT NULL,
    grid_import_kw NUMERIC(10, 2) NOT NULL,
    battery_power_kw NUMERIC(10, 2) NOT NULL, -- positive = discharge, negative = charge
    battery_soc_pct NUMERIC(5, 2) NOT NULL,
    total_demand_kw NUMERIC(10, 2) NOT NULL,
    curtailment_kw NUMERIC(10, 2) NOT NULL DEFAULT 0.0
);
CREATE INDEX IF NOT EXISTS idx_energy_readings_plant_time ON energy_readings(plant_id, recorded_at DESC);

-- 4. Weather Telemetry & Ambient Conditions
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_id VARCHAR(64) REFERENCES plants(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    solar_irradiance_ghi NUMERIC(8, 2) NOT NULL, -- W/m^2
    ambient_temp_c NUMERIC(5, 2) NOT NULL,
    cloud_cover_pct NUMERIC(5, 2) NOT NULL,
    humidity_pct NUMERIC(5, 2) NOT NULL,
    wind_speed_ms NUMERIC(6, 2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_weather_data_time ON weather_data(plant_id, recorded_at DESC);

-- 5. Battery State & Degradation History
CREATE TABLE IF NOT EXISTS battery_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_id VARCHAR(64) REFERENCES plants(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    soc_pct NUMERIC(5, 2) NOT NULL,
    current_power_kw NUMERIC(10, 2) NOT NULL,
    cell_temp_c NUMERIC(5, 2) NOT NULL,
    state VARCHAR(32) NOT NULL,
    cycle_count INT NOT NULL,
    soh_pct NUMERIC(5, 2) NOT NULL
);

-- 6. Grid Tariffs Schedule & Time-of-Use
CREATE TABLE IF NOT EXISTS grid_tariffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_id VARCHAR(64) REFERENCES plants(id) ON DELETE CASCADE,
    start_hour INT NOT NULL,
    end_hour INT NOT NULL,
    tariff_rate NUMERIC(8, 3) NOT NULL, -- in currency / kWh
    tier VARCHAR(32) NOT NULL, -- 'OFF_PEAK', 'STANDARD', 'PEAK', 'CRITICAL_PEAK'
    effective_from DATE NOT NULL,
    effective_to DATE
);

-- 7. Forecast Records (Renewable & Industrial Load)
CREATE TABLE IF NOT EXISTS forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_id VARCHAR(64) REFERENCES plants(id) ON DELETE CASCADE,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    forecast_horizon VARCHAR(16) NOT NULL, -- '15m', '30m', '1h', '6h', '24h'
    forecast_timestamp TIMESTAMPTZ NOT NULL,
    forecast_generation_kw NUMERIC(10, 2) NOT NULL,
    confidence_lower_kw NUMERIC(10, 2) NOT NULL,
    confidence_upper_kw NUMERIC(10, 2) NOT NULL,
    forecast_demand_kw NUMERIC(10, 2) NOT NULL,
    model_version VARCHAR(64) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_forecasts_horizon ON forecasts(plant_id, forecast_horizon, forecast_timestamp);

-- 8. Optimization Runs
CREATE TABLE IF NOT EXISTS optimization_runs (
    id VARCHAR(64) PRIMARY KEY,
    plant_id VARCHAR(64) REFERENCES plants(id) ON DELETE CASCADE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    solver_status VARCHAR(32) NOT NULL,
    objective_value NUMERIC(12, 4) NOT NULL,
    solve_duration_ms NUMERIC(10, 2) NOT NULL,
    total_grid_cost NUMERIC(10, 2) NOT NULL,
    estimated_savings NUMERIC(10, 2) NOT NULL,
    peak_demand_kw NUMERIC(10, 2) NOT NULL,
    curtailment_avoided_kwh NUMERIC(10, 2) NOT NULL,
    feasibility_status VARCHAR(64) NOT NULL
);

-- 9. Energy Allocations (Optimal Dispatch Schedule per interval)
CREATE TABLE IF NOT EXISTS energy_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id VARCHAR(64) REFERENCES optimization_runs(id) ON DELETE CASCADE,
    interval_time TIMESTAMPTZ NOT NULL,
    renewable_to_load_kw NUMERIC(10, 2) NOT NULL,
    renewable_to_battery_kw NUMERIC(10, 2) NOT NULL,
    grid_to_load_kw NUMERIC(10, 2) NOT NULL,
    battery_to_load_kw NUMERIC(10, 2) NOT NULL,
    curtailment_kw NUMERIC(10, 2) NOT NULL,
    grid_total_kw NUMERIC(10, 2) NOT NULL,
    battery_soc_pct NUMERIC(5, 2) NOT NULL,
    interval_cost NUMERIC(10, 2) NOT NULL
);

-- 10. Explainable AI Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(64) PRIMARY KEY,
    plant_id VARCHAR(64) REFERENCES plants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    title VARCHAR(255) NOT NULL,
    action_text TEXT NOT NULL,
    rationale TEXT[] NOT NULL,
    expected_impact TEXT[] NOT NULL,
    confidence_score NUMERIC(4, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_APPROVAL' -- 'PENDING_APPROVAL', 'APPLIED', 'DISMISSED'
);

-- 11. System Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    plant_id VARCHAR(64) REFERENCES plants(id) ON DELETE CASCADE,
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    severity VARCHAR(16) NOT NULL, -- 'CRITICAL', 'WARNING', 'INFO'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    component VARCHAR(32) NOT NULL,
    recommended_action TEXT NOT NULL,
    is_acknowledged BOOLEAN NOT NULL DEFAULT FALSE
);

-- 12. Simulation Scenarios Catalog
CREATE TABLE IF NOT EXISTS simulation_scenarios (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tag VARCHAR(64) NOT NULL,
    parameters JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
