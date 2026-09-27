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
  Radio,
  CheckCircle2,
  GitFork,
  SunMedium,
  ArrowUpRight,
  ChevronRight,
  Activity,
  Cpu,
  Layers,
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

  // Dark mode theme state (defaulting to dark command center)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('energiq_theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('energiq_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    showToast(isDarkMode ? 'Switched to Executive Light Mode' : 'Switched to Dark Command Center');
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

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300 relative ${isDarkMode ? 'dark bg-[#060913] text-slate-100' : 'light bg-slate-50 text-slate-900'}`}>
      {/* Ambient background glows for high-tech industrial depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl" />
      </div>

      {/* Global Interactive Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectSection={setCurrentSection}
        onToggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        onRunOptimization={handleQuickOptimize}
      />

      {/* Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900/95 light:bg-white text-slate-100 light:text-slate-800 rounded-2xl border border-cyan-500/40 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-bottom-5 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
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
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Top Sticky Navigation Bar */}
        <TopBar
          plant={plant}
          alerts={alerts}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onRefresh={loadAllData}
          isRefreshing={isRefreshing}
          onOpenAlerts={() => setCurrentSection('alerts')}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
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
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* 1. EXECUTIVE DASHBOARD */}
          {currentSection === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Executive Tier Header & Metric Segmented Control */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold text-white light:text-slate-900 tracking-tight font-sans">
                      Executive Overview
                    </h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 light:bg-emerald-50 text-emerald-400 light:text-emerald-700 border border-emerald-500/20 text-[11px] font-mono font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      100% In-Balance
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 light:text-slate-500 mt-1 font-mono">
                    Real-time microgrid dispatch: 650 kWp Solar PV • 800 kWh BESS • 500 kW Grid Limit
                  </p>
                </div>

                {/* Metric View Segmented Selector */}
                <div className="flex items-center gap-1 p-1 bg-slate-900/80 light:bg-slate-200/80 border border-slate-800/80 light:border-slate-300 rounded-xl text-xs font-medium self-start sm:self-auto shadow-inner">
                  <button
                    onClick={() => setKpiViewMode('operational')}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg transition-all cursor-pointer font-sans",
                      kpiViewMode === 'operational'
                        ? "bg-cyan-500/20 text-cyan-300 light:bg-white light:text-cyan-700 light:shadow-xs font-bold border border-cyan-500/30 light:border-slate-200"
                        : "text-slate-400 hover:text-slate-200 light:text-slate-600"
                    )}
                  >
                    Operational (4)
                  </button>
                  <button
                    onClick={() => setKpiViewMode('financial')}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg transition-all cursor-pointer font-sans",
                      kpiViewMode === 'financial'
                        ? "bg-amber-500/20 text-amber-300 light:bg-white light:text-amber-700 light:shadow-xs font-bold border border-amber-500/30 light:border-slate-200"
                        : "text-slate-400 hover:text-slate-200 light:text-slate-600"
                    )}
                  >
                    Financial & Tariffs (4)
                  </button>
                  <button
                    onClick={() => setKpiViewMode('all')}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg transition-all cursor-pointer font-sans",
                      kpiViewMode === 'all'
                        ? "bg-purple-500/20 text-purple-300 light:bg-white light:text-purple-700 light:shadow-xs font-bold border border-purple-500/30 light:border-slate-200"
                        : "text-slate-400 hover:text-slate-200 light:text-slate-600"
                    )}
                  >
                    All Metrics (8)
                  </button>
                </div>
              </div>

              {/* Evenly Spaced KPI Cards */}
              {kpis && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
                  {(kpiViewMode === 'operational' || kpiViewMode === 'all') && (
                    <>
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
                    </>
                  )}

                  {(kpiViewMode === 'financial' || kpiViewMode === 'all') && (
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
              )}

              {/* Core Workspace: Evenly Spaced Two-Column Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left Column (8 cols): Interactive Hero Visualizer */}
                <div className="xl:col-span-8 space-y-4">
                  {/* Visualizer Tab Switcher Bar */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 light:bg-slate-200/80 rounded-xl border border-slate-800/80 light:border-slate-300">
                      <button
                        onClick={() => setVisualizerTab('flow')}
                        className={clsx(
                          "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                          visualizerTab === 'flow'
                            ? "bg-cyan-500/20 text-cyan-300 light:bg-white light:text-cyan-700 shadow-xs border border-cyan-500/30 light:border-slate-200"
                            : "text-slate-400 hover:text-slate-200 light:text-slate-600"
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
                            ? "bg-cyan-500/20 text-cyan-300 light:bg-white light:text-cyan-700 shadow-xs border border-cyan-500/30 light:border-slate-200"
                            : "text-slate-400 hover:text-slate-200 light:text-slate-600"
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
                            ? "bg-cyan-500/20 text-cyan-300 light:bg-white light:text-cyan-700 shadow-xs border border-cyan-500/30 light:border-slate-200"
                            : "text-slate-400 hover:text-slate-200 light:text-slate-600"
                        )}
                      >
                        <BatteryCharging className="w-3.5 h-3.5" />
                        <span>BESS Storage</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setCurrentSection(visualizerTab === 'flow' ? 'energyflow' : visualizerTab)}
                      className="hidden sm:flex items-center gap-1.5 text-xs text-cyan-400 light:text-cyan-700 hover:underline font-mono font-medium cursor-pointer"
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

                {/* Right Column (4 cols): AI Copilot & Microgrid Operating Vitals */}
                <div className="xl:col-span-4 space-y-6">
                  {/* AI Copilot Recommendation Card */}
                  <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-indigo-950/40 light:from-white light:via-sky-50/50 light:to-indigo-50/40 rounded-2xl border border-indigo-500/30 light:border-indigo-200 p-5 shadow-xl backdrop-blur-2xl relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 w-64 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* AI Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 light:border-slate-200 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white rounded-xl shadow-md shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-extrabold text-white light:text-slate-900 uppercase tracking-wider font-mono">
                            AI Copilot Strategy
                          </h3>
                          <span className="text-[10px] text-slate-400 light:text-slate-500 font-mono">
                            MILP Solver v2.10
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 light:bg-emerald-100 text-emerald-400 light:text-emerald-800 border border-emerald-500/30">
                          {recommendation ? `${(recommendation.confidence * 100).toFixed(0)}% Conf.` : '94% Conf.'}
                        </span>
                      </div>
                    </div>

                    {/* Recommendation Directive */}
                    <div className="mt-3.5 p-3.5 bg-slate-950/60 light:bg-white rounded-xl border border-slate-800/80 light:border-slate-200 shadow-inner relative z-10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-400 light:text-sky-700">
                          Target: {recommendation?.target_component || 'BESS & Grid Import'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Autonomous</span>
                      </div>
                      <p className="text-xs font-medium text-slate-200 light:text-slate-800 leading-relaxed font-sans">
                        {recommendation?.recommended_action ||
                          'Pre-charge BESS to 85% before 17:00 IST peak tariff period. Dispatch 350 kW during evening peak to avoid ₹12.50/kWh peak charges.'}
                      </p>
                    </div>

                    {/* Projected Key Impacts */}
                    <div className="grid grid-cols-2 gap-2.5 mt-3.5 relative z-10">
                      <div className="p-2.5 bg-slate-950/40 light:bg-white/80 rounded-xl border border-slate-800/70 light:border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 block">Cost Avoidance</span>
                        <span className="text-sm font-extrabold font-mono text-emerald-400 light:text-emerald-700">
                          +₹18,450 <span className="text-[10px] font-normal">/day</span>
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-950/40 light:bg-white/80 rounded-xl border border-slate-800/70 light:border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 block">Peak Shaving</span>
                        <span className="text-sm font-extrabold font-mono text-cyan-400 light:text-sky-700">
                          -120 kW <span className="text-[10px] font-normal">Grid</span>
                        </span>
                      </div>
                    </div>

                    {/* Dispatch Button */}
                    <div className="mt-4 pt-3.5 border-t border-slate-800/80 light:border-slate-200 flex items-center justify-between gap-3 relative z-10">
                      {isCopilotAuthorized ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 light:text-emerald-700 font-bold font-mono">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Dispatched to SCADA</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setIsCopilotDispatching(true);
                            setTimeout(() => {
                              setIsCopilotDispatching(false);
                              setIsCopilotAuthorized(true);
                              handleQuickOptimize();
                              showToast('AI supervisory schedule dispatched to SCADA.');
                            }, 800);
                          }}
                          disabled={isCopilotDispatching}
                          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-70"
                        >
                          {isCopilotDispatching ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Dispatching...</span>
                            </>
                          ) : (
                            <>
                              <span>Authorize & Dispatch</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Microgrid Operating Vitals & Substation Headroom */}
                  <div className="bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-5 shadow-xl backdrop-blur-2xl transition-colors space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 light:border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <h4 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider font-mono">
                          Facility Vitals
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Chennai Zone 4
                      </span>
                    </div>

                    {/* Substation Capacity Headroom */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 light:text-slate-600 font-mono text-[11px]">Substation Demand</span>
                        <span className="font-mono font-bold text-slate-200 light:text-slate-800">
                          {kpis ? `${kpis.grid_consumption.value} kW / 500 kW` : '166.6 kW / 500 kW'}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 light:bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              ((typeof kpis?.grid_consumption.value === 'number' ? kpis.grid_consumption.value : 166.6) / 500) * 100
                            )}%`
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Safe Operating Zone</span>
                        <span className="text-emerald-400 font-semibold">333.4 kW Margin</span>
                      </div>
                    </div>

                    {/* Carbon Offset & Green Ratio */}
                    <div className="p-3 bg-slate-950/40 light:bg-slate-50 rounded-xl border border-slate-800/70 light:border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 light:bg-emerald-50 light:text-emerald-700">
                          <Leaf className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Carbon Avoided Today</span>
                          <strong className="text-xs font-mono text-emerald-400 light:text-emerald-700">
                            1,240 kg CO₂e
                          </strong>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        -100% Fossil
                      </span>
                    </div>

                    {/* Quick Access Section Links */}
                    <div className="pt-2 border-t border-slate-800/80 light:border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-medium">
                      <button
                        onClick={() => setCurrentSection('loads')}
                        className="flex items-center justify-between p-2 bg-slate-950/30 hover:bg-slate-800/50 light:bg-slate-100 light:hover:bg-slate-200/80 rounded-lg text-slate-300 light:text-slate-700 transition-colors cursor-pointer"
                      >
                        <span>Industrial Loads (6)</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                      <button
                        onClick={() => setCurrentSection('simulator')}
                        className="flex items-center justify-between p-2 bg-slate-950/30 hover:bg-slate-800/50 light:bg-slate-100 light:hover:bg-slate-200/80 rounded-lg text-slate-300 light:text-slate-700 transition-colors cursor-pointer"
                      >
                        <span>What-If Simulator</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
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
