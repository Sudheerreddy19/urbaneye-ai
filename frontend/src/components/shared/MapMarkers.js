import L from 'leaflet';

/**
 * High-Fidelity 3D Emoji Map Markers with Glassmorphic Bases
 * Simulates 3D vehicle models with interactive hover/click states and realistic road representations.
 */

// 1. 3D Ambulance Marker: Large 🚑 with glassmorphic base, interactive hover glow & optional route/booking tag
export const createAmbulanceMarker = (label = '108', eta = null, isBooked = false) => {
  return L.divIcon({
    className: 'custom-3d-ambulance-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-200 hover:scale-125 hover:z-50">
        ${eta ? `
          <div class="mb-0.5 px-1.5 py-0.5 rounded-full bg-slate-950/90 border ${isBooked ? 'border-red-500 text-red-300' : 'border-emerald-500 text-emerald-300'} font-mono text-[9px] font-bold shadow-md whitespace-nowrap">
            ${isBooked ? `🚨 ${eta}` : `🟢 ${eta}`}
          </div>
        ` : ''}
        <div class="relative flex items-center justify-center text-3xl sm:text-4xl drop-shadow-xl bg-white/20 hover:bg-red-600/30 backdrop-blur-md p-1 rounded-xl border border-white/30 hover:border-red-400 shadow-md group-hover:shadow-[0_0_20px_rgba(239,68,68,0.7)] transition-all duration-200">
          <span class="leading-none transform transition-transform group-hover:rotate-6">🚑</span>
        </div>
      </div>
    `,
    iconSize: [48, 54],
    iconAnchor: [24, 27],
  });
};

// 2. 3D Bus Marker: Large 🚌 with 3D glassmorphic base & route badge
export const createBusMarker = (routeNumber = '21A', occupancy = null) => {
  return L.divIcon({
    className: 'custom-3d-bus-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-200 hover:scale-125 hover:z-50">
        <div class="mb-0.5 px-1.5 py-0.5 rounded-full bg-slate-950/90 border border-blue-500/80 text-blue-300 font-mono text-[9px] font-bold shadow-md whitespace-nowrap">
          ${routeNumber} ${occupancy ? `• ${occupancy}%` : ''}
        </div>
        <div class="relative flex items-center justify-center text-3xl sm:text-4xl drop-shadow-xl bg-white/20 hover:bg-blue-600/30 backdrop-blur-md p-1 rounded-xl border border-white/30 hover:border-blue-400 shadow-md group-hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] transition-all duration-200">
          <span class="leading-none transform transition-transform group-hover:-rotate-6">🚌</span>
        </div>
      </div>
    `,
    iconSize: [48, 54],
    iconAnchor: [24, 27],
  });
};

// 3. 3D Police / Patrol Car Marker: Large 🚓 with 3D glassmorphic base
export const createPoliceCarMarker = (callsign = 'POLICE') => {
  return L.divIcon({
    className: 'custom-3d-police-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-200 hover:scale-125 hover:z-50">
        <div class="mb-0.5 px-1.5 py-0.5 rounded-full bg-slate-950/90 border border-emerald-500/80 text-emerald-300 font-mono text-[9px] font-bold shadow-md whitespace-nowrap">
          ${callsign}
        </div>
        <div class="relative flex items-center justify-center text-3xl sm:text-4xl drop-shadow-xl bg-white/20 hover:bg-emerald-600/30 backdrop-blur-md p-1 rounded-xl border border-white/30 hover:border-emerald-400 shadow-md group-hover:shadow-[0_0_20px_rgba(16,185,129,0.7)] transition-all duration-200">
          <span class="leading-none">🚓</span>
        </div>
      </div>
    `,
    iconSize: [48, 54],
    iconAnchor: [24, 27],
  });
};

// 4. 3D Car Marker: Large 🚗 with 3D glassmorphic base
export const createCarMarker = (label = 'Car') => {
  return L.divIcon({
    className: 'custom-3d-car-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-200 hover:scale-125 hover:z-50">
        <div class="relative flex items-center justify-center text-3xl sm:text-4xl drop-shadow-xl bg-white/20 hover:bg-blue-600/30 backdrop-blur-md p-1 rounded-xl border border-white/30 shadow-md group-hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] transition-all duration-200">
          <span class="leading-none">🚗</span>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

// 5. 3D Hazard Markers: Large 🚧 (Construction) or 💥 (Accident) with 3D glassmorphic base
export const createHazardMarker = (type = 'Accident', label = null) => {
  const isConstruction = type.toLowerCase().includes('construct') || type.toLowerCase().includes('pothole') || type.toLowerCase().includes('waterlog');
  const emoji = isConstruction ? '🚧' : '💥';
  const displayLabel = label || (isConstruction ? 'ROAD WORK' : 'ACCIDENT');

  return L.divIcon({
    className: 'custom-3d-hazard-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-200 hover:scale-125 hover:z-50">
        <div class="mb-0.5 px-1.5 py-0.5 rounded-full bg-slate-950/90 border border-amber-500/80 text-amber-300 font-mono text-[9px] font-bold shadow-md whitespace-nowrap">
          ${displayLabel}
        </div>
        <div class="relative flex items-center justify-center text-3xl sm:text-4xl drop-shadow-xl bg-white/20 hover:bg-amber-500/30 backdrop-blur-md p-1 rounded-xl border border-white/30 hover:border-amber-400 shadow-md group-hover:shadow-[0_0_20px_rgba(245,158,11,0.8)] transition-all duration-200">
          <span class="leading-none">${emoji}</span>
        </div>
      </div>
    `,
    iconSize: [48, 54],
    iconAnchor: [24, 27],
  });
};

// 6. 3D Hospital Center Anchor: Large 🏥
export const createHospitalMarker = (name = 'ALA HOSPITAL') => {
  return L.divIcon({
    className: 'custom-3d-hospital-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-200 hover:scale-125 hover:z-50">
        <div class="mb-0.5 px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-500/80 text-rose-300 font-mono text-[9px] font-bold shadow-md whitespace-nowrap">
          ${name}
        </div>
        <div class="relative flex items-center justify-center text-3xl sm:text-4xl drop-shadow-xl bg-white/20 hover:bg-rose-600/30 backdrop-blur-md p-1 rounded-xl border border-white/30 hover:border-rose-400 shadow-md group-hover:shadow-[0_0_20px_rgba(225,29,72,0.8)] transition-all duration-200">
          <span class="leading-none">🏥</span>
        </div>
      </div>
    `,
    iconSize: [52, 56],
    iconAnchor: [26, 28],
  });
};

// 7. 3D User Location Marker: Large 📍 / 👤
export const createUserLocationMarker = () => {
  return L.divIcon({
    className: 'custom-3d-user-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-200 hover:scale-125 hover:z-50">
        <div class="relative flex items-center justify-center text-3xl sm:text-4xl drop-shadow-xl bg-white/20 hover:bg-blue-600/30 backdrop-blur-md p-1 rounded-xl border border-white/30 hover:border-blue-400 shadow-md group-hover:shadow-[0_0_16px_rgba(59,130,246,0.8)] transition-all duration-200">
          <span class="leading-none">📍</span>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

// 8. 3D Traffic Signal Marker: Large 🚦
export const createSignalMarker = (state = 'GREEN', countdown = 30) => {
  const isForced = state === 'FORCED GREEN';
  const color = isForced ? 'border-emerald-400 text-emerald-300' : state === 'RED' ? 'border-red-400 text-red-300' : 'border-emerald-400 text-emerald-300';

  return L.divIcon({
    className: 'custom-3d-signal-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-200 hover:scale-125 hover:z-50">
        <div class="mb-0.5 px-1.5 py-0.5 rounded-full bg-slate-950/90 border ${color} font-mono text-[9px] font-bold shadow-md whitespace-nowrap">
          ${countdown}s
        </div>
        <div class="relative flex items-center justify-center text-2xl sm:text-3xl drop-shadow-xl bg-white/20 backdrop-blur-md p-1 rounded-xl border border-white/30 shadow-md transition-all duration-200">
          <span class="leading-none">🚦</span>
        </div>
      </div>
    `,
    iconSize: [42, 48],
    iconAnchor: [21, 24],
  });
};

// 9. 3D Route Origin Marker: 🟢 📍
export const createOriginMarker = (label = 'START') => {
  return L.divIcon({
    className: 'custom-3d-origin-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-200 hover:scale-125 hover:z-50">
        <div class="mb-0.5 px-2 py-0.5 rounded-full bg-slate-950/95 border border-emerald-500 text-emerald-300 font-mono text-[9px] font-bold shadow-lg whitespace-nowrap">
          📍 ${label}
        </div>
        <div class="relative flex items-center justify-center text-3xl drop-shadow-xl bg-emerald-600/30 backdrop-blur-md p-1 rounded-xl border border-emerald-400 shadow-md group-hover:shadow-[0_0_20px_rgba(16,185,129,0.9)] transition-all duration-200 animate-bounce">
          <span class="leading-none">🟢</span>
        </div>
      </div>
    `,
    iconSize: [48, 54],
    iconAnchor: [24, 27],
  });
};

// 10. 3D Route Destination Marker: 🏁 🎯
export const createDestinationMarker = (label = 'DESTINATION') => {
  return L.divIcon({
    className: 'custom-3d-destination-marker',
    html: `
      <div class="relative flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-200 hover:scale-125 hover:z-50">
        <div class="mb-0.5 px-2 py-0.5 rounded-full bg-slate-950/95 border border-rose-500 text-rose-300 font-mono text-[9px] font-bold shadow-lg whitespace-nowrap">
          🏁 ${label}
        </div>
        <div class="relative flex items-center justify-center text-3xl drop-shadow-xl bg-rose-600/30 backdrop-blur-md p-1 rounded-xl border border-rose-400 shadow-md group-hover:shadow-[0_0_20px_rgba(244,63,94,0.9)] transition-all duration-200 animate-pulse">
          <span class="leading-none">🎯</span>
        </div>
      </div>
    `,
    iconSize: [48, 54],
    iconAnchor: [24, 27],
  });
};

