import React from 'react';
import { History, Bus, Navigation, Clock, CheckCircle2, Ticket, MapPin } from 'lucide-react';

const tripHistory = [
  {
    id: 'TRIP-9901',
    date: 'Today, 4:15 PM',
    route: 'Bus 21A • Brodipet 4/1 ➔ Ala Hospital',
    type: 'Transit Bus',
    fare: '₹20',
    status: 'Completed',
    duration: '14 mins',
  },
  {
    id: 'TRIP-9844',
    date: 'Yesterday, 8:30 AM',
    route: 'Bus 10A • NTR Bus Stand ➔ AP Secretariat',
    type: 'Transit Bus',
    fare: '₹35',
    status: 'Completed',
    duration: '28 mins',
  },
  {
    id: 'TRIP-9721',
    date: '26 Aug 2026, 6:40 PM',
    route: 'Journey Nav • Pattabhipuram ➔ Brodipet',
    type: 'Multi-Modal Route',
    fare: '₹0',
    status: 'Completed',
    duration: '18 mins',
  },
];

export const HistoryView = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Citizen Trip & Telemetry History</h2>
            <p className="text-xs text-slate-400">Past journeys, bus rides, and emergency assistance records</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-xl space-y-4">
        <div className="space-y-3">
          {tripHistory.map((trip) => (
            <div
              key={trip.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between flex-wrap gap-3"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{trip.route}</div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                    <span>{trip.date}</span>
                    <span>•</span>
                    <span>Duration: {trip.duration}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <span className="text-xs font-bold text-emerald-400">{trip.fare}</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 text-[10px] font-semibold border border-emerald-800">
                  {trip.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
