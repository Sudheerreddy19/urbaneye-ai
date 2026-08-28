import React from 'react';
import { BarChart3, Download, FileText, CheckCircle2, TrendingUp } from 'lucide-react';

export const HospitalReportsView = () => {
  const reports = [
    {
      id: 'MED-REP-8801',
      title: 'Emergency Department Door-to-Needle & Balloon Time Audit',
      date: 'Today, 20:30 IST',
      metrics: 'Median Door-to-Cath Time: 28 mins (-12m improvement)',
      size: '3.1 MB PDF',
    },
    {
      id: 'MED-REP-8802',
      title: 'Monthly Blood Bank Cross-Match & Inventory Report',
      date: '27 Aug 2026',
      metrics: 'O- Negative Shortage Addressed • 158 Units Transfused',
      size: '2.5 MB PDF',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              CLINICAL ANALYTICS & TRIAGE AUDITS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Trauma turnaround metrics, ER patient flow analytics, and regional EMS logistics summaries.
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Monthly Clinical Audit</span>
        </button>
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-400">{rep.id}</span>
                  <span className="text-[10px] font-mono text-slate-400">• {rep.date}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">{rep.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{rep.metrics}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs font-mono text-slate-400">{rep.size}</span>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalReportsView;
