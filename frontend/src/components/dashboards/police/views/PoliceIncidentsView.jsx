import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TriangleAlert,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  Filter,
  Plus,
  Send
} from 'lucide-react';
import { useUrbanData } from '../../../../context/UrbanDataContext';

export const PoliceIncidentsView = () => {
  const { data, addIncidentReport } = useUrbanData();
  const incidents = data?.incidents || [];
  const [filter, setFilter] = useState('all');

  const filteredIncidents = incidents.filter((inc) => {
    if (filter === 'all') return true;
    return inc.severity?.toLowerCase() === filter.toLowerCase() || inc.type?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TriangleAlert className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              INCIDENTS & TACTICAL DISPATCH
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Active highway collisions, road hazards, traffic bottlenecks & patrol dispatch logging.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'critical', 'high', 'accident', 'construction'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition cursor-pointer ${
                filter === f
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIncidents.map((incident) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 shadow-xl backdrop-blur-xl space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {incident.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    • {incident.type}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">
                  {incident.title}
                </h3>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                incident.severity === 'Critical'
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : incident.severity === 'High'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-blue-950 text-blue-300 border-blue-800'
              }`}>
                {incident.severity}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{incident.location}</span>
            </div>

            {incident.impact && (
              <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                {incident.impact}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Reported: {incident.reportedAt}</span>
              <span className="text-emerald-400 font-bold">{incident.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PoliceIncidentsView;
