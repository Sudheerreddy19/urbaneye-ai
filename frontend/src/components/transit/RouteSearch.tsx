import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  ArrowUpDown,
  Compass,
  Bus,
  Clock,
  Sparkles,
  Loader2,
  X,
  AlertCircle
} from 'lucide-react';
import { useTransitStore, type RouteData, type TransitStop } from '../../store/transitStore';
import {
  searchTransitLocations,
  reverseGeocodeLocation,
  fetchOSRMRoute,
  type GeocodingResult
} from '../../services/transitApi';

interface RouteSearchProps {
  onRouteCalculated?: (route: RouteData) => void;
  className?: string;
}

export const RouteSearch: React.FC<RouteSearchProps> = ({ onRouteCalculated, className = '' }) => {
  const {
    origin,
    destination,
    setOrigin,
    setDestination,
    setActiveRoute,
    isRoutingLoading,
    setIsRoutingLoading,
    transitError,
    setTransitError,
  } = useTransitStore();

  const [fromQuery, setFromQuery] = useState(origin?.name || '');
  const [toQuery, setToQuery] = useState(destination?.name || '');
  const [fromResults, setFromResults] = useState<GeocodingResult[]>([]);
  const [toResults, setToResults] = useState<GeocodingResult[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<'from' | 'to' | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [isSearchingStops, setIsSearchingStops] = useState(false);

  const debounceTimerRef = useRef<any>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // Sync input text when store changes externally
  useEffect(() => {
    if (origin?.name) setFromQuery(origin.name);
  }, [origin]);

  useEffect(() => {
    if (destination?.name) setToQuery(destination.name);
  }, [destination]);

  // Click outside to dismiss dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for Origin
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFromQuery(val);
    setActiveDropdown('from');
    clearTimeout(debounceTimerRef.current);

    if (val.trim().length < 2) {
      setFromResults([]);
      return;
    }

    setIsSearchingStops(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchTransitLocations(val);
        setFromResults(results);
      } catch (err) {
        // Handled silently
      } finally {
        setIsSearchingStops(false);
      }
    }, 300);
  };

  // Debounced search for Destination
  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setToQuery(val);
    setActiveDropdown('to');
    clearTimeout(debounceTimerRef.current);

    if (val.trim().length < 2) {
      setToResults([]);
      return;
    }

    setIsSearchingStops(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchTransitLocations(val);
        setToResults(results);
      } catch (err) {
        // Handled silently
      } finally {
        setIsSearchingStops(false);
      }
    }, 300);
  };

  // "Use My Current Location" button handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setTransitError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeolocating(true);
    setTransitError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const loc = await reverseGeocodeLocation(latitude, longitude);
          setOrigin({
            name: `${loc.name} (My Location)`,
            coordinates: [latitude, longitude],
            isUserLocation: true,
          });
          setFromQuery(`${loc.name} (My Location)`);
          setActiveDropdown(null);
        } catch (e) {
          // Fallback to coordinates
          setOrigin({
            name: `My GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            coordinates: [latitude, longitude],
            isUserLocation: true,
          });
        } finally {
          setIsGeolocating(false);
        }
      },
      (err) => {
        setIsGeolocating(false);
        // Default to Guntur Central if permission is denied
        setOrigin({
          name: 'Guntur Central (Brodipet)',
          coordinates: [16.3067, 80.4365],
          isUserLocation: true,
        });
        setFromQuery('Guntur Central (Brodipet)');
        setTransitError('Location permission denied. Defaulted to Guntur Central.');
        setTimeout(() => setTransitError(null), 4000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Swap From & To
  const handleSwapPoints = () => {
    const tempOrigin = origin;
    const tempDestination = destination;
    const tempFromQuery = fromQuery;
    const tempToQuery = toQuery;

    setOrigin(tempDestination ? { ...tempDestination, isUserLocation: false } : null);
    setDestination(tempOrigin ? { ...tempOrigin } : null);
    setFromQuery(tempToQuery);
    setToQuery(tempFromQuery);
  };

  // Calculate live road route whenever both origin and destination are valid
  const calculateRoute = async (
    start: { name: string; coordinates: [number, number] },
    end: { name: string; coordinates: [number, number] }
  ) => {
    setIsRoutingLoading(true);
    setTransitError(null);

    try {
      const osrmResult = await fetchOSRMRoute(start.coordinates, end.coordinates);

      // Synthesize realistic intermediate bus stops along the road polyline
      const intermediateStops: TransitStop[] = [];
      const poly = osrmResult.polyline;
      const stopCount = Math.min(5, Math.max(2, Math.floor(poly.length / 15)));

      intermediateStops.push({
        id: 'stop-start',
        name: start.name,
        coordinates: start.coordinates,
        sequence: 1,
        scheduledArrival: 'Now',
        estimatedArrival: 'On Time',
        isPassed: true,
      });

      for (let i = 1; i <= stopCount; i++) {
        const sampleIdx = Math.floor((poly.length / (stopCount + 1)) * i);
        const sampleCoords = poly[sampleIdx] || poly[0];
        const stepMins = Math.round((osrmResult.durationMins / (stopCount + 1)) * i);

        intermediateStops.push({
          id: `stop-${i}`,
          name: `Transit Stop ${i} (${stepMins}m)`,
          coordinates: sampleCoords,
          sequence: i + 1,
          scheduledArrival: `+${stepMins} min`,
          estimatedArrival: `+${stepMins + (i === 1 ? 0 : 1)} min`,
          isPassed: false,
        });
      }

      intermediateStops.push({
        id: 'stop-end',
        name: end.name,
        coordinates: end.coordinates,
        sequence: stopCount + 2,
        scheduledArrival: `+${osrmResult.durationMins} min`,
        estimatedArrival: `+${osrmResult.durationMins + 1} min`,
        isPassed: false,
      });

      const routeData: RouteData = {
        id: `ROUTE-${Date.now()}`,
        name: `${start.name} ➔ ${end.name}`,
        fromName: start.name,
        toName: end.name,
        fromCoords: start.coordinates,
        toCoords: end.coordinates,
        polyline: osrmResult.polyline,
        distanceKm: osrmResult.distanceKm,
        durationMins: osrmResult.durationMins,
        stops: intermediateStops,
        bounds: [
          [
            Math.min(start.coordinates[0], end.coordinates[0]) - 0.005,
            Math.min(start.coordinates[1], end.coordinates[1]) - 0.005,
          ],
          [
            Math.max(start.coordinates[0], end.coordinates[0]) + 0.005,
            Math.max(start.coordinates[1], end.coordinates[1]) + 0.005,
          ],
        ],
      };

      setActiveRoute(routeData);
      if (onRouteCalculated) {
        onRouteCalculated(routeData);
      }
    } catch (err: any) {
      setTransitError(err?.message || 'Failed to compute road navigation route.');
    } finally {
      setIsRoutingLoading(false);
    }
  };

  const handleSelectOrigin = (res: GeocodingResult) => {
    const newOrigin = { name: res.name, coordinates: [res.lat, res.lon] as [number, number] };
    setOrigin(newOrigin);
    setFromQuery(res.name);
    setActiveDropdown(null);

    if (destination) {
      calculateRoute(newOrigin, destination);
    }
  };

  const handleSelectDestination = (res: GeocodingResult) => {
    const newDest = { name: res.name, coordinates: [res.lat, res.lon] as [number, number] };
    setDestination(newDest);
    setToQuery(res.name);
    setActiveDropdown(null);

    if (origin) {
      calculateRoute(origin, newDest);
    }
  };

  // Popular transit presets for Guntur / Metro corridor
  const handleQuickPreset = (fromName: string, fromCoords: [number, number], toName: string, toCoords: [number, number]) => {
    const orig = { name: fromName, coordinates: fromCoords };
    const dest = { name: toName, coordinates: toCoords };
    setOrigin(orig);
    setDestination(dest);
    setFromQuery(fromName);
    setToQuery(toName);
    calculateRoute(orig, dest);
  };

  return (
    <div
      ref={dropdownContainerRef}
      className={`relative w-full rounded-2xl bg-slate-900/95 border border-slate-800/90 p-4 backdrop-blur-xl shadow-2xl ${className}`}
    >
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Bus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Live Route Navigator</h3>
            <p className="text-[11px] text-slate-400 font-medium">Dynamic Bus Stations & Stop Geosearch</p>
          </div>
        </div>

        {/* GPS Current Location Quick Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isGeolocating}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
          title="Detect Current GPS Location"
        >
          {isGeolocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
          )}
          <span className="hidden sm:inline">Use My Location</span>
        </button>
      </div>

      {/* Input Fields Container with Connector Line */}
      <div className="relative space-y-2.5">
        {/* Origin Search Field */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus-within:border-emerald-500/70 focus-within:ring-1 focus-within:ring-emerald-500/40 transition">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-950 flex-shrink-0" />
            <input
              type="text"
              value={fromQuery}
              onChange={handleFromChange}
              onFocus={() => {
                setActiveDropdown('from');
                if (!fromResults.length && fromQuery.length >= 2) {
                  searchTransitLocations(fromQuery).then(setFromResults);
                }
              }}
              placeholder="Search origin bus stop or terminal..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
            />
            {fromQuery && (
              <button
                type="button"
                onClick={() => {
                  setFromQuery('');
                  setOrigin(null);
                  setFromResults([]);
                }}
                className="text-slate-500 hover:text-slate-300 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown for Origin */}
          {activeDropdown === 'from' && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
              {isSearchingStops && (
                <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                  <span>Searching transit stops via Overpass API...</span>
                </div>
              )}
              {!isSearchingStops && fromResults.length === 0 && (
                <div className="p-3 text-center text-xs text-slate-500">
                  Type a bus stop name, station, or street
                </div>
              )}
              {fromResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectOrigin(item)}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-900 border-b border-slate-900/60 last:border-none flex items-start gap-2.5 group transition"
                >
                  <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{item.displayName}</div>
                  </div>
                  <span className="ml-auto text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 flex-shrink-0">
                    {item.type.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button (Floating between inputs) */}
        <div className="absolute right-3 top-[34px] z-10">
          <button
            type="button"
            onClick={handleSwapPoints}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-blue-600/30 border border-slate-700 text-slate-300 hover:text-blue-300 transition shadow-lg cursor-pointer"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Search Field */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus-within:border-rose-500/70 focus-within:ring-1 focus-within:ring-rose-500/40 transition">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-950 flex-shrink-0" />
            <input
              type="text"
              value={toQuery}
              onChange={handleToChange}
              onFocus={() => {
                setActiveDropdown('to');
                if (!toResults.length && toQuery.length >= 2) {
                  searchTransitLocations(toQuery).then(setToResults);
                }
              }}
              placeholder="Search destination bus stop or terminal..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
            />
            {toQuery && (
              <button
                type="button"
                onClick={() => {
                  setToQuery('');
                  setDestination(null);
                  setToResults([]);
                }}
                className="text-slate-500 hover:text-slate-300 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown for Destination */}
          {activeDropdown === 'to' && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
              {isSearchingStops && (
                <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                  <span>Searching transit stops via Overpass API...</span>
                </div>
              )}
              {!isSearchingStops && toResults.length === 0 && (
                <div className="p-3 text-center text-xs text-slate-500">
                  Type a destination stop name or hospital
                </div>
              )}
              {toResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectDestination(item)}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-900 border-b border-slate-900/60 last:border-none flex items-start gap-2.5 group transition"
                >
                  <MapPin className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{item.displayName}</div>
                  </div>
                  <span className="ml-auto text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 flex-shrink-0">
                    {item.type.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Routing status & Error display */}
      {isRoutingLoading && (
        <div className="mt-3 px-3 py-2 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Computing high-precision road polyline with OSRM...</span>
        </div>
      )}

      {transitError && (
        <div className="mt-3 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
          <span>{transitError}</span>
        </div>
      )}

      {/* Quick Terminal Presets */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Popular Bus Corridors</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() =>
              handleQuickPreset(
                'NTR Central Bus Station',
                [16.3015, 80.432],
                'Ala Hospital Terminal',
                [16.3125, 80.4348]
              )
            }
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-blue-900/30 border border-slate-800 hover:border-blue-500/40 text-[11px] text-slate-300 hover:text-white transition font-mono cursor-pointer"
          >
            RTC ➔ Ala Hospital
          </button>
          <button
            type="button"
            onClick={() =>
              handleQuickPreset(
                'Guntur Railway Junction',
                [16.2995, 80.4438],
                'Amaravati Seed Capital Hub',
                [16.3351, 80.4812]
              )
            }
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-blue-900/30 border border-slate-800 hover:border-blue-500/40 text-[11px] text-slate-300 hover:text-white transition font-mono cursor-pointer"
          >
            Rly Junc ➔ Amaravati
          </button>
          <button
            type="button"
            onClick={() =>
              handleQuickPreset(
                'Pattabhipuram Circle',
                [16.2974, 80.4491],
                'Lakshmipuram 4-Roads',
                [16.312, 80.442]
              )
            }
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-blue-900/30 border border-slate-800 hover:border-blue-500/40 text-[11px] text-slate-300 hover:text-white transition font-mono cursor-pointer"
          >
            Pattabhipuram ➔ Lakshmipuram
          </button>
        </div>
      </div>
    </div>
  );
};
