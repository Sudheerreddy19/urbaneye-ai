import React, { useState } from 'react';
import { TriangleAlert, ShieldAlert, Plus, Camera, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { useUrbanData } from '../../../../context/UrbanDataContext';

export const HazardsView = () => {
  const { data, reportIncident } = useUrbanData();
  const incidents = data?.incidents || [];
  const [showReportForm, setShowReportForm] = useState(false);
  const [hazardType, setHazardType] = useState('Potholes');
  const [locationText, setLocationText] = useState('Brodipet 4th Line Road');
  const [reportedSuccess, setReportedSuccess] = useState(false);

  const handleReport = (e) => {
    e.preventDefault();
    const newInc = {
      id: `INC-GNT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${hazardType} reported near ${locationText}`,
      type: hazardType,
      location: locationText,
      severity: 'Medium',
      coordinates: [16.3067, 80.4365],
      reportedAt: 'Just now',
      status: 'Report Received',
      impact: 'Verification by AI cameras underway.',
    };
    if (reportIncident) {
      reportIncident(newInc);
    }
    setReportedSuccess(true);
    setShowReportForm(false);
    setTimeout(() => setReportedSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <TriangleAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Citizen Road Hazards & Incident Feed</h2>
            <p className="text-xs text-slate-400">Crowdsourced & AI-detected urban safety anomalies</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowReportForm(!showReportForm)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition shadow-lg shadow-amber-600/30 cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Report Hazard</span>
        </button>
      </div>

      {reportedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Hazard report logged with AP Urban Maintenance Team! Thank you for keeping Guntur safe.</span>
        </div>
      )}

      {showReportForm && (
        <form onSubmit={handleReport} className="p-5 rounded-3xl bg-slate-900/95 border border-amber-500/40 space-y-3 shadow-2xl">
          <div className="text-xs font-bold text-white">Submit New Road Hazard</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Hazard Category</label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Potholes">Severe Pothole / Road Damage</option>
                <option value="Waterlogging">Monsoon Waterlogging</option>
                <option value="Accident">Vehicle Collision / Obstruction</option>
                <option value="Signal Fault">Traffic Signal Outage</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">Exact Location Landmark</label>
              <input
                type="text"
                required
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowReportForm(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
            >
              Submit Report
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3 flex-wrap"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <TriangleAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{inc.title}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{inc.location} • Reported: {inc.reportedAt}</div>
                <div className="text-[11px] text-slate-300 mt-1">{inc.impact}</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 text-amber-300 text-[10px] font-mono border border-amber-800/80">
              {inc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HazardsView;
