import React from 'react';
import { TrendingUp, BarChart3, Activity, Gauge, Zap } from 'lucide-react';

export const PoliceAnalyticsView = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              TRAFFIC FLOW & CORRIDOR ANALYTICS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Guntur arterial speed trends, bottleneck mitigation metrics, and AI signal performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-3">
          <div className="text-xs font-mono text-slate-400">Corridor Average Speed</div>
          <div className="text-3xl font-black text-white font-mono">38.4 km/h</div>
          <span className="text-xs text-emerald-400 font-mono font-bold">+18% vs traditional fixed timers</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-3">
          <div className="text-xs font-mono text-slate-400">Emergency Transit Clear Rate</div>
          <div className="text-3xl font-black text-emerald-400 font-mono">98.2%</div>
          <span className="text-xs text-emerald-400 font-mono font-bold">Zero intersection stops recorded</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-3">
          <div className="text-xs font-mono text-slate-400">Total Preemptions Today</div>
          <div className="text-3xl font-black text-rose-400 font-mono">14 Runs</div>
          <span className="text-xs text-slate-300 font-mono">108 EMS + Police Tactical Units</span>
        </div>
      </div>
    </div>
  );
};

export default PoliceAnalyticsView;
