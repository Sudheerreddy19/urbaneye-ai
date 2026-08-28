import React from 'react';
import { Ticket, QrCode, Bus, CheckCircle2, Clock } from 'lucide-react';

const activeBookings = [
  {
    ticketId: 'APSRTC-GNT-88219',
    busRoute: 'Bus 21A Superfast Express',
    origin: 'Brodipet 4/1 Stop',
    destination: 'Ala Super Speciality Hospital',
    departure: 'In 4 mins (Live GPS)',
    seat: 'Seat 14 (Window)',
    fare: '₹20.00',
    status: 'ACTIVE DIGITAL PASS',
  }
];

export const BookingsView = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">My Active Bookings & Digital Transit Pass</h2>
            <p className="text-xs text-slate-400">Scan QR pass on bus validator or show conductor</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activeBookings.map((b) => (
          <div key={b.ticketId} className="p-6 rounded-3xl bg-slate-900/90 border border-blue-500/40 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800 font-bold">
                {b.status}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">{b.fare}</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">{b.busRoute}</h3>
              <p className="text-xs text-slate-300 font-mono">{b.origin} ➔ {b.destination}</p>
              <div className="text-xs text-blue-400 font-bold flex items-center gap-1 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{b.departure} • {b.seat}</span>
              </div>
            </div>

            {/* Simulated QR Code */}
            <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center text-slate-900 space-y-1">
              <QrCode className="w-28 h-28 text-slate-900" />
              <span className="text-[10px] font-mono font-bold tracking-wider">{b.ticketId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsView;
