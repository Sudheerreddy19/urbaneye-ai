import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  LocateFixed,
  Flame,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Pause,
  Play
} from 'lucide-react';
import {
  createBusMarker,
  createAmbulanceMarker,
  createHazardMarker,
  createUserLocationMarker,
  createHospitalMarker,
  createPoliceCarMarker,
  createOriginMarker,
  createDestinationMarker
} from '../../shared/MapMarkers';
import RoadRoute from '../../shared/RoadRoute';
import { useUrbanData } from '../../../context/UrbanDataContext';
import { useSmoothVehicleLerp } from '../../../hooks/useSmoothVehicleLerp';

// Map Controller for Smooth Center, Zoom, and Active Route Bounds Flying
const MapController = ({ centerCoords, zoomLevel, activeRoute }) => {
  const map = useMap();

  useEffect(() => {
    if (activeRoute && activeRoute.fromCoords && activeRoute.toCoords) {
      try {
        const bounds = L.latLngBounds([activeRoute.fromCoords, activeRoute.toCoords]);
        map.fitBounds(bounds, { padding: [70, 70], maxZoom: 15, duration: 1.2 });
      } catch (e) {
        // fallback
      }
    } else if (centerCoords) {
      map.flyTo(centerCoords, zoomLevel || 14, { duration: 1 });
    }
  }, [centerCoords, zoomLevel, activeRoute, map]);

  return null;
};

export const CitizenMap = ({
  buses = [],
  ambulances = [],
  policePatrols = [],
  trafficSignals = [],
  activeRoute = null,
  centerCoordinates = [16.3067, 80.4365] // Guntur Central
}) => {
  const { data, toggleAmbulanceBooking } = useUrbanData();
  const [mapReady, setMapReady] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);
  const [currentCenter, setCurrentCenter] = useState(centerCoordinates);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [bookingToast, setBookingToast] = useState(null);
  
  // 1 & 2: Pause on Hover / Click state for vehicles
  const [isPaused, setIsPaused] = useState(false);

  // Raw vehicle feeds from props or context
  const rawBuses = buses.length > 0 ? buses : (data?.buses || []);
  const rawAmbulances = ambulances.length > 0 ? ambulances : (data?.ambulances || []);
  const rawPatrols = policePatrols.length > 0 ? policePatrols : (data?.policePatrols || []);
  const trafficSegments = data?.trafficSegments || [];
  const incidents = data?.incidents || [];

  // Smooth Linear Interpolation (Lerp) with freeze-on-hover/click
  const smoothBuses = useSmoothVehicleLerp(rawBuses, isPaused, 50);
  const smoothAmbulances = useSmoothVehicleLerp(rawAmbulances, isPaused, 50);
  const smoothPatrols = useSmoothVehicleLerp(rawPatrols, isPaused, 50);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleLocateMe = () => {
    setCurrentCenter([16.3067, 80.4365]);
    setZoomLevel(15);
  };

  const handleAmbulanceBooking = (ambId) => {
    if (toggleAmbulanceBooking) {
      toggleAmbulanceBooking(ambId);
    }
    const target = smoothAmbulances.find((a) => a.id === ambId);
    const willBeBooked = !(target?.isBooked);
    setBookingToast(
      willBeBooked
        ? `🚑 ${ambId} Dispatch Confirmed! Priority route established.`
        : `Ambulance ${ambId} released back to active standby.`
    );
    setTimeout(() => setBookingToast(null), 4000);
  };

  // Natural Road Routing Waypoints (Guntur Bus Stand -> Ala Hospital)
  const defaultJourneyWaypoints = [
    [16.3015, 80.4320], // Guntur Bus Stand
    [16.3067, 80.4365], // Brodipet Main
    [16.3125, 80.4348], // Ala Hospital
  ];

  return (
    <div className="relative w-full h-full flex-1 min-h-[420px] bg-slate-900/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col">
      {/* Top Floating Corridor Info Pill */}
      <div className="absolute top-3.5 left-3.5 z-[1000] pointer-events-none flex items-center gap-2">
        <div className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-blue-500/50 text-blue-300 text-xs font-mono font-bold flex items-center gap-2 shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>GUNTUR LIVE 3D MOBILITY MESH</span>
        </div>

        {isPaused && (
          <div className="pointer-events-auto px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
            <Pause className="w-3 h-3" />
            <span>Vehicles Paused</span>
          </div>
        )}
      </div>

      {/* Floating Map Controls (Right Side) */}
      <div className="absolute top-3.5 right-3.5 z-[1000] flex flex-col gap-2">
        {/* GPS Locate Me Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          className="p-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-blue-400 hover:text-blue-300 shadow-xl backdrop-blur-md transition cursor-pointer"
          title="Locate my position"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        {/* Traffic Congestion Layer Toggle */}
        <button
          type="button"
          onClick={() => setShowTrafficLayer(!showTrafficLayer)}
          className={`p-2.5 rounded-2xl border shadow-xl backdrop-blur-md transition cursor-pointer flex items-center justify-center ${
            showTrafficLayer
              ? 'bg-amber-600/30 border-amber-500/60 text-amber-300'
              : 'bg-slate-950/90 border-slate-700/80 text-slate-400 hover:text-slate-200'
          }`}
          title={showTrafficLayer ? "Hide Traffic Density Layer" : "Show Traffic Density Layer"}
        >
          <Flame className="w-4 h-4" />
        </button>

        {/* Manual Pause / Play Animation Toggle */}
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className={`p-2.5 rounded-2xl border shadow-xl backdrop-blur-md transition cursor-pointer flex items-center justify-center ${
            isPaused
              ? 'bg-amber-600/30 border-amber-500/60 text-amber-300'
              : 'bg-slate-950/90 border-slate-700/80 text-slate-400 hover:text-slate-200'
          }`}
          title={isPaused ? "Resume Vehicle Movement" : "Pause Vehicle Movement"}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
      </div>

      {/* Booking Toast Banner */}
      {bookingToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 rounded-2xl bg-slate-950/95 border border-emerald-500/80 text-emerald-300 text-xs font-mono font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{bookingToast}</span>
        </div>
      )}

      {/* Main React-Leaflet Map Container */}
      <div className="flex-1 w-full h-full relative min-h-[420px] overflow-hidden">
        {mapReady && (
          <MapContainer
            center={currentCenter}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            style={{ height: '100%', width: '100%', minHeight: '420px', background: '#0B0F19' }}
          >
            <MapController centerCoords={currentCenter} zoomLevel={zoomLevel} activeRoute={activeRoute} />

            {/* Free OpenStreetMap Tiles with CSS dark-invert filter */}
            <TileLayer
              className="dark-map-tiles"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* 2. Color-Coded Natural Street Grid Traffic Polylines */}
            {showTrafficLayer &&
              trafficSegments.map((segment) => {
                const color =
                  segment.congestionLevel === 'heavy'
                    ? '#EF4444' // Red
                    : segment.congestionLevel === 'moderate'
                    ? '#F59E0B' // Yellow
                    : '#10B981'; // Green

                return (
                  <React.Fragment key={segment.id}>
                    {/* Ambient Glow */}
                    <Polyline
                      positions={segment.coordinates}
                      pathOptions={{
                        color: color,
                        weight: 8,
                        opacity: 0.3,
                      }}
                    />
                    {/* Core Line */}
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
                          {segment.delayMinutes > 0 && (
                            <div className="text-[10px] text-amber-400 font-mono">
                              Est. Delay: +{segment.delayMinutes} mins
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Polyline>
                  </React.Fragment>
                );
              })}

            {/* 3. Natural Road Routing with OSRM (Dynamic Waypoints from Journey Planner) */}
            <RoadRoute
              waypoints={activeRoute?.waypoints || defaultJourneyWaypoints}
              color="#3B82F6"
              weight={6}
              opacity={0.95}
              fitBounds={true}
            />

            {/* Dynamic Route Origin Pin (🟢 📍) */}
            {activeRoute?.fromCoords && (
              <Marker position={activeRoute.fromCoords} icon={createOriginMarker(activeRoute.from || 'Origin')}>
                <Popup className="custom-leaflet-popup">
                  <div className="p-1.5 text-slate-100 font-sans space-y-1">
                    <div className="font-bold text-xs text-emerald-400">📍 Trip Origin</div>
                    <div className="text-xs text-white font-medium">{activeRoute.from}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Departure Anchor</div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Dynamic Route Destination Pin (🏁 🎯) */}
            {activeRoute?.toCoords && (
              <Marker position={activeRoute.toCoords} icon={createDestinationMarker(activeRoute.to || 'Destination')}>
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 text-slate-100 font-sans space-y-1.5 min-w-[190px]">
                    <div className="font-bold text-xs text-rose-400">🏁 Destination Point</div>
                    <div className="text-xs text-white font-bold">{activeRoute.to}</div>
                    <div className="text-[11px] text-emerald-400 font-mono font-bold bg-slate-950 p-1 rounded border border-slate-800 flex justify-between">
                      <span>Distance: {activeRoute.distance}</span>
                      <span>ETA: {activeRoute.duration}</span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono flex justify-between">
                      <span>Mode: {activeRoute.mode}</span>
                      <span className="text-emerald-300 font-bold">{activeRoute.estimatedCost}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* User Live Location Marker (3D Pin) */}
            <Marker position={[16.3067, 80.4365]} icon={createUserLocationMarker()}>
              <Popup className="custom-leaflet-popup">
                <div className="p-1 text-slate-100 font-sans">
                  <div className="font-bold text-xs text-blue-400">Your Live Position</div>
                  <div className="text-[10px] text-slate-300">Brodipet 4/1, Guntur</div>
                </div>
              </Popup>
            </Marker>

            {/* Hospital Center Anchor (3D Hospital 🏥) */}
            <Marker position={[16.3125, 80.4348]} icon={createHospitalMarker('ALA HOSPITAL')}>
              <Popup className="custom-leaflet-popup">
                <div className="p-1 text-slate-100 font-sans">
                  <div className="font-bold text-xs text-rose-400">Ala Super Speciality Hospital</div>
                  <div className="text-[11px] text-slate-300">Level-1 Trauma & Emergency Hub</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1">● Green Corridor Standby</div>
                </div>
              </Popup>
            </Marker>

            {/* High-Fidelity 3D Smooth Animated Buses (🚌) with Pause on Hover/Click */}
            {smoothBuses.map((bus) => (
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
                  <div className="p-2.5 text-slate-100 font-sans space-y-2 min-w-[230px]">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-blue-400 font-mono">
                        Bus {bus.routeNumber} ({bus.busNumber || bus.id})
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        {bus.status || 'Active'}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-200">{bus.routeName}</div>

                    {/* Driver & Contact Card */}
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400">Driver: <b className="text-white">{bus.driverName || 'K. Srinivasa Rao'}</b></div>
                      <a
                        href={`tel:${bus.driverPhone || '+919848011221'}`}
                        className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center justify-between pt-0.5 border-t border-slate-800"
                      >
                        <span>📞 {bus.driverPhone || '+91 98480 11221'}</span>
                        <span className="text-[9px] bg-emerald-600/30 text-emerald-300 px-1 rounded font-bold">CALL</span>
                      </a>
                    </div>

                    <div className="text-[10px] text-slate-300 flex justify-between font-mono">
                      <span>Occupancy: <b className="text-blue-300">{bus.seatOccupancy}%</b></span>
                      <span>Speed: <b>{bus.speedKmph} km/h</b></span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Next Stop: <b className="text-slate-200">{bus.nextStop}</b></div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* High-Fidelity 3D Smooth Animated Ambulances (🚑) with Pause on Hover/Click & Booking */}
            {smoothAmbulances.map((amb) => {
              const isBooked = !!amb.isBooked;

              return (
                <Marker
                  key={amb.id}
                  position={amb.currentCoordinates}
                  icon={createAmbulanceMarker('108', amb.eta, isBooked)}
                  eventHandlers={{
                    mouseover: () => setIsPaused(true),
                    mouseout: () => setIsPaused(false),
                    click: () => setIsPaused(true),
                    dblclick: () => handleAmbulanceBooking(amb.id),
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2.5 text-slate-100 font-sans space-y-2.5 min-w-[240px]">
                      {/* Header Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-rose-400 font-mono">{amb.id}</span>
                          <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800">
                            {amb.triage || 'ALS'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isBooked ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {isBooked ? 'In Transit / Booked' : 'Available'}
                        </span>
                      </div>

                      {/* Vehicle Number & Hospital */}
                      <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[10px] font-mono">Vehicle:</span>
                          <span className="font-bold text-white font-mono text-[11px]">{amb.vehicleNumber || 'AP-07-TA-1081'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[10px] font-mono">Hospital:</span>
                          <span className="font-medium text-slate-200 text-[11px] truncate max-w-[140px]">{amb.hospitalName || amb.destination || 'Guntur General Hospital'}</span>
                        </div>
                      </div>

                      {/* Driver & Mobile Number Card */}
                      <div className="bg-slate-950/90 p-2.5 rounded-xl border border-rose-900/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">👨‍✈️</span>
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase font-mono">Driver In-Charge</div>
                              <div className="text-xs font-bold text-white">{amb.driverName || 'Ramesh Kumar'}</div>
                            </div>
                          </div>
                          {amb.driverRating && (
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                              ⭐ {amb.driverRating}
                            </span>
                          )}
                        </div>

                        {/* Direct Mobile Call Button */}
                        <a
                          href={`tel:${amb.driverPhone || '+919876543220'}`}
                          className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-between transition"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>📞</span>
                            <span>{amb.driverPhone || '+91 98765 43220'}</span>
                          </span>
                          <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-sans font-black">CALL</span>
                        </a>
                      </div>

                      {/* Patient Condition / Vitals */}
                      <div className="text-[11px] text-slate-300 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800/80">
                        <span className="text-slate-400 font-mono text-[10px]">Condition: </span>
                        <span className="font-semibold text-slate-200">{amb.patientSummary || 'Emergency Standby'}</span>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                        <span>Speed: <b className="text-slate-200">{amb.speedKmph} km/h</b></span>
                        <span>ETA: <b className="text-emerald-400">{amb.eta}</b></span>
                      </div>

                      {/* Booking Action Button */}
                      <div className="pt-1 border-t border-slate-800">
                        {isBooked ? (
                          <div className="space-y-1">
                            <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                              <span>🔴 Assigned to Active Emergency</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAmbulanceBooking(amb.id)}
                              className="w-full py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition"
                            >
                              Cancel Dispatch / Release
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAmbulanceBooking(amb.id)}
                            className="w-full py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>🟢 Request Ambulance Dispatch</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* High-Fidelity 3D Smooth Animated Police Patrols (🚓) with Pause on Hover/Click */}
            {smoothPatrols.map((patrol) => (
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
                  <div className="p-2.5 text-slate-100 font-sans space-y-2 min-w-[220px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-400 font-mono">{patrol.callsign}</span>
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                        {patrol.status || 'Active'}
                      </span>
                    </div>

                    {/* Officer In-Charge & Contact */}
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400">Officer: <b className="text-white">{patrol.officer || 'Sub-Inspector K. Ramesh'}</b></div>
                      <a
                        href={`tel:${patrol.officerPhone || '+919876543211'}`}
                        className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center justify-between pt-0.5 border-t border-slate-800"
                      >
                        <span>📞 {patrol.officerPhone || '+91 98765 43211'}</span>
                        <span className="text-[9px] bg-emerald-600/30 text-emerald-300 px-1 rounded font-bold">CALL</span>
                      </a>
                    </div>

                    <div className="text-[10px] text-slate-300 flex justify-between font-mono">
                      <span>Speed: <b>{patrol.speedKmph} km/h</b></span>
                      <span className="text-slate-400 truncate max-w-[120px]">{patrol.station || 'Precinct 1'}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* 4. Global Road Hazards (Dynamic from mockUrbanData.incidents) */}
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

      {/* Floating Bottom Center "Show Legend" Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000]">
        <button
          type="button"
          onClick={() => setShowLegend(!showLegend)}
          className="px-3.5 py-1.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-xs font-mono font-semibold text-slate-300 hover:text-white shadow-xl backdrop-blur-md transition cursor-pointer flex items-center gap-1.5"
        >
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>{showLegend ? 'Hide Legend' : 'Show Legend & 3D Icons'}</span>
        </button>
      </div>

      {/* Legend Drawer / Card */}
      {showLegend && (
        <div className="absolute bottom-12 left-4 right-4 sm:left-auto sm:right-4 z-[1000] p-3.5 rounded-2xl bg-slate-950/95 border border-slate-800 text-xs font-mono text-slate-300 shadow-2xl backdrop-blur-md space-y-2.5">
          <div className="font-bold text-white text-[11px] pb-1.5 border-b border-slate-800 flex items-center justify-between">
            <span>3D Symbols & Traffic Density</span>
            <span className="text-[10px] text-blue-400">Live Telemetry</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none">🚌</span>
              <span>City Transit Bus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none">🚑</span>
              <span>EMS Ambulance 108</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none">🚓</span>
              <span>Police Patrol</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none">🚧</span>
              <span>Hazard / Construction</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[10px] font-bold text-slate-400 mb-1">Traffic Congestion Density:</div>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1">
                <span className="w-3 h-1 rounded bg-[#EF4444]" />
                <span className="text-red-400">Heavy (Red)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-1 rounded bg-[#F59E0B]" />
                <span className="text-amber-400">Moderate (Yellow)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-1 rounded bg-[#10B981]" />
                <span className="text-emerald-400">Light (Green)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenMap;
