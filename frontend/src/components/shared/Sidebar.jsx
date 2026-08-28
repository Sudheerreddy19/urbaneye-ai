import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Ambulance,
  Users,
  BedDouble,
  Stethoscope,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Layers,
  ChevronRight,
  ShieldAlert,
  Activity,
  Menu,
  X,
  Radio,
  TriangleAlert,
  Navigation,
  Video,
  FileText,
  TrendingUp
} from 'lucide-react';

const hospitalMenuItems = [
  { id: 'Dashboard', tabKey: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'Incoming Ambulances', tabKey: 'ambulances', label: 'Incoming Ambulances', icon: Ambulance, badge: '3 Active', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { id: 'Patients & Triage', tabKey: 'patients', label: 'Patients & Triage', icon: Users, badge: null },
  { id: 'Bed Management', tabKey: 'beds', label: 'Bed Management', icon: BedDouble, badge: '54 Avail', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'Medical Staff', tabKey: 'staff', label: 'Medical Staff', icon: Stethoscope, badge: null },
  { id: 'Alerts & Dispatches', tabKey: 'alerts', label: 'Alerts & Dispatches', icon: Bell, badge: '2 Urgent', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'Reports & Analytics', tabKey: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null },
  { id: 'Settings', tabKey: 'settings', label: 'Settings', icon: Settings, badge: null },
];

const policeMenuItems = [
  { id: 'Live Overview', tabKey: 'dashboard', label: 'Live Overview', icon: LayoutDashboard, badge: 'TACTICAL', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'Ambulances', tabKey: 'ambulances', label: 'Ambulances', icon: Ambulance, badge: '8 Active', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { id: 'Traffic Signals', tabKey: 'signals', label: 'Traffic Signals', icon: Radio, badge: '32 Active', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'Incidents', tabKey: 'incidents', label: 'Incidents', icon: TriangleAlert, badge: '7 Open', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'Green Corridors', tabKey: 'corridors', label: 'Green Corridors', icon: Navigation, badge: 'ACTIVE', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse' },
  { id: 'CCTV Feeds', tabKey: 'cctv', label: 'CCTV Feeds', icon: Video, badge: '3 Live', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'Reports', tabKey: 'reports', label: 'Reports', icon: FileText, badge: null },
  { id: 'Alerts', tabKey: 'alerts', label: 'Alerts', icon: Bell, badge: '4 New', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { id: 'Analytics', tabKey: 'analytics', label: 'Analytics', icon: TrendingUp, badge: null },
  { id: 'Settings', tabKey: 'settings', label: 'Settings', icon: Settings, badge: null },
];

export const Sidebar = ({
  role = 'hospital',
  activeTab,
  currentView,
  setCurrentView,
  onSelectTab,
  onLogout,
  hospitalName = 'Ala Super Speciality Hospital',
  facilityType = 'Level-1 Emergency Trauma Node'
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPolice = role === 'police';

  const menuItems = isPolice ? policeMenuItems : hospitalMenuItems;
  const activeIdentifier = (currentView || activeTab || (isPolice ? 'Live Overview' : 'Dashboard')).toString().toLowerCase();

  const handleItemClick = (item) => {
    if (setCurrentView) setCurrentView(item.label);
    if (onSelectTab) onSelectTab(item.tabKey || item.id);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className={`h-full flex flex-col justify-between border-r border-slate-800/90 text-slate-200 w-64 select-none ${
      isPolice
        ? 'bg-gradient-to-b from-[#09101d] via-[#0b1320] to-[#070b14]'
        : 'bg-gradient-to-b from-[#0e0c1f] via-[#110f27] to-[#0a0817]'
    }`}>
      {/* Top Branding Section */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl p-0.5 shadow-lg ${
              isPolice
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 shadow-emerald-950/50'
                : 'bg-gradient-to-tr from-purple-600 via-indigo-500 to-rose-500 shadow-purple-900/40'
            }`}>
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                {isPolice ? (
                  <ShieldAlert className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Layers className="w-5 h-5 text-purple-400" />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">UrbanEye</span>
                <span className={`bg-clip-text text-transparent font-black text-lg ${
                  isPolice
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                    : 'bg-gradient-to-r from-purple-400 to-rose-400'
                }`}>
                  AI
                </span>
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-widest block ${
                isPolice ? 'text-emerald-400/90' : 'text-purple-300/80'
              }`}>
                {isPolice ? 'Police Command OS' : 'Hospital Command'}
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tactical / Facility Info Card */}
        <div className={`p-3 mx-3 my-2.5 rounded-2xl border shadow-inner ${
          isPolice
            ? 'bg-emerald-950/20 border-emerald-800/30'
            : 'bg-purple-950/30 border-purple-800/30'
        }`}>
          <div className="flex items-start gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${
              isPolice
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}>
              {isPolice ? (
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              ) : (
                <Activity className="w-3.5 h-3.5 animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">
                {isPolice ? 'Guntur Traffic HQ' : hospitalName}
              </h4>
              <p className="text-[10px] font-mono text-slate-400 truncate">
                {isPolice ? 'Amaravati Capital Corridor Node' : facilityType}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {isPolice ? 'Signal Grid Synchronized' : 'Green Corridor Sync Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu Items */}
        <nav className="px-3 space-y-1 mt-1 max-h-[calc(100vh-270px)] overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const itemLabel = item.label.toLowerCase();
            const itemTab = (item.tabKey || item.id).toLowerCase();
            const isActive =
              activeIdentifier === itemLabel ||
              activeIdentifier === itemTab ||
              (itemTab === 'dashboard' && (activeIdentifier === 'live overview' || activeIdentifier === 'dashboard' || activeIdentifier === 'overview'));

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? isPolice
                      ? 'bg-gradient-to-r from-emerald-600/30 via-emerald-600/20 to-transparent text-white border border-emerald-500/40 shadow-md shadow-emerald-950/50'
                      : 'bg-gradient-to-r from-purple-600/30 via-purple-600/20 to-transparent text-white border border-purple-500/40 shadow-md shadow-purple-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? isPolice
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/50'
                          : 'bg-purple-600 text-white shadow-sm shadow-purple-500/50'
                        : isPolice
                        ? 'bg-slate-800/60 text-slate-400 group-hover:text-emerald-300 group-hover:bg-slate-800'
                        : 'bg-slate-800/60 text-slate-400 group-hover:text-purple-300 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className={`w-3.5 h-3.5 ${isPolice ? 'text-emerald-400' : 'text-purple-400'}`} />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User & Logout Section */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${
            isPolice
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-700'
              : 'bg-gradient-to-tr from-rose-500 to-purple-600'
          }`}>
            {isPolice ? 'SM' : 'DR'}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-white truncate">
              {isPolice ? 'Inspector S. Mahesh' : 'Dr. K. Suhasini'}
            </h5>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              {isPolice ? 'Chief Traffic Controller' : 'Chief Trauma Triage'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-xs font-semibold transition cursor-pointer shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{isPolice ? 'Exit Police Console' : 'Exit Hospital Console'}</span>
        </button>
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

export default Sidebar;
