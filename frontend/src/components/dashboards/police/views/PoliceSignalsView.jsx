import React from 'react';
import { motion } from 'framer-motion';
import {
  Radio,
  Clock,
  Sparkles,
  ShieldCheck,
  Power,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useUrbanData } from '../../../../context/UrbanDataContext';

export const PoliceSignalsView = () => {
  const { data, toggleSignalPreemption } = useUrbanData();
  const trafficSignals = data?.trafficSignals || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              ADAPTIVE TRAFFIC SIGNAL NETWORK
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Guntur Urban Intelligent Corridor • Direct Emergency Override & AI Signal Optimization
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono font-bold">
            {trafficSignals.length} Active Signal Nodes
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-blue-950/40 border border-blue-800/50 text-blue-300 text-xs font-mono font-bold">
            AI Optimization: 94.8%
          </div>
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trafficSignals.map((signal) => {
          const isForcedGreen = signal.currentState === 'FORCED GREEN';
          const isGreen = signal.currentState === 'GREEN' || isForcedGreen;

          return (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 shadow-xl backdrop-blur-xl transition-all duration-300 space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    {signal.id}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    {signal.intersectionName}
                  </h3>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                  isForcedGreen
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse'
                    : isGreen
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                    : 'bg-red-950/60 text-red-300 border-red-800/60'
                }`}>
                  {signal.currentState} ({signal.countdown}s)
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs font-mono">
                <div className="text-slate-300 font-semibold">{signal.phase}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Density: <b className="text-slate-200">{signal.trafficDensity}</b></span>
                  <span>Queue: <b className="text-slate-200">{signal.queueLengthMeters}m</b></span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Optimization Score:</span>
                  <span className="text-emerald-400 font-bold">{signal.aiOptimizationScore}%</span>
                </div>
              </div>

              {/* Emergency Override Button */}
              <button
                type="button"
                onClick={() => toggleSignalPreemption && toggleSignalPreemption(signal.id)}
                className={`w-full py-2 px-3 rounded-2xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  isForcedGreen
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 shadow-emerald-900/40'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{isForcedGreen ? 'Revert to AI Adaptive' : 'Force Green Corridor'}</span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PoliceSignalsView;
