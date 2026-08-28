import React from 'react';
import AlertsFeed from '../AlertsFeed';
import { Bell, Radio, ShieldAlert } from 'lucide-react';

export const HospitalAlertsView = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              HOSPITAL CODE RED & TRIAGE ALERTS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Inbound life-critical trauma notifications, code blue resuscitation alerts, and blood bank priority requests.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs font-mono font-bold">
          2 Urgent Code Red Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <AlertsFeed />
        </div>
      </div>
    </div>
  );
};

export default HospitalAlertsView;
