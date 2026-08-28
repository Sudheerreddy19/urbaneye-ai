import React from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export const PoliceAlertsView = () => {
  const alerts = [
    {
      id: 'ALT-POL-01',
      title: 'Emergency Priority Preemption Requested',
      message: 'Ambulance AMB-108-GNT-01 entering Brodipet 4/1 junction. Green wave locked.',
      time: '2 mins ago',
      severity: 'Critical',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    },
    {
      id: 'ALT-POL-02',
      title: 'Waterlogging Drainage Alert at Railway Underpass',
      message: 'Left lane submerged by 14 inches. City municipal pumps dispatched.',
      time: '42 mins ago',
      severity: 'High',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    },
    {
      id: 'ALT-POL-03',
      title: 'Traffic Density Spike on Grand Trunk Road',
      message: 'Speed dropped to 14 km/h. AI adjusting signal timing +15s green.',
      time: '1 hour ago',
      severity: 'Medium',
      badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              POLICE DISPATCH & BROADCAST ALERTS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time critical notices, traffic signal overrides, and city emergency broadcasts.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs font-mono font-bold">
          {alerts.length} Active Notifications
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 shadow-xl backdrop-blur-xl flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">{alt.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${alt.badgeColor}`}>
                  {alt.severity}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">• {alt.time}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{alt.title}</h3>
              <p className="text-xs text-slate-300">{alt.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoliceAlertsView;
