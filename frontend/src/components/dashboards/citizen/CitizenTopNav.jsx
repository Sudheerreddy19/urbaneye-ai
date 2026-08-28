import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherAQIWidget from '../../shared/WeatherAQIWidget';
import { useAuth } from '../../../context/AuthContext';

function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}



import {
  Search,
  Mic,
  MicOff,
  Bell,
  CloudSun,
  User,
  Sparkles,
  MapPin,
  CheckCircle2,
  Volume2,
  X
} from 'lucide-react';

export const CitizenTopNav = ({
  onSearchQuery,
  onOpenAlerts,
  alertCount = 3
}) => {
  const { user } = useAuth();
  const userInitials = getInitials(user?.name ?? '');
  const userName = user?.name ?? 'Citizen';

  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceToast, setVoiceToast] = useState(null);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API if supported in browser
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English localization

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');

        setQuery(transcript);
        if (onSearchQuery) onSearchQuery(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (query) {
          showVoiceToast(`Voice Recognized: "${query}"`);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [query, onSearchQuery]);

  const showVoiceToast = (msg) => {
    setVoiceToast(msg);
    setTimeout(() => {
      setVoiceToast(null);
    }, 3500);
  };

  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Fallback simulation if speech recognition is already running or blocked
          simulateVoiceAI();
        }
      } else {
        // Fallback simulation for unsupported browsers/environments
        simulateVoiceAI();
      }
    }
  };

  const simulateVoiceAI = () => {
    setIsListening(true);
    const sampleQueries = [
      "Where is Bus 21A",
      "Route to Ala Hospital",
      "Show nearby ambulances",
      "Check traffic on Market Road"
    ];
    const chosen = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];

    setTimeout(() => {
      setQuery(chosen);
      if (onSearchQuery) onSearchQuery(chosen);
      setIsListening(false);
      showVoiceToast(`Voice Command Parsed: "${chosen}"`);
    }, 1800);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSearchQuery) onSearchQuery(query);
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-[#090E1A]/90 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
      {/* 1. Left Title */}
      <div className="flex items-center gap-3 pl-10 lg:pl-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>USER DASHBOARD</span>
              <span className="text-blue-400 font-bold">(Citizen)</span>
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              SMART MOBILITY
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Live Public Transit, Route Nav & Emergency Alert Network
          </p>
        </div>
      </div>

      {/* 2. Center Search Bar with Voice AI */}
      <div className="w-full md:max-w-md lg:max-w-lg relative">
        <form onSubmit={handleFormSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (onSearchQuery) onSearchQuery(e.target.value);
            }}
            placeholder={
              isListening
                ? "Listening to voice input... (Speak now)"
                : "Search for location, bus, route..."
            }
            className={`w-full pl-10 pr-20 py-2 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-all duration-200 border ${
              isListening
                ? 'bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />

          {/* Voice AI Mic Action Button */}
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  if (onSearchQuery) onSearchQuery('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/50'
                  : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40'
              }`}
              title={isListening ? "Stop listening" : "Click to speak (Voice AI)"}
            >
              {isListening ? (
                <Mic className="w-3.5 h-3.5 animate-bounce" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
              {isListening && (
                <span className="text-[10px] font-mono font-bold pr-1">REC</span>
              )}
            </button>
          </div>
        </form>

        {/* Voice AI Parsed Toast Notification */}
        <AnimatePresence>
          {voiceToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              className="absolute top-12 left-0 right-0 z-30 p-2.5 rounded-2xl bg-blue-950/95 border border-blue-500/60 text-blue-200 text-xs shadow-2xl backdrop-blur-md flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 animate-spin" />
                <span className="font-semibold">{voiceToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setVoiceToast(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Right Status & Profile Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-end">
        {/* Weather & AQI Widget */}
        <WeatherAQIWidget city="Guntur" />

        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenAlerts}
          className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse">
              {alertCount}
            </span>
          )}
        </button>

        {/* User Profile Chip */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-900/40">
            {userInitials || <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white leading-tight">{userName}</div>
            <div className="text-[10px] text-blue-400 font-mono">Citizen Portal</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CitizenTopNav;
