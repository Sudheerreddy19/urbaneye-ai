import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ambulance,
  HeartPulse,
  Activity,
  Clock,
  MapPin,
  Radio,
  ChevronRight,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  Siren,
  Filter,
  UserCheck
} from 'lucide-react';

export const IncomingTable = ({
  ambulances = [],
  selectedAmbulanceId,
  onSelectAmbulance
}) => {
  const [filterCondition, setFilterCondition] = useState('ALL');
  const [prepModalAmb, setPrepModalAmb] = useState(null);
  const [preppedBays, setPreppedBays] = useState({});

  const filteredAmbulances = ambulances.filter((amb) => {
    if (filterCondition === 'ALL') return true;
    return amb.condition.toUpperCase() === filterCondition.toUpperCase();
  });

  const handlePrepBay = (amb) => {
    setPrepModalAmb(amb);
  };

  const confirmPrepBay = (ambId) => {
    setPreppedBays((prev) => ({ ...prev, [ambId]: true }));
    setPrepModalAmb(null);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 sm:p-5 lg:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Ambulance className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Incoming Ambulances & In-Transit Triage
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live patient vital telemetry, route preemption, and emergency bay assignment.
            </p>
          </div>

          {/* Condition Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs self-stretch sm:self-auto justify-between sm:justify-start">
            {['ALL', 'CRITICAL', 'STABLE'].map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => setFilterCondition(cond)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  filterCondition === cond
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cond === 'ALL' ? 'All (3)' : cond}
              </button>
            ))}
          </div>
        </div>

        {/* Ambulances Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="pb-3 pl-2 font-medium">Vehicle / ID</th>
                <th className="pb-3 font-medium">Origin / From</th>
                <th className="pb-3 font-medium">ETA & Speed</th>
                <th className="pb-3 font-medium">Patient Condition</th>
                <th className="pb-3 font-medium">Triage / Type</th>
                <th className="pb-3 font-medium">Action & Bay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAmbulances.map((amb) => {
                const isSelected = selectedAmbulanceId === amb.id;
                const isPrepped = preppedBays[amb.id];

                return (
                  <tr
                    key={amb.id}
                    onClick={() => onSelectAmbulance && onSelectAmbulance(amb.id)}
                    className={`group cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-purple-950/40 hover:bg-purple-950/60'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Vehicle ID & Driver */}
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            amb.condition === 'Critical'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          <Siren className="w-3.5 h-3.5 animate-pulse" />
                        </div>
                        <div>
                          <div className="font-bold text-white font-mono flex items-center gap-1.5">
                            <span>{amb.id}</span>
                            <span className="text-[10px] text-purple-400 font-normal">({amb.vehicleNumber || 'AP-07-TA-1081'})</span>
                          </div>
                          <a
                            href={`tel:${amb.driverPhone || '+919876543220'}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <span>👨‍✈️ {amb.driverName || 'Ramesh Kumar'}</span>
                            <span className="text-slate-400">({amb.driverPhone || '+91 98765 43220'})</span>
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Origin / From */}
                    <td className="py-3 max-w-[150px]">
                      <div className="flex items-center gap-1.5 text-slate-200 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{amb.origin}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate pl-5">
                        {amb.patientSummary}
                      </div>
                    </td>

                    {/* ETA & Speed */}
                    <td className="py-3 font-mono">
                      <div className="flex items-center gap-1.5 font-bold text-rose-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{amb.eta}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{amb.speedKmph} km/h • Green Wave</div>
                    </td>

                    {/* Condition Badge */}
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          amb.condition === 'Critical'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                            : amb.condition === 'Serious'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            amb.condition === 'Critical'
                              ? 'bg-rose-500 animate-ping'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <span>{amb.condition}</span>
                      </span>
                    </td>

                    {/* Triage / Type */}
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            amb.triage === 'ALS'
                              ? 'bg-purple-950/80 text-purple-300 border-purple-800/60'
                              : 'bg-blue-950/80 text-blue-300 border-blue-800/60'
                          }`}
                        >
                          {amb.triage}
                        </span>
                        {amb.activePreemption && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                            SIGNAL PREEMPT
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrepBay(amb);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                          isPrepped
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {isPrepped ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Bay #1 Ready</span>
                          </>
                        ) : (
                          <>
                            <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
                            <span>Prep Bay</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Ambulance Live Vitals Preview Strip */}
      {selectedAmbulanceId && (
        <div className="mt-4 pt-3 border-t border-slate-800">
          {(() => {
            const selectedAmb = ambulances.find((a) => a.id === selectedAmbulanceId) || ambulances[0];
            if (!selectedAmb || !selectedAmb.vitals) return null;

            return (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <HeartPulse className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <span className="font-bold text-white">{selectedAmb.id} Live Vitals:</span>
                    <span className="text-slate-400 ml-1.5">{selectedAmb.patientSummary}</span>
                  </div>
                </div>

                {/* Vitals metrics chips */}
                <div className="flex items-center gap-3 font-mono">
                  <div className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    HR: <span className="font-bold text-rose-400">{selectedAmb.vitals.heartRate}</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    BP: <span className="font-bold text-emerald-400">{selectedAmb.vitals.bloodPressure}</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    SpO2: <span className="font-bold text-blue-400">{selectedAmb.vitals.spo2}</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hidden sm:block">
                    Resp: <span className="font-bold text-amber-400">{selectedAmb.vitals.respirationRate}</span>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </div>
      )}

      {/* Triage Prep Bay Modal */}
      <AnimatePresence>
        {prepModalAmb && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Prepare Emergency Bay</h4>
                  <p className="text-xs text-slate-400">Assigning trauma team for {prepModalAmb.id}</p>
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Diagnosis:</span>
                  <span className="text-rose-300 font-semibold">{prepModalAmb.patientSummary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Specialist:</span>
                  <span className="text-slate-200">{prepModalAmb.assignedDoctor || "Dr. K. Suhasini"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Corridor ETA:</span>
                  <span className="text-emerald-400 font-bold">{prepModalAmb.eta}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPrepModalAmb(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => confirmPrepBay(prepModalAmb.id)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30"
                >
                  Confirm Bay #1 & Page Triage Team
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IncomingTable;
