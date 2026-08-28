import React from 'react';
import WeatherAQIWidget from './WeatherAQIWidget';
import {
  Building2,
  Bell,
  Radio,
  Clock,
  Shield,
  ShieldAlert,
  Flame,
  Search,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const TopNav = ({
  role = 'hospital',
  title,
  subtitle,
  hospitalName = "Ala Super Speciality Hospital",
  officerName = "Inspector S. Mahesh",
  location = "Brodipet, Guntur",
  alertCount = 4,
  onOpenAlerts
}) => {
  const isPolice = role === 'police';

  const defaultTitle = isPolice ? "POLICE CONTROL DASHBOARD" : "HOSPITAL DASHBOARD";
  const defaultSubtitle = isPolice
    ? "Tactical Urban Grid & Traffic Preemption Node"
    : "Emergency Triage & Inbound Medical Operations";

  return (
    <header className="sticky top-0 z-20 w-full bg-[#090e18]/90 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Title & Live Corridor Breadcrumb */}
      <div className="flex items-center gap-3.5 pl-10 lg:pl-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>{title || defaultTitle}</span>
            </h2>
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
              isPolice
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            }`}>
              {isPolice ? 'TACTICAL LIVE GRID' : 'LIVE TELEMETRY'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {subtitle || defaultSubtitle} • <span className="text-slate-300">{location}</span>
          </p>
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 w-full md:w-auto justify-end">
        {/* Weather & AQI Glassmorphic Widget */}
        <WeatherAQIWidget city="Guntur" />

        {/* Live Network Node Status Tag */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400">Node:</span>
          <span className="text-emerald-400 font-semibold">Guntur-Corridor</span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {}}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm group border ${
            isPolice
              ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border-rose-500/40'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 animate-pulse ${isPolice ? 'text-emerald-400' : 'text-rose-400'}`} />
          <span className="hidden sm:inline">{isPolice ? 'Sync Signal Mesh' : 'Green Corridor Override'}</span>
          <span className="sm:hidden">{isPolice ? 'Sync' : 'Override'}</span>
        </button>

        {/* Notification Bell with Badge */}
        <button
          type="button"
          onClick={onOpenAlerts}
          className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-lg animate-pulse ${
              isPolice ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'
            }`}>
              {alertCount}
            </span>
          )}
        </button>

        {/* Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-800">
          <div className={`w-8 h-8 rounded-xl p-0.5 shadow-sm ${
            isPolice
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-700'
              : 'bg-gradient-to-tr from-purple-600 to-rose-600'
          }`}>
            <div className="w-full h-full bg-[#080d17] rounded-[10px] flex items-center justify-center">
              {isPolice ? (
                <Shield className="w-4 h-4 text-emerald-400" />
              ) : (
                <Building2 className="w-4 h-4 text-purple-300" />
              )}
            </div>
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-white truncate max-w-[140px]">
              {isPolice ? officerName : hospitalName}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {isPolice ? 'AP Police Central' : 'Trauma Bay Unit 1'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
