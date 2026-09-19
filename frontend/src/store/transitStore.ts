import { create } from 'zustand';

export interface TransitStop {
  id: string | number;
  name: string;
  coordinates: [number, number]; // [lat, lon]
  sequence?: number;
  scheduledArrival?: string;
  estimatedArrival?: string;
  isPassed?: boolean;
}

export interface LiveBus {
  id: string;
  busNumber: string;
  registrationNumber?: string;
  routeNumber: string;
  routeName: string;
  driverName?: string;
  driverPhone?: string;
  currentCoordinates: [number, number];
  previousCoordinates?: [number, number];
  speedKmph: number;
  heading: number; // 0-360 degrees
  seatOccupancy: number; // 0-100 percentage
  totalSeats?: number;
  availableSeats?: number;
  occupancyLevel?: 'LOW' | 'MODERATE' | 'FULL' | 'CROWDED';
  status?: string;
  nextStop?: string;
  distanceKm?: number;
  etaMinutes?: number;
  eta?: string;
  acStatus?: string;
  busType?: 'AC Electric Express' | 'Superfast Metro' | 'City Ordinary' | 'Rapid Transit';
  lastTelemetryUpdate?: number;
  stops?: TransitStop[];
  path?: [number, number][];
}

export interface RouteData {
  id: string;
  name: string;
  fromName: string;
  toName: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  polyline: [number, number][];
  distanceKm: number;
  durationMins: number;
  stops: TransitStop[];
  bounds?: [[number, number], [number, number]];
}

interface TransitState {
  origin: { name: string; coordinates: [number, number]; isUserLocation?: boolean } | null;
  destination: { name: string; coordinates: [number, number] } | null;
  activeRoute: RouteData | null;
  selectedBus: LiveBus | null;
  isBusDrawerOpen: boolean;
  buses: LiveBus[];
  isSearching: boolean;
  isRoutingLoading: boolean;
  transitError: string | null;
  darkMode: boolean;

  // Actions
  setOrigin: (origin: { name: string; coordinates: [number, number]; isUserLocation?: boolean } | null) => void;
  setDestination: (destination: { name: string; coordinates: [number, number] } | null) => void;
  setActiveRoute: (route: RouteData | null) => void;
  setSelectedBus: (bus: LiveBus | null) => void;
  setBusDrawerOpen: (open: boolean) => void;
  setBuses: (buses: LiveBus[] | ((prev: LiveBus[]) => LiveBus[])) => void;
  updateBusTelemetry: (busNumber: string, partial: Partial<LiveBus>) => void;
  setIsSearching: (val: boolean) => void;
  setIsRoutingLoading: (val: boolean) => void;
  setTransitError: (err: string | null) => void;
  toggleDarkMode: () => void;
}

export const useTransitStore = create<TransitState>((set) => ({
  origin: null,
  destination: null,
  activeRoute: null,
  selectedBus: null,
  isBusDrawerOpen: false,
  buses: [],
  isSearching: false,
  isRoutingLoading: false,
  transitError: null,
  darkMode: true,

  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setActiveRoute: (activeRoute) => set({ activeRoute }),
  setSelectedBus: (selectedBus) => set({ selectedBus, isBusDrawerOpen: !!selectedBus }),
  setBusDrawerOpen: (isBusDrawerOpen) => set({ isBusDrawerOpen }),
  setBuses: (updater) =>
    set((state) => ({
      buses: typeof updater === 'function' ? updater(state.buses) : updater,
    })),
  updateBusTelemetry: (busNumber, partial) =>
    set((state) => ({
      buses: state.buses.map((bus) =>
        bus.busNumber === busNumber || bus.id === busNumber
          ? { ...bus, ...partial, lastTelemetryUpdate: Date.now() }
          : bus
      ),
      selectedBus:
        state.selectedBus && (state.selectedBus.busNumber === busNumber || state.selectedBus.id === busNumber)
          ? { ...state.selectedBus, ...partial, lastTelemetryUpdate: Date.now() }
          : state.selectedBus,
    })),
  setIsSearching: (isSearching) => set({ isSearching }),
  setIsRoutingLoading: (isRoutingLoading) => set({ isRoutingLoading }),
  setTransitError: (transitError) => set({ transitError }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
