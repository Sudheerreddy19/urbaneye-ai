import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  Siren,
  CheckCircle2,
  Clock,
  Radio,
  X,
  Droplet,
  Activity
} from 'lucide-react';

const initialAlerts = [
  {
    id: 'ALT-101',
    title: 'AMB-108-GNT-01 is 3 mins away',
    desc: 'Critical Cardiac Shock patient inbound. Triage Bay 1 requested.',
    priority: 'HIGH',
    priorityClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    time: 'Just now',
    type: 'ambulance',
    icon: Siren,
  },
  {
    id: 'ALT-102',
    title: 'Green Corridor Signal Override Active',
    desc: 'SIG-GNT-101 & 103 forced green for AMB-01 priority transit.',
    priority: 'SYSTEM',
    priorityClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    time: '2 mins ago',
    type: 'signal',
    icon: Radio,
  },
  {
    id: 'ALT-103',
    title: 'Blood Bank: Critical O- Shortage',
    desc: 'Only 3 units remaining in emergency cold reserve.',
    priority: 'CRITICAL',
    priorityClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    time: '6 mins ago',
    type: 'blood',
    icon: Droplet,
  },
  {
    id: 'ALT-104',
    title: 'ICU Capacity Threshold Notice',
    desc: 'ICU occupancy reached 88%. 8 beds currently available.',
    priority: 'MED',
    priorityClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    time: '14 mins ago',
    type: 'bed',
    icon: Activity,
  },
];

export const AlertsFeed = () => {
  const [alerts, setAlerts] = useState(initialAlerts);

  const handleDismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="w-full h-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 lg:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Alerts & Triage Notifications
              </h3>
              <p className="text-[11px] text-slate-400">
                Live dispatch updates & clinical priority broadcasts.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60">
            {alerts.length} Active
          </span>
        </div>

        {/* Scrollable Alerts Feed */}
        <div className="mt-3.5 space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
          <AnimatePresence>
            {alerts.map((alert) => {
              const Icon = alert.icon;

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition space-y-1.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${alert.priorityClass}`}>
                        {alert.priority}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                        {alert.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDismiss(alert.id)}
                      className="text-slate-500 hover:text-slate-300 transition opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    {alert.desc}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </span>
                    <span className="text-purple-400">Node Dispatch</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Status */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-Time Stream Active</span>
        </span>
        <button
          type="button"
          onClick={() => setAlerts(initialAlerts)}
          className="text-slate-400 hover:text-white transition text-[10px]"
        >
          Reset Stream
        </button>
      </div>
    </div>
  );
};

export default AlertsFeed;
