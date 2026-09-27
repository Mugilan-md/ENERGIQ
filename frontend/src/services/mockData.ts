import {
  PlantSummary,
  ExecutiveDashboardKPIs,
  EnergyFlowData,
  ForecastData,
  ForecastPoint,
  IndustrialLoad,
  BatteryState,
  GridTariffInfo,
  TariffTier,
  OptimizationResult,
  ExplainableMetadata,
  PredefinedScenario,
  SimulationResult,
  DigitalTwinState,
  SystemAlert,
  AnalyticsPeriodData
} from '@/types';

export const mockPlant: PlantSummary = {
  id: 'plant-elcot-01',
  name: 'ELCOT Advanced Precision Manufacturing Hub',
  location: 'Industrial Corridor, Chennai',
  capacity_solar_kw: 650.0,
  capacity_bess_kwh: 800.0,
  grid_contract_kw: 500.0,
  current_mode: 'NORMAL',
  system_health: 'OPTIMAL',
  last_updated: new Date().toLocaleTimeString('en-US', { hour12: false })
};

export const mockKpis: ExecutiveDashboardKPIs = {
  renewable_generation: {
    value: 565.4,
    unit: 'kW',
    trend: 14.2,
    trend_direction: 'up',
    is_positive_trend: true,
    label: 'Renewable Generation',
    context: 'Solar (520 kW) + Wind (45 kW)'
  },
  industrial_demand: {
    value: 667.0,
    unit: 'kW',
    trend: -2.4,
    trend_direction: 'down',
    is_positive_trend: true,
    label: 'Industrial Demand',
    context: '6 Active Load Centers (CNC, HVAC, Pumping)'
  },
  grid_consumption: {
    value: 166.6,
    unit: 'kW',
    trend: -28.5,
    trend_direction: 'down',
    is_positive_trend: true,
    label: 'Net Grid Import',
    context: 'Contract Cap: 500 kW (33.3% capacity)'
  },
  battery_soc: {
    value: 68.5,
    unit: '%',
    trend: 6.2,
    trend_direction: 'up',
    is_positive_trend: true,
    label: 'Battery State of Charge',
    context: '548 kWh Available (Charging @ 65 kW)'
  },
  current_grid_peak: {
    value: 462.0,
    unit: 'kW',
    trend: -8.1,
    trend_direction: 'down',
    is_positive_trend: true,
    label: 'Monthly Grid Peak',
    context: 'Margin to 500 kW limit: 38 kW'
  },
  renewable_curtailment: {
    value: 0.0,
    unit: '%',
    trend: 0.0,
    trend_direction: 'neutral',
    is_positive_trend: true,
    label: 'Solar Curtailment',
    context: '100% Absorbed via BESS buffer'
  },
  current_energy_cost: {
    value: 1299.5,
    unit: '₹/hr',
    trend: -34.8,
    trend_direction: 'down',
    is_positive_trend: true,
    label: 'Current Energy Rate',
    context: 'Active Tariff: ₹7.80/kWh (Standard Tier)'
  },
  estimated_daily_savings: {
    value: 18450.0,
    unit: '₹/day',
    trend: 19.5,
    trend_direction: 'up',
    is_positive_trend: true,
    label: 'Daily Cost Avoidance',
    context: 'Via MILP Peak Shaving & Arbitrage'
  }
};

export const mockEnergyFlow: EnergyFlowData = {
  solar_generation: 520.4,
  wind_generation: 45.0,
  total_renewable: 565.4,
  grid_import: 166.6,
  battery_power: -65.0,
  battery_soc: 68.5,
  total_demand: 667.0,
  curtailment: 0.0,
  flows: {
    renewable_to_load: 500.4,
    renewable_to_battery: 65.0,
    grid_to_load: 166.6,
    battery_to_load: 0.0,
    renewable_to_curtailment: 0.0,
    grid_to_battery: 0.0
  }
};

export const mockLoads: IndustrialLoad[] = [
  {
    id: 'cnc-01',
    name: 'CNC 5-Axis Milling Cells',
    category: 'CNC',
    criticality: 'CRITICAL',
    current_power: 285.0,
    min_power: 220.0,
    max_power: 380.0,
    nominal_power: 300.0,
    flexibility_type: 'Non-curtailable (Precision Machining)',
    operating_schedule: 'Continuous 24/7 (3-Shift Rotation)',
    production_dependency: 'Critical Spindle Path - Tolerance ±2µm',
    is_sheddable: false,
    is_modulatable: false,
    status: 'RUNNING'
  },
  {
    id: 'hvac-01',
    name: 'Cleanroom HVAC & Process Chiller',
    category: 'HVAC',
    criticality: 'HIGH',
    current_power: 140.0,
    min_power: 80.0,
    max_power: 210.0,
    nominal_power: 150.0,
    flexibility_type: 'Thermal Buffer (±2°C Deadband modulation)',
    operating_schedule: 'Continuous (Temperature & Humidity Controlled)',
    production_dependency: 'Cleanroom ISO Class 6 environment compliance',
    is_sheddable: false,
    is_modulatable: true,
    status: 'MODULATED'
  },
  {
    id: 'comp-01',
    name: 'Compressed Air Generation Station',
    category: 'COMPRESSOR',
    criticality: 'MEDIUM',
    current_power: 95.0,
    min_power: 40.0,
    max_power: 160.0,
    nominal_power: 110.0,
    flexibility_type: 'Pressure Vessel Storage (30 min buffer)',
    operating_schedule: '06:00 - 22:00 Demand Tracking',
    production_dependency: 'Pneumatic tooling & robotic pick-and-place',
    is_sheddable: true,
    is_modulatable: true,
    status: 'RUNNING'
  },
  {
    id: 'pump-01',
    name: 'Effluent Treatment & Industrial Pumping',
    category: 'PUMP',
    criticality: 'FLEXIBLE',
    current_power: 45.0,
    min_power: 0.0,
    max_power: 120.0,
    nominal_power: 80.0,
    flexibility_type: 'Storage Reservoir Buffer (Can shift 4 hours)',
    operating_schedule: 'Intermittent / Off-Peak preferred',
    production_dependency: 'Wastewater balancing tank capacity 500m³',
    is_sheddable: true,
    is_modulatable: true,
    status: 'RUNNING'
  },
  {
    id: 'ev-01',
    name: 'Fleet EV Logistics Fast Chargers',
    category: 'EV_CHARGING',
    criticality: 'FLEXIBLE',
    current_power: 60.0,
    min_power: 0.0,
    max_power: 150.0,
    nominal_power: 90.0,
    flexibility_type: 'Smart Curtailment & Duty Cycle Throttling',
    operating_schedule: 'Shift changeovers & nighttime charging',
    production_dependency: 'Internal material transport AGVs & forklifts',
    is_sheddable: true,
    is_modulatable: true,
    status: 'RUNNING'
  },
  {
    id: 'aux-01',
    name: 'Facility Lighting & Auxiliary UPS',
    category: 'AUXILIARY',
    criticality: 'MEDIUM',
    current_power: 42.0,
    min_power: 30.0,
    max_power: 75.0,
    nominal_power: 45.0,
    flexibility_type: 'Lighting zone dimming (15% reduction)',
    operating_schedule: 'Continuous Base Load',
    production_dependency: 'Plant safety lighting and telemetry servers',
    is_sheddable: false,
    is_modulatable: true,
    status: 'RUNNING'
  }
];

export const mockBattery: BatteryState = {
  capacity_kwh: 800.0,
  current_soc: 68.5,
  min_soc: 15.0,
  max_soc: 95.0,
  reserve_soc: 20.0,
  max_charge_kw: 250.0,
  max_discharge_kw: 250.0,
  charge_efficiency: 0.94,
  discharge_efficiency: 0.94,
  degradation_cost_per_kwh: 0.45,
  current_power: -65.0,
  available_energy_kwh: 548.0,
  temperature_c: 27.4,
  state: 'CHARGING',
  cycle_count: 412,
  health_soh: 96.8,
  projected_soc_curve: [
    { time: '00:00', soc: 45.0, power: 0 },
    { time: '02:00', soc: 55.0, power: -50 },
    { time: '04:00', soc: 65.0, power: -50 },
    { time: '06:00', soc: 60.0, power: 25 },
    { time: '08:00', soc: 52.0, power: 40 },
    { time: '10:00', soc: 62.0, power: -60 },
    { time: '12:00', soc: 82.0, power: -100 },
    { time: '14:00', soc: 92.0, power: -50 },
    { time: '16:00', soc: 88.0, power: 20 },
    { time: '18:00', soc: 68.0, power: 120 },
    { time: '20:00', soc: 42.0, power: 140 },
    { time: '22:00', soc: 35.0, power: 30 }
  ]
};

export const mockGridInfo: GridTariffInfo = {
  current_tariff: 7.80,
  currency_symbol: '₹',
  current_tier: 'STANDARD',
  next_tier: 'PEAK',
  next_tier_time: '18:00',
  import_limit_kw: 500.0,
  current_import_kw: 166.6,
  demand_charge_rate: 350.0,
  monthly_peak_kw: 462.0,
  demand_charge_exposure: 161700.0,
  schedule: Array.from({ length: 24 }).map((_, h) => {
    let tier: TariffTier = 'STANDARD';
    let tariff = 7.80;
    if (h < 6 || h >= 22) {
      tier = 'OFF_PEAK';
      tariff = 4.50;
    } else if ((h >= 9 && h < 12) || (h >= 18 && h < 22)) {
      tier = 'PEAK';
      tariff = 12.50;
    }
    return {
      hour: h,
      time_label: `${h.toString().padStart(2, '0')}:00`,
      tariff,
      tier,
      is_current: h === 12
    };
  })
};

export const generateMockForecast = (horizon: string = '24h'): ForecastData => {
  const count = horizon === '15m' ? 4 : horizon === '1h' ? 12 : horizon === '6h' ? 24 : 24;
  const points: ForecastPoint[] = [];
  for (let i = 0; i < count; i++) {
    const h = (8 + i) % 24;
    const timeLabel = `${h.toString().padStart(2, '0')}:00`;
    const solarFactor = Math.max(0, Math.sin(((h - 6) / 12) * Math.PI));
    const forecastGen = Math.round(620 * Math.pow(solarFactor, 1.8) + (h >= 6 && h <= 18 ? 40 : 0));
    const actualGen = i < count * 0.4 ? Math.round(forecastGen * (0.95 + Math.random() * 0.1)) : undefined;
    const forecastDemand = Math.round(580 + Math.sin((h / 24) * Math.PI * 2) * 120);

    points.push({
      timestamp: timeLabel,
      time_label: timeLabel,
      forecast_generation: forecastGen,
      actual_generation: actualGen,
      confidence_lower: Math.max(0, Math.round(forecastGen * 0.88)),
      confidence_upper: Math.round(forecastGen * 1.12),
      forecast_demand: forecastDemand,
      solar_irradiance: Math.round(solarFactor * 980),
      temperature: Math.round(26 + solarFactor * 8),
      cloud_cover: Math.round(15 + (1 - solarFactor) * 40)
    });
  }

  return {
    horizon: horizon as any,
    points,
    mae: 14.8,
    rmse: 21.3,
    mape: 4.8,
    r2: 0.94,
    is_simulated: false
  };
};

export const mockExplainableRecommendation: ExplainableMetadata = {
  decision: 'BESS Arbitrage and Peak Shaving Dispatch',
  confidence: 0.96,
  target_component: 'BESS & Grid Substation',
  timestamp: new Date().toLocaleTimeString(),
  recommended_action: 'Authorize 180 kW BESS top-up charging for 45 minutes using surplus solar PV, then prepare to discharge 150 kW during evening peak tariff (18:00 - 21:00).',
  why: [
    'Solar generation is currently peaking at 565 kW while production loads require 500 kW.',
    'Capturing the 65 kW surplus into BESS avoids 0% curtailment waste and buffers against ₹12.50/kWh peak grid rates.',
    'Pre-charging mitigates potential grid demand spikes beyond 500 kW contract ceiling.'
  ],
  expected_impact: [
    'Estimated immediate cost avoidance of ₹4,250 during the 18:00 - 21:00 peak tariff window.',
    'Shaves 150 kW from grid import, preventing monthly maximum demand charge penalties (₹350/kW).',
    'Maintains battery cell temperature safely below 30°C and preserves SOH above 96%.'
  ]
};

export const mockOptimizationResult: OptimizationResult = {
  id: 'opt-run-001',
  timestamp: new Date().toLocaleTimeString(),
  status: 'OPTIMAL',
  objective_value: 38240.0,
  solve_time_ms: 11.4,
  summary: {
    total_grid_cost: 38240.0,
    baseline_grid_cost: 56690.0,
    cost_savings: 18450.0,
    cost_savings_pct: 32.5,
    peak_demand_kw: 385.0,
    peak_reduction_kw: 115.0,
    renewable_utilized_pct: 100.0,
    curtailed_energy_kwh: 0.0,
    production_feasibility: '100% SATISFIED'
  },
  explanation: mockExplainableRecommendation,
  schedule: Array.from({ length: 24 }).map((_, i) => {
    const h = i;
    const timeLabel = `${h.toString().padStart(2, '0')}:00`;
    const solarFactor = Math.max(0, Math.sin(((h - 6) / 12) * Math.PI));
    const solarGen = Math.round(620 * Math.pow(solarFactor, 1.8));
    const demand = Math.round(580 + Math.sin((h / 24) * Math.PI * 2) * 120);
    const tariff = (h >= 9 && h < 12) || (h >= 18 && h < 22) ? 12.50 : (h < 6 || h >= 22 ? 4.50 : 7.80);
    const bessDis = tariff > 10.0 && demand > solarGen ? Math.min(demand - solarGen, 150) : 0;
    const bessChg = solarGen > demand ? Math.min(solarGen - demand, 180) : (h >= 1 && h <= 4 ? 90 : 0);
    const gridImp = Math.max(0, demand - solarGen - bessDis + bessChg);

    return {
      time: timeLabel,
      renewable_gen: solarGen,
      load_demand: demand,
      grid_import: gridImp,
      battery_charge: bessChg,
      battery_discharge: bessDis,
      battery_soc: Math.round(45 + Math.sin((h / 24) * Math.PI * 2) * 35),
      curtailment: 0,
      tariff,
      cost: Math.round(gridImp * tariff)
    };
  })
};

export const mockScenarios: PredefinedScenario[] = [
  {
    id: 'sc-01',
    name: 'Severe Heatwave & High Production Surge',
    description: 'Chiller and HVAC loads surge +25%, solar generation high, tariffs peak at ₹12.50/kWh.',
    tag: 'HEATWAVE',
    params: {
      renewable_multiplier: 1.25,
      demand_multiplier: 1.25,
      initial_battery_soc: 60.0,
      tariff_multiplier: 1.2,
      grid_limit_kw: 500.0,
      battery_reserve_pct: 20.0,
      load_flexibility_pct: 15.0
    }
  },
  {
    id: 'sc-02',
    name: 'Monsoon Heavy Cloud Cover & Wind Deficit',
    description: 'Solar PV curtailed to 30% baseline. Relies on BESS arbitrage and off-peak grid buffering.',
    tag: 'MONSOON',
    params: {
      renewable_multiplier: 0.35,
      demand_multiplier: 1.0,
      initial_battery_soc: 85.0,
      tariff_multiplier: 1.0,
      grid_limit_kw: 500.0,
      battery_reserve_pct: 25.0,
      load_flexibility_pct: 20.0
    }
  },
  {
    id: 'sc-03',
    name: 'Substation Grid Outage / Islanding Defense',
    description: 'Utility feeder disconnected. Microgrid operates islanded with zero grid import.',
    tag: 'ISLANDING',
    params: {
      renewable_multiplier: 1.0,
      demand_multiplier: 0.85,
      initial_battery_soc: 90.0,
      tariff_multiplier: 1.0,
      grid_limit_kw: 0.0,
      battery_reserve_pct: 30.0,
      load_flexibility_pct: 30.0
    }
  }
];

export const mockSimulationResult: SimulationResult = {
  baseline: {
    total_cost: 56840.0,
    grid_import_kwh: 4850.0,
    peak_grid_kw: 540.0,
    renewable_utilization_pct: 82.4,
    curtailment_kwh: 145.0,
    battery_cycles: 0.3
  },
  optimized: {
    total_cost: 38240.0,
    grid_import_kwh: 3620.0,
    peak_grid_kw: 385.0,
    renewable_utilization_pct: 100.0,
    curtailment_kwh: 0.0,
    battery_cycles: 1.2
  },
  comparison: {
    cost_saved: 18600.0,
    savings_pct: 32.7,
    peak_shaved_kw: 155.0,
    peak_reduction_pct: 28.7,
    renewable_recovered_kwh: 145.0,
    feasibility: '100% Critical Loads Protected'
  },
  schedule: mockOptimizationResult.schedule,
  is_simulation_estimate: true
};

export const mockDigitalTwin: DigitalTwinState = {
  timestamp: new Date().toLocaleTimeString(),
  hub_voltage_v: 415.2,
  hub_frequency_hz: 50.02,
  power_factor: 0.985,
  operating_mode: 'NORMAL',
  active_alerts_count: 3,
  nodes: [
    {
      id: 'solar-inv-01',
      name: 'Rooftop Solar PV Array',
      type: 'SOURCE',
      power_kw: 520.4,
      status: 'OPTIMAL',
      efficiency_pct: 98.2,
      details: {
        Inverter: 'SMA Sunny Tripower 100kW x 6',
        Irradiance: '820 W/m²',
        DC_Voltage: '680 V',
        MPPT_State: 'Track Lock Active'
      }
    },
    {
      id: 'bess-rack-01',
      name: 'BESS Battery Rack System',
      type: 'STORAGE',
      power_kw: -65.0,
      status: 'ACTIVE',
      efficiency_pct: 94.0,
      details: {
        Chemistry: 'Lithium Iron Phosphate (LFP)',
        Pack_Voltage: '745 V',
        Cell_Balance: 'Delta < 12mV',
        Thermal_BMS: 'Cooling Pump Active'
      }
    },
    {
      id: 'grid-sub-01',
      name: 'Main Substation 11kV Feeder',
      type: 'GRID',
      power_kw: 166.6,
      status: 'OPTIMAL',
      efficiency_pct: 99.1,
      details: {
        Transformer: '1.5 MVA Dyn11 Oil Cooled',
        Import_Capacity: '500 kW Contract',
        Line_Frequency: '50.02 Hz',
        Harmonics_THD: '1.8% (IEEE 519)'
      }
    },
    {
      id: 'bus-main-415',
      name: 'Central 415V Switchgear Busbar',
      type: 'HUB',
      power_kw: 667.0,
      status: 'OPTIMAL',
      efficiency_pct: 99.8,
      details: {
        Bus_Rating: '2000A Copper Plated',
        Neutral_Ground: 'Solid Low Impedance',
        Breakers: 'ABB Emax2 Smart ACB',
        SCADA_Link: 'Modbus TCP / IEC 61850'
      }
    },
    {
      id: 'load-machining',
      name: 'Precision CNC Machining Floor',
      type: 'SINK',
      power_kw: 285.0,
      status: 'OPTIMAL',
      efficiency_pct: 96.5,
      details: {
        Workcells: '5-Axis DMG Mori x 4',
        Power_Factor: '0.96 with VFD Filters',
        Interlock: 'Safety Lock Active (Zero Shed)',
        Criticality: 'P1 Production Core'
      }
    },
    {
      id: 'load-cleanroom',
      name: 'Cleanroom ISO-6 & Chiller Plant',
      type: 'SINK',
      power_kw: 140.0,
      status: 'ACTIVE',
      efficiency_pct: 93.8,
      details: {
        Chillers: 'Carrier Screw Chiller 80TR x 2',
        Modulation: '±2°C Deadband Throttle',
        Airflow: 'Laminar 0.45 m/s',
        Criticality: 'P2 High Importance'
      }
    }
  ]
};

export const mockAnalytics: AnalyticsPeriodData = {
  timeframe: 'week',
  daily_costs: [
    { date: 'Mon', baseline_cost: 54200, optimized_cost: 36800, savings: 17400 },
    { date: 'Tue', baseline_cost: 56100, optimized_cost: 38200, savings: 17900 },
    { date: 'Wed', baseline_cost: 53800, optimized_cost: 35900, savings: 17900 },
    { date: 'Thu', baseline_cost: 58400, optimized_cost: 39100, savings: 19300 },
    { date: 'Fri', baseline_cost: 57200, optimized_cost: 38400, savings: 18800 },
    { date: 'Sat', baseline_cost: 44100, optimized_cost: 31200, savings: 12900 },
    { date: 'Sun', baseline_cost: 41200, optimized_cost: 29800, savings: 11400 }
  ],
  renewable_utilization_trend: [
    { date: 'Mon', solar_kwh: 3850, utilized_kwh: 3850, curtailed_kwh: 0 },
    { date: 'Tue', solar_kwh: 4100, utilized_kwh: 4100, curtailed_kwh: 0 },
    { date: 'Wed', solar_kwh: 3600, utilized_kwh: 3600, curtailed_kwh: 0 },
    { date: 'Thu', solar_kwh: 4250, utilized_kwh: 4250, curtailed_kwh: 0 },
    { date: 'Fri', solar_kwh: 3950, utilized_kwh: 3950, curtailed_kwh: 0 },
    { date: 'Sat', solar_kwh: 4300, utilized_kwh: 4300, curtailed_kwh: 0 },
    { date: 'Sun', solar_kwh: 3750, utilized_kwh: 3750, curtailed_kwh: 0 }
  ],
  grid_peak_history: [
    { date: 'Mon', peak_kw: 380, contract_limit: 500 },
    { date: 'Tue', peak_kw: 395, contract_limit: 500 },
    { date: 'Wed', peak_kw: 375, contract_limit: 500 },
    { date: 'Thu', peak_kw: 410, contract_limit: 500 },
    { date: 'Fri', peak_kw: 390, contract_limit: 500 },
    { date: 'Sat', peak_kw: 340, contract_limit: 500 },
    { date: 'Sun', peak_kw: 320, contract_limit: 500 }
  ],
  battery_throughput: [
    { date: 'Mon', throughput_kwh: 420, soh: 97.2 },
    { date: 'Tue', throughput_kwh: 480, soh: 97.1 },
    { date: 'Wed', throughput_kwh: 410, soh: 97.0 },
    { date: 'Thu', throughput_kwh: 520, soh: 97.0 },
    { date: 'Fri', throughput_kwh: 490, soh: 96.9 },
    { date: 'Sat', throughput_kwh: 310, soh: 96.9 },
    { date: 'Sun', throughput_kwh: 280, soh: 96.8 }
  ],
  forecast_accuracy_trend: [
    { date: 'Mon', mae: 15.2, mape: 5.1 },
    { date: 'Tue', mae: 14.8, mape: 4.9 },
    { date: 'Wed', mae: 16.1, mape: 5.4 },
    { date: 'Thu', mae: 13.9, mape: 4.6 },
    { date: 'Fri', mae: 14.2, mape: 4.7 },
    { date: 'Sat', mae: 12.8, mape: 4.2 },
    { date: 'Sun', mae: 13.5, mape: 4.4 }
  ]
};

export const mockAlerts: SystemAlert[] = [
  {
    id: 'alt-01',
    timestamp: '12:28:45',
    severity: 'WARNING',
    title: 'Grid Peak Approaching Threshold',
    description: 'Substation import is at 445 kW (89% of contracted 500 kW ceiling). Demand charge exposure risk.',
    component: 'GRID',
    recommended_action: 'Dispatch BESS discharge at 75 kW or throttle flexible EV logistics & water pumping.',
    acknowledged: false
  },
  {
    id: 'alt-02',
    timestamp: '12:05:12',
    severity: 'INFO',
    title: 'Solar PV Generation Exceeds Morning Baseline',
    description: 'Solar irradiance reached 820 W/m² (+12% above 08:00 model prediction). Opportunity to top-up BESS.',
    component: 'RENEWABLE',
    recommended_action: 'Direct 65 kW surplus solar to BESS storage to prepare for evening peak tariff tier (18:00).',
    acknowledged: false
  },
  {
    id: 'alt-03',
    timestamp: '10:15:00',
    severity: 'CRITICAL',
    title: 'High Tariff Window Scheduled (₹12.50/kWh)',
    description: 'Evening peak tariff starts at 18:00. Unoptimized projected electricity cost: ₹18,400/hr.',
    component: 'OPTIMIZER',
    recommended_action: 'Authorize automated MILP dispatch schedule to shave 140 kW from grid import.',
    acknowledged: false
  }
];
