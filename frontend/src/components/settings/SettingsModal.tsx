import React, { useState } from 'react';
import { PlantSummary } from '@/types';
import { Settings, Save, CheckCircle2, ShieldCheck, Factory, Zap } from 'lucide-react';

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
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-600" />
            System & Microgrid Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hardware asset ratings, mathematical solver boundaries, and security settings
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
          Role: {currentRole}
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Plant Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Industrial Plant Identifier</label>
            <input
              type="text"
              readOnly
              value={plant ? plant.id : 'plant-elcot-01'}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Facility Name</label>
            <input
              type="text"
              readOnly
              value={plant ? plant.name : 'ELCOT Advanced Manufacturing'}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700"
            />
          </div>
        </div>

        {/* Capacity Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200/70">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Solar PV Capacity (kWp)</label>
            <input
              type="number"
              value={solarCap}
              onChange={(e) => setSolarCap(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-semibold mb-1">BESS Energy Capacity (kWh)</label>
            <input
              type="number"
              value={bessCap}
              onChange={(e) => setBessCap(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Substation Contract Cap (kW)</label>
            <input
              type="number"
              value={gridLimit}
              onChange={(e) => setGridLimit(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold"
            />
          </div>
        </div>

        {/* Solver Configuration */}
        <div className="p-4 bg-sky-50/40 rounded-xl border border-sky-100 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-sky-900">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Optimization Solver Engine Specifications</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] text-slate-600 font-mono">
            <div>Solver: PuLP CBC v2.9</div>
            <div>Time Limit: 10.0s</div>
            <div>Degradation Cost: ₹0.45/kWh</div>
            <div>Reserve SOC Lock: 20%</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Settings updated successfully!
            </span>
          )}
          {!saved && <div />}

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
