export type OperatingMode = 
  | 'NORMAL' 
  | 'HIGH DEMAND' 
  | 'LOW RENEWABLE' 
  | 'HIGH TARIFF' 
  | 'BATTERY RESERVE' 
  | 'PEAK RISK';

export type LoadCriticality = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'FLEXIBLE';

export type LoadCategory = 
  | 'CNC' 
  | 'HVAC' 
  | 'COMPRESSOR' 
  | 'PUMP' 
  | 'EV_CHARGING' 
  | 'AUXILIARY';

export type TariffTier = 'OFF_PEAK' | 'STANDARD' | 'PEAK' | 'CRITICAL_PEAK';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AlertComponent = 'GRID' | 'BATTERY' | 'RENEWABLE' | 'LOAD' | 'OPTIMIZER';

export interface PlantSummary {
  id: string;
  name: string;
  location: string;
  capacity_solar_kw: number;
  capacity_bess_kwh: number;
  grid_contract_kw: number;
  current_mode: OperatingMode;
  system_health: 'OPTIMAL' | 'DEGRADED' | 'WARNING';
  last_updated: string;
}

export interface KpiMetric {
  value: number;
  unit: string;
  trend: number; // percentage change
  trend_direction: 'up' | 'down' | 'neutral';
  is_positive_trend: boolean;
  label: string;
  context: string;
}

export interface ExecutiveDashboardKPIs {
  renewable_generation: KpiMetric;
  industrial_demand: KpiMetric;
  grid_consumption: KpiMetric;
  battery_soc: KpiMetric;
  current_grid_peak: KpiMetric;
  renewable_curtailment: KpiMetric;
  current_energy_cost: KpiMetric;
  estimated_daily_savings: KpiMetric;
}

export interface EnergyFlowData {
  solar_generation: number;
  wind_generation: number;
  total_renewable: number;
  grid_import: number;
  battery_power: number; // + discharge, - charge
  battery_soc: number;
  total_demand: number;
  curtailment: number;
  flows: {
    renewable_to_load: number;
    renewable_to_battery: number;
    grid_to_load: number;
    battery_to_load: number;
    renewable_to_curtailment: number;
    grid_to_battery: number;
  };
}

export interface IndustrialLoad {
  id: string;
  name: string;
  category: LoadCategory;
  criticality: LoadCriticality;
  current_power: number;
  min_power: number;
  max_power: number;
  nominal_power: number;
  flexibility_type: string;
  operating_schedule: string;
  production_dependency: string;
  is_sheddable: boolean;
  is_modulatable: boolean;
  status: 'RUNNING' | 'MODULATED' | 'IDLE' | 'SHED';
}

export interface BatteryState {
  capacity_kwh: number;
  current_soc: number;
  min_soc: number;
  max_soc: number;
  reserve_soc: number;
  max_charge_kw: number;
  max_discharge_kw: number;
  charge_efficiency: number;
  discharge_efficiency: number;
  degradation_cost_per_kwh: number;
  current_power: number; // kW (+ dis, - ch)
  available_energy_kwh: number;
  temperature_c: number;
  state: 'CHARGING' | 'DISCHARGING' | 'IDLE' | 'RESERVE_HOLD';
  cycle_count: number;
  health_soh: number;
  projected_soc_curve: Array<{ time: string; soc: number; power: number }>;
}

export interface GridTariffInfo {
  current_tariff: number; // ₹/kWh
  currency_symbol: string;
  current_tier: TariffTier;
  next_tier: TariffTier;
  next_tier_time: string;
  import_limit_kw: number;
  current_import_kw: number;
  demand_charge_rate: number; // ₹/kW/month
  monthly_peak_kw: number;
  demand_charge_exposure: number; // ₹
  schedule: Array<{
    hour: number;
    time_label: string;
    tariff: number;
    tier: TariffTier;
    is_current: boolean;
  }>;
}

export interface ForecastPoint {
  timestamp: string;
  time_label: string;
  actual_generation?: number;
  forecast_generation: number;
  confidence_lower: number;
  confidence_upper: number;
  actual_demand?: number;
  forecast_demand: number;
  solar_irradiance: number;
  temperature: number;
  cloud_cover: number;
}

export interface ForecastData {
  horizon: '15m' | '30m' | '1h' | '6h' | '24h';
  points: ForecastPoint[];
  mae: number;
  rmse: number;
  mape: number;
  r2: number;
  is_simulated: boolean;
}

export interface ExplainableMetadata {
  decision: string;
  recommended_action: string;
  why: string[];
  expected_impact: string[];
  confidence: number;
  target_component: string;
  timestamp: string;
}

export interface OptimizationResult {
  id: string;
  timestamp: string;
  status: 'OPTIMAL' | 'FEASIBLE' | 'INFEASIBLE';
  objective_value: number;
  solve_time_ms: number;
  summary: {
    total_grid_cost: number;
    baseline_grid_cost: number;
    cost_savings: number;
    cost_savings_pct: number;
    peak_demand_kw: number;
    peak_reduction_kw: number;
    renewable_utilized_pct: number;
    curtailed_energy_kwh: number;
    production_feasibility: '100% SATISFIED' | 'MODULATED WITH MARGIN' | 'CONSTRAINT VIOLATION';
  };
  schedule: Array<{
    time: string;
    renewable_gen: number;
    load_demand: number;
    grid_import: number;
    battery_charge: number;
    battery_discharge: number;
    battery_soc: number;
    curtailment: number;
    tariff: number;
    cost: number;
  }>;
  explanation: ExplainableMetadata;
}

export interface WhatIfSimulationParams {
  renewable_multiplier: number;
  demand_multiplier: number;
  initial_battery_soc: number;
  tariff_multiplier: number;
  grid_limit_kw: number;
  battery_reserve_pct: number;
  load_flexibility_pct: number;
  scenario_name?: string;
}

export interface SimulationResult {
  baseline: {
    total_cost: number;
    grid_import_kwh: number;
    peak_grid_kw: number;
    renewable_utilization_pct: number;
    curtailment_kwh: number;
    battery_cycles: number;
  };
  optimized: {
    total_cost: number;
    grid_import_kwh: number;
    peak_grid_kw: number;
    renewable_utilization_pct: number;
    curtailment_kwh: number;
    battery_cycles: number;
  };
  comparison: {
    cost_saved: number;
    savings_pct: number;
    peak_shaved_kw: number;
    peak_reduction_pct: number;
    renewable_recovered_kwh: number;
    feasibility: string;
  };
  schedule: OptimizationResult['schedule'];
  is_simulation_estimate: boolean;
}

export interface PredefinedScenario {
  id: string;
  name: string;
  description: string;
  tag: string;
  params: WhatIfSimulationParams;
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  component: AlertComponent;
  recommended_action: string;
  acknowledged: boolean;
}

export interface AnalyticsPeriodData {
  timeframe: 'day' | 'week' | 'month';
  daily_costs: Array<{ date: string; baseline_cost: number; optimized_cost: number; savings: number }>;
  renewable_utilization_trend: Array<{ date: string; solar_kwh: number; utilized_kwh: number; curtailed_kwh: number }>;
  grid_peak_history: Array<{ date: string; peak_kw: number; contract_limit: number }>;
  battery_throughput: Array<{ date: string; throughput_kwh: number; soh: number }>;
  forecast_accuracy_trend: Array<{ date: string; mae: number; mape: number }>;
}

export interface DigitalTwinNode {
  id: string;
  name: string;
  type: 'SOURCE' | 'STORAGE' | 'GRID' | 'HUB' | 'SINK';
  power_kw: number;
  status: 'OPTIMAL' | 'ACTIVE' | 'IDLE' | 'WARNING' | 'ALERT';
  efficiency_pct: number;
  details: Record<string, string | number>;
}

export interface DigitalTwinState {
  operating_mode: OperatingMode;
  hub_frequency_hz: number;
  hub_voltage_v: number;
  power_factor: number;
  nodes: DigitalTwinNode[];
  active_alerts_count: number;
  timestamp: string;
}
