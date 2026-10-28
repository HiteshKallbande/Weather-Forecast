import React, { useState } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HeroWeather from './components/HeroWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import MetricsPanel from './components/MetricsPanel';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

function DashboardContent() {
  const {
    activeLocation,
    unit,
    weatherError,
    setWeatherError,
    locationError,
    setLocationError,
    refreshWeather,
    isLoadingWeather,
  } = useWeather();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="min-h-screen bg-midnight-900 text-slate-100 flex flex-col font-sans antialiased selection:bg-aether-cyan/30 selection:text-white">
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeNav={activeNav}
          onSelectNav={setActiveNav}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <Header onToggleSidebar={() => setSidebarOpen(true)} />

          {/* Main Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Atmospheric Telemetry Error Banner */}
            {(weatherError || locationError) && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-rose-100">Telemetry Communication Warning</p>
                    <p className="text-[11px] text-rose-300/90 font-light mt-0.5">
                      {weatherError || locationError}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => refreshWeather()}
                    disabled={isLoadingWeather}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs border border-white/10 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin' : ''}`} />
                    <span>Retry Sync</span>
                  </button>
                  <button
                    onClick={() => {
                      setWeatherError(null);
                      setLocationError(null);
                    }}
                    className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Master Grid: Main Hero & Forecasts (Left) + Atmospheric Metrics (Right) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Left Column: Hero, Hourly, 7-Day Forecast */}
              <div className="xl:col-span-8 space-y-6">
                <HeroWeather location={activeLocation} unit={unit} />
                <HourlyForecast
                  hourly={activeLocation?.hourly}
                  unit={unit}
                  accentColor={activeLocation?.accentColor}
                />
                <DailyForecast daily={activeLocation?.daily} unit={unit} />
              </div>

              {/* Right Column: Atmospheric Metrics */}
              <div className="xl:col-span-4">
                <MetricsPanel location={activeLocation} unit={unit} />
              </div>
            </div>

            {/* Subtle Observatory Status Footer */}
            <footer className="pt-8 pb-4 text-center border-t border-white/[0.06]">
              <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-slate-400">
                <span>AETHERIS ATMOSPHERIC SYSTEM V4.8</span>
                <span>•</span>
                <span className="text-aether-cyan">PROVIDER: OPEN-METEO GLOBAL WMO</span>
                <span>•</span>
                <span className="text-emerald-400/80">LATENCY: 8ms</span>
                <span>•</span>
                <span>PRECISION SENSOR TELEMETRY</span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <DashboardContent />
    </WeatherProvider>
  );
}
