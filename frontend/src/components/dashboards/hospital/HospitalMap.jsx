import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import {
  Radio,
  Navigation,
  Flame,
  Pause,
  Play
} from 'lucide-react';
import {
  createAmbulanceMarker,
  createHospitalMarker,
  createHazardMarker
} from '../../shared/MapMarkers';
import RoadRoute from '../../shared/RoadRoute';
import { useUrbanData } from '../../../context/UrbanDataContext';
import { useSmoothVehicleLerp } from '../../../hooks/useSmoothVehicleLerp';

export const HospitalMap = ({
  hospitalCoords = [16.3125, 80.4348],
  hospitalName = "Ala Super Speciality Hospital",
  ambulances = [],
  selectedAmbulanceId,
  onSelectAmbulance
}) => {
  const { data } = useUrbanData();
  const [mapReady, setMapReady] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const rawAmbulances = ambulances.length > 0 ? ambulances : (data?.ambulances || []);
  const trafficSegments = data?.trafficSegments || [];
  const incidents = data?.incidents || [];

  // Smooth Lerp Interpolation for Hospital Inbound Ambulances
  const smoothAmbulances = useSmoothVehicleLerp(rawAmbulances, isPaused, 50);

  useEffect(() => {
    setMapReady(true);
  }, []);

  // Selected or first critical ambulance for approach route
  const activeAmb = smoothAmbulances.find(a => a.id === selectedAmbulanceId) || smoothAmbulances[0];

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-900/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl flex flex-col">
      {/* Top Map Header Strip */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none flex-wrap gap-2">
        {/* Preemption Badge & Pause State */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-rose-500/60 text-rose-300 text-xs font-mono font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>GREEN CORRIDOR PREEMPTION ACTIVE</span>
          </div>

          {isPaused && (
            <div className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
              <Pause className="w-3 h-3" />
              <span>Paused</span>
            </div>
          )}
        </div>

        {/* Live Tracking Mode Pill, Pause Toggle & Traffic Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono border transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
              isPaused
                ? 'bg-amber-600/40 text-amber-300 border-amber-500/50'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={isPaused ? "Resume Vehicles" : "Pause Vehicles"}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono border transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
              showTraffic
                ? 'bg-amber-600/30 text-amber-300 border-amber-500/50'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Traffic Density"
          >
            <Flame className="w-3 h-3" />
            <span className="hidden sm:inline">Traffic</span>
          </button>

          <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 backdrop-blur-md hidden sm:flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-purple-400" />
            <span>Brodipet Grid Telemetry</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="flex-1 w-full h-full min-h-[340px] relative overflow-hidden">
        {mapReady && (
          <MapContainer
            center={hospitalCoords}
            zoom={14}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            style={{ height: '100%', width: '100%', minHeight: '340px', background: '#0b0f19' }}
          >
            {/* Free OpenStreetMap Tiles with CSS dark-invert filter */}
            <TileLayer
              className="dark-map-tiles"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* 2. Color-Coded Natural Street Grid Traffic Polylines */}
            {showTraffic &&
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
                        weight: 7,
                        opacity: 0.3,
                      }}
                    />
                    <Polyline
                      positions={segment.coordinates}
                      pathOptions={{
                        color: color,
                        weight: 4,
                        opacity: 0.9,
                      }}
                    >
                      <Popup className="custom-leaflet-popup">
                        <div className="p-1 text-slate-100 font-sans">
                          <div className="font-bold text-xs" style={{ color: color }}>
                            {segment.name}
                          </div>
                          <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                            Traffic: <b className="capitalize">{segment.congestionLevel}</b> ({segment.speedKmph} km/h)
                          </div>
                        </div>
                      </Popup>
                    </Polyline>
                  </React.Fragment>
                );
              })}

            {/* 3. Natural Road Routing for active inbound ambulance */}
            {activeAmb && activeAmb.currentCoordinates && (
              <RoadRoute
                waypoints={[activeAmb.currentCoordinates, hospitalCoords]}
                color={activeAmb.condition === 'Critical' ? '#EF4444' : '#10B981'}
                weight={5}
                opacity={0.95}
              />
            )}

            {/* 3D Hospital Center Marker (🏥) */}
            <Marker position={hospitalCoords} icon={createHospitalMarker(hospitalName)}>
              <Popup className="custom-leaflet-popup">
                <div className="p-1 text-slate-100 font-sans">
                  <div className="font-bold text-xs text-rose-400">{hospitalName}</div>
                  <div className="text-[11px] text-slate-300">Level-1 Trauma Center • Brodipet</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1">● Emergency Bay Clear & Standing By</div>
                </div>
              </Popup>
            </Marker>

            {/* 3D Live Smooth Moving Inbound Ambulances (🚑) with Pause on Hover/Click */}
            {smoothAmbulances.map((amb) => {
              const coords = amb.currentCoordinates;

              return (
                <Marker
                  key={amb.id}
                  position={coords}
                  icon={createAmbulanceMarker('108', amb.eta, amb.isBooked)}
                  eventHandlers={{
                    mouseover: () => setIsPaused(true),
                    mouseout: () => setIsPaused(false),
                    click: () => {
                      setIsPaused(true);
                      if (onSelectAmbulance) onSelectAmbulance(amb.id);
                    },
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 text-slate-100 font-sans space-y-2 min-w-[220px]">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs font-mono text-rose-400">{amb.id}</div>
                        <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                          {amb.triage || 'ALS'} • {amb.condition || 'Critical'}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-200">{amb.patientSummary}</div>
                      
                      {/* Driver & Contact */}
                      <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 space-y-1">
                        <div className="text-[10px] text-slate-400">Driver: <b className="text-white">{amb.driverName || 'Ramesh Kumar'}</b></div>
                        <a
                          href={`tel:${amb.driverPhone || '+919876543220'}`}
                          className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center justify-between pt-0.5 border-t border-slate-800"
                        >
                          <span>📞 {amb.driverPhone || '+91 98765 43220'}</span>
                          <span className="text-[9px] bg-emerald-600/30 text-emerald-300 px-1 rounded">DIAL</span>
                        </a>
                      </div>

                      <div className="text-[10px] text-slate-300 flex justify-between">
                        <span>ETA: <b className="text-emerald-400">{amb.eta}</b></span>
                        <span>Speed: <b>{amb.speedKmph} km/h</b></span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* 4. Global Road Hazards (🚧 / 💥) */}
            {incidents.map((incident) => (
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
            <span className="text-sm">🏥</span>
            <span>Hospital Trauma Hub</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🚑</span>
            <span>Critical ALS Inbound</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🚧</span>
            <span>Road Hazard Alert</span>
          </div>
        </div>

        <div className="text-purple-400 font-medium">
          Hospital Corridor Radar Active
        </div>
      </div>
    </div>
  );
};

export default HospitalMap;
