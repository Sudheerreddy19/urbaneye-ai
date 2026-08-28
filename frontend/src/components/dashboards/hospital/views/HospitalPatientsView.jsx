import React from 'react';
import { Users, Activity, Clock, CheckCircle2, ShieldAlert, Heart } from 'lucide-react';

export const HospitalPatientsView = () => {
  const patients = [
    {
      id: 'PT-GNT-9901',
      name: 'R. Koteswara Rao (58 M)',
      diagnosis: 'Acute ST-Elevation Myocardial Infarction',
      triageLevel: 'Level 1 - Resuscitation (Red)',
      bay: 'Cath Lab Bay 2',
      doctor: 'Dr. K. Suhasini',
      status: 'In Surgery',
      admittedAt: '45 mins ago',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    },
    {
      id: 'PT-GNT-9902',
      name: 'M. Lakshmi (34 F)',
      diagnosis: 'Highway Polytrauma & Femur Fracture',
      triageLevel: 'Level 2 - Emergent (Orange)',
      bay: 'Trauma Bay 4',
      doctor: 'Dr. T. Dharma Teja',
      status: 'Stabilizing',
      admittedAt: '1h 12m ago',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    },
    {
      id: 'PT-GNT-9903',
      name: 'P. Venkata Subbaiah (72 M)',
      diagnosis: 'Acute Exacerbation of COPD',
      triageLevel: 'Level 3 - Urgent (Yellow)',
      bay: 'Pulmonary Ward 104',
      doctor: 'Dr. V. Rajesh',
      status: 'Stable on O2',
      admittedAt: '2h 30m ago',
      badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              PATIENTS & EMERGENCY TRIAGE
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Active admissions, Manchester Triage score tracking, and ER bay assignments.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 text-purple-300 text-xs font-mono font-bold">
          26 Patients Processed Today
        </div>
      </div>

      <div className="space-y-4">
        {patients.map((pt) => (
          <div
            key={pt.id}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-400">{pt.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${pt.badgeColor}`}>
                  {pt.triageLevel}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">• Admitted {pt.admittedAt}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{pt.name}</h3>
              <p className="text-xs text-slate-300">{pt.diagnosis}</p>
              <div className="text-[11px] text-slate-400 font-mono pt-1">
                Assigned: <b className="text-slate-200">{pt.doctor}</b> • Location: <b className="text-emerald-400">{pt.bay}</b>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono font-bold text-emerald-400">
              {pt.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalPatientsView;
