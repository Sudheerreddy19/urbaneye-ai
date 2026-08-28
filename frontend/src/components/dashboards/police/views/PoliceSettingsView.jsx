import React, { useState } from 'react';
import { Settings, Shield, Radio, Bell, Save, CheckCircle2 } from 'lucide-react';

export const PoliceSettingsView = () => {
  const [preemptionRadius, setPreemptionRadius] = useState(500);
  const [autoOverride, setAutoOverride] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              POLICE TERMINAL CONFIGURATION
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Tactical grid parameters, green corridor sensitivity thresholds, and radio frequency bindings.
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-950 text-emerald-300 border border-emerald-500 text-xs font-mono font-bold flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings Applied</span>
          </div>
        )}
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase font-mono block">
            Automatic Emergency Preemption Detection Radius: {preemptionRadius} meters
          </label>
          <input
            type="range"
            min="200"
            max="1500"
            step="50"
            value={preemptionRadius}
            onChange={(e) => setPreemptionRadius(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <p className="text-[11px] text-slate-400 font-mono">
            Signals will automatically initiate emergency green wave sequence when an EMS beacon enters this boundary.
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div>
            <div className="text-sm font-bold text-white">Automated Cross-Traffic Red Lockout</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">Force all intersecting lanes to hold RED until ambulance clears.</div>
          </div>
          <input
            type="checkbox"
            checked={autoOverride}
            onChange={(e) => setAutoOverride(e.target.checked)}
            className="w-5 h-5 accent-emerald-500 cursor-pointer rounded"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Police Grid Configurations</span>
        </button>
      </div>
    </div>
  );
};

export default PoliceSettingsView;
