import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import {
  PlantSummary,
  ExecutiveDashboardKPIs,
  EnergyFlowData,
  ForecastData,
  IndustrialLoad,
  BatteryState,
  GridTariffInfo,
  OptimizationResult,
  ExplainableMetadata,
  PredefinedScenario,
  SimulationResult,
  DigitalTwinState,
  SystemAlert,
  WhatIfSimulationParams
} from '@/types';

import { Sidebar, NavSection } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { EnergyFlowDiagram } from '@/components/dashboard/EnergyFlowDiagram';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { ForecastChart } from '@/components/forecast/ForecastChart';
import { LoadMatrix } from '@/components/loads/LoadMatrix';
import { BatteryGauge } from '@/components/battery/BatteryGauge';
import { TariffChart } from '@/components/grid/TariffChart';
import { OptimizationPanel } from '@/components/optimization/OptimizationPanel';
import { WhatIfSimulator } from '@/components/simulator/WhatIfSimulator';
import { DigitalTwinView } from '@/components/digitaltwin/DigitalTwinView';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { AlertsPanel } from '@/components/alerts/AlertsPanel';
import { SettingsModal } from '@/components/settings/SettingsModal';

import {
  Sun,
  Factory,
  Zap,
  BatteryCharging,
  TrendingDown,
  Percent,
  IndianRupee,
  PiggyBank,
  AlertCircle
} from 'lucide-react';

export function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState<'ADMIN' | 'ENERGY_MANAGER' | 'OPERATOR'>('ENERGY_MANAGER');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Core Data States
  const [plant, setPlant] = useState<PlantSummary | null>(null);
  const [kpis, setKpis] = useState<ExecutiveDashboardKPIs | null>(null);
  const [energyFlow, setEnergyFlow] = useState<EnergyFlowData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loads, setLoads] = useState<IndustrialLoad[]>([]);
  const [battery, setBattery] = useState<BatteryState | null>(null);
  const [gridInfo, setGridInfo] = useState<GridTariffInfo | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [recommendation, setRecommendation] = useState<ExplainableMetadata | null>(null);
  const [scenarios, setScenarios] = useState<PredefinedScenario[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [digitalTwin, setDigitalTwin] = useState<DigitalTwinState | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);

  // Loading States
  const [isSolvingOpt, setIsSolvingOpt] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isForecastLoading, setIsForecastLoading] = useState(false);

  // Fetch all initial telemetry
  const loadAllData = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMsg(null);
    try {
      const [
        plantRes,
        kpiRes,
        flowRes,
        forecastRes,
        loadsRes,
        batteryRes,
        gridRes,
        scenariosRes,
        twinRes,
        analyticsRes,
        alertsRes
      ] = await Promise.all([
        api.getPlantSummary(),
        api.getDashboardKpis(),
        api.getEnergyFlow(),
        api.getRenewableForecast('24h'),
        api.getLoads(),
        api.getBatteryState(),
        api.getGridInfo(),
        api.getScenarios(),
        api.getDigitalTwin(),
        api.getAnalytics('week'),
        api.getAlerts()
      ]);

      setPlant(plantRes);
      setKpis(kpiRes);
      setEnergyFlow(flowRes);
      setForecast(forecastRes);
      setLoads(loadsRes);
      setBattery(batteryRes);
      setGridInfo(gridRes);
      setScenarios(scenariosRes);
      setDigitalTwin(twinRes);
      setAnalyticsData(analyticsRes);
      setAlerts(alertsRes);

      // Run initial baseline optimization & simulation
      const optRes = await api.runOptimization({ horizon_hours: 24 });
      setOptimizationResult(optRes);
      setRecommendation(optRes.explanation);

      const simRes = await api.runSimulator({
        renewable_multiplier: 1.0,
        demand_multiplier: 1.0,
        initial_battery_soc: 65.0,
        tariff_multiplier: 1.0,
        grid_limit_kw: 500.0,
        battery_reserve_pct: 20.0,
        load_flexibility_pct: 15.0
      });
      setSimulationResult(simRes);
    } catch (err: any) {
      console.error('Failed to fetch platform telemetry:', err);
      setErrorMsg(err.message || 'Unable to connect to ENERGIQ backend API.');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Forecast Horizon Change Handler
  const handleHorizonChange = async (horizon: '15m' | '30m' | '1h' | '6h' | '24h') => {
    setIsForecastLoading(true);
    try {
      const res = await api.getRenewableForecast(horizon);
      setForecast(res);
    } catch (err) {
      console.error('Error changing horizon:', err);
    } finally {
      setIsForecastLoading(false);
    }
  };

  // Industrial Load Status Update Handler
  const handleUpdateLoad = async (loadId: string, status: string) => {
    try {
      await api.updateLoadStatus(loadId, status);
      const updatedLoads = await api.getLoads();
      setLoads(updatedLoads);
      const updatedFlow = await api.getEnergyFlow();
      setEnergyFlow(updatedFlow);
      const updatedKpis = await api.getDashboardKpis();
      setKpis(updatedKpis);
    } catch (err: any) {
      alert(err.message || 'Failed to update load status');
    }
  };

  // Run Optimization Handler
  const handleRunOptimization = async (params: any) => {
    setIsSolvingOpt(true);
    try {
      const res = await api.runOptimization(params);
      setOptimizationResult(res);
      setRecommendation(res.explanation);
    } catch (err: any) {
      alert(`Optimization Solver Error: ${err.message}`);
    } finally {
      setIsSolvingOpt(false);
    }
  };

  // Run What-If Simulation Handler
  const handleRunSimulation = async (simParams: WhatIfSimulationParams) => {
    setIsSimulating(true);
    try {
      const res = await api.runSimulator(simParams);
      setSimulationResult(res);
    } catch (err: any) {
      alert(`Simulation Error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  // Analytics Timeframe Change Handler
  const handleTimeframeChange = async (tf: 'day' | 'week' | 'month') => {
    try {
      const res = await api.getAnalytics(tf);
      setAnalyticsData(res);
    } catch (err) {
      console.error('Failed to change analytics timeframe:', err);
    }
  };

  // Alert Acknowledge Handler
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await api.acknowledgeAlert(alertId);
      const updatedAlerts = await api.getAlerts();
      setAlerts(updatedAlerts);
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Sticky Navigation Bar */}
        <TopBar
          plant={plant}
          alerts={alerts}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onRefresh={loadAllData}
          isRefreshing={isRefreshing}
          onOpenAlerts={() => setCurrentSection('alerts')}
        />

        {/* Global Error Banner if API Fails */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadAllData}
              className="px-2.5 py-1 bg-white border border-rose-300 rounded font-bold hover:bg-rose-100 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Dynamic Section Content Container */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* 1. EXECUTIVE DASHBOARD */}
          {currentSection === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Top 8 KPI Cards */}
              {kpis && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <KpiCard
                    metric={kpis.renewable_generation}
                    icon={Sun}
                    accentColor="emerald"
                    tooltip="Real-time Solar PV and Wind Generation"
                  />
                  <KpiCard
                    metric={kpis.industrial_demand}
                    icon={Factory}
                    accentColor="sky"
                    tooltip="Aggregate Industrial Load Power"
                  />
                  <KpiCard
                    metric={kpis.grid_consumption}
                    icon={Zap}
                    accentColor="amber"
                    tooltip="Substation Net Import Power"
                  />
                  <KpiCard
                    metric={kpis.battery_soc}
                    icon={BatteryCharging}
                    accentColor="indigo"
                    tooltip="BESS State of Charge"
                  />
                  <KpiCard
                    metric={kpis.current_grid_peak}
                    icon={TrendingDown}
                    accentColor="slate"
                    tooltip="Monthly Peak Grid Demand"
                  />
                  <KpiCard
                    metric={kpis.renewable_curtailment}
                    icon={Percent}
                    accentColor="rose"
                    tooltip="Wasted/Curtailed Renewable Output"
                  />
                  <KpiCard
                    metric={kpis.current_energy_cost}
                    icon={IndianRupee}
                    accentColor="amber"
                    tooltip="Estimated Hourly Energy Cost"
                  />
                  <KpiCard
                    metric={kpis.estimated_daily_savings}
                    icon={PiggyBank}
                    accentColor="emerald"
                    tooltip="Daily Cost Avoidance via MILP"
                  />
                </div>
              )}

              {/* Live Energy Flow Visualization */}
              {energyFlow && <EnergyFlowDiagram data={energyFlow} />}

              {/* Explainable AI Recommendation Card */}
              {recommendation && <RecommendationCard data={recommendation} />}

              {/* Split Dashboard Row: Forecast Preview & Battery/Grid Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {forecast && (
                  <ForecastChart
                    data={forecast}
                    onHorizonChange={handleHorizonChange}
                    isLoading={isForecastLoading}
                  />
                )}

                {battery && <BatteryGauge battery={battery} />}
              </div>
            </div>
          )}

          {/* 2. RENEWABLE FORECAST */}
          {currentSection === 'forecast' && forecast && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <ForecastChart
                data={forecast}
                onHorizonChange={handleHorizonChange}
                isLoading={isForecastLoading}
              />
            </div>
          )}

          {/* 3. LIVE ENERGY FLOW */}
          {currentSection === 'energyflow' && energyFlow && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <EnergyFlowDiagram data={energyFlow} />
            </div>
          )}

          {/* 4. INDUSTRIAL LOADS */}
          {currentSection === 'loads' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <LoadMatrix loads={loads} onUpdateLoad={handleUpdateLoad} />
            </div>
          )}

          {/* 5. BATTERY INTELLIGENCE */}
          {currentSection === 'battery' && battery && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <BatteryGauge battery={battery} />
            </div>
          )}

          {/* 6. GRID & TARIFF INTELLIGENCE */}
          {currentSection === 'grid' && gridInfo && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <TariffChart gridInfo={gridInfo} />
            </div>
          )}

          {/* 7. AI OPTIMIZATION */}
          {currentSection === 'optimization' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <OptimizationPanel
                currentResult={optimizationResult}
                onRunOptimization={handleRunOptimization}
                isLoading={isSolvingOpt}
              />
            </div>
          )}

          {/* 8. WHAT-IF SIMULATOR */}
          {currentSection === 'simulator' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <WhatIfSimulator
                scenarios={scenarios}
                onRunSimulation={handleRunSimulation}
                currentResult={simulationResult}
                isLoading={isSimulating}
              />
            </div>
          )}

          {/* 9. DIGITAL TWIN */}
          {currentSection === 'digitaltwin' && digitalTwin && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <DigitalTwinView twinState={digitalTwin} />
            </div>
          )}

          {/* 10. HISTORICAL ANALYTICS */}
          {currentSection === 'analytics' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <AnalyticsDashboard
                data={analyticsData}
                onTimeframeChange={handleTimeframeChange}
                isLoading={false}
              />
            </div>
          )}

          {/* 11. ALERTS & ACTIONS */}
          {currentSection === 'alerts' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <AlertsPanel
                alerts={alerts}
                onAcknowledge={handleAcknowledgeAlert}
              />
            </div>
          )}

          {/* 12. SYSTEM SETTINGS */}
          {currentSection === 'settings' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <SettingsModal plant={plant} currentRole={currentRole} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
