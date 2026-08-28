import React from 'react';
import { Stethoscope, UserCheck, Clock, CheckCircle2 } from 'lucide-react';

export const HospitalStaffView = () => {
  const staff = [
    {
      id: 'DOC-01',
      name: 'Dr. K. Suhasini, MD',
      role: 'Chief Emergency Cardiology & Trauma Lead',
      department: 'Trauma & Resuscitation',
      status: 'On-Duty (Cath Lab)',
      shift: 'Day Shift (08:00 - 20:00)',
      activePatients: 4,
    },
    {
      id: 'DOC-02',
      name: 'Dr. T. Dharma Teja, MS, MCh',
      role: 'Consultant Trauma & Neurosurgeon',
      department: 'Emergency Surgery',
      status: 'On-Duty (OT-1)',
      shift: '24h Trauma Call',
      activePatients: 2,
    },
    {
      id: 'DOC-03',
      name: 'Dr. V. Rajesh, MD',
      role: 'Pulmonology & Critical Care Intensivist',
      department: 'Medical ICU',
      status: 'On-Duty (MICU)',
      shift: 'Day Shift',
      activePatients: 6,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              ON-DUTY MEDICAL STAFF & SPECIALISTS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Active physician roster, surgical teams on standby, and on-call specialist telemetry.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 text-purple-300 text-xs font-mono font-bold">
          34 Specialists On-Duty
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {staff.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 shadow-xl backdrop-blur-xl space-y-3"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-mono font-bold text-purple-400">{doc.id}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                {doc.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{doc.name}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{doc.role}</p>
              <span className="text-[11px] font-mono text-slate-400 block mt-1">{doc.department}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Shift: {doc.shift}</span>
              <span className="text-purple-400 font-bold">{doc.activePatients} Cases</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalStaffView;
