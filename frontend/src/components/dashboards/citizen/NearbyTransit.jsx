import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ambulance,
  PhoneCall,
  Clock,
  MapPin,
  HeartPulse,
  ChevronRight,
  ShieldAlert,
  X,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useUrbanData } from '../../../context/UrbanDataContext';

export const NearbyTransit = ({ onSelectTransitItem, selectedItem }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAllModal, setShowAllModal] = useState(false);
  const { data, toggleAmbulanceBooking } = useUrbanData();

  const rawAmbulances = data?.ambulances || [];

  // Map all real emergency ambulances from the smart city telemetry
  const ambulanceItems = rawAmbulances.map((amb) => {
    const isBooked = !!amb.isBooked;
    const triage = amb.triage || 'ALS';

    return {
      id: amb.id,
      type: 'ambulance',
      vehicleNumber: amb.vehicleNumber || amb.id,
      hospitalName: amb.hospitalName || 'Guntur Government Hospital',
      driverName: amb.driverName || 'Ramesh Kumar',
      driverPhone: amb.driverPhone || '+91 98765 43220',
      eta: amb.eta || '3 min',
      distance: amb.speedKmph > 0 ? '1.2 km away' : 'At Base Station',
      speedKmph: amb.speedKmph || 45,
      triage: triage,
      isBooked: isBooked,
      condition: amb.condition || (isBooked ? 'Critical' : 'Available'),
      patientSummary: amb.patientSummary || (isBooked ? 'Emergency Transit Active' : 'Standby Emergency Unit'),
      activePreemption: amb.activePreemption,
      sirenStatus: amb.sirenStatus || (isBooked ? 'CODE RED ACTIVE' : 'STANDBY PRIORITY'),
      raw: amb,
    };
  });

  const filterTabs = [
    { id: 'all', label: 'All Units' },
    { id: 'available', label: 'Available' },
    { id: 'als', label: 'ALS (Critical)' },
    { id: 'bls', label: 'BLS (General)' },
    { id: 'icu', label: 'Mobile ICU' },
  ];

  const filteredItems = ambulanceItems.filter((amb) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'available') return !amb.isBooked;
    if (activeFilter === 'als') return amb.triage === 'ALS';
    if (activeFilter === 'bls') return amb.triage === 'BLS';
    if (activeFilter === 'icu') return amb.triage === 'ICU';
    return true;
  });

  const availableCount = ambulanceItems.filter((a) => !a.isBooked).length;

  return (
    <div className="w-full h-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center">
                <Ambulance className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Nearby Ambulances
              </h3>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live 108 EMS & Emergency Response Fleet
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
              Radius: 5.0 km
            </span>
            <span className="text-[9px] font-mono text-emerald-400">
              {availableCount} Available Now
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3 pb-2 overflow-x-auto no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Ambulances Cards List */}
        <div className="space-y-2.5 mt-2.5 max-h-[calc(100vh-340px)] overflow-y-auto pr-0.5 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((amb, idx) => {
              const isSelected = selectedItem?.id === amb.id;
              const isBooked = amb.isBooked;

              return (
                <motion.div
                  key={amb.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  onClick={() => {
                    if (onSelectTransitItem) onSelectTransitItem(amb);
                  }}
                  className={`group relative p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-rose-950/60 border-rose-500 ring-1 ring-rose-500/50 shadow-lg shadow-rose-950/40'
                      : isBooked
                      ? 'bg-slate-950/80 border-rose-900/40 hover:border-rose-700/60'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Card Header: Ambulance ID + Triage + Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isBooked
                            ? 'bg-rose-600/30 text-rose-400 border border-rose-500/40 animate-pulse'
                            : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        <Ambulance className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-white">
                            {amb.id}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                              amb.triage === 'ALS'
                                ? 'bg-rose-950 text-rose-300 border-rose-800'
                                : amb.triage === 'ICU'
                                ? 'bg-purple-950 text-purple-300 border-purple-800'
                                : 'bg-blue-950 text-blue-300 border-blue-800'
                            }`}
                          >
                            {amb.triage}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & ETA Badge */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 justify-end font-mono">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            isBooked
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {isBooked ? 'IN TRANSIT' : 'STANDBY'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1 justify-end">
                        <Clock className="w-2.5 h-2.5 text-slate-500" />
                        <span>ETA: <b className="text-slate-200">{amb.eta}</b></span>
                      </div>
                    </div>
                  </div>

                  {/* Hospital & Corridor */}
                  <div className="text-[11px] text-slate-300 font-semibold truncate mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                    <span className="truncate">{amb.hospitalName}</span>
                  </div>

                  {/* Condition / Patient Summary */}
                  <div className="mt-1 text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800/80 flex items-center justify-between">
                    <span className="truncate max-w-[170px]">
                      {amb.patientSummary}
                    </span>
                    <span className="text-slate-300 font-bold flex-shrink-0">
                      {amb.speedKmph} km/h
                    </span>
                  </div>

                  {/* Driver In-Charge & Direct Contact */}
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800">
                    <span className="text-slate-300 truncate max-w-[130px]">
                      👨‍✈️ {amb.driverName}
                    </span>
                    <a
                      href={`tel:${amb.driverPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold flex-shrink-0"
                    >
                      <PhoneCall className="w-2.5 h-2.5" />
                      <span>{amb.driverPhone}</span>
                    </a>
                  </div>

                  {/* Booking / Dispatch Action Button */}
                  <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      {amb.distance}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (toggleAmbulanceBooking) {
                          toggleAmbulanceBooking(amb.id);
                        }
                      }}
                      className={`py-1 px-2.5 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer flex items-center gap-1 ${
                        isBooked
                          ? 'bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-900/60'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                      }`}
                    >
                      {isBooked ? (
                        <>
                          <AlertCircle className="w-3 h-3 text-rose-400" />
                          <span>Cancel Dispatch</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          <span>Dispatch Ambulance</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer: Emergency 108 Hotline */}
      <div className="pt-3 border-t border-slate-800 mt-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <a
            href="tel:108"
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-rose-950/60 transition flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>Emergency 108 Call</span>
          </a>
          <button
            type="button"
            onClick={() => setShowAllModal(true)}
            className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1"
            title="View full fleet list"
          >
            <span>All Fleet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* View All Modal */}
      <AnimatePresence>
        {showAllModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-200 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center">
                    <Ambulance className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      All Ambulances in Guntur EMS Network
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Trauma centers, ICU mobile units, and active dispatch units
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllModal(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {ambulanceItems.map((amb) => (
                  <div
                    key={amb.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">
                          {amb.id}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          {amb.triage}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            amb.isBooked
                              ? 'bg-rose-950 text-rose-400'
                              : 'bg-emerald-950 text-emerald-400'
                          }`}
                        >
                          {amb.isBooked ? 'BUSY' : 'STANDBY'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {amb.hospitalName} • 👨‍✈️ {amb.driverName}
                      </p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-rose-400 font-bold">{amb.eta}</span>
                      <p className="text-[10px] text-slate-500">{amb.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NearbyTransit;

