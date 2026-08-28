import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Car,
  Bus,
  Bike,
  Footprints,
  ArrowRight,
  Clock,
  Zap,
  Sparkles,
  Route,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import {
  resolveLocationCoords,
  calculateRoadDistanceKm,
  calculateMultimodalMetrics,
  generateRouteWaypoints,
  fetchRealRoadRoute,
  KNOWN_LANDMARKS,
} from '../../../utils/geoRouting';

const transportModes = [
  { id: 'car', label: 'Car', icon: Car },
  { id: 'bus', label: 'Bus', icon: Bus },
  { id: 'bike', label: 'Bike', icon: Bike },
  { id: 'walk', label: 'Walk', icon: Footprints },
];

export const JourneyPlanner = ({ onRouteCalculated }) => {
  const [fromLoc, setFromLoc] = useState('Guntur Bus Stand (Current)');
  const [toLoc, setToLoc] = useState('Vijayawada');
  const [selectedMode, setSelectedMode] = useState('bus');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedRoute, setCalculatedRoute] = useState(null);
  const [dynamicModeMetrics, setDynamicModeMetrics] = useState({});

  // Quick autocomplete suggestions list
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  // Compute live preview metrics for the selected points using OSRM + Nominatim
  const computeRoute = async (originText, destText, modeId) => {
    setIsCalculating(true);
    try {
      const [fromRes, toRes] = await Promise.all([
        resolveLocationCoords(originText),
        resolveLocationCoords(destText),
      ]);

      // Fetch real road route with turn-by-turn directions and real highway geometry
      const realRoute = await fetchRealRoadRoute(
        fromRes.coords,
        toRes.coords,
        fromRes.name,
        toRes.name,
        modeId
      );

      const distanceKm = realRoute?.distanceKm || calculateRoadDistanceKm(fromRes.coords, toRes.coords);
      const metrics = calculateMultimodalMetrics(distanceKm, modeId);

      // Compute metrics for all 4 modes
      const allModeMetrics = {};
      transportModes.forEach((m) => {
        allModeMetrics[m.id] = calculateMultimodalMetrics(distanceKm, m.id);
      });
      setDynamicModeMetrics(allModeMetrics);

      const activeM = transportModes.find((m) => m.id === modeId) || transportModes[1];

      const routeResult = {
        from: fromRes.name,
        to: toRes.name,
        fromCoords: fromRes.coords,
        toCoords: toRes.coords,
        waypoints: realRoute?.waypoints || generateRouteWaypoints(fromRes.coords, toRes.coords),
        mode: activeM.label,
        modeId,
        duration: realRoute?.duration || metrics.duration,
        durationMinutes: realRoute?.durationMinutes || metrics.durationMinutes,
        distance: realRoute?.distanceStr || metrics.distanceStr,
        distanceKm,
        estimatedCost: metrics.estimatedCost,
        trafficStatus: realRoute?.trafficStatus || (distanceKm > 20 ? 'Highway Express Corridor' : 'Moderate Flow (Green Wave)'),
        steps: realRoute?.steps || [
          `Depart from ${fromRes.name}`,
          distanceKm > 15
            ? `Take Amaravati Core Expressway / NH-16 towards ${toRes.name}`
            : `Follow main corridor towards ${toRes.name}`,
          `Arrive at ${toRes.name} (${metrics.distanceStr})`,
        ],
      };

      setCalculatedRoute(routeResult);
      if (onRouteCalculated) {
        onRouteCalculated(routeResult);
      }
    } catch (err) {
      console.warn('Route calculation notice:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Initial calculation on mount
  useEffect(() => {
    computeRoute(fromLoc, toLoc, selectedMode);
  }, []);

  const handleCalculateRoute = (e) => {
    e.preventDefault();
    setShowFromSuggestions(false);
    setShowToSuggestions(false);
    computeRoute(fromLoc, toLoc, selectedMode);
  };

  const handleModeChange = (modeId) => {
    setSelectedMode(modeId);
    if (calculatedRoute) {
      const distanceKm = calculatedRoute.distanceKm;
      const metrics = calculateMultimodalMetrics(distanceKm, modeId);
      const activeM = transportModes.find((m) => m.id === modeId) || transportModes[0];
      const updated = {
        ...calculatedRoute,
        mode: activeM.label,
        modeId,
        duration: metrics.duration,
        durationMinutes: metrics.durationMinutes,
        estimatedCost: metrics.estimatedCost,
      };
      setCalculatedRoute(updated);
      if (onRouteCalculated) onRouteCalculated(updated);
    } else {
      computeRoute(fromLoc, toLoc, modeId);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Route className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Plan Your Journey
            </h3>
            <p className="text-[11px] text-slate-400">
              AI multimodal route optimization
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
          Fastest Path
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleCalculateRoute} className="space-y-3 relative">
        {/* From Input */}
        <div className="space-y-1 relative">
          <label className="block text-[11px] font-mono text-slate-400">
            FROM (Origin)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              required
              value={fromLoc}
              onFocus={() => setShowFromSuggestions(true)}
              onChange={(e) => {
                setFromLoc(e.target.value);
                setShowFromSuggestions(true);
              }}
              placeholder="e.g. Guntur Bus Stand, Brodipet"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showFromSuggestions && (
            <div className="absolute top-14 left-0 right-0 z-50 bg-slate-950 border border-slate-700 rounded-xl p-1 shadow-2xl max-h-36 overflow-y-auto custom-scrollbar text-xs">
              {KNOWN_LANDMARKS.slice(0, 6).map((lm) => (
                <div
                  key={lm.name}
                  onClick={() => {
                    setFromLoc(lm.name);
                    setShowFromSuggestions(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 cursor-pointer flex items-center justify-between text-slate-300 text-[11px]"
                >
                  <span>{lm.name}</span>
                  <span className="text-[9px] font-mono text-slate-500">Guntur/AP</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* To Input */}
        <div className="space-y-1 relative">
          <label className="block text-[11px] font-mono text-slate-400">
            TO (Destination)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-rose-400">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              required
              value={toLoc}
              onFocus={() => setShowToSuggestions(true)}
              onChange={(e) => {
                setToLoc(e.target.value);
                setShowToSuggestions(true);
              }}
              placeholder="e.g. Vijayawada, Amaravati, Ala Hospital"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showToSuggestions && (
            <div className="absolute top-14 left-0 right-0 z-50 bg-slate-950 border border-slate-700 rounded-xl p-1 shadow-2xl max-h-36 overflow-y-auto custom-scrollbar text-xs">
              {[
                { name: 'Vijayawada City Junction', tag: '34 km' },
                { name: 'Amaravati Capital / Secretariat', tag: '28 km' },
                { name: 'Mangalagiri (AIIMS Hub)', tag: '21 km' },
                { name: 'Ala Super Speciality Hospital', tag: '1.2 km' },
                { name: 'Tenali Town Junction', tag: '26 km' },
                { name: 'Acharya Nagarjuna University (ANU)', tag: '12 km' },
              ].map((lm) => (
                <div
                  key={lm.name}
                  onClick={() => {
                    setToLoc(lm.name);
                    setShowToSuggestions(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-rose-600/20 hover:text-rose-300 cursor-pointer flex items-center justify-between text-slate-300 text-[11px]"
                >
                  <span>{lm.name}</span>
                  <span className="text-[9px] font-mono text-emerald-400">{lm.tag}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Multi-modal Selector Row */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {transportModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            const preview = dynamicModeMetrics[mode.id];

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeChange(mode.id)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/40'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] font-semibold">{mode.label}</span>
                <span className="text-[9px] font-mono opacity-80">
                  {preview ? preview.duration : '...'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isCalculating}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
        >
          {isCalculating ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Find Best Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Calculated Route Preview Card */}
      <AnimatePresence>
        {calculatedRoute && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-2xl bg-blue-950/40 border border-blue-800/40 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between font-mono">
              <span className="text-blue-300 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" />
                <span>{calculatedRoute.duration}</span>
              </span>
              <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                {calculatedRoute.distance}
              </span>
              <span className="text-emerald-400 font-bold">{calculatedRoute.estimatedCost}</span>
            </div>

            <div className="text-[11px] text-slate-300 font-medium flex items-center justify-between">
              <span>Status: <span className="text-emerald-400">{calculatedRoute.trafficStatus}</span></span>
              <span className="text-[10px] font-mono text-blue-300">Live on Map</span>
            </div>

            <div className="space-y-1 pt-1.5 border-t border-blue-900/50 text-[10px] text-slate-300 font-mono">
              {calculatedRoute.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span className="truncate">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JourneyPlanner;
