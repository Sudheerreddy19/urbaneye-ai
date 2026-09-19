import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  LocateFixed,
  Flame,
  Layers,
  Sparkles,
  Pause,
  Play,
  Maximize2,
  Minimize2,
  Navigation,
  Compass
} from 'lucide-react';
import { useTransitStore, type LiveBus, type RouteData, type TransitStop } from '../../store/transitStore';
import { useBusTracking } from '../../hooks/useBusTracking';
import { BusStatusCard } from './BusStatusCard';

// Smooth Map Bounds & Center Controller
const MapBoundsController: React.FC<{ activeRoute: RouteData | null; centerCoords: [number, number] }> = ({
  activeRoute,
  centerCoords,
}) => {
  const map = useMap();

  useEffect(() => {
    if (activeRoute && activeRoute.polyline && activeRoute.polyline.length > 0) {
      try {
        const bounds = L.latLngBounds(activeRoute.polyline);
        map.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 16,
          animate: true,
          duration: 1.2,
        });
      } catch (err) {
        // Fallback
      }
    } else if (centerCoords) {
      map.flyTo(centerCoords, 14, { duration: 1 });
    }
  }, [activeRoute, centerCoords, map]);

  return null;
};

// Create High-Contrast Animated Live Bus Marker with Bearing Rotation & Radar Pulse
export const createLiveBusMarker = (bus: LiveBus, isSelected: boolean = false) => {
  const occupancy = bus.seatOccupancy ?? 50;
  const isFull = occupancy >= 85;
  const isModerate = occupancy >= 50 && occupancy < 85;

  const occupancyColor = isFull ? '#EF4444' : isModerate ? '#F59E0B' : '#10B981';
  const heading = bus.heading || 0;

  return L.divIcon({
    className: 'custom-live-bus-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer select-none group transition-transform duration-300 ${
        isSelected ? 'scale-125 z-50' : 'hover:scale-115'
      }">
        <!-- Top Floating Status Pill -->
        <div class="mb-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/95 border border-blue-500/80 shadow-2xl font-mono text-[9px] font-bold text-white whitespace-nowrap backdrop-blur-md">
          <span class="w-1.5 h-1.5 rounded-full animate-ping" style="background-color: ${occupancyColor};"></span>
          <span>${bus.routeNumber}</span>
          <span class="text-slate-400">|</span>
          <span style="color: ${occupancyColor};">${occupancy}%</span>
          <span class="text-slate-400 text-[8px]">${bus.speedKmph || 30}k</span>
        </div>

        <!-- 3D Glass Vehicle Hub with Direction Bearing Arrow -->
        <div class="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-900/90 border-2 ${
          isSelected ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]' : 'border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
        } backdrop-blur-md transition-all duration-300">
          
          <!-- Direction Compass Arrow -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-500 ease-out" style="transform: rotate(${heading}deg);">
            <div class="w-2 h-2 border-t-2 border-r-2 border-cyan-300 transform -rotate-45 translate-y-[-14px]"></div>
          </div>

          <!-- Bus Emoji / Icon -->
          <span class="text-2xl leading-none transform transition-transform group-hover:scale-110">🚌</span>

          <!-- Radar Pulse Wave Ring -->
          <div class="absolute -inset-1 rounded-2xl border border-blue-400/40 animate-ping pointer-events-none opacity-60"></div>
        </div>
      </div>
    `,
    iconSize: [52, 60],
    iconAnchor: [26, 30],
  });
};

// Create Origin Marker Pin
export const createOriginPin = (label: string = 'Origin') => {
  return L.divIcon({
    className: 'custom-origin-pin',
    html: `
      <div class="relative flex flex-col items-center select-none group cursor-pointer">
        <div class="mb-1 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500 text-emerald-300 font-mono text-[9px] font-bold shadow-lg whitespace-nowrap">
          📍 ${label}
        </div>
        <div class="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.7)] backdrop-blur-md">
          <div class="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 40],
  });
};

// Create Destination Marker Pin
export const createDestinationPin = (label: string = 'Destination') => {
  return L.divIcon({
    className: 'custom-dest-pin',
    html: `
      <div class="relative flex flex-col items-center select-none group cursor-pointer">
        <div class="mb-1 px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-500 text-rose-300 font-mono text-[9px] font-bold shadow-lg whitespace-nowrap">
          🏁 ${label}
        </div>
        <div class="w-8 h-8 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.7)] backdrop-blur-md">
          <div class="w-3.5 h-3.5 rounded-full bg-rose-500 animate-bounce"></div>
        </div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 40],
  });
};

// Create Clickable Intermediate Transit Stop Marker
export const createStopMarker = (seq: number, name: string, isPassed: boolean = false) => {
  return L.divIcon({
    className: 'custom-stop-marker',
    html: `
      <div class="relative flex flex-col items-center select-none group cursor-pointer">
        <div class="w-5 h-5 rounded-full ${
          isPassed
            ? 'bg-slate-800 border border-slate-600 text-slate-400'
            : 'bg-blue-600 border-2 border-white text-white shadow-[0_0_10px_rgba(59,130,246,0.8)]'
        } flex items-center justify-center font-mono text-[10px] font-bold group-hover:scale-125 transition-transform">
          ${seq}
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface BusMapProps {
  centerCoordinates?: [number, number];
  zoomLevel?: number;
  className?: string;
  onBusSelect?: (bus: LiveBus) => void;
}

export const BusMap: React.FC<BusMapProps> = ({
  centerCoordinates = [16.3067, 80.4365],
  zoomLevel = 14,
  className = '',
  onBusSelect,
}) => {
  const { activeRoute, selectedBus, setSelectedBus, isBusDrawerOpen, setBusDrawerOpen } = useTransitStore();
  const { buses, inspectBus, telemetryMode } = useBusTracking();
  const [mapReady, setMapReady] = useState(false);
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(centerCoordinates);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleBusClick = (bus: LiveBus) => {
    inspectBus(bus);
    if (onBusSelect) onBusSelect(bus);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCenter([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          setCurrentCenter([16.3067, 80.4365]);
        }
      );
    } else {
      setCurrentCenter([16.3067, 80.4365]);
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[440px] rounded-3xl overflow-hidden bg-[#0B0F19] border border-slate-800/90 shadow-2xl flex flex-col ${className}`}>
      {/* Top Floating Telemetry & Mode Indicator */}
      <div className="absolute top-3.5 left-3.5 z-[1000] pointer-events-none flex flex-wrap items-center gap-2">
        <div className="pointer-events-auto px-3 py-1.5 rounded-full bg-slate-950/90 border border-blue-500/50 text-blue-300 text-xs font-mono font-bold flex items-center gap-2 shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>URBAN TRANSIT TELEMETRY</span>
        </div>

        <div className="pointer-events-auto px-2.5 py-1 rounded-full bg-slate-950/90 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>{buses.length} Active Fleet Vehicles</span>
        </div>

        {activeRoute && (
          <div className="pointer-events-auto px-2.5 py-1 rounded-full bg-indigo-950/90 border border-indigo-500/50 text-indigo-300 text-[11px] font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-md">
            <span>🛣️ {activeRoute.distanceKm} km ({activeRoute.durationMins}m trip)</span>
          </div>
        )}
      </div>

      {/* Floating Map Controls (Right Side) */}
      <div className="absolute top-3.5 right-3.5 z-[1000] flex flex-col gap-2">
        {/* GPS Locate Me */}
        <button
          type="button"
          onClick={handleLocateMe}
          className="p-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-blue-400 hover:text-blue-300 shadow-xl backdrop-blur-md transition cursor-pointer"
          title="Center on my location"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        {/* Traffic Layer Toggle */}
        <button
          type="button"
          onClick={() => setShowTrafficLayer(!showTrafficLayer)}
          className={`p-2.5 rounded-2xl border shadow-xl backdrop-blur-md transition cursor-pointer ${
            showTrafficLayer
              ? 'bg-amber-600/30 border-amber-500/60 text-amber-300'
              : 'bg-slate-950/90 border-slate-700/80 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Traffic Density Layer"
        >
          <Flame className="w-4 h-4" />
        </button>
      </div>

      {/* Main React-Leaflet Map Canvas */}
      <div className="flex-1 w-full h-full relative min-h-[440px]">
        {mapReady && (
          <MapContainer
            center={currentCenter}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            style={{ height: '100%', width: '100%', background: '#0B0F19' }}
          >
            <MapBoundsController activeRoute={activeRoute} centerCoords={currentCenter} />

            {/* Dark inverted OpenStreetMap Tiles */}
            <TileLayer
              className="dark-map-tiles"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* Dynamic Road-Following Polyline from OSRM */}
            {activeRoute && activeRoute.polyline && (
              <>
                {/* Ambient Route Glow */}
                <Polyline
                  positions={activeRoute.polyline}
                  pathOptions={{
                    color: '#3B82F6',
                    weight: 10,
                    opacity: 0.35,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
                {/* Core Sharp Polyline */}
                <Polyline
                  positions={activeRoute.polyline}
                  pathOptions={{
                    color: '#60A5FA',
                    weight: 5,
                    opacity: 0.95,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />

                {/* Intermediate Stops along the Route */}
                {activeRoute.stops?.map((stop, idx) => (
                  <Marker
                    key={`stop-${stop.id || idx}`}
                    position={stop.coordinates}
                    icon={createStopMarker(idx + 1, stop.name, stop.isPassed)}
                  >
                    <Popup className="custom-leaflet-popup">
                      <div className="p-2 text-slate-100 font-sans space-y-1 min-w-[170px]">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-blue-400 font-mono">Stop #{idx + 1}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {stop.isPassed ? 'Passed' : 'Upcoming'}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-white">{stop.name}</div>
                        <div className="text-[10px] font-mono text-emerald-400 flex justify-between pt-1 border-t border-slate-800">
                          <span>Scheduled: {stop.scheduledArrival || 'On Time'}</span>
                          <span>Est: {stop.estimatedArrival || 'On Time'}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Origin Pin */}
                {activeRoute.fromCoords && (
                  <Marker position={activeRoute.fromCoords} icon={createOriginPin(activeRoute.fromName || 'Origin')}>
                    <Popup className="custom-leaflet-popup">
                      <div className="p-1.5 text-slate-100 font-sans">
                        <div className="font-bold text-xs text-emerald-400">📍 Trip Origin</div>
                        <div className="text-xs font-medium text-white">{activeRoute.fromName}</div>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Destination Pin */}
                {activeRoute.toCoords && (
                  <Marker position={activeRoute.toCoords} icon={createDestinationPin(activeRoute.toName || 'Destination')}>
                    <Popup className="custom-leaflet-popup">
                      <div className="p-2 text-slate-100 font-sans space-y-1 min-w-[190px]">
                        <div className="font-bold text-xs text-rose-400">🏁 Trip Destination</div>
                        <div className="text-xs font-bold text-white">{activeRoute.toName}</div>
                        <div className="text-[10px] font-mono text-emerald-400 bg-slate-950 p-1 rounded border border-slate-800 flex justify-between">
                          <span>Distance: {activeRoute.distanceKm} km</span>
                          <span>ETA: {activeRoute.durationMins} mins</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </>
            )}

            {/* Live Animated Bus Markers with Heading & Speed */}
            {buses.map((bus) => {
              const isSelected = selectedBus?.id === bus.id || selectedBus?.busNumber === bus.busNumber;

              return (
                <Marker
                  key={`bus-${bus.id || bus.busNumber}`}
                  position={bus.currentCoordinates}
                  icon={createLiveBusMarker(bus, isSelected)}
                  eventHandlers={{
                    click: () => handleBusClick(bus),
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2.5 text-slate-100 font-sans space-y-2 min-w-[220px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-400 font-mono">
                          Bus {bus.routeNumber} ({bus.registrationNumber || bus.busNumber})
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {bus.status || 'Active'}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200">{bus.routeName}</div>
                      <div className="text-[10px] font-mono text-slate-300 flex justify-between">
                        <span>Occupancy: <b className="text-blue-300">{bus.seatOccupancy}%</b></span>
                        <span>Speed: <b>{bus.speedKmph} km/h</b></span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Next Stop: <b className="text-white">{bus.nextStop}</b>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBusClick(bus)}
                        className="w-full mt-1 py-1 px-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 text-[11px] font-mono font-bold transition cursor-pointer text-center"
                      >
                        Inspect Live Status & Occupancy →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* Floating Bottom Drawer for Selected Bus */}
      {isBusDrawerOpen && selectedBus && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[1050]">
          <BusStatusCard onClose={() => setBusDrawerOpen(false)} />
        </div>
      )}
    </div>
  );
};
