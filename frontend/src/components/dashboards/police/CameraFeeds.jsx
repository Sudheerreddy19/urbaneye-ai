import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Eye,
  Maximize2,
  Minimize2,
  Radio,
  Clock,
  Car,
  Gauge,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';

const feeds = [
  {
    id: 'CAM-01',
    name: 'Brodipet 4/1 Main Junction',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80',
    status: 'LIVE',
    fps: '30 FPS',
    speed: '42 km/h avg',
    density: 'Moderate (64 veh/min)',
    resolution: '4K AI Telemetry',
  },
  {
    id: 'CAM-02',
    name: 'Market Road Culvert Approach',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=400&q=80',
    status: 'PREEMPTION LOCK',
    fps: '60 FPS',
    speed: '58 km/h (EMS Wave)',
    density: 'High (88 veh/min)',
    resolution: '4K AI Telemetry',
  },
  {
    id: 'CAM-03',
    name: 'Railway Station Circle East',
    imageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=400&q=80',
    status: 'LIVE',
    fps: '30 FPS',
    speed: '31 km/h avg',
    density: 'Dense (110 veh/min)',
    resolution: '1080p Optical',
  },
];

export const CameraFeeds = () => {
  const [selectedFeed, setSelectedFeed] = useState(null);

  return (
    <div className="w-full h-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 lg:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Traffic Camera Surveillance Feeds
              </h3>
              <p className="text-[11px] text-slate-400">
                Live AI computer vision optical streams & speed sensors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 text-[10px] font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>3 STREAMS LIVE</span>
          </div>
        </div>

        {/* 3 Camera Feeds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3.5">
          {feeds.map((feed) => (
            <motion.div
              key={feed.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedFeed(feed)}
              className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer shadow-lg flex flex-col justify-between aspect-video"
            >
              {/* CCTV Snapshot Image */}
              <img
                src={feed.imageUrl}
                alt={feed.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 transition duration-300 filter contrast-125"
              />

              {/* Grid scanlines overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

              {/* Top Camera Header Overlay */}
              <div className="relative z-10 p-2 flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1 bg-black/80 px-1.5 py-0.5 rounded border border-slate-700 text-white font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>{feed.id}</span>
                </div>

                <div className="bg-black/80 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">
                  {feed.fps}
                </div>
              </div>

              {/* Center AI Target Detection Box Overlay */}
              <div className="relative z-10 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition duration-200">
                <div className="w-16 h-10 border border-emerald-400/80 bg-emerald-500/10 rounded flex items-center justify-center text-[9px] font-mono text-emerald-300 font-bold">
                  AI DETECT
                </div>
              </div>

              {/* Bottom Camera Footer Overlay */}
              <div className="relative z-10 p-2 text-left font-mono">
                <div className="text-xs font-bold text-white truncate drop-shadow">
                  {feed.name}
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-300 mt-0.5">
                  <span>{feed.speed}</span>
                  <span className="text-emerald-400 font-bold">{feed.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Automatic License Plate Recognition (ANPR) Active</span>
        <span className="text-blue-400">Fiber Node GNT-HQ</span>
      </div>

      {/* Expanded Camera Feed Modal */}
      <AnimatePresence>
        {selectedFeed && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-3 p-5 text-slate-100"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold">
                    {selectedFeed.id} [LIVE STREAM]
                  </span>
                  <h4 className="font-bold text-sm text-white">{selectedFeed.name}</h4>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFeed(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Large Stream Preview */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-slate-800">
                <img
                  src={selectedFeed.imageUrl}
                  alt={selectedFeed.name}
                  className="w-full h-full object-cover filter contrast-125"
                />
                <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded-lg border border-slate-700 font-mono text-xs text-white">
                  ● REC • {new Date().toLocaleTimeString()}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/80 p-2 rounded-xl border border-slate-700 text-xs font-mono">
                  <span className="text-slate-300">Vehicle Speed: <b className="text-blue-400">{selectedFeed.speed}</b></span>
                  <span className="text-slate-300">Density: <b className="text-emerald-400">{selectedFeed.density}</b></span>
                  <span className="text-slate-400">{selectedFeed.resolution}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CameraFeeds;
