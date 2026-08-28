import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TriangleAlert,
  ShieldAlert,
  MapPin,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Send,
  UserCheck
} from 'lucide-react';

export const IncidentTable = ({ incidents = [] }) => {
  const [incidentList, setIncidentList] = useState(
    incidents.length > 0
      ? incidents
      : [
          {
            id: "INC-GNT-4091",
            title: "Road Surface Degradation / Deep Pothole",
            type: "Pothole",
            location: "Brodipet 2nd Line Road - Near Post Office",
            severity: "High",
            reportedBy: "AI Edge Camera Feed",
            reportedAt: "18 mins ago",
            status: "Dispatched",
          },
          {
            id: "INC-GNT-4092",
            title: "Monsoon Waterlogging & Culvert Bottleneck",
            type: "Waterlogging",
            location: "Market Road Underpass Railway Culvert",
            severity: "Critical",
            reportedBy: "Citizen Sensor Net",
            reportedAt: "42 mins ago",
            status: "Active Containment",
          },
          {
            id: "INC-GNT-4095",
            title: "Traffic Node Collision (Minor Scrape)",
            type: "Accident",
            location: "Guntur Railway Station Circle East",
            severity: "Medium",
            reportedBy: "Patrol Unit #4",
            reportedAt: "9 mins ago",
            status: "On Scene",
          },
        ]
  );

  const [dispatchedId, setDispatchedId] = useState(null);

  const handleDispatch = (id) => {
    setDispatchedId(id);
    setTimeout(() => {
      setIncidentList((prev) =>
        prev.map((inc) => (inc.id === id ? { ...inc, status: "Patrol Dispatched" } : inc))
      );
      setDispatchedId(null);
    }, 800);
  };

  return (
    <div className="w-full h-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 lg:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <TriangleAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Recent Urban Incidents & Hazard Log
              </h3>
              <p className="text-[11px] text-slate-400">
                AI camera detections, citizen reports & patrol dispatches.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60">
            {incidentList.length} Active
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto mt-3.5">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-2.5 pl-1 font-medium">Type</th>
                <th className="pb-2.5 font-medium">Location</th>
                <th className="pb-2.5 font-medium">Reported By</th>
                <th className="pb-2.5 font-medium">Time</th>
                <th className="pb-2.5 font-medium">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {incidentList.map((inc) => {
                const isCritical = inc.severity === 'Critical' || inc.severity === 'High';

                return (
                  <tr key={inc.id} className="hover:bg-slate-800/40 transition">
                    {/* Type & Badge */}
                    <td className="py-2.5 pl-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isCritical ? 'bg-rose-500 animate-ping' : 'bg-amber-400'
                          }`}
                        />
                        <span className="font-bold text-white">{inc.type}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-2.5 max-w-[140px] truncate text-slate-300">
                      <div className="truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{inc.location}</span>
                      </div>
                    </td>

                    {/* Reported By */}
                    <td className="py-2.5 font-mono text-[11px] text-slate-400">
                      {inc.reportedBy}
                    </td>

                    {/* Time */}
                    <td className="py-2.5 font-mono text-[11px] text-slate-400">
                      {inc.reportedAt}
                    </td>

                    {/* Status & Dispatch */}
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                            isCritical
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                              : 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                          }`}
                        >
                          {inc.status}
                        </span>

                        {inc.status !== 'On Scene' && (
                          <button
                            type="button"
                            onClick={() => handleDispatch(inc.id)}
                            disabled={dispatchedId === inc.id}
                            className="p-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                            title="Dispatch nearest patrol unit"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Integrated AP Police Dial 112 & CCTV Edge Grid</span>
        <span className="text-emerald-400">Auto-Triage Active</span>
      </div>
    </div>
  );
};

export default IncidentTable;
