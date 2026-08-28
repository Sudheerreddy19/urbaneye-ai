import React from 'react';
import BedMatrix from '../BedMatrix';
import { BedDouble, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useUrbanData } from '../../../../context/UrbanDataContext';

export const HospitalBedsView = () => {
  const { data } = useUrbanData();
  const beds = data?.hospitalStats?.beds || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BedDouble className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              HOSPITAL BED CAPACITY & WARD MATRIX
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time occupancy across ICU, Ventilator, Emergency Trauma, and General Inpatient wards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono font-bold">
            {beds.available || 54} Total Beds Free
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs font-mono font-bold">
            {beds.icu?.available || 8} ICU Free
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <BedMatrix bedStats={beds} />
      </div>
    </div>
  );
};

export default HospitalBedsView;
