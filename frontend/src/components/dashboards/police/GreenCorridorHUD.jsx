import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation,
  Ambulance,
  Radio,
  Clock,
  Gauge,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Siren,
  PowerOff,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const GreenCorridorHUD = ({
  ambulance = {
    id: "AMB-108-GNT-01",
    vehicleNumber: "AP-07-TA-1081",
    destination: "Ala Super Speciality Hospital",
    distanceToNextSignal: "240 m",
    speedKmph: 46,
    eta: "3 mins",
  },
  onEndCorridor
}) => {
  const [corridorActive, setCorridorActive] = useState(true);
  const [overrideModal, setOverrideModal] = useState(false);

  const signalSequence = [
    {
      id: "SIG-04",
      name: "Brodipet 4/1 Main Junction",
      status: "FORCED GREEN",
      statusColor: "text-emerald-400 bg-emerald-950/80 border-emerald-800/60 font-bold",
      time: "18 sec",
      distance: "240 m away",
      preempted: true,
    },
    {
      id: "SIG-05",
      name: "Ala Hospital Approach Crossing",
      status: "PREPARE",
      statusColor: "text-amber-400 bg-amber-950/80 border-amber-800/60 font-bold",
      time: "24 sec",
      distance: "680 m away",
      preempted: true,
    },
    {
      id: "SIG-06",
      name: "Market Road Culvert Intersection",
      status: "NORMAL",
      statusColor: "text-slate-400 bg-slate-800/80 border-slate-700/60",
      time: "45 sec",
      distance: "1.2 km away",
      preempted: false,
    },
  ];

  const handleToggleCorridor = () => {
    setCorridorActive(!corridorActive);
    if (onEndCorridor) {
      onEndCorridor(!corridorActive);
    }
  };

  return (
    <div className="w-full h-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 lg:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* HUD Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Active Green Corridor HUD
              </h3>
              <p className="text-[11px] text-slate-400">
                Automated signal preemption & priority routing.
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
              corridorActive
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-600/60 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {corridorActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>ACTIVE</span>
              </>
            ) : (
              <span>STANDBY</span>
            )}
          </span>
        </div>

        {/* Priority Transport Details Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/25 border border-emerald-800/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Siren className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="font-mono font-bold text-white text-xs">{ambulance.id}</span>
              <span className="text-[10px] text-slate-400">({ambulance.vehicleNumber})</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/50">
              CODE RED
            </span>
          </div>

          <div className="text-xs text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-slate-400">Destination:</span>
            <span className="font-semibold text-white truncate">{ambulance.destination}</span>
          </div>

          {/* 3 Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-800/20 font-mono">
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400">Next Signal</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">{ambulance.distanceToNextSignal}</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400">Speed</div>
              <div className="text-xs font-bold text-blue-400 mt-0.5">{ambulance.speedKmph} km/h</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-400">Corridor ETA</div>
              <div className="text-xs font-bold text-rose-400 mt-0.5">{ambulance.eta}</div>
            </div>
          </div>
        </div>

        {/* Signal Preemption Synchronization Chain */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span>PREEMPTED SIGNAL CHAIN</span>
            <span className="text-emerald-400">Auto-Synced</span>
          </div>

          <div className="space-y-2">
            {signalSequence.map((sig, idx) => (
              <div
                key={sig.id}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-[10px] text-slate-300">
                    0{idx + 4}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate">{sig.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{sig.distance}</div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 font-mono">
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded border ${sig.statusColor}`}>
                    {sig.status} ({sig.time})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* End / Restore Corridor Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={handleToggleCorridor}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
            corridorActive
              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:shadow-rose-950/50'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
          }`}
        >
          {corridorActive ? (
            <>
              <PowerOff className="w-3.5 h-3.5" />
              <span>End Green Corridor (Restore Normal Cycle)</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Re-Engage Emergency Green Corridor</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GreenCorridorHUD;
