import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ambulance,
  Heart,
  Activity,
  User,
  Clock,
  Radio,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useUrbanData } from '../../../../context/UrbanDataContext';

export const HospitalAmbulancesView = () => {
  const { data } = useUrbanData();
  const ambulances = data?.ambulances || [];
  const [selectedAmb, setSelectedAmb] = useState(ambulances[0]?.id || 'AMB-108-GNT-01');

  const active = ambulances.find(a => a.id === selectedAmb) || ambulances[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Ambulance className="w-6 h-6 text-rose-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              INCOMING AMBULANCES & INBOUND LOGISTICS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Live patient vitals telemetry, triage stage categorization & trauma bay pre-allocation.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 text-purple-300 text-xs font-mono font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <span>{ambulances.length} Active Inbound Units</span>
        </div>
      </div>

      {/* Ambulances List & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {ambulances.map((amb) => {
            const isSelected = amb.id === selectedAmb;
            const isCritical = amb.condition === 'Critical';

            return (
              <div
                key={amb.id}
                onClick={() => setSelectedAmb(amb.id)}
                className={`p-4.5 rounded-3xl border transition-all cursor-pointer shadow-lg ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-purple-950/40'
                    : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-rose-400">{amb.id}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{amb.patientSummary}</h3>
                    <div className="text-[11px] text-slate-300 font-mono mt-0.5 flex items-center gap-1.5">
                      <span>👨‍✈️ {amb.driverName || 'Ramesh Kumar'}</span>
                      <a href={`tel:${amb.driverPhone || '+919876543220'}`} className="text-emerald-400 hover:underline">
                        ({amb.driverPhone || '+91 98765 43220'})
                      </a>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    isCritical
                      ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}>
                    {amb.condition}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">ETA: <b className="text-emerald-400">{amb.eta}</b></span>
                  <span className="text-purple-300 font-bold">{amb.triage} Life Support</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Card (7 cols) */}
        {active && (
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-purple-400 font-bold">{active.vehicleNumber || 'AP-07-TA-1081'}</span>
                <h3 className="text-lg font-bold text-white mt-1">{active.patientSummary}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Assigned: {active.assignedDoctor || 'Dr. K. Suhasini'}</p>
              </div>
              <div className="px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold">
                ETA {active.eta}
              </div>
            </div>

            {/* Driver & Comms Contact Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-base">
                  👨‍✈️
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Ambulance Pilot / Driver</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{active.driverName || 'Ramesh Kumar'}</span>
                    {active.driverRating && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800">
                        ⭐ {active.driverRating}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <a
                href={`tel:${active.driverPhone || '+919876543220'}`}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <span>📞</span>
                <span>{active.driverPhone || '+91 98765 43220'}</span>
              </a>
            </div>

            {/* Vitals Telemetry Card */}
            {active.vitals && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>Real-Time Biometric Sensor Feed</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400">HEART RATE</span>
                    <div className="text-lg font-black text-rose-400 mt-0.5">{active.vitals.heartRate}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400">BLOOD PRESSURE</span>
                    <div className="text-lg font-black text-white mt-0.5">{active.vitals.bloodPressure}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400">SPO2 SATURATION</span>
                    <div className="text-lg font-black text-blue-400 mt-0.5">{active.vitals.spo2}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400">RESPIRATION</span>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">{active.vitals.respirationRate}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Triage Readiness Actions */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="text-xs font-bold text-white font-mono">Trauma Readiness Protocol</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  className="py-2.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs shadow-lg shadow-purple-600/30 transition cursor-pointer"
                >
                  Reserve Resuscitation Bay 1
                </button>
                <button
                  type="button"
                  className="py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs transition cursor-pointer"
                >
                  Page Trauma Surgical Team
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalAmbulancesView;
