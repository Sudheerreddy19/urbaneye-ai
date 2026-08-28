import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUrbanData } from '../../../context/UrbanDataContext';
import CitizenSidebar from './CitizenSidebar';
import CitizenTopNav from './CitizenTopNav';
import NearbyTransit from './NearbyTransit';
import CitizenMap from './CitizenMap';
import JourneyPlanner from './JourneyPlanner';
import QuickActions from './QuickActions';

// Sub-Views
import ProfileView from './views/ProfileView';
import SettingsView from './views/SettingsView';
import HelpView from './views/HelpView';
import HistoryView from './views/HistoryView';
import FavoritesView from './views/FavoritesView';
import HazardsView from './views/HazardsView';
import BookingsView from './views/BookingsView';
import { PhoneCall, ShieldAlert, X, Radio } from 'lucide-react';

export const CitizenDashboard = ({ onLogout }) => {
  const { data } = useUrbanData();
  const [currentView, setCurrentView] = useState('Home');
  const [selectedTransit, setSelectedTransit] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);

  const buses = data?.buses || [];
  const ambulances = data?.ambulances || [];
  const policePatrols = data?.policePatrols || [];
  const trafficSignals = data?.trafficSignals || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const handleTriggerSOS = () => {
    setSosTriggered(true);
    setTimeout(() => {
      setSosTriggered(false);
      setEmergencyModalOpen(false);
    }, 4000);
  };

  // Normalize view key
  const activeKey = (currentView || 'Home').toString().toLowerCase();

  const renderActiveView = () => {
    switch (activeKey) {
      case 'profile':
        return (
          <motion.div
            key="profile-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full overflow-y-auto"
          >
            <ProfileView />
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            key="settings-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full overflow-y-auto"
          >
            <SettingsView />
          </motion.div>
        );

      case 'help':
      case 'support':
      case 'help & support':
        return (
          <motion.div
            key="help-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full overflow-y-auto"
          >
            <HelpView onOpenEmergencyModal={() => setEmergencyModalOpen(true)} />
          </motion.div>
        );

      case 'history':
        return (
          <motion.div
            key="history-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full overflow-y-auto"
          >
            <HistoryView />
          </motion.div>
        );

      case 'favorites':
        return (
          <motion.div
            key="favorites-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full overflow-y-auto"
          >
            <FavoritesView />
          </motion.div>
        );

      case 'bookings':
      case 'my bookings':
        return (
          <motion.div
            key="bookings-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full overflow-y-auto"
          >
            <BookingsView />
          </motion.div>
        );

      case 'hazards':
      case 'road hazards':
        return (
          <motion.div
            key="hazards-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full overflow-y-auto"
          >
            <HazardsView />
          </motion.div>
        );

      case 'home':
      case 'transport':
      case 'traffic':
      case 'ambulances':
      default:
        return (
          <motion.div
            key="home-grid-view"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1700px] mx-auto h-full items-stretch"
          >
            {/* ========================================================================= */}
            {/* A. LEFT COLUMN: NEARBY TRANSIT (3 Cols / ~25%) */}
            {/* ========================================================================= */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-3 flex flex-col h-full overflow-y-auto"
            >
              <NearbyTransit
                selectedItem={selectedTransit}
                onSelectTransitItem={(item) => setSelectedTransit(item)}
              />
            </motion.div>

            {/* ========================================================================= */}
            {/* B. CENTER COLUMN: MAIN MAP (6 Cols / ~50%) */}
            {/* ========================================================================= */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-6 flex flex-col h-full min-h-[420px] relative overflow-hidden"
            >
              <CitizenMap
                buses={buses}
                ambulances={ambulances}
                policePatrols={policePatrols}
                trafficSignals={trafficSignals}
                activeRoute={activeRoute}
                centerCoordinates={[16.3067, 80.4365]}
              />
            </motion.div>

            {/* ========================================================================= */}
            {/* C. RIGHT COLUMN: VERTICAL STACK (3 Cols / ~25%) */}
            {/* ========================================================================= */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-3 flex flex-col gap-4 h-full overflow-y-auto"
            >
              {/* Widget 1: Journey Planner */}
              <JourneyPlanner
                onRouteCalculated={(route) => setActiveRoute(route)}
              />

              {/* Widget 2: Quick Actions & City Status Overview */}
              <QuickActions />
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B0F19] text-slate-100 flex flex-row selection:bg-blue-600/30 selection:text-blue-300">
      {/* 1. CITIZEN SIDEBAR */}
      <CitizenSidebar
        currentView={currentView}
        activeTab={currentView}
        onSelectTab={(tab) => {
          if (tab === 'emergency') {
            setEmergencyModalOpen(true);
          } else {
            setCurrentView(tab);
          }
        }}
        onLogout={onLogout}
        onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
      />

      {/* 2. MAIN CONTENT AREA (Non-overflowing layout container) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* CITIZEN TOP NAVIGATION */}
        <CitizenTopNav
          onSearchQuery={(q) => setSearchFilter(q)}
          onOpenAlerts={() => setCurrentView('hazards')}
          alertCount={3}
        />

        {/* BREADCRUMB STRIP FOR ACTIVE VIEW */}
        <div className="px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/60 bg-[#090e18]/60 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Citizen Portal</span>
            <span>/</span>
            <span className="text-blue-400 font-bold capitalize">{currentView}</span>
          </div>

          {currentView !== 'Home' && (
            <button
              type="button"
              onClick={() => setCurrentView('Home')}
              className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer"
            >
              ← Back to Live 3D Map
            </button>
          )}
        </div>

        {/* MAIN VIEWPORT CONTAINER */}
        <main className="flex-1 p-3 sm:p-4 lg:p-5 overflow-y-auto lg:overflow-hidden smart-city-grid h-[calc(100vh-115px)]">
          <AnimatePresence mode="wait">
            {renderActiveView()}
          </AnimatePresence>
        </main>
      </div>

      {/* EMERGENCY SOS MODAL */}
      <AnimatePresence>
        {emergencyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-rose-600/50 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-rose-500 font-bold text-base">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                  <span>EMERGENCY DISPATCH SOS</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmergencyModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {sosTriggered ? (
                <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-mono space-y-2 text-center animate-pulse">
                  <div className="font-bold text-sm text-rose-400">EMERGENCY SOS BROADCAST ACTIVE</div>
                  <div>Live GPS Coordinates [16.3067, 80.4365] transmitted to AP Police Control Room & 108 Ala Hospital Trauma Unit.</div>
                </div>
              ) : (
                <div className="space-y-4 text-xs text-slate-300">
                  <p>
                    Connecting directly to Guntur Central Emergency Command & Ala Super Speciality Hospital.
                  </p>

                  <div className="space-y-2">
                    <a
                      href="tel:108"
                      className="w-full p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/40 transition cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Call 108 (EMS Ambulance Triage)</span>
                    </a>

                    <a
                      href="tel:112"
                      className="w-full p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/40 transition cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Call 112 (AP Police Command)</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleTriggerSOS}
                      className="w-full p-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-rose-500/60 text-rose-400 font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Radio className="w-4 h-4 animate-ping" />
                      <span>Broadcast Silent Panic SOS (Instant GPS)</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitizenDashboard;
