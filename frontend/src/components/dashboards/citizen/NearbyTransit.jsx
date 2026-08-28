import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus,
  Ambulance,
  Radio,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Sparkles,
  AlertCircle,
  X,
  Navigation
} from 'lucide-react';

const initialTransitList = [
  {
    id: 'bus-21a',
    type: 'bus',
    routeNumber: '21A',
    routeName: 'Guntur Bus Stand → Amaravati High-Speed',
    driverName: 'K. Srinivasa Rao',
    driverPhone: '+91 98480 11221',
    eta: '3 min',
    distance: '400m away',
    occupancyPercent: 72,
    occupancyStatus: 'Moderate',
    occupancyColor: 'bg-emerald-500',
    occupancyTextColor: 'text-emerald-400',
    nextStop: 'Naaz Centre Crossing',
    fare: '₹25',
    ac: true,
  },
  {
    id: 'bus-09b',
    type: 'bus',
    routeNumber: '09B',
    routeName: 'Brodipet 4/1 → Mangalagiri Capital Hub',
    driverName: 'M. Ramanjaneyulu',
    driverPhone: '+91 98480 22332',
    eta: '5 min',
    distance: '800m away',
    occupancyPercent: 92,
    occupancyStatus: 'Crowded',
    occupancyColor: 'bg-rose-500',
    occupancyTextColor: 'text-rose-400',
    nextStop: 'Old Bus Stand Junction',
    fare: '₹20',
    ac: false,
  },
  {
    id: 'bus-17c',
    type: 'bus',
    routeNumber: '17C',
    routeName: 'Pattabhipuram → Railway Station Loop',
    driverName: 'P. Venkat Reddy',
    driverPhone: '+91 98480 33443',
    eta: '6 min',
    distance: '1.2 km away',
    occupancyPercent: 48,
    occupancyStatus: 'Seats Available',
    occupancyColor: 'bg-blue-500',
    occupancyTextColor: 'text-blue-400',
    nextStop: 'Medical College Gate',
    fare: '₹15',
    ac: true,
  },
  {
    id: 'amb-101',
    type: 'ambulance',
    routeNumber: 'AMB-101',
    routeName: 'Emergency Critical Response Transport',
    driverName: 'Ramesh Kumar',
    driverPhone: '+91 98765 43220',
    eta: '3 min',
    distance: '1.2 km away',
    occupancyPercent: 100,
    occupancyStatus: 'CODE RED PRIORITY',
    occupancyColor: 'bg-rose-600 animate-pulse',
    occupancyTextColor: 'text-rose-400',
    nextStop: 'Ala Hospital Green Corridor',
    fare: 'Emergency Tier',
    ac: true,
  },
  {
    id: 'traffic-sig-04',
    type: 'traffic',
    routeNumber: 'SIG-04',
    routeName: 'Brodipet Main Crossing',
    eta: '18s green',
    distance: '350m ahead',
    occupancyPercent: 65,
    occupancyStatus: 'Smooth Flow',
    occupancyColor: 'bg-emerald-500',
    occupancyTextColor: 'text-emerald-400',
    nextStop: 'Preempted Wave',
    fare: 'Normal',
    ac: false,
  },
];

export const NearbyTransit = ({ onSelectTransitItem, selectedItem }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAllModal, setShowAllModal] = useState(false);

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'buses', label: 'Buses' },
    { id: 'ambulances', label: 'Ambulances' },
    { id: 'traffic', label: 'Traffic' },
  ];

  const filteredItems = initialTransitList.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'buses') return item.type === 'bus';
    if (activeFilter === 'ambulances') return item.type === 'ambulance';
    if (activeFilter === 'traffic') return item.type === 'traffic';
    return true;
  });

  return (
    <div className="w-full h-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Nearby You
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[11px] text-slate-400">
              Live arrival times & bus occupancy
            </p>
          </div>

          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
            Radius: 2.0 km
          </span>
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
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Transit Cards List */}
        <div className="space-y-2.5 mt-2.5 max-h-[calc(100vh-340px)] overflow-y-auto pr-0.5 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => {
              const isBus = item.type === 'bus';
              const isAmb = item.type === 'ambulance';
              const isSelected = selectedItem?.id === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  onClick={() => onSelectTransitItem && onSelectTransitItem(item)}
                  className={`group relative p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-500/50 shadow-lg'
                      : isAmb
                      ? 'bg-rose-950/30 border-rose-800/50 hover:border-rose-600/60'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isAmb
                            ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                            : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {isAmb ? (
                          <Ambulance className="w-3.5 h-3.5 animate-pulse" />
                        ) : (
                          <Bus className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-white">
                            {item.routeNumber}
                          </span>
                          {item.ac && (
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-cyan-950 text-cyan-400 rounded border border-cyan-800">
                              AC
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ETA Badge */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-blue-400 font-mono flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.eta}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.distance}
                      </div>
                    </div>
                  </div>

                  {/* Route Subtitle */}
                  <div className="text-[11px] text-slate-300 font-medium truncate mt-1.5">
                    {item.routeName}
                  </div>

                  {/* Driver In-Charge & Direct Contact */}
                  {item.driverName && (
                    <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800">
                      <span className="text-slate-300 truncate max-w-[130px]">👨‍✈️ {item.driverName}</span>
                      <a
                        href={`tel:${item.driverPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-bold flex-shrink-0"
                      >
                        <span>📞 {item.driverPhone}</span>
                      </a>
                    </div>
                  )}

                  {/* Occupancy Progress Bar */}
                  <div className="mt-2 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span>Crowd Index:</span>
                      </span>
                      <span className={`font-semibold font-mono ${item.occupancyTextColor}`}>
                        {item.occupancyPercent}% ({item.occupancyStatus})
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.occupancyPercent}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`h-full rounded-full ${item.occupancyColor}`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-slate-800 mt-3">
        <button
          type="button"
          onClick={() => setShowAllModal(true)}
          className="w-full py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-blue-400 hover:text-blue-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>View All Nearby Transit</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
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
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span>All Active Transit in Guntur Metropolitan Net</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAllModal(false)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {initialTransitList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-white text-sm">{item.routeNumber}</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">{item.routeName}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-blue-400 font-bold">{item.eta}</span>
                      <p className="text-[10px] text-slate-500">{item.distance}</p>
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
