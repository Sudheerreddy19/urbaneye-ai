import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Sparkles, Activity, CloudSun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── WeatherAPI.com key ───────────────────────────────────────────────────────
const WEATHER_API_KEY = '94a5b99f680d4110b2e105057262808';

// ── Helpers ──────────────────────────────────────────────────────────────────
// ── EPA PM2.5 → AQI breakpoint formula ──────────────────────────────────────
// Source: https://www.airnow.gov/sites/default/files/2020-05/aqi-technical-assistance-document-sept2018.pdf
const PM25_BREAKPOINTS = [
  { cLow: 0.0,   cHigh: 12.0,  iLow: 0,   iHigh: 50  },
  { cLow: 12.1,  cHigh: 35.4,  iLow: 51,  iHigh: 100 },
  { cLow: 35.5,  cHigh: 55.4,  iLow: 101, iHigh: 150 },
  { cLow: 55.5,  cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
  { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
];

function pm25ToAqi(pm25) {
  const val = parseFloat(pm25);
  if (isNaN(val) || val < 0) return 0;
  const bp = PM25_BREAKPOINTS.find(b => val >= b.cLow && val <= b.cHigh)
          ?? PM25_BREAKPOINTS[PM25_BREAKPOINTS.length - 1];
  return Math.round(
    ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (val - bp.cLow) + bp.iLow
  );
}

function aqiCategory(aqi) {
  if (aqi <= 50)  return { status: 'Good',      color: 'text-emerald-400', dot: 'bg-emerald-400', badge: 'bg-emerald-950/60 border-emerald-800/50' };
  if (aqi <= 100) return { status: 'Moderate',   color: 'text-amber-400',   dot: 'bg-amber-400',   badge: 'bg-amber-950/60 border-amber-800/50' };
  if (aqi <= 150) return { status: 'Unhealthy',  color: 'text-orange-400',  dot: 'bg-orange-400',  badge: 'bg-orange-950/60 border-orange-800/50' };
  return             { status: 'Hazardous', color: 'text-rose-400',    dot: 'bg-rose-400',    badge: 'bg-rose-950/60 border-rose-800/50' };
}

function weatherIcon(condText = '') {
  const t = condText.toLowerCase();
  if (t.includes('rain') || t.includes('drizzle') || t.includes('shower')) return '🌧️';
  if (t.includes('snow') || t.includes('sleet') || t.includes('blizzard')) return '❄️';
  if (t.includes('cloud') || t.includes('overcast') || t.includes('mist') || t.includes('fog')) return '⛅';
  if (t.includes('thunder') || t.includes('storm')) return '⛈️';
  if (t.includes('sunny') || t.includes('clear')) return '☀️';
  return '🌤️';
}

/**
 * WeatherAQIWidget — fetches live weather + AQI from WeatherAPI.com
 * Props:
 *   city        — city name to query (default "Guntur")
 *   staticMode  — if true, uses passed temp/condition/aqiValue/aqiStatus props (no API call)
 */
export const WeatherAqiWidget = ({
  city = 'Guntur',
  // Legacy static props (used as fallback while loading)
  temp: tempProp = '—°C',
  condition: condProp = 'Loading...',
  aqiValue: aqiProp = 0,
  aqiStatus: aqiStatusProp = '...',
  staticMode = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [weather, setWeather]         = useState(null);
  const [loading, setLoading]         = useState(!staticMode);
  const [error, setError]             = useState(null);

  useEffect(() => {
    if (staticMode) return;

    let cancelled = false;
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // WeatherAPI.com: current + AQI (aqi=yes)
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&aqi=yes`
        );
        if (!res.ok) throw new Error(`Weather API ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setWeather({
            tempC:      Math.round(data.current.temp_c),
            condition:  data.current.condition.text,
            humidity:   data.current.humidity,
            windKph:    Math.round(data.current.wind_kph),
            windDir:    data.current.wind_dir,
            feelsLike:  Math.round(data.current.feelslike_c),
            pm25:       data.current.air_quality?.pm2_5?.toFixed(1) ?? '—',
            pm10:       data.current.air_quality?.pm10?.toFixed(1)  ?? '—',
            usEpaIndex: data.current.air_quality?.['us-epa-index'] ?? 0,
            // Accurate AQI using EPA PM2.5 breakpoint formula
            aqiApprox:  pm25ToAqi(data.current.air_quality?.pm2_5 ?? 0),
          });
        }
      } catch (e) {
        if (!cancelled) setError('Live data unavailable');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [city, staticMode]);

  // Resolve display values
  const displayTemp      = weather ? `${weather.tempC}°C` : (loading ? '...' : tempProp);
  const displayCondition = weather ? weather.condition    : (loading ? 'Loading...' : condProp);
  const displayAqi       = weather ? weather.aqiApprox   : aqiProp;
  const aqi              = aqiCategory(displayAqi);
  const icon             = weatherIcon(displayCondition);

  return (
    <div className="relative inline-block select-none">
      {/* Dark Glassmorphic Pill Container */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-xs font-mono text-slate-200 backdrop-blur-xl shadow-lg transition-all duration-200 cursor-pointer group"
        title="Click for live environmental telemetry details"
      >
        {/* Left: Weather */}
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">{icon}</span>
          <span className="font-bold text-white font-sans">
            {loading ? <span className="animate-pulse">...</span> : displayTemp}
          </span>
          <span className="text-slate-400 text-[11px] hidden sm:inline truncate max-w-[70px]">
            {displayCondition.split(' ').slice(0, 2).join(' ')}
          </span>
        </div>

        {/* Separator */}
        <div className="h-3.5 w-[1px] bg-slate-700/80" />

        {/* Right: AQI */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${aqi.dot} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${aqi.dot}`} />
          </span>
          <span className={`font-bold ${aqi.color}`}>
            {error ? <span className="text-slate-400">Offline</span> : (
              <>AQI {displayAqi} <span className="font-normal opacity-90">({aqi.status})</span></>
            )}
          </span>
        </div>
      </button>

      {/* Expanded Environmental Telemetry Dropdown */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-11 right-0 sm:left-0 sm:right-auto z-50 w-64 p-3.5 rounded-2xl bg-slate-950/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl text-xs space-y-2.5 font-mono text-slate-300"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-white font-bold font-sans">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{city} Live Telemetry</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 font-bold">
                {loading ? 'LOADING' : error ? 'OFFLINE' : 'LIVE'}
              </span>
            </div>

            {loading && (
              <div className="text-center text-slate-400 py-2 animate-pulse text-[11px]">
                Fetching live data from WeatherAPI...
              </div>
            )}

            {!loading && error && (
              <div className="text-center text-rose-400 py-2 text-[11px]">
                {error} — showing last known values
              </div>
            )}

            {!loading && (
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <div>
                    <div className="text-slate-400 text-[9px]">Humidity</div>
                    <div className="font-bold text-white">{weather?.humidity ?? '—'}%</div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  <div>
                    <div className="text-slate-400 text-[9px]">Wind Speed</div>
                    <div className="font-bold text-white">{weather ? `${weather.windKph} km/h ${weather.windDir}` : '—'}</div>
                  </div>
                </div>

                {weather && (
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="text-slate-400 text-[9px]">Feels Like</div>
                      <div className="font-bold text-white">{weather.feelsLike}°C</div>
                    </div>
                  </div>
                )}

                {weather && (
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                      <div className="text-slate-400 text-[9px]">PM2.5</div>
                      <div className="font-bold text-white">{weather.pm25} µg/m³</div>
                    </div>
                  </div>
                )}

                <div className={`col-span-2 p-2 rounded-xl border flex items-center justify-between ${aqi.badge}`}>
                  <div className="flex items-center gap-2">
                    <Activity className={`w-3.5 h-3.5 ${aqi.color}`} />
                    <div>
                      <div className="text-slate-300 text-[10px]">Air Quality Index</div>
                      <div className={`font-bold ${aqi.color}`}>{displayAqi} — {aqi.status} Air</div>
                    </div>
                  </div>
                  {weather && (
                    <span className="text-[10px] text-slate-400 font-mono">PM10: {weather.pm10} µg/m³</span>
                  )}
                </div>
              </div>
            )}

            <div className="text-[9px] text-slate-500 text-center pt-1 border-t border-slate-900">
              Powered by WeatherAPI.com • {city} Corridor Node
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const WeatherAQIWidget = WeatherAqiWidget;
export default WeatherAqiWidget;
