import React, { useState } from 'react';
import { mockLocations } from './data/mockWeather';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HeroWeather from './components/HeroWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import MetricsPanel from './components/MetricsPanel';

export default function App() {
  const [locations] = useState(mockLocations);
  const [activeLocation, setActiveLocation] = useState(mockLocations[0]);
  const [unit, setUnit] = useState('C'); // 'C' | 'F'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-midnight-900 text-slate-100 flex flex-col font-sans antialiased selection:bg-aether-cyan/30 selection:text-white">
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          locations={locations}
          activeLocation={activeLocation}
          onSelectLocation={setActiveLocation}
          unit={unit}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeNav={activeNav}
          onSelectNav={setActiveNav}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <Header
            onToggleSidebar={() => setSidebarOpen(true)}
            unit={unit}
            onToggleUnit={setUnit}
            activeLocation={activeLocation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            locations={locations}
            onSelectLocation={setActiveLocation}
          />

          {/* Main Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Master Grid: Main Hero & Forecasts (Left) + Atmospheric Metrics (Right) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Left Column: Hero, Hourly, 7-Day Forecast */}
              <div className="xl:col-span-8 space-y-6">
                <HeroWeather location={activeLocation} unit={unit} />
                <HourlyForecast
                  hourly={activeLocation.hourly}
                  unit={unit}
                  accentColor={activeLocation.accentColor}
                />
                <DailyForecast daily={activeLocation.daily} unit={unit} />
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
                <span>GLOBAL OBSERVATORIES: 5 ONLINE</span>
                <span>•</span>
                <span className="text-emerald-400/80">LATENCY: 12ms</span>
                <span>•</span>
                <span>PRECISION INSTRUMENTATION</span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
