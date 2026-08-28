import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';

// Derive two-letter initials from a full name
function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}
import {
  Home,
  Bus,
  Route,
  Ambulance,
  ShieldAlert,
  TriangleAlert,
  Ticket,
  Star,
  History,
  User,
  Settings,
  HelpCircle,
  LogOut,
  PhoneCall,
  Menu,
  X,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';

const citizenNavItems = [
  { id: 'home', label: 'Home', icon: Home, badge: null },
  { id: 'transport', label: 'Public Transport', icon: Bus, badge: 'Live 3D' },
  { id: 'traffic', label: 'Traffic & Routes', icon: Route, badge: null },
  { id: 'ambulances', label: 'Nearby Ambulances', icon: Ambulance, badge: '108 Live' },
  { id: 'emergency', label: 'Emergency SOS', icon: ShieldAlert, badge: '108 / 112' },
  { id: 'hazards', label: 'Road Hazards', icon: TriangleAlert, badge: '3 Active' },
  { id: 'bookings', label: 'My Bookings', icon: Ticket, badge: null },
  { id: 'favorites', label: 'Favorites', icon: Star, badge: null },
  { id: 'history', label: 'History', icon: History, badge: null },
  { id: 'profile', label: 'Profile', icon: User, badge: null },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  { id: 'support', label: 'Help & Support', icon: HelpCircle, badge: null },
];

export const CitizenSidebar = ({
  activeTab = 'Home',
  currentView,
  onSelectTab,
  onLogout,
  onOpenEmergencyModal
}) => {
  const { user } = useAuth();
  const userInitials = getInitials(user?.name ?? '');
  const userName = user?.name ?? 'Citizen';

  const [mobileOpen, setMobileOpen] = useState(false);
  const activeIdentifier = (currentView || activeTab || 'Home').toString().toLowerCase();

  const handleItemClick = (id) => {
    if (id === 'emergency') {
      if (onOpenEmergencyModal) onOpenEmergencyModal();
      else if (onSelectTab) onSelectTab('emergency');
    } else if (onSelectTab) {
      onSelectTab(id);
    }
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between border-r border-slate-800/90 text-slate-200 w-64 select-none bg-gradient-to-b from-[#0B0F19] via-[#0D1424] to-[#070B14]">
      {/* Top Branding Section */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl p-0.5 shadow-lg bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 shadow-blue-950/60">
              <div className="w-full h-full bg-[#080E1A] rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">UrbanEye</span>
                <span className="bg-clip-text text-transparent font-black text-lg bg-gradient-to-r from-blue-400 to-cyan-300">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Smarter City. Safer Lives.
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Citizen Status Tag */}
        <div className="px-4 py-2.5 mx-3 my-2.5 rounded-2xl bg-blue-950/30 border border-blue-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span className="text-xs font-semibold text-white">Guntur Smart Portal</span>
          </div>
          <span className="text-[10px] font-mono text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded-full border border-blue-700/50">
            Citizen Mode
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-1 mt-1 max-h-[calc(100vh-340px)] overflow-y-auto custom-scrollbar">
          {citizenNavItems.map((item) => {
            const Icon = item.icon;
            const itemKey = item.id.toLowerCase();
            const isActive =
              activeIdentifier === itemKey ||
              activeIdentifier === item.label.toLowerCase() ||
              (itemKey === 'support' && activeIdentifier.includes('help')) ||
              (itemKey === 'home' && (activeIdentifier === 'home' || activeIdentifier === 'transport' || activeIdentifier === 'traffic' || activeIdentifier === 'ambulances'));

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/30 via-blue-600/20 to-transparent text-white border border-blue-500/40 shadow-md shadow-blue-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                        : 'bg-slate-800/60 text-slate-400 group-hover:text-blue-300 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border ${
                        item.badge.includes('Active') || item.badge.includes('108') || item.badge.includes('Live')
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Emergency Card & Profile/Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-2.5">
        {/* Emergency Call Card */}
        <div
          onClick={onOpenEmergencyModal}
          className="group relative p-3 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-800/40 hover:border-rose-600/70 transition cursor-pointer shadow-lg overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center group-hover:scale-110 transition flex-shrink-0">
              <PhoneCall className="w-4 h-4 text-rose-400 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <h5 className="text-xs font-bold text-white tracking-tight">Emergency Call</h5>
              </div>
              <p className="text-[11px] font-mono text-rose-300 font-bold">Dial 108 / 112</p>
            </div>
          </div>
        </div>

        {/* User Pill (Opens Profile on click) & Logout */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition">
          <div
            onClick={() => handleItemClick('profile')}
            className="flex items-center gap-2 min-w-0 cursor-pointer group"
            title="View Citizen Profile"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-105 transition">
              {userInitials || <User className="w-3.5 h-3.5" />}
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition">{userName}</h5>
              <p className="text-[10px] text-blue-400 font-mono">Citizen Portal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            title="Exit Citizen Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 flex-shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-3 left-3 z-40">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 shadow-xl backdrop-blur-md cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden fixed top-0 bottom-0 left-0 z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CitizenSidebar;
