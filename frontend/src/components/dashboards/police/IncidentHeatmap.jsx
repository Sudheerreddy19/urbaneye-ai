import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Activity,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Radio
} from 'lucide-react';

export const IncidentHeatmap = () => {
  const hotZones = [
    { name: 'Market Road Culvert', severity: 'Critical Congestion', color: 'bg-rose-500', density: '92%' },
    { name: 'Brodipet 4/1 Junction', severity: 'Signal Preemption Queue', color: 'bg-amber-500', density: '78%' },
    { name: 'Railway Station Circle', severity: 'Transit Flow Slowdown', color: 'bg-yellow-400', density: '65%' },
    { name: 'Lakshmipuram 4-Roads', severity: 'Normal Moderate Flow', color: 'bg-emerald-400', density: '38%' },
  ];

  return (
    <div className="w-full h-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 lg:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Incident & Congestion Heatmap
              </h3>
              <p className="text-[11px] text-slate-400">
                Corridor density clusters & hazard hot-spots.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60">
            74% Flow Index
          </span>
        </div>

        {/* Visual Simulated Heatmap Graphic */}
        <div className="relative h-28 w-full mt-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden flex items-center justify-center p-3">
          {/* Cyber grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
          
          {/* Stylized Glowing Heat Spots */}
          <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-rose-500/30 blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/2 w-20 h-20 rounded-full bg-amber-500/25 blur-xl" />
          <div className="absolute top-1/3 right-1/4 w-14 h-14 rounded-full bg-yellow-500/25 blur-lg" />
          
          {/* Vector Road Network Nodes */}
          <svg className="w-full h-full text-slate-700/60 stroke-current" viewBox="0 0 200 80" fill="none">
            <path d="M 10 40 Q 60 10 100 40 T 190 40" strokeWidth="2.5" strokeDasharray="4 4" />
            <path d="M 50 10 L 50 70" strokeWidth="2" />
            <path d="M 100 10 L 100 70" strokeWidth="3" stroke="#F43F5E" strokeOpacity="0.8" />
            <path d="M 150 10 L 150 70" strokeWidth="2" stroke="#F59E0B" strokeOpacity="0.8" />
          </svg>

          {/* Center Overlay Tags */}
          <div className="relative z-10 flex items-center gap-4 text-center font-mono">
            <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-rose-500/50 shadow-lg backdrop-blur-md">
              <div className="text-[9px] text-slate-400">Bottleneck Node</div>
              <div className="text-xs font-bold text-rose-400">Market Rd Underpass</div>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-amber-500/50 shadow-lg backdrop-blur-md">
              <div className="text-[9px] text-slate-400">Signal Delay</div>
              <div className="text-xs font-bold text-amber-400">+3.2 min</div>
            </div>
          </div>
        </div>

        {/* Hotspots Breakdown */}
        <div className="mt-3.5 space-y-2">
          {hotZones.slice(0, 3).map((zone, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/60 border border-slate-800/80"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full ${zone.color} flex-shrink-0`} />
                <span className="text-slate-200 font-semibold truncate">{zone.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[10px] text-slate-400">{zone.severity}</span>
                <span className="text-[11px] font-bold text-white">{zone.density}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>AI Telemetry Model v4.2</span>
        <span className="text-emerald-400">Thermal Overlay OK</span>
      </div>
    </div>
  );
};

export default IncidentHeatmap;
