import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import {
  Flame,
  Radio,
  Eye,
  ShieldAlert,
  Maximize2,
  Pause,
  Play
} from 'lucide-react';
import {
  createBusMarker,
  createAmbulanceMarker,
  createHazardMarker,
  createSignalMarker,
  createHospitalMarker,
  createPoliceCarMarker
} from '../../shared/MapMarkers';
import RoadRoute from '../../shared/RoadRoute';
import { useUrbanData } from '../../../context/UrbanDataContext';
import { useSmoothVehicleLerp } from '../../../hooks/useSmoothVehicleLerp';

export const TacticalMap = ({
  buses = [],
  ambulances = [],
  trafficSignals = [],
  selectedAmbulanceId = 'AMB-108-GNT-01',
  centerCoordinates = [16.3067, 80.4365]
}) => {
  const { data } = useUrbanData();
  const [mapReady, setMapReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [layers, setLayers] = useState({
    buses: true,
    ambulances: true,
    patrols: true,
    signals: true,
    traffic: true,
    corridor: true,
    hazards: true,
  });

  const rawBuses = buses.length > 0 ? buses : (data?.buses || []);
  const rawAmbulances = ambulances.length > 0 ? ambulances : (data?.ambulances || []);
  const rawPatrols = data?.policePatrols || [];
  const liveSignals = trafficSignals.length > 0 ? trafficSignals : (data?.trafficSignals || []);
  const trafficSegments = data?.trafficSegments || [];
  const incidents = data?.incidents || [];

  // Smooth Lerp Interpolation for Police Tactical Map
  const smoothBuses = useSmoothVehicleLerp(rawBuses, isPaused, 50);
  const smoothAmbulances = useSmoothVehicleLerp(rawAmbulances, isPaused, 50);
  const smoothPatrols = useSmoothVehicleLerp(rawPatrols, isPaused, 50);

  useEffect(() => {
    setMapReady(true);
  }, []);

  // Green Corridor Waypoints for natural road routing
  const greenCorridorWaypoints = [
    [16.3098, 80.4372], // AMB 01 Start
    [16.3082, 80.4412], // Market Road crossing
    [16.3067, 80.4365], // Brodipet 4/1 Junction
    [16.3125, 80.4348], // Ala Hospital
  ];

  return (
    <div className="relative w-full h-full min-h-[420px] bg-slate-900/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl flex flex-col">
      {/* Top Map HUD Strip */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none gap-2 flex-wrap">
        {/* Active Preemption Indicator */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>TACTICAL MESH • 3D ASSETS ACTIVE</span>
          </div>

          {isPaused && (
            <div className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
              <Pause className="w-3 h-3" />
              <span>Paused</span>
            </div>
          )}
        </div>

        {/* Layer Toggles & Pause Control */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs font-mono backdrop-blur-md shadow-lg flex-wrap">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`px-2 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${
              isPaused ? 'bg-amber-600/40 text-amber-300 border border-amber-500/50' : 'text-slate-400 hover:text-slate-200'
            }`}
            title={isPaused ? "Resume Vehicles" : "Pause Vehicles"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setLayers({ ...layers, traffic: !layers.traffic })}
            className={`px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              layers.traffic ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span className="hidden sm:inline">Traffic</span>
          </button>

          <button
            type="button"
            onClick={() => setLayers({ ...layers, buses: !layers.buses })}
            className={`px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              layers.buses ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🚌</span>
            <span className="hidden sm:inline">Buses</span>
          </button>

          <button
            type="button"
            onClick={() => setLayers({ ...layers, ambulances: !layers.ambulances })}
            className={`px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              layers.ambulances ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🚑</span>
            <span className="hidden sm:inline">EMS</span>
          </button>

          <button
            type="button"
            onClick={() => setLayers({ ...layers, patrols: !layers.patrols })}
            className={`px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              layers.patrols ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🚓</span>
            <span className="hidden sm:inline">Patrol</span>
          </button>

          <button
            type="button"
            onClick={() => setLayers({ ...layers, signals: !layers.signals })}
            className={`px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              layers.signals ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🚦</span>
            <span className="hidden sm:inline">Signals</span>
          </button>

          <button
            type="button"
            onClick={() => setLayers({ ...layers, hazards: !layers.hazards })}
            className={`px-2.5 py-1 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              layers.hazards ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🚧</span>
            <span className="hidden sm:inline">Hazards</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="flex-1 w-full h-full min-h-[380px] relative overflow-hidden">
        {mapReady && (
          <MapContainer
            center={centerCoordinates}
            zoom={14}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            style={{ height: '100%', width: '100%', minHeight: '380px', background: '#0B0F19' }}
          >
            {/* Free OpenStreetMap Tiles with CSS dark-invert filter */}
            <TileLayer
              className="dark-map-tiles"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* 2. Color-Coded Natural Street Grid Traffic Polylines */}
            {layers.traffic &&
              trafficSegments.map((segment) => {
                const color =
                  segment.congestionLevel === 'heavy'
                    ? '#EF4444' // Red
                    : segment.congestionLevel === 'moderate'
                    ? '#F59E0B' // Yellow
                    : '#10B981'; // Green

                return (
                  <React.Fragment key={segment.id}>
                    <Polyline
                      positions={segment.coordinates}
                      pathOptions={{
                        color: color,
                        weight: 8,
                        opacity: 0.3,
                      }}
                    />
                    <Polyline
                      positions={segment.coordinates}
                      pathOptions={{
                        color: color,
                        weight: 4.5,
                        opacity: 0.95,
                      }}
                    >
                      <Popup className="custom-leaflet-popup">
                        <div className="p-1 text-slate-100 font-sans">
                          <div className="font-bold text-xs" style={{ color: color }}>
                            {segment.name}
                          </div>
                          <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                            Density: <b className="capitalize">{segment.congestionLevel}</b> ({segment.speedKmph} km/h)
                          </div>
                        </div>
                      </Popup>
                    </Polyline>
                  </React.Fragment>
                );
              })}

            {/* 3. Green Corridor Natural Road Routing */}
            {layers.corridor && (
              <RoadRoute
                waypoints={greenCorridorWaypoints}
                color="#10B981"
                weight={6}
                opacity={1}
              />
            )}

            {/* 3D Hospital Marker (🏥) */}
            <Marker position={[16.3125, 80.4348]} icon={createHospitalMarker('ALA TRAUMA HUB')}>
              <Popup className="custom-leaflet-popup">
                <div className="p-1 text-slate-100 font-sans">
                  <div className="font-bold text-xs text-rose-400">Ala Super Speciality Hospital</div>
                  <div className="text-[11px] text-slate-300">Apex Emergency Receiver Node</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1">● Trauma Bay Clear</div>
                </div>
              </Popup>
            </Marker>

            {/* 3D Live Smooth Moving Buses (🚌) with Pause on Hover/Click */}
            {layers.buses &&
              smoothBuses.map((bus) => (
                <Marker
                  key={bus.id}
                  position={bus.currentCoordinates}
                  icon={createBusMarker(bus.routeNumber, bus.seatOccupancy)}
                  eventHandlers={{
                    mouseover: () => setIsPaused(true),
                    mouseout: () => setIsPaused(false),
                    click: () => setIsPaused(true),
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 text-slate-100 font-sans space-y-1.5 min-w-[210px]">
                      <div className="font-bold text-xs text-blue-400 font-mono">
                        {bus.id} ({bus.routeNumber || 'Transit'})
                      </div>
                      <div className="text-[11px] font-semibold text-slate-200">{bus.routeName}</div>

                      {/* Driver & Contact */}
                      <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-0.5">
                        <div className="text-slate-400 text-[10px]">Driver: <b className="text-white">{bus.driverName || 'K. Srinivasa Rao'}</b></div>
                        <a href={`tel:${bus.driverPhone || '+919848011221'}`} className="text-emerald-400 hover:underline flex items-center justify-between">
                          <span>📞 {bus.driverPhone || '+91 98480 11221'}</span>
                          <span className="text-[9px] bg-emerald-600/30 px-1 rounded">CALL</span>
                        </a>
                      </div>

                      <div className="text-[10px] text-slate-300 flex justify-between font-mono">
                        <span>Speed: <b>{bus.speedKmph} km/h</b></span>
                        <span>Occupancy: <b>{bus.seatOccupancy}%</b></span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* 3D Live Smooth Moving Ambulances (🚑) with Pause on Hover/Click */}
            {layers.ambulances &&
              smoothAmbulances.map((amb) => (
                <Marker
                  key={amb.id}
                  position={amb.currentCoordinates}
                  icon={createAmbulanceMarker('108', amb.eta, amb.isBooked)}
                  eventHandlers={{
                    mouseover: () => setIsPaused(true),
                    mouseout: () => setIsPaused(false),
                    click: () => setIsPaused(true),
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 text-slate-100 font-sans space-y-2 min-w-[220px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-rose-400 font-mono">{amb.id} (TACTICAL)</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                          {amb.triage || 'ALS'}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-200">{amb.patientSummary}</div>
                      <div className="text-[10px] text-slate-300">Destination: <b>{amb.destination}</b></div>

                      {/* Driver & Contact */}
                      <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 space-y-1">
                        <div className="text-[10px] text-slate-400">Driver: <b className="text-white">{amb.driverName || 'Ramesh Kumar'}</b></div>
                        <a
                          href={`tel:${amb.driverPhone || '+919876543220'}`}
                          className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center justify-between pt-0.5 border-t border-slate-800"
                        >
                          <span>📞 {amb.driverPhone || '+91 98765 43220'}</span>
                          <span className="text-[9px] bg-emerald-600/30 text-emerald-300 px-1 rounded">COMMS</span>
                        </a>
                      </div>

                      <div className="text-[10px] font-mono text-emerald-400 font-bold">
                        Preempted Nodes: {amb.preemptedSignalNodes?.join(', ') || 'Direct Override'}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* 3D Live Smooth Moving Police Patrol Units (🚓) with Pause on Hover/Click */}
            {layers.patrols &&
              smoothPatrols.map((patrol) => (
                <Marker
                  key={patrol.id}
                  position={patrol.currentCoordinates}
                  icon={createPoliceCarMarker(patrol.callsign)}
                  eventHandlers={{
                    mouseover: () => setIsPaused(true),
                    mouseout: () => setIsPaused(false),
                    click: () => setIsPaused(true),
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 text-slate-100 font-sans space-y-1.5 min-w-[210px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-400 font-mono">{patrol.callsign}</span>
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                          {patrol.status || 'Active'}
                        </span>
                      </div>

                      {/* Officer & Contact */}
                      <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-0.5">
                        <div className="text-slate-400 text-[10px]">Officer: <b className="text-white">{patrol.officer || 'Sub-Inspector K. Ramesh'}</b></div>
                        <a href={`tel:${patrol.officerPhone || '+919876543211'}`} className="text-emerald-400 hover:underline flex items-center justify-between">
                          <span>📞 {patrol.officerPhone || '+91 98765 43211'}</span>
                          <span className="text-[9px] bg-emerald-600/30 px-1 rounded">CALL</span>
                        </a>
                      </div>

                      <div className="text-[10px] text-slate-300 flex justify-between font-mono">
                        <span>Speed: <b>{patrol.speedKmph} km/h</b></span>
                        <span className="text-slate-400 truncate max-w-[100px]">{patrol.station || 'Precinct 1'}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* 3D Traffic Signals (🚦) */}
            {layers.signals &&
              liveSignals.map((sig) => (
                <Marker
                  key={sig.id}
                  position={sig.coordinates}
                  icon={createSignalMarker(sig.currentState, sig.countdown)}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 text-slate-100 font-sans">
                      <div className="font-bold text-xs font-mono text-emerald-400">{sig.id}</div>
                      <div className="text-[11px] font-semibold text-slate-200">{sig.intersectionName}</div>
                      <div className="text-[10px] text-slate-300 mt-0.5">
                        State: <b>{sig.currentState}</b> ({sig.countdown}s remaining)
                      </div>
                      <div className="text-[10px] font-mono text-purple-400 mt-1">Phase: {sig.phase}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* 4. Global Road Hazards (🚧 / 💥) */}
            {layers.hazards &&
              incidents.map((incident) => (
                <Marker
                  key={incident.id}
                  position={incident.coordinates}
                  icon={createHazardMarker(incident.type, incident.type === 'Accident' ? 'ACCIDENT' : 'ROAD HAZARD')}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 text-slate-100 font-sans space-y-1 min-w-[200px]">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-xs font-mono text-amber-400">{incident.id}</div>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                          incident.severity === 'Critical'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : incident.severity === 'High'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {incident.severity}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-white">{incident.title}</div>
                      <div className="text-[11px] text-slate-300">{incident.location}</div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800">
                        <span>Reported: {incident.reportedAt}</span>
                        <span className="text-emerald-400">{incident.status}</span>
                      </div>
                      {incident.impact && (
                        <div className="text-[10px] text-slate-300 italic bg-slate-950/80 p-1.5 rounded border border-slate-800 mt-1">
                          {incident.impact}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        )}
      </div>

      {/* Bottom Map Legend */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🚌</span>
            <span>Transit Bus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🚑</span>
            <span>EMS Ambulance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🚓</span>
            <span>Police Patrol</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🚦</span>
            <span>Signal Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🚧</span>
            <span>Road Hazard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1.5 bg-emerald-400 rounded-full inline-block shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-emerald-400 font-semibold">Green Corridor</span>
          </div>
        </div>

        <div className="text-emerald-400 font-medium">
          AP Police Tactical Mesh Online
        </div>
      </div>
    </div>
  );
};

export default TacticalMap;
