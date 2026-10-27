import React, { useState } from 'react';
import {
  Search,
  Menu,
  Bell,
  SlidersHorizontal,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function Header({
  onToggleSidebar,
  unit,
  onToggleUnit,
  activeLocation,
  searchQuery,
  onSearchChange,
  locations,
  onSelectLocation,
}) {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredLocations = searchQuery.trim()
    ? locations.filter(
        (l) =>
          l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 glass-panel border-b border-white/10 backdrop-blur-xl">
      {/* Left: Mobile hamburger & Location breadcrumb */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10 lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs">
          <span className="font-mono text-slate-400">TELEMETRY</span>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-200">{activeLocation.city}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-slate-400">
            {activeLocation.timezone}
          </span>
        </div>
      </div>

      {/* Center: Frosted Glass Search Bar */}
      <div className="relative flex-1 max-w-md mx-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search observatory, coordinates, or city..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            className="w-full pl-10 pr-12 py-2 text-xs text-white placeholder-slate-400 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 focus:border-aether-cyan/60 focus:outline-none focus:ring-1 focus:ring-aether-cyan/50 focus:bg-white/[0.07] transition-all"
          />
          <div className="absolute right-3 hidden sm:flex items-center space-x-0.5 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-white/[0.06] border border-white/10 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && filteredLocations.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 p-1.5 glass-panel rounded-xl shadow-2xl border border-white/15 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            {filteredLocations.map((loc) => (
              <button
                key={loc.id}
                onMouseDown={() => {
                  onSelectLocation(loc);
                  onSearchChange('');
                  setShowSearchDropdown(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs hover:bg-white/10 transition-colors"
              >
                <div>
                  <span className="font-semibold text-white">{loc.city}</span>
                  <span className="text-slate-400 ml-1.5">{loc.country}</span>
                </div>
                <span className="font-mono text-slate-400">
                  {unit === 'C' ? loc.tempC : loc.tempF}°
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Actions: Live Pill, Unit Toggle, Controls */}
      <div className="flex items-center space-x-3">
        {/* Live Observation indicator */}
        <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10">
          <span className="w-2 h-2 rounded-full bg-aether-cyan shadow-[0_0_8px_#00f0ff] animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-slate-300">
            LIVE TELEMETRY
          </span>
        </div>

        {/* Temperature Unit Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10">
          <button
            onClick={() => onToggleUnit('C')}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all duration-200 ${
              unit === 'C'
                ? 'bg-aether-cyan/20 text-aether-cyan border border-aether-cyan/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => onToggleUnit('F')}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all duration-200 ${
              unit === 'F'
                ? 'bg-aether-amber/20 text-aether-amber border border-aether-amber/40 shadow-glow-amber'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>

        {/* Simulation Sync / Refresh */}
        <button
          onClick={handleRefresh}
          title="Resync Telemetry"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10 transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-aether-cyan' : ''}`}
          />
        </button>

        {/* Notification Bell */}
        <button
          title="Atmospheric Alerts"
          className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-aether-cyan shadow-[0_0_6px_#00f0ff]" />
        </button>
      </div>
    </header>
  );
}
