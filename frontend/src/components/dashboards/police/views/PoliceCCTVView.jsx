import React from 'react';
import CameraFeeds from '../CameraFeeds';
import { Video, ShieldCheck, Sparkles } from 'lucide-react';

export const PoliceCCTVView = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              TACTICAL CCTV SURVEILLANCE MATRIX
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Live AI optical feeds with vehicle license plate OCR and incident auto-detection across Brodipet network.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-blue-950/40 border border-blue-800/50 text-blue-300 text-xs font-mono font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>3 Edge Feeds Streaming</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CameraFeeds />
      </div>
    </div>
  );
};

export default PoliceCCTVView;
