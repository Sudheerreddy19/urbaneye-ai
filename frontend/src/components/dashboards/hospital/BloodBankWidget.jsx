import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplet,
  AlertTriangle,
  Send,
  CheckCircle2,
  Heart,
  Plus,
  RefreshCw
} from 'lucide-react';

export const BloodBankWidget = ({ bloodStats }) => {
  const [bloodData, setBloodData] = useState(
    bloodStats || {
      "A+": { units: 28, status: "Adequate", badgeColor: "emerald" },
      "A-": { units: 6, status: "Low Stock", badgeColor: "amber" },
      "B+": { units: 34, status: "Adequate", badgeColor: "emerald" },
      "B-": { units: 7, status: "Low Stock", badgeColor: "amber" },
      "O+": { units: 48, status: "Adequate", badgeColor: "emerald" },
      "O-": { units: 3, status: "Critical", badgeColor: "rose" },
      "AB+": { units: 19, status: "Adequate", badgeColor: "emerald" },
      "AB-": { units: 2, status: "Critical", badgeColor: "rose" },
    }
  );

  const [requestModalGroup, setRequestModalGroup] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const handleRequestUnits = (type) => {
    setRequestModalGroup(type);
  };

  const confirmRequest = (type) => {
    setBloodData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        units: prev[type].units + 5,
        status: "Dispatch In-Transit",
        badgeColor: "purple"
      }
    }));
    setRequestSuccess(true);
    setTimeout(() => {
      setRequestSuccess(false);
      setRequestModalGroup(null);
    }, 1600);
  };

  return (
    <div className="w-full h-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 lg:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <Droplet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Blood Bank & Cold Reserve
              </h3>
              <p className="text-[11px] text-slate-400">
                Real-time regional blood inventory & donor dispatch.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60">
            2 Critical
          </span>
        </div>

        {/* Blood Groups 4x2 Grid */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {Object.entries(bloodData).map(([type, data]) => {
            const isCritical = data.status === 'Critical' || data.units <= 3;
            const isLow = data.status === 'Low Stock' || (data.units > 3 && data.units <= 7);

            return (
              <motion.div
                key={type}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleRequestUnits(type)}
                className={`p-2.5 rounded-2xl text-center cursor-pointer transition-all border ${
                  isCritical
                    ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.25)] hover:bg-rose-950/60'
                    : isLow
                    ? 'bg-amber-950/30 border-amber-500/40 hover:bg-amber-950/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span
                    className={`font-black text-sm font-mono ${
                      isCritical ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-white'
                    }`}
                  >
                    {type}
                  </span>
                </div>

                <div className="text-base font-extrabold text-white font-mono mt-0.5">
                  {data.units}
                  <span className="text-[10px] font-normal text-slate-400 ml-0.5">u</span>
                </div>

                <div
                  className={`text-[9px] font-mono font-semibold uppercase mt-1 truncate ${
                    isCritical
                      ? 'text-rose-400'
                      : isLow
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {isCritical ? 'Critical' : isLow ? 'Low' : 'OK'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Emergency Blood Request Button */}
      <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between">
        <div className="text-[10px] font-mono text-slate-400">
          Red Cross & Regional Blood Hub Sync
        </div>
        <button
          type="button"
          onClick={() => handleRequestUnits('O-')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Request Dispatch (O-)</span>
        </button>
      </div>

      {/* Request Units Modal */}
      <AnimatePresence>
        {requestModalGroup && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold font-mono text-lg">
                  {requestModalGroup}
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Emergency Blood Request</h4>
                  <p className="text-xs text-slate-400">Dispatching to GGH Central Blood Bank</p>
                </div>
              </div>

              {requestSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>5 Units of {requestModalGroup} dispatched via Priority Green Corridor!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Group:</span>
                      <span className="text-rose-400 font-bold">{requestModalGroup} Negative</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Requested Volume:</span>
                      <span className="text-white font-bold">5 Units (In-Transit)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transit Priority:</span>
                      <span className="text-emerald-400">CODE RED Preemption</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRequestModalGroup(null)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmRequest(requestModalGroup)}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30"
                    >
                      Authorize Dispatch
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BloodBankWidget;
