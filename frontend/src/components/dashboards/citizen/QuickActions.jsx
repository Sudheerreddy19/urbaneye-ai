import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  TriangleAlert,
  Bus,
  Ambulance,
  Radio,
  CheckCircle2,
  X,
  Send,
  Camera,
  MapPin,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const QuickActions = () => {
  const [activeModal, setActiveModal] = useState(null); // 'emergency' | 'hazard' | 'bus' | 'ambulance' | null
  const [hazardSubmitted, setHazardSubmitted] = useState(false);
  const [hazardData, setHazardData] = useState({
    category: 'Pothole',
    location: 'Brodipet 4/1 Road',
    description: '',
  });

  const cityStats = [
    { label: 'Traffic', value: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Buses', value: '12 Active', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Incidents', value: '3 On Roads', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Ambulances', value: '1 Active', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  const handleHazardSubmit = (e) => {
    e.preventDefault();
    setHazardSubmitted(true);
    setTimeout(() => {
      setHazardSubmitted(false);
      setActiveModal(null);
    }, 2000);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-xl space-y-4">
      {/* 1. Quick Actions Section */}
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Quick Actions
          </h3>
          <span className="text-[10px] font-mono text-slate-400">One-Tap Portal</span>
        </div>

        {/* 2x2 Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-3">
          {/* Action 1: Call 108 (Red) */}
          <button
            type="button"
            onClick={() => setActiveModal('emergency')}
            className="p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-700/60 hover:border-rose-500 text-rose-300 transition flex flex-col items-center justify-center gap-1.5 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-rose-600/30 text-rose-400 border border-rose-500/50 flex items-center justify-center group-hover:scale-110 transition">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-white">Call 108</span>
            <span className="text-[9px] font-mono text-rose-400">Emergency</span>
          </button>

          {/* Action 2: Report Hazard (Blue Outline) */}
          <button
            type="button"
            onClick={() => setActiveModal('hazard')}
            className="p-3 rounded-2xl bg-blue-950/30 hover:bg-blue-900/40 border border-blue-600/60 hover:border-blue-400 text-blue-300 transition flex flex-col items-center justify-center gap-1.5 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center group-hover:scale-110 transition">
              <TriangleAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Report Hazard</span>
            <span className="text-[9px] font-mono text-blue-400">Civic Alert</span>
          </button>

          {/* Action 3: Track Bus (Green Outline) */}
          <button
            type="button"
            onClick={() => setActiveModal('bus')}
            className="p-3 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-600/60 hover:border-emerald-400 text-emerald-300 transition flex flex-col items-center justify-center gap-1.5 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center group-hover:scale-110 transition">
              <Bus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Track Bus</span>
            <span className="text-[9px] font-mono text-emerald-400">Live GPS</span>
          </button>

          {/* Action 4: Find Ambulance (Purple Outline) */}
          <button
            type="button"
            onClick={() => setActiveModal('ambulance')}
            className="p-3 rounded-2xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-600/60 hover:border-purple-400 text-purple-300 transition flex flex-col items-center justify-center gap-1.5 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition">
              <Ambulance className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Find Ambulance</span>
            <span className="text-[9px] font-mono text-purple-400">Quick Request</span>
          </button>
        </div>
      </div>

      {/* 2. City Status Overview (4 Blocks) */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between pb-2">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            City Status Overview
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {cityStats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-2xl border ${stat.bg} flex flex-col justify-between`}
            >
              <span className="text-[10px] text-slate-400 font-medium">{stat.label}</span>
              <span className={`text-xs font-bold font-mono mt-0.5 ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Report Hazard */}
      <AnimatePresence>
        {activeModal === 'hazard' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                    <TriangleAlert className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Report Road Hazard</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {hazardSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="font-bold">Hazard Ticket Logged!</div>
                    <div className="text-[11px] text-emerald-400/90 mt-0.5">
                      Municipal patrol & police mesh notified for verification.
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleHazardSubmit} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[10px]">Hazard Type</label>
                    <select
                      value={hazardData.category}
                      onChange={(e) => setHazardData({ ...hazardData, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    >
                      <option>Pothole / Road Damage</option>
                      <option>Monsoon Waterlogging</option>
                      <option>Traffic Signal Failure</option>
                      <option>Illegal Parking Obstruction</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[10px]">Location</label>
                    <input
                      type="text"
                      required
                      value={hazardData.location}
                      onChange={(e) => setHazardData({ ...hazardData, location: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[10px]">Description / Note</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Deep crater on left lane slowing down traffic"
                      value={hazardData.description}
                      onChange={(e) => setHazardData({ ...hazardData, description: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Civic Alert</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {/* MODAL: Emergency Call 108 */}
        {activeModal === 'emergency' && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-rose-800/80 rounded-3xl p-5 shadow-2xl space-y-4 text-center text-slate-200"
            >
              <div className="w-14 h-14 rounded-full bg-rose-600/20 text-rose-500 border border-rose-500/40 flex items-center justify-center mx-auto">
                <Phone className="w-7 h-7 animate-bounce" />
              </div>

              <div>
                <h4 className="font-black text-lg text-white">Emergency Response Line</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Connecting to Andhra Pradesh Central Emergency Medical Dispatch
                </p>
                <div className="text-2xl font-black font-mono text-rose-400 mt-2">
                  Dial 108 / 112
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-[11px] text-rose-300">
                GPS Location Auto-Broadcasting to nearest ALS Ambulance.
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <a
                  href="tel:108"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickActions;
