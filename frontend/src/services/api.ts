import {
  ExecutiveDashboardKPIs,
  PlantSummary,
  EnergyFlowData,
  ForecastData,
  IndustrialLoad,
  BatteryState,
  GridTariffInfo,
  OptimizationResult,
  ExplainableMetadata,
  PredefinedScenario,
  SimulationResult,
  WhatIfSimulationParams,
  DigitalTwinState,
  SystemAlert,
  AnalyticsPeriodData
} from '@/types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || errorBody.message || `API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Dashboard
  async getDashboardKpis(): Promise<ExecutiveDashboardKPIs> {
    const res = await fetch(`${API_BASE}/dashboard/kpis`);
    return handleResponse<ExecutiveDashboardKPIs>(res);
  },

  async getPlantSummary(): Promise<PlantSummary> {
    const res = await fetch(`${API_BASE}/dashboard/plant`);
    return handleResponse<PlantSummary>(res);
  },

  async getEnergyFlow(): Promise<EnergyFlowData> {
    const res = await fetch(`${API_BASE}/energy-flow`);
    return handleResponse<EnergyFlowData>(res);
  },

  // Forecasts
  async getRenewableForecast(horizon: '15m' | '30m' | '1h' | '6h' | '24h' = '24h'): Promise<ForecastData> {
    const res = await fetch(`${API_BASE}/forecast/renewable?horizon=${horizon}`);
    return handleResponse<ForecastData>(res);
  },

  async getLoadForecast(horizonHours: number = 24): Promise<any[]> {
    const res = await fetch(`${API_BASE}/forecast/load?horizon_hours=${horizonHours}`);
    return handleResponse<any[]>(res);
  },

  // Industrial Loads
  async getLoads(): Promise<IndustrialLoad[]> {
    const res = await fetch(`${API_BASE}/loads`);
    return handleResponse<IndustrialLoad[]>(res);
  },

  async updateLoadStatus(loadId: string, status: string): Promise<any> {
    const res = await fetch(`${API_BASE}/loads/${loadId}?status=${status}`, {
      method: 'PUT'
    });
    return handleResponse<any>(res);
  },

  // Battery
  async getBatteryState(): Promise<BatteryState> {
    const res = await fetch(`${API_BASE}/battery`);
    return handleResponse<BatteryState>(res);
  },

  // Grid
  async getGridInfo(): Promise<GridTariffInfo> {
    const res = await fetch(`${API_BASE}/grid`);
    return handleResponse<GridTariffInfo>(res);
  },

  // Optimization
  async runOptimization(params: {
    horizon_hours?: number;
    solar_capacity_kw?: number;
    bess_capacity_kwh?: number;
    initial_soc_pct?: number;
    grid_limit_kw?: number;
    load_flexibility_pct?: number;
  }): Promise<OptimizationResult> {
    const res = await fetch(`${API_BASE}/optimization/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return handleResponse<OptimizationResult>(res);
  },

  async getRecommendations(): Promise<ExplainableMetadata> {
    const res = await fetch(`${API_BASE}/recommendations`);
    return handleResponse<ExplainableMetadata>(res);
  },

  // Simulator
  async getScenarios(): Promise<PredefinedScenario[]> {
    const res = await fetch(`${API_BASE}/scenarios`);
    return handleResponse<PredefinedScenario[]>(res);
  },

  async runSimulator(params: WhatIfSimulationParams): Promise<SimulationResult> {
    const res = await fetch(`${API_BASE}/simulator/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return handleResponse<SimulationResult>(res);
  },

  // Digital Twin
  async getDigitalTwin(): Promise<DigitalTwinState> {
    const res = await fetch(`${API_BASE}/digital-twin`);
    return handleResponse<DigitalTwinState>(res);
  },

  // Analytics
  async getAnalytics(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<AnalyticsPeriodData> {
    const res = await fetch(`${API_BASE}/analytics?timeframe=${timeframe}`);
    return handleResponse<AnalyticsPeriodData>(res);
  },

  // Alerts
  async getAlerts(): Promise<SystemAlert[]> {
    const res = await fetch(`${API_BASE}/alerts`);
    return handleResponse<SystemAlert[]>(res);
  },

  async acknowledgeAlert(alertId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, {
      method: 'POST'
    });
    return handleResponse<any>(res);
  }
};
