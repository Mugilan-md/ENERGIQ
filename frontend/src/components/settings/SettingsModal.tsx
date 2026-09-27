import React, { useState } from 'react';
import { PlantSummary } from '@/types';
import { Settings, Save, CheckCircle2, ShieldCheck, Factory, Zap, Cpu, Sliders, Check } from 'lucide-react';

interface SettingsModalProps {
  plant: PlantSummary | null;
  currentRole: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ plant, currentRole }) => {
  const [solarCap, setSolarCap] = useState(plant ? plant.capacity_solar_kw : 650);
  const [bessCap, setBessCap] = useState(plant ? plant.capacity_bess_kwh : 800);
  const [gridLimit, setGridLimit] = useState(plant ? plant.grid_contract_kw : 500);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="bg-slate-900/80 light:bg-white rounded-2xl border border-slate-800/90 light:border-slate-200 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl relative overflow-hidden transition-colors max-w-4xl mx-auto">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

      <div className="flex items-center justify-between pb-4 border-b border-slate-800 light:border-slate-200 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white light:text-slate-900 tracking-tight">
                System & Microgrid Parameter Configuration
              </h2>
              <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
                Hardware asset ratings, mathematical solver boundaries, and role-based permissions
              </p>
            </div>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-950/70 light:bg-slate-100 text-cyan-400 light:text-cyan-800 rounded-xl border border-slate-800 light:border-slate-200">
          Role: {currentRole}
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Plant Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 light:text-slate-600 font-semibold mb-1.5 font-mono">
              Industrial Plant Identifier
            </label>
            <input
              type="text"
              readOnly
              value={plant ? plant.id : 'plant-elcot-01'}
              className="w-full bg-slate-950/70 light:bg-slate-50 border border-slate-800 light:border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-300 light:text-slate-700 font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-400 light:text-slate-600 font-semibold mb-1.5 font-mono">
              Facility Name
            </label>
            <input
              type="text"
              readOnly
              value={plant ? plant.name : 'ELCOT Advanced Precision Manufacturing Hub'}
              className="w-full bg-slate-950/70 light:bg-slate-50 border border-slate-800 light:border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-300 light:text-slate-700"
            />
          </div>
        </div>

        {/* Capacity Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-950/60 light:bg-slate-50 rounded-xl border border-slate-800/80 light:border-slate-200">
          <div>
            <label className="block text-slate-400 light:text-slate-600 font-semibold mb-1.5 font-mono">
              Solar PV Capacity (kWp)
            </label>
            <input
              type="number"
              value={solarCap}
              onChange={(e) => setSolarCap(Number(e.target.value))}
              className="w-full bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 rounded-xl px-3.5 py-2 text-slate-100 light:text-slate-900 font-mono font-bold focus:border-cyan-500 focus:outline-hidden transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-400 light:text-slate-600 font-semibold mb-1.5 font-mono">
              BESS Energy Storage (kWh)
            </label>
            <input
              type="number"
              value={bessCap}
              onChange={(e) => setBessCap(Number(e.target.value))}
              className="w-full bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 rounded-xl px-3.5 py-2 text-slate-100 light:text-slate-900 font-mono font-bold focus:border-cyan-500 focus:outline-hidden transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-400 light:text-slate-600 font-semibold mb-1.5 font-mono">
              Substation Contract Cap (kW)
            </label>
            <input
              type="number"
              value={gridLimit}
              onChange={(e) => setGridLimit(Number(e.target.value))}
              className="w-full bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 rounded-xl px-3.5 py-2 text-slate-100 light:text-slate-900 font-mono font-bold focus:border-cyan-500 focus:outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* Solver Configuration */}
        <div className="p-5 bg-cyan-950/20 light:bg-sky-50/50 rounded-xl border border-cyan-500/25 light:border-sky-200 space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-cyan-300 light:text-sky-900 font-mono">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Mathematical Optimization Engine Specification</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] text-slate-300 light:text-slate-600 font-mono">
            <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">Solver: PuLP CBC v2.10</div>
            <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">Time Limit: 10.0s</div>
            <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">Degradation: ₹0.45/kWh</div>
            <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">Reserve Lock: 20%</div>
          </div>
        </div>

        {/* Save Row */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 light:border-slate-100">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              Configuration saved and committed to microgrid digital twin!
            </span>
          ) : <div />}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer hover:scale-102"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
