import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  Clock,
  Sparkles
} from 'lucide-react';

export const PoliceReportsView = () => {
  const reports = [
    {
      id: 'REP-2026-0828',
      title: 'Amaravati Corridor Daily Traffic & Preemption Audit',
      date: 'Today, 21:00 IST',
      status: 'Generated & Signed',
      size: '2.4 MB PDF',
      metrics: '32 Signals • 8 Green Corridors • 99.8% Uptime',
    },
    {
      id: 'REP-2026-0827',
      title: 'EMS Transit Efficiency & Response Time Breakdown',
      date: 'Yesterday, 23:59 IST',
      status: 'Archived',
      size: '4.1 MB PDF',
      metrics: 'Avg Response 6.2 min (-1.4 min vs target)',
    },
    {
      id: 'REP-2026-0826',
      title: 'Weekly Urban Bottleneck & Pothole Hazard Summary',
      date: '26 Aug 2026',
      status: 'Archived',
      size: '1.8 MB PDF',
      metrics: '14 Repairs Completed • 3 Under Investigation',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              POLICE AUDIT & TELEMETRY REPORTS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated intelligence reports for Guntur police division, corridor preemption logs & signal audits.
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Full Daily Log</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">{report.id}</span>
                  <span className="text-[10px] font-mono text-slate-400">• {report.date}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">{report.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{report.metrics}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs font-mono text-slate-400">{report.size}</span>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PoliceReportsView;
