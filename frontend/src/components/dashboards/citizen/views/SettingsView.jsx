import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Bell,
  Moon,
  Share2,
  ShieldCheck,
  Smartphone,
  Volume2,
  Globe,
  Sliders,
  CheckCircle2,
  Sparkles,
  Lock
} from 'lucide-react';

export const SettingsView = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [sosAutoTrigger, setSosAutoTrigger] = useState(true);
  const [speedAlerts, setSpeedAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Citizen Settings & Preferences</h2>
            <p className="text-xs text-slate-400">Configure notifications, security, telemetry data sharing, and display</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Preferences updated and saved to your Citizen Profile successfully!</span>
        </motion.div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section 1: Notifications & Alerts */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Bell className="w-4 h-4 text-blue-400" />
            <span>Alerts & Notifications</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Push Notifications</div>
                <div className="text-[11px] text-slate-400">Receive live bus arrival & delay alerts</div>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  notifications ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Emergency Sound Siren</div>
                <div className="text-[11px] text-slate-400">Audible warning when EMS 108 is near</div>
              </div>
              <button
                type="button"
                onClick={() => setSoundAlerts(!soundAlerts)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  soundAlerts ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                    soundAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Road Hazard Alerts</div>
                <div className="text-[11px] text-slate-400">Waterlogging, accident & pothole warnings</div>
              </div>
              <button
                type="button"
                onClick={() => setSpeedAlerts(!speedAlerts)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  speedAlerts ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                    speedAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Privacy & Telemetry */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Privacy & Emergency SOS</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Emergency Auto-Broadcast</div>
                <div className="text-[11px] text-slate-400">Auto-transmit GPS to Police/EMS on 108 SOS</div>
              </div>
              <button
                type="button"
                onClick={() => setSosAutoTrigger(!sosAutoTrigger)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  sosAutoTrigger ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                    sosAutoTrigger ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Anonymous Telemetry Sharing</div>
                <div className="text-[11px] text-slate-400">Contribute speed data to improve city traffic AI</div>
              </div>
              <button
                type="button"
                onClick={() => setDataSharing(!dataSharing)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  dataSharing ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                    dataSharing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">High-Contrast Dark Theme</div>
                <div className="text-[11px] text-slate-400">Cyberpunk Slate 950 OLED optimized</div>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  darkMode ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Localization & Language */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl space-y-4 shadow-xl col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Language & Region</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/40 cursor-pointer">
              <div className="text-xs font-bold text-white">English (India)</div>
              <div className="text-[10px] text-blue-300 font-mono">Default System Language</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
              <div className="text-xs font-bold text-slate-200">తెలుగు (Telugu)</div>
              <div className="text-[10px] text-slate-400 font-mono">ఆంధ్రప్రదేశ్ అధికారిక భాష</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
              <div className="text-xs font-bold text-slate-200">हिंदी (Hindi)</div>
              <div className="text-[10px] text-slate-400 font-mono">राष्ट्रीय संपर्क भाषा</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
