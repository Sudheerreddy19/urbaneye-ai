import React from 'react';
import {
  Bus,
  X,
  Clock,
  Gauge,
  Navigation,
  Users,
  PhoneCall,
  ShieldCheck,
  Zap,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useTransitStore, type LiveBus } from '../../store/transitStore';

interface BusStatusCardProps {
  bus?: LiveBus | null;
  onClose?: () => void;
  className?: string;
}

export const BusStatusCard: React.FC<BusStatusCardProps> = ({
  bus: propBus,
  onClose,
  className = '',
}) => {
  const { selectedBus, setBusDrawerOpen, setSelectedBus } = useTransitStore();
  const bus = propBus || selectedBus;

  if (!bus) return null;

  const handleClose = () => {
    if (onClose) onClose();
    else {
      setBusDrawerOpen(false);
      setSelectedBus(null);
    }
  };

  const occupancy = bus.seatOccupancy ?? 50;
  const isFull = occupancy >= 85;
  const isModerate = occupancy >= 50 && occupancy < 85;
  const isLow = occupancy < 50;

  // Occupancy visual style
  const occupancyBadge = isFull
    ? { text: 'Bus Full / Standees Only', bg: 'bg-rose-950/80 text-rose-300 border-rose-800', barColor: 'bg-rose-500' }
    : isModerate
    ? { text: 'Moderate Occupancy', bg: 'bg-amber-950/80 text-amber-300 border-amber-800', barColor: 'bg-amber-500' }
    : { text: 'Seats Available', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800', barColor: 'bg-emerald-500' };

  const etaText = bus.eta || (bus.etaMinutes ? `${bus.etaMinutes} mins` : '4 mins');
  const distanceText = bus.distanceKm ? `${bus.distanceKm} km` : '1.2 km';
  const speedText = `${bus.speedKmph || 32} km/h`;
  const busType = bus.busType || bus.acStatus || 'AC Electric Express';

  return (
    <div
      className={`rounded-3xl bg-slate-900/95 border border-slate-800/90 shadow-2xl backdrop-blur-2xl p-5 text-slate-100 flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-300 z-[1100] ${className}`}
    >
      {/* 1. Header Bar: Route Badge, Status & Close Button */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-900/40">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
              🚌
            </div>
            {/* Live radar pulse */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white font-mono tracking-tight">
                BUS {bus.routeNumber}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300">
                {bus.registrationNumber || bus.busNumber || 'AP-07-Z-2101'}
              </span>
            </div>
            <div className="text-xs text-blue-400 font-medium truncate max-w-[210px] sm:max-w-[280px]">
              {bus.routeName || 'Urban Metro Corridor Express'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Real-Time Occupancy & Crowd Level Gauge */}
      <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Real-Time Bus Crowd Level:</span>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${occupancyBadge.bg}`}>
            {occupancyBadge.text}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${occupancyBadge.barColor}`}
            style={{ width: `${Math.min(100, Math.max(5, occupancy))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Capacity: <b className="text-white">{occupancy}% Full</b></span>
          <span>Seats Left: <b className={isFull ? 'text-rose-400' : 'text-emerald-400'}>{bus.availableSeats ?? Math.round(50 * (1 - occupancy / 100))} seats</b></span>
        </div>
      </div>

      {/* 3. Live Telemetry Metrics Grid: ETA, Speed, Distance */}
      <div className="grid grid-cols-3 gap-2">
        {/* Metric 1: Live ETA */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center">
          <Clock className="w-4 h-4 text-emerald-400 mb-1" />
          <div className="text-[10px] font-mono uppercase text-slate-400">Live ETA</div>
          <div className="text-xs font-bold text-emerald-300 font-mono mt-0.5">
            {etaText}
          </div>
        </div>

        {/* Metric 2: Live Speed */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center">
          <Gauge className="w-4 h-4 text-blue-400 mb-1" />
          <div className="text-[10px] font-mono uppercase text-slate-400">Speed</div>
          <div className="text-xs font-bold text-blue-300 font-mono mt-0.5">
            {speedText}
          </div>
        </div>

        {/* Metric 3: Distance Away */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center">
          <Navigation className="w-4 h-4 text-purple-400 mb-1" />
          <div className="text-[10px] font-mono uppercase text-slate-400">Distance</div>
          <div className="text-xs font-bold text-purple-300 font-mono mt-0.5">
            {distanceText}
          </div>
        </div>
      </div>

      {/* 4. Upcoming Next Stop Corridor Information */}
      <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Next Approaching Stop</div>
            <div className="text-xs font-bold text-white truncate max-w-[200px]">
              {bus.nextStop || 'Brodipet Main Road Junction'}
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
          Approaching
        </span>
      </div>

      {/* 5. Driver Details & Direct Mobile Contact */}
      <div className="bg-slate-950/90 rounded-2xl p-3 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-200">
            👨‍✈️
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Driver In-Charge</div>
            <div className="text-xs font-bold text-white">{bus.driverName || 'K. Srinivasa Rao'}</div>
          </div>
        </div>

        <a
          href={`tel:${bus.driverPhone || '+919848011221'}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call Driver</span>
        </a>
      </div>

      {/* 6. Footer Info Badge (AC / Fleet Category) */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-cyan-300">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>{busType}</span>
        </span>
        <span className="text-slate-500">Live GPS Frequency: 4s</span>
      </div>
    </div>
  );
};
