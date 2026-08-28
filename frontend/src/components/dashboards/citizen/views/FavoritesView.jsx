import React from 'react';
import { Star, Bus, MapPin, Hospital, Building, Navigation, ArrowRight } from 'lucide-react';

const savedLocations = [
  { name: 'Ala Super Speciality Hospital', type: 'Hospital / Emergency', address: 'Brodipet, Guntur', eta: '4 min away' },
  { name: 'NTR Central Bus Station', type: 'Transit Hub', address: 'Guntur Station Road', eta: '8 min away' },
  { name: 'Guntur Railway Junction', type: 'Railway Hub', address: 'Grand Trunk Road', eta: '10 min away' },
];

const savedRoutes = [
  { route: 'Bus 21A Express', path: 'Old Bus Stand ⇄ Ala Hospital', status: 'Live Every 10m' },
  { route: 'Bus 10A Superfast', path: 'Guntur Junction ⇄ Secretariat', status: 'Live Every 15m' },
];

export const FavoritesView = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Saved Favorites & Pinned Routes</h2>
            <p className="text-xs text-slate-400">Quick-access favorite transit lines, landmarks, and hospitals</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Saved Landmarks */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-xl space-y-3">
          <div className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Pinned Destinations</span>
          </div>
          <div className="space-y-2.5">
            {savedLocations.map((loc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{loc.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{loc.address} • {loc.type}</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800">
                  {loc.eta}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Bus Routes */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-xl space-y-3">
          <div className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
            <Bus className="w-4 h-4 text-blue-400" />
            <span>Frequent Transit Lines</span>
          </div>
          <div className="space-y-2.5">
            {savedRoutes.map((rt, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{rt.route}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{rt.path}</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  {rt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesView;
