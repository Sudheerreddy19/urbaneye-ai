import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bus,
  Search,
  Filter,
  Navigation,
  Clock,
  Users,
  ShieldCheck,
  Zap,
  Radio,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { RouteSearch } from '../../../transit/RouteSearch';
import { BusMap } from '../../../transit/BusMap';
import { BusStatusCard } from '../../../transit/BusStatusCard';
import { useTransitStore } from '../../../../store/transitStore';
import { useBusTracking } from '../../../../hooks/useBusTracking';

export const PublicTransportView = () => {
  const {
    activeRoute,
    selectedBus,
    setSelectedBus,
    isBusDrawerOpen,
    setBusDrawerOpen,
  } = useTransitStore();

  const [routeFilter, setRouteFilter] = useState('all');
  const [occupancyFilter, setOccupancyFilter] = useState('all');
  const { buses, inspectBus, telemetryMode, lastHeartbeat, refetchTelemetry } = useBusTracking();

  // Deduplicate buses strictly by routeNumber / busNumber to prevent any duplicate bus data
  const uniqueBuses = React.useMemo(() => {
    const map = new Map();
    for (const b of buses) {
      const key = b.routeNumber || b.busNumber || b.id;
      if (!map.has(key)) {
        map.set(key, b);
      }
    }
    return Array.from(map.values());
  }, [buses]);

  // Filter buses based on user selections
  const filteredBuses = uniqueBuses.filter((b) => {
    if (routeFilter !== 'all' && b.routeNumber !== routeFilter) return false;
    if (occupancyFilter === 'seats_available' && (b.seatOccupancy || 0) >= 60) return false;
    if (occupancyFilter === 'moderate' && ((b.seatOccupancy || 0) < 60 || (b.seatOccupancy || 0) >= 85)) return false;
    if (occupancyFilter === 'full' && (b.seatOccupancy || 0) < 85) return false;
    return true;
  });

  const availableRoutes = Array.from(new Set(uniqueBuses.map((b) => b.routeNumber)));

  return (
    <div className="w-full h-full flex flex-col gap-4 max-w-[1700px] mx-auto p-2 sm:p-4 text-slate-100 overflow-hidden">
      {/* 1. Header Banner with Live Telemetry Pulse & Route Search Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-950/60 flex items-center justify-center">
            <div className="w-full h-full bg-[#080E1A] rounded-[14px] flex items-center justify-center">
              <Bus className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Live Public Transit & Bus Navigator
              </h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE GPS TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Dynamic bus station autocomplete, OSRM road polylines, crowd density & ETA tracking
            </p>
          </div>
        </div>

        {/* Telemetry Status Bar */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="text-blue-400 font-bold">{uniqueBuses.length}</span>
            <span className="text-slate-500">Live Buses</span>
          </div>

          <button
            type="button"
            onClick={() => refetchTelemetry()}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="Refresh Live Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Dual-Column Content Grid: Search & Fleet List (Col 4) + Interactive BusMap (Col 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Dynamic Search & Live Bus List */}
        <div className="lg:col-span-4 flex flex-col gap-3 h-full overflow-y-auto pr-1">
          {/* A. Dynamic Origin / Destination Search Component */}
          <RouteSearch />

          {/* B. Filter Pills */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-400" />
                <span>Filter Buses by Route</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">{filteredBuses.length} Shown</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setRouteFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  routeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Routes
              </button>
              {availableRoutes.map((rt) => (
                <button
                  key={rt}
                  type="button"
                  onClick={() => setRouteFilter(rt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    routeFilter === rt
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Route {rt}
                </button>
              ))}
            </div>

            {/* Occupancy Filter */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setOccupancyFilter('all')}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition ${
                  occupancyFilter === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                All Seats
              </button>
              <button
                type="button"
                onClick={() => setOccupancyFilter('seats_available')}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition ${
                  occupancyFilter === 'seats_available'
                    ? 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-950 text-emerald-400/70 hover:text-emerald-300'
                }`}
              >
                Seats Available
              </button>
              <button
                type="button"
                onClick={() => setOccupancyFilter('full')}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition ${
                  occupancyFilter === 'full'
                    ? 'bg-rose-900 text-rose-300 border border-rose-700'
                    : 'bg-slate-950 text-rose-400/70 hover:text-rose-300'
                }`}
              >
                Full Only
              </button>
            </div>
          </div>

          {/* C. Live Bus Cards List */}
          <div className="flex-1 space-y-2 overflow-y-auto pr-0.5">
            {filteredBuses.map((bus) => {
              const occupancy = bus.seatOccupancy ?? 50;
              const isFull = occupancy >= 85;
              const isModerate = occupancy >= 50 && occupancy < 85;
              const isSelected = selectedBus?.id === bus.id || selectedBus?.busNumber === bus.busNumber;

              return (
                <div
                  key={bus.id || bus.busNumber}
                  onClick={() => inspectBus(bus)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/40 border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800/90 hover:border-slate-700 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🚌</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-white font-mono">
                            ROUTE {bus.routeNumber}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                            {bus.registrationNumber || bus.busNumber}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 truncate max-w-[180px] font-medium">
                          {bus.routeName}
                        </div>
                      </div>
                    </div>

                    {/* Live ETA Badge */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        {bus.eta || `${bus.etaMinutes || 4} mins`}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {bus.distanceKm || 1.2} km away
                      </div>
                    </div>
                  </div>

                  {/* Occupancy Indicator Bar */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">Crowd Level:</span>
                      <span
                        className={`font-bold px-1.5 py-0.2 rounded ${
                          isFull
                            ? 'bg-rose-950 text-rose-300'
                            : isModerate
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {isFull ? 'BUS FULL' : isModerate ? 'MODERATE' : 'SEATS AVAILABLE'} ({occupancy}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isFull ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                      <span>Next: <b className="text-slate-200">{bus.nextStop || 'Brodipet 4th Line'}</b></span>
                      <span>Speed: <b>{bus.speedKmph || 30} km/h</b></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Bus Map Canvas */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[440px] relative overflow-hidden">
          <BusMap />
        </div>
      </div>
    </div>
  );
};

export default PublicTransportView;
