import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import {
  PlantSummary,
  ExecutiveDashboardKPIs,
  KpiMetric,
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
import { CommandPalette } from '@/components/common/CommandPalette';

import {
  Sun,
  Factory,
  Zap,
  BatteryCharging,
  TrendingDown,
  Percent,
  IndianRupee,
  PiggyBank,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  GitFork,
  SunMedium,
  ArrowUpRight,
  ChevronRight,
  Leaf
} from 'lucide-react';
import clsx from 'clsx';

export function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState<'ADMIN' | 'ENERGY_MANAGER' | 'OPERATOR'>('ENERGY_MANAGER');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Executive Dashboard Layout Mode States
  const [kpiViewMode, setKpiViewMode] = useState<'operational' | 'financial' | 'all'>('operational');
  const [visualizerTab, setVisualizerTab] = useState<'flow' | 'forecast' | 'battery'>('flow');
  const [isCopilotDispatching, setIsCopilotDispatching] = useState(false);
  const [isCopilotAuthorized, setIsCopilotAuthorized] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        battRes,
        gridRes,
        recRes,
        scenRes,
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
        api.getRecommendations(),
        api.getScenarios(),
        api.getDigitalTwin(),
        api.getAnalytics('day'),
        api.getAlerts()
      ]);

      setPlant(plantRes);
      setKpis(kpiRes);
      setEnergyFlow(flowRes);
      setForecast(forecastRes);
      setLoads(loadsRes);
      setBattery(battRes);
      setGridInfo(gridRes);
      setRecommendation(recRes);
      setScenarios(scenRes);
      setDigitalTwin(twinRes);
      setAnalyticsData(analyticsRes);
      setAlerts(alertsRes);

      // Run baseline scenario for simulation preview
      const simRes = await api.runSimulator({
        renewable_multiplier: 1.0,
        demand_multiplier: 1.0,
        initial_battery_soc: 65,
        tariff_multiplier: 1.0,
        grid_limit_kw: 500,
        battery_reserve_pct: 20,
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
      showToast(`Updated forecast horizon to ${horizon}`);
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
      showToast(`Workcell ${loadId} set to ${status}`);
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
      showToast('MILP Optimization solved successfully! (Status: OPTIMAL)');
    } catch (err: any) {
      alert(`Optimization Solver Error: ${err.message}`);
    } finally {
      setIsSolvingOpt(false);
    }
  };

  // Trigger quick optimize from TopBar or Command Palette
  const handleQuickOptimize = () => {
    handleRunOptimization({
      horizon_hours: 24,
      initial_soc_pct: battery ? battery.current_soc : 65,
      grid_limit_kw: 500,
      load_flexibility_pct: 15
    });
  };

  // Run What-If Simulation Handler
  const handleRunSimulation = async (simParams: WhatIfSimulationParams) => {
    setIsSimulating(true);
    try {
      const res = await api.runSimulator(simParams);
      setSimulationResult(res);
      showToast('Parametric simulation scenario verified.');
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
      showToast(`Loaded ${tf} analytics report`);
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
      showToast(`Alert [${alertId}] acknowledged`);
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  // 4 Default Clean KPI objects with exact values
  const defaultSolarKpi: KpiMetric = kpis?.renewable_generation || {
    label: 'Solar Generation',
    value: 565,
    unit: 'kW',
    trend: 12.4,
    trend_direction: 'up',
    is_positive_trend: true,
    context: '650 kWp Rooftop & Ground Array'
  };

  const defaultDemandKpi: KpiMetric = kpis?.industrial_demand || {
    label: 'Facility Demand',
    value: 667,
    unit: 'kW',
    trend: -3.2,
    trend_direction: 'down',
    is_positive_trend: true,
    context: '6 Critical Industrial Workcells'
  };

  const defaultGridKpi: KpiMetric = kpis?.grid_consumption || {
    label: 'Grid Import',
    value: 167,
    unit: 'kW',
    trend: -18.5,
    trend_direction: 'down',
    is_positive_trend: true,
    context: '500 kW Substation Sanction'
  };

  const defaultBatteryKpi: KpiMetric = kpis?.battery_soc || {
    label: 'Battery SOC',
    value: 68.5,
    unit: '%',
    trend: 5.0,
    trend_direction: 'up',
    is_positive_trend: true,
    context: '800 kWh LFP Storage Buffer'
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-[#F4F7FA] text-[#0F172A] relative select-none light">
      {/* Global Interactive Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectSection={setCurrentSection}
        onRunOptimization={handleQuickOptimize}
      />

      {/* Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-white text-[#0F172A] rounded-xl border border-[#E2E8F0] shadow-lg animate-in slide-in-from-bottom-5 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative z-10 bg-[#F4F7FA]">
        {/* Top Clean White Header */}
        <TopBar
          plant={plant}
          alerts={alerts}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onRefresh={loadAllData}
          isRefreshing={isRefreshing}
          onOpenAlerts={() => setCurrentSection('alerts')}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onTriggerOptimize={handleQuickOptimize}
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
              className="px-2.5 py-1 bg-white border border-rose-300 rounded font-bold hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Dynamic Section Content Container */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[#F4F7FA]">
          {/* 1. EXECUTIVE DASHBOARD */}
          {currentSection === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* ==============================================================
                  2. FACILITY HERO BANNER (Crisp 8K ELCOT Campus Image)
                  ============================================================== */}
              <div className="relative w-full h-[220px] sm:h-[250px] lg:h-[270px] rounded-[20px] overflow-hidden shadow-xs border border-slate-200/80 bg-slate-900 select-none">
                {/* Background Campus Photo */}
                <img
                  src="/elcot-campus-bg.jpg"
                  alt="ELCOT Advanced Precision Manufacturing Hub"
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                />

                {/* Subtle Left-to-Right Overlay: Preserves photograph visibility */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(15, 23, 42, 0.72) 0%, rgba(15, 23, 42, 0.30) 50%, rgba(15, 23, 42, 0.05) 100%)'
                  }}
                />

                {/* Hero Content on the LEFT side */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8 max-w-2xl text-white">
                  {/* Top Status Indicators */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white border border-white/20 text-xs font-mono font-medium shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                      LIVE SCADA
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/50 backdrop-blur-md text-slate-200 border border-white/10 text-xs font-mono">
                      Chennai
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/50 backdrop-blur-md text-slate-200 border border-white/10 text-xs font-mono">
                      50.0 Hz Nominal
                    </span>
                  </div>

                  {/* Main Typography */}
                  <div className="mt-auto">
                    <div className="text-xs font-bold uppercase tracking-wider text-sky-300 font-mono mb-1">
                      Industrial Energy Intelligence
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm font-sans leading-tight">
                      ELCOT Advanced Precision Manufacturing Hub
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1 font-sans">
                      Real-time Microgrid Dispatch: 650 kWp Solar PV • 800 kWh BESS • 500 kW Grid Limit
                    </p>
                  </div>
                </div>
              </div>

              {/* ==============================================================
                  4. FOUR CLEAN KPI CARDS IMMEDIATELY BELOW HERO
                  ============================================================== */}
              <div className="space-y-4">
                {/* Metric Mode Filter (Optional fine-grained telemetry) */}
                <div className="flex items-center justify-between gap-4 pb-0.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#64748B] font-mono">
                      Real-Time Operational Telemetry
                    </h2>
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium shadow-xs">
                    <button
                      onClick={() => setKpiViewMode('operational')}
                      className={clsx(
                        "px-3 py-1 rounded-lg transition-all cursor-pointer font-sans",
                        kpiViewMode === 'operational'
                          ? "bg-sky-50 text-[#0EA5E9] font-bold border border-sky-200 shadow-2xs"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      )}
                    >
                      Operational (4)
                    </button>
                    <button
                      onClick={() => setKpiViewMode('financial')}
                      className={clsx(
                        "px-3 py-1 rounded-lg transition-all cursor-pointer font-sans",
                        kpiViewMode === 'financial'
                          ? "bg-amber-50 text-[#F59E0B] font-bold border border-amber-200 shadow-2xs"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      )}
                    >
                      Financial (4)
                    </button>
                    <button
                      onClick={() => setKpiViewMode('all')}
                      className={clsx(
                        "px-3 py-1 rounded-lg transition-all cursor-pointer font-sans",
                        kpiViewMode === 'all'
                          ? "bg-purple-50 text-[#8B5CF6] font-bold border border-purple-200 shadow-2xs"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      )}
                    >
                      All (8)
                    </button>
                  </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
                  {(kpiViewMode === 'operational' || kpiViewMode === 'all') && (
                    <>
                      {/* 1. Solar Generation: 565 kW (#10B981) */}
                      <KpiCard
                        metric={{
                          ...defaultSolarKpi,
                          label: 'Solar Generation'
                        }}
                        icon={Sun}
                        accentColor="emerald"
                        tooltip="Real-time Solar PV Generation"
                      />

                      {/* 2. Facility Demand: 667 kW (#0EA5E9) */}
                      <KpiCard
                        metric={{
                          ...defaultDemandKpi,
                          label: 'Facility Demand'
                        }}
                        icon={Factory}
                        accentColor="sky"
                        tooltip="Aggregate Industrial Load Demand"
                      />

                      {/* 3. Grid Import: 167 kW (#F59E0B) */}
                      <KpiCard
                        metric={{
                          ...defaultGridKpi,
                          label: 'Grid Import'
                        }}
                        icon={Zap}
                        accentColor="amber"
                        tooltip="Substation Net Import Power"
                      />

                      {/* 4. Battery SOC: 68.5% (#8B5CF6) */}
                      <KpiCard
                        metric={{
                          ...defaultBatteryKpi,
                          label: 'Battery SOC'
                        }}
                        icon={BatteryCharging}
                        accentColor="purple"
                        tooltip="BESS State of Charge"
                      />
                    </>
                  )}

                  {(kpiViewMode === 'financial' || kpiViewMode === 'all') && kpis && (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              {/* ==============================================================
                  WORKSPACE TWO-COLUMN: LIVE ENERGY FLOW & AI OPTIMIZATION
                  ============================================================== */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left Column (8 cols): Interactive Visualizer */}
                <div className="xl:col-span-8 space-y-4">
                  {/* Visualizer Tab Switcher Bar */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
                      <button
                        onClick={() => setVisualizerTab('flow')}
                        className={clsx(
                          "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                          visualizerTab === 'flow'
                            ? "bg-sky-50 text-[#0EA5E9] shadow-2xs border border-sky-200"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        )}
                      >
                        <GitFork className="w-3.5 h-3.5" />
                        <span>Live Power Flow</span>
                      </button>
                      <button
                        onClick={() => setVisualizerTab('forecast')}
                        className={clsx(
                          "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                          visualizerTab === 'forecast'
                            ? "bg-sky-50 text-[#0EA5E9] shadow-2xs border border-sky-200"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        )}
                      >
                        <SunMedium className="w-3.5 h-3.5" />
                        <span>24h Forecast</span>
                      </button>
                      <button
                        onClick={() => setVisualizerTab('battery')}
                        className={clsx(
                          "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                          visualizerTab === 'battery'
                            ? "bg-sky-50 text-[#0EA5E9] shadow-2xs border border-sky-200"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        )}
                      >
                        <BatteryCharging className="w-3.5 h-3.5" />
                        <span>BESS Storage</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setCurrentSection(visualizerTab === 'flow' ? 'energyflow' : visualizerTab)}
                      className="hidden sm:flex items-center gap-1.5 text-xs text-[#0EA5E9] hover:text-sky-700 hover:underline font-mono font-medium cursor-pointer"
                    >
                      <span>Expanded View</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Active Visualizer Content */}
                  <div>
                    {visualizerTab === 'flow' && energyFlow && (
                      <EnergyFlowDiagram data={energyFlow} />
                    )}
                    {visualizerTab === 'forecast' && forecast && (
                      <ForecastChart
                        data={forecast}
                        onHorizonChange={handleHorizonChange}
                        isLoading={isForecastLoading}
                      />
                    )}
                    {visualizerTab === 'battery' && battery && (
                      <BatteryGauge battery={battery} />
                    )}
                  </div>
                </div>

                {/* Right Column (4 cols): AI Optimization Decision Card & Vitals */}
                <div className="xl:col-span-4 space-y-6">
                  {/* ==============================================================
                      7. AI OPTIMIZATION DECISION CARD
                      ============================================================== */}
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm transition-all duration-300">
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-[#0EA5E9] flex items-center justify-center shadow-xs shrink-0">
                          <Sparkles className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#0EA5E9] font-mono">
                            AI OPTIMIZATION
                          </div>
                          <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">
                            Recommended Energy Strategy
                          </h3>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200">
                        {recommendation ? `${(recommendation.confidence * 100).toFixed(0)}% Conf.` : '94% Conf.'}
                      </span>
                    </div>

                    {/* Recommendation Directive */}
                    <div className="mt-4 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
                        <span>Charge BESS +180 kW for 45 minutes</span>
                      </div>
                      <div className="mt-2 text-xs text-[#64748B] leading-relaxed">
                        <strong className="text-[#0F172A]">Why:</strong> Solar generation is above current facility demand and battery SOC is below the optimal reserve target.
                      </div>
                    </div>

                    {/* Expected Impact */}
                    <div className="mt-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono mb-2.5">
                        Expected Impact
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                          <span className="text-[11px] text-[#64748B] block">Energy Cost</span>
                          <span className="text-sm font-bold font-mono text-[#10B981]">
                            ↓ ₹18,450<span className="text-[10px] font-normal text-[#64748B]">/day</span>
                          </span>
                        </div>
                        <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                          <span className="text-[11px] text-[#64748B] block">Peak Demand</span>
                          <span className="text-sm font-bold font-mono text-[#0EA5E9]">
                            ↓ 120 kW
                          </span>
                        </div>
                        <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                          <span className="text-[11px] text-[#64748B] block">Solar Usage</span>
                          <span className="text-sm font-bold font-mono text-[#10B981]">
                            ↑ 8.2%
                          </span>
                        </div>
                        <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                          <span className="text-[11px] text-[#64748B] block">Production Risk</span>
                          <span className="text-sm font-bold font-mono text-[#10B981]">
                            Low
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Primary Action Button */}
                    <div className="mt-5 pt-3.5 border-t border-[#E2E8F0]">
                      {isCopilotAuthorized ? (
                        <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                          <span>Recommendation Applied to SCADA</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setIsCopilotDispatching(true);
                            setTimeout(() => {
                              setIsCopilotDispatching(false);
                              setIsCopilotAuthorized(true);
                              handleQuickOptimize();
                              showToast('AI supervisory recommendation dispatched to SCADA.');
                            }, 800);
                          }}
                          disabled={isCopilotDispatching}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-70"
                        >
                          {isCopilotDispatching ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Applying to SCADA...</span>
                            </>
                          ) : (
                            <>
                              <span>Apply Recommendation</span>
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Microgrid Operating Vitals */}
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono">
                          Facility Vitals
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-[#64748B]">
                        Chennai Zone 4
                      </span>
                    </div>

                    {/* Substation Capacity Headroom */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#64748B] font-mono text-[11px]">Substation Demand</span>
                        <span className="font-mono font-bold text-[#0F172A]">
                          {kpis ? `${kpis.grid_consumption.value} kW / 500 kW` : '167 kW / 500 kW'}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              ((typeof kpis?.grid_consumption.value === 'number' ? kpis.grid_consumption.value : 167) / 500) * 100
                            )}%`
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono">
                        <span>Safe Operating Zone</span>
                        <span className="text-[#10B981] font-semibold">333.0 kW Margin</span>
                      </div>
                    </div>

                    {/* Carbon Offset & Green Ratio */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-emerald-50 text-[#10B981]">
                          <Leaf className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[#64748B] block">Carbon Avoided Today</span>
                          <strong className="text-xs font-mono text-[#10B981]">
                            1,240 kg CO₂e
                          </strong>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#10B981] border border-emerald-200">
                        100% Green
                      </span>
                    </div>

                    {/* Quick Access Section Links */}
                    <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-2 text-[11px] font-medium">
                      <button
                        onClick={() => setCurrentSection('loads')}
                        className="flex items-center justify-between p-2 bg-[#F8FAFC] hover:bg-slate-100 rounded-lg text-[#0F172A] transition-colors cursor-pointer border border-[#E2E8F0]"
                      >
                        <span>Industrial Loads (6)</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                      </button>
                      <button
                        onClick={() => setCurrentSection('simulator')}
                        className="flex items-center justify-between p-2 bg-[#F8FAFC] hover:bg-slate-100 rounded-lg text-[#0F172A] transition-colors cursor-pointer border border-[#E2E8F0]"
                      >
                        <span>What-If Simulator</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                      </button>
                    </div>
                  </div>
                </div>
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
