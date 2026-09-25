from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime

OperatingMode = Literal[
    'NORMAL', 
    'HIGH DEMAND', 
    'LOW RENEWABLE', 
    'HIGH TARIFF', 
    'BATTERY RESERVE', 
    'PEAK RISK'
]

LoadCriticality = Literal['CRITICAL', 'HIGH', 'MEDIUM', 'FLEXIBLE']
LoadCategory = Literal['CNC', 'HVAC', 'COMPRESSOR', 'PUMP', 'EV_CHARGING', 'AUXILIARY']
TariffTier = Literal['OFF_PEAK', 'STANDARD', 'PEAK', 'CRITICAL_PEAK']
AlertSeverity = Literal['CRITICAL', 'WARNING', 'INFO']
AlertComponent = Literal['GRID', 'BATTERY', 'RENEWABLE', 'LOAD', 'OPTIMIZER']

class PlantSummary(BaseModel):
    id: str
    name: str
    location: str
    capacity_solar_kw: float
    capacity_bess_kwh: float
    grid_contract_kw: float
    current_mode: OperatingMode
    system_health: Literal['OPTIMAL', 'DEGRADED', 'WARNING']
    last_updated: str

class KpiMetric(BaseModel):
    value: float
    unit: str
    trend: float
    trend_direction: Literal['up', 'down', 'neutral']
    is_positive_trend: bool
    label: str
    context: str

class ExecutiveDashboardKPIs(BaseModel):
    renewable_generation: KpiMetric
    industrial_demand: KpiMetric
    grid_consumption: KpiMetric
    battery_soc: KpiMetric
    current_grid_peak: KpiMetric
    renewable_curtailment: KpiMetric
    current_energy_cost: KpiMetric
    estimated_daily_savings: KpiMetric

class FlowAllocations(BaseModel):
    renewable_to_load: float
    renewable_to_battery: float
    grid_to_load: float
    battery_to_load: float
    renewable_to_curtailment: float
    grid_to_battery: float

class EnergyFlowData(BaseModel):
    solar_generation: float
    wind_generation: float
    total_renewable: float
    grid_import: float
    battery_power: float
    battery_soc: float
    total_demand: float
    curtailment: float
    flows: FlowAllocations

class IndustrialLoad(BaseModel):
    id: str
    name: str
    category: LoadCategory
    criticality: LoadCriticality
    current_power: float
    min_power: float
    max_power: float
    nominal_power: float
    flexibility_type: str
    operating_schedule: str
    production_dependency: str
    is_sheddable: bool
    is_modulatable: bool
    status: Literal['RUNNING', 'MODULATED', 'IDLE', 'SHED']

class BatteryState(BaseModel):
    capacity_kwh: float
    current_soc: float
    min_soc: float
    max_soc: float
    reserve_soc: float
    max_charge_kw: float
    max_discharge_kw: float
    charge_efficiency: float
    discharge_efficiency: float
    degradation_cost_per_kwh: float
    current_power: float
    available_energy_kwh: float
    temperature_c: float
    state: Literal['CHARGING', 'DISCHARGING', 'IDLE', 'RESERVE_HOLD']
    cycle_count: int
    health_soh: float
    projected_soc_curve: List[Dict[str, Any]]

class TariffScheduleItem(BaseModel):
    hour: int
    time_label: str
    tariff: float
    tier: TariffTier
    is_current: bool

class GridTariffInfo(BaseModel):
    current_tariff: float
    currency_symbol: str = "₹"
    current_tier: TariffTier
    next_tier: TariffTier
    next_tier_time: str
    import_limit_kw: float
    current_import_kw: float
    demand_charge_rate: float
    monthly_peak_kw: float
    demand_charge_exposure: float
    schedule: List[TariffScheduleItem]

class ForecastPoint(BaseModel):
    timestamp: str
    time_label: str
    actual_generation: Optional[float] = None
    forecast_generation: float
    confidence_lower: float
    confidence_upper: float
    actual_demand: Optional[float] = None
    forecast_demand: float
    solar_irradiance: float
    temperature: float
    cloud_cover: float

class ForecastData(BaseModel):
    horizon: Literal['15m', '30m', '1h', '6h', '24h']
    points: List[ForecastPoint]
    mae: float
    rmse: float
    mape: float
    r2: float
    is_simulated: bool = True

class ExplainableMetadata(BaseModel):
    decision: str
    recommended_action: str
    why: List[str]
    expected_impact: List[str]
    confidence: float
    target_component: str
    timestamp: str

class OptimizationScheduleItem(BaseModel):
    time: str
    renewable_gen: float
    load_demand: float
    grid_import: float
    battery_charge: float
    battery_discharge: float
    battery_soc: float
    curtailment: float
    tariff: float
    cost: float

class OptimizationSummary(BaseModel):
    total_grid_cost: float
    baseline_grid_cost: float
    cost_savings: float
    cost_savings_pct: float
    peak_demand_kw: float
    peak_reduction_kw: float
    renewable_utilized_pct: float
    curtailed_energy_kwh: float
    production_feasibility: Literal['100% SATISFIED', 'MODULATED WITH MARGIN', 'CONSTRAINT VIOLATION']

class OptimizationResult(BaseModel):
    id: str
    timestamp: str
    status: Literal['OPTIMAL', 'FEASIBLE', 'INFEASIBLE']
    objective_value: float
    solve_time_ms: float
    summary: OptimizationSummary
    schedule: List[OptimizationScheduleItem]
    explanation: ExplainableMetadata

class WhatIfSimulationParams(BaseModel):
    renewable_multiplier: float = 1.0
    demand_multiplier: float = 1.0
    initial_battery_soc: float = 65.0
    tariff_multiplier: float = 1.0
    grid_limit_kw: float = 500.0
    battery_reserve_pct: float = 20.0
    load_flexibility_pct: float = 15.0
    scenario_name: Optional[str] = None

class PredefinedScenario(BaseModel):
    id: str
    name: str
    description: str
    tag: str
    params: WhatIfSimulationParams

class SimulationKPI(BaseModel):
    total_cost: float
    grid_import_kwh: float
    peak_grid_kw: float
    renewable_utilization_pct: float
    curtailment_kwh: float
    battery_cycles: float

class SimulationComparison(BaseModel):
    cost_saved: float
    savings_pct: float
    peak_shaved_kw: float
    peak_reduction_pct: float
    renewable_recovered_kwh: float
    feasibility: str

class SimulationResult(BaseModel):
    baseline: SimulationKPI
    optimized: SimulationKPI
    comparison: SimulationComparison
    schedule: List[OptimizationScheduleItem]
    is_simulation_estimate: bool = True

class SystemAlert(BaseModel):
    id: str
    timestamp: str
    severity: AlertSeverity
    title: str
    description: str
    component: AlertComponent
    recommended_action: str
    acknowledged: bool = False

class DigitalTwinNode(BaseModel):
    id: str
    name: str
    type: Literal['SOURCE', 'STORAGE', 'GRID', 'HUB', 'SINK']
    power_kw: float
    status: Literal['OPTIMAL', 'ACTIVE', 'IDLE', 'WARNING', 'ALERT']
    efficiency_pct: float
    details: Dict[str, Any]

class DigitalTwinState(BaseModel):
    operating_mode: OperatingMode
    hub_frequency_hz: float
    hub_voltage_v: float
    power_factor: float
    nodes: List[DigitalTwinNode]
    active_alerts_count: int
    timestamp: str
