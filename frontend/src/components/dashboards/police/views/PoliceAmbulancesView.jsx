import React from 'react';
import { motion } from 'framer-motion';
import {
  Ambulance,
  Activity,
  Heart,
  Navigation,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Gauge,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useUrbanData } from '../../../../context/UrbanDataContext';

export const PoliceAmbulancesView = () => {
  const { data, toggleSignalPreemption } = useUrbanData();
  const ambulances = data?.ambulances || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              ACTIVE EMS EMERGENCY FLEET
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time telemetry tracking & automated green corridor preemption sync across Guntur corridor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs font-mono font-bold flex items-center gap-2">
            <Ambulance className="w-4 h-4 text-rose-400" />
            <span>{ambulances.length} Tracked Units</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Preemption Sync: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Ambulances Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ambulances.map((amb) => {
          const isCritical = amb.condition === 'Critical';

          return (
            <motion.div
              key={amb.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 shadow-xl backdrop-blur-xl transition-all duration-300 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-rose-400">
                      {amb.id}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {amb.vehicleNumber}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono mt-0.5 flex items-center gap-1.5">
                      <span>👨‍✈️ {amb.driverName || 'Ramesh Kumar'}</span>
                      {amb.driverRating && (
                        <span className="text-[10px] text-amber-400 font-bold">⭐ {amb.driverRating}</span>
                      )}
                    </p>
                    <a
                      href={`tel:${amb.driverPhone || '+919876543220'}`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/60 mt-1"
                    >
                      <span>📞 {amb.driverPhone || '+91 98765 43220'}</span>
                    </a>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                    isCritical
                      ? 'bg-rose-950/80 text-rose-300 border-rose-700/60 animate-pulse'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                  }`}>
                    {amb.triage} • {amb.condition}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-semibold text-slate-200">
                    {amb.patientSummary}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Target: <b>{amb.destination}</b></span>
                    <span className="text-emerald-400 font-bold">ETA: {amb.eta}</span>
                  </div>
                </div>

                {/* Vitals Telemetry */}
                {amb.vitals && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">Heart Rate:</span>
                      <span className="text-rose-400 font-bold">{amb.vitals.heartRate}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">SpO2:</span>
                      <span className="text-blue-400 font-bold">{amb.vitals.spo2}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                  <span>{amb.speedKmph} km/h</span>
                </div>

                <div className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Signals Preempted</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PoliceAmbulancesView;
