import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Bell, Radio } from 'lucide-react';

export const HospitalSettingsView = () => {
  const [autoTriagePage, setAutoTriagePage] = useState(true);
  const [criticalVitalsThreshold, setCriticalVitalsThreshold] = useState(90);
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
            <Settings className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              HOSPITAL NODE CONFIGURATION
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Emergency triage auto-allocation rules, telemetry alert thresholds, and ambulance sync parameters.
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 rounded-2xl bg-purple-950 text-purple-300 border border-purple-500 text-xs font-mono font-bold flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div>
            <div className="text-sm font-bold text-white">Auto-Page Trauma Team on Code Red Arrival</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">Automatically trigger mobile alerts to on-duty trauma surgeons when ETA &lt; 5 mins.</div>
          </div>
          <input
            type="checkbox"
            checked={autoTriagePage}
            onChange={(e) => setAutoTriagePage(e.target.checked)}
            className="w-5 h-5 accent-purple-500 cursor-pointer rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase font-mono block">
            Critical SpO2 Trigger Threshold: {criticalVitalsThreshold}%
          </label>
          <input
            type="range"
            min="80"
            max="95"
            step="1"
            value={criticalVitalsThreshold}
            onChange={(e) => setCriticalVitalsThreshold(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <p className="text-[11px] text-slate-400 font-mono">
            Any incoming patient telemetry reporting SpO2 below this value will be automatically escalated to Level-1 Resuscitation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-sm shadow-xl shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Hospital Node Settings</span>
        </button>
      </div>
    </div>
  );
};

export default HospitalSettingsView;
