import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BedDouble,
  Activity,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Wind,
  ShieldAlert,
  Heart
} from 'lucide-react';

export const BedMatrix = ({ bedStats }) => {
  const [bedsData, setBedsData] = useState(
    bedStats || {
      total: 380,
      occupied: 326,
      available: 54,
      icu: { total: 12, occupied: 6, available: 6, status: "Moderate" },
      ventilator: { total: 15, occupied: 8, available: 7, status: "Available" },
      general: { total: 40, occupied: 22, available: 18, status: "Stable" },
      emergencyTrauma: { total: 10, occupied: 7, available: 3, status: "Elevated" },
    }
  );

  const [reserveModalCategory, setReserveModalCategory] = useState(null);
  const [reserveSuccess, setReserveSuccess] = useState(false);

  const categories = [
    {
      id: 'icu',
      name: 'ICU Beds',
      icon: Activity,
      stats: bedsData.icu,
      accentColor: 'rose',
      description: 'Intensive Critical Care Unit',
    },
    {
      id: 'ventilator',
      name: 'Ventilators',
      icon: Wind,
      stats: bedsData.ventilator,
      accentColor: 'amber',
      description: 'Invasive & Non-invasive Respiration',
    },
    {
      id: 'general',
      name: 'General Ward Beds',
      icon: BedDouble,
      stats: bedsData.general,
      accentColor: 'emerald',
      description: 'Standard Inpatient Admission',
    },
    {
      id: 'emergencyTrauma',
      name: 'Emergency Trauma Beds',
      icon: Heart,
      stats: bedsData.emergencyTrauma,
      accentColor: 'purple',
      description: 'Resuscitation & Immediate Triage',
    },
  ];

  const handleReserveBed = (catId) => {
    setBedsData((prev) => {
      const target = prev[catId];
      if (target && target.available > 0) {
        return {
          ...prev,
          available: prev.available - 1,
          occupied: prev.occupied + 1,
          [catId]: {
            ...target,
            occupied: target.occupied + 1,
            available: target.available - 1,
          },
        };
      }
      return prev;
    });

    setReserveSuccess(true);
    setTimeout(() => {
      setReserveSuccess(false);
      setReserveModalCategory(null);
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 lg:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BedDouble className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Bed Availability Matrix
              </h3>
              <p className="text-[11px] text-slate-400">
                Live ward capacity & allocation telemetry.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            {bedsData.available || 54} Total Free
          </span>
        </div>

        {/* Capacity Progress Bars Matrix */}
        <div className="space-y-4 mt-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const occupied = cat.stats.occupied;
            const total = cat.stats.total;
            const available = cat.stats.available;
            const percent = Math.round((occupied / total) * 100);

            // Determine bar color
            const barColor =
              percent >= 85
                ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : percent >= 65
                ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]';

            const badgeTextColor =
              percent >= 85
                ? 'text-rose-400 bg-rose-950/60 border-rose-800/40'
                : percent >= 65
                ? 'text-amber-400 bg-amber-950/60 border-amber-800/40'
                : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';

            return (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-bold">
                      {occupied} <span className="text-slate-400">/ {total}</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${badgeTextColor}`}>
                      {available} Free
                    </span>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="w-full h-2 rounded-full bg-slate-950/80 border border-slate-800/80 overflow-hidden relative">
                  <motion.div
                    className={`h-full rounded-full ${barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between">
        <div className="text-[11px] font-mono text-slate-400">
          Auto-synced with GGH & AIIMS network
        </div>
        <button
          type="button"
          onClick={() => setReserveModalCategory('icu')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Quick Reserve Bed</span>
        </button>
      </div>

      {/* Reserve Bed Modal */}
      <AnimatePresence>
        {reserveModalCategory && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Reserve Critical Bed</h4>
                  <p className="text-xs text-slate-400">Lock allocation for incoming transfer</p>
                </div>
              </div>

              {reserveSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Bed allocation locked! Notification sent to triage unit.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ward Unit:</span>
                      <span className="text-white font-bold">ICU Trauma Bay 4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lock Duration:</span>
                      <span className="text-emerald-400">45 Mins Buffer</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setReserveModalCategory(null)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReserveBed('icu')}
                      className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30"
                    >
                      Confirm Lock
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

export default BedMatrix;
