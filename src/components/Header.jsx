import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Menu,
  Bell,
  RefreshCw,
  MapPin,
  Compass,
  AlertCircle,
  X,
  Navigation,
  Check,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export default function Header({ onToggleSidebar }) {
  const {
    unit,
    setUnit,
    activeLocation,
    refreshWeather,
    isLoadingWeather,
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    handleSearchChange,
    clearSearch,
    selectSearchResult,
    isLocating,
    locationError,
    setLocationError,
    detectUserLocation,
  } = useWeather();

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K to focus search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowSearchDropdown(true);
      }
      if (e.key === 'Escape') {
        setShowSearchDropdown(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRefresh = async () => {
    if (isLoadingWeather) return;
    await refreshWeather();
  };

  const hasSearchContent = Boolean(searchQuery.trim());
  const showDropdown = showSearchDropdown && hasSearchContent;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 glass-panel border-b border-white/10 backdrop-blur-xl">
      {/* Left: Mobile hamburger & Location breadcrumb */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10 lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs">
          <span className="font-mono text-slate-400">TELEMETRY</span>
          <span className="text-slate-500">/</span>
          <span className="font-semibold text-white truncate max-w-[140px] md:max-w-[200px]">
            {activeLocation?.city || 'Observatory'}
          </span>
          {activeLocation?.country && (
            <span className="text-slate-400 font-normal">
              ({activeLocation.country})
            </span>
          )}
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-aether-cyan hidden md:inline-block">
            {activeLocation?.timezone || 'AUTO'}
          </span>
        </div>
      </div>

      {/* Center: Frosted Glass Search Bar */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-lg mx-2 sm:mx-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search observatory, coordinates (lat, lon), or city..."
            value={searchQuery}
            onChange={(e) => {
              handleSearchChange(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => {
              if (searchQuery.trim()) setShowSearchDropdown(true);
            }}
            className="w-full pl-10 pr-20 sm:pr-24 py-2 text-xs text-white placeholder-slate-400 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 focus:border-aether-cyan/60 focus:outline-none focus:ring-1 focus:ring-aether-cyan/50 focus:bg-white/[0.07] transition-all"
          />

          {/* Right Actions inside search input */}
          <div className="absolute right-2 flex items-center space-x-1">
            {hasSearchContent && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Geolocation trigger */}
            <button
              type="button"
              onClick={detectUserLocation}
              disabled={isLocating}
              className={`p-1.5 rounded-lg border transition-all ${
                isLocating
                  ? 'bg-aether-cyan/20 border-aether-cyan/40 text-aether-cyan animate-pulse'
                  : 'bg-white/[0.05] border-white/10 text-slate-300 hover:text-aether-cyan hover:border-aether-cyan/30'
              }`}
              title="Detect current location via browser GPS"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            </button>

            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-white/[0.06] border border-white/10 rounded pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Search Results / Error / Loading Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 glass-panel rounded-2xl shadow-2xl border border-white/15 z-50 animate-in fade-in slide-in-from-top-1 duration-150 backdrop-blur-2xl">
            {/* Searching indicator */}
            {isSearching && (
              <div className="p-4 flex items-center justify-center space-x-2 text-xs font-mono text-slate-400">
                <RefreshCw className="w-4 h-4 animate-spin text-aether-cyan" />
                <span>Scanning global atmospheric observatories...</span>
              </div>
            )}

            {/* Search Error State */}
            {!isSearching && searchError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                <div className="flex items-center space-x-2 text-rose-300 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>Observatory Not Located</span>
                </div>
                <p className="mt-1 text-slate-300 text-[11px] font-light leading-relaxed">
                  {searchError}
                </p>
                <div className="mt-2 pt-2 border-t border-rose-500/15 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Tip: You can search by coordinates</span>
                  <span className="text-aether-cyan">e.g. 40.71, -74.00</span>
                </div>
              </div>
            )}

            {/* Search Results List */}
            {!isSearching && !searchError && searchResults.length > 0 && (
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Located Observatories ({searchResults.length})
                </div>
                {searchResults.map((loc) => (
                  <button
                    key={loc.id}
                    onMouseDown={() => {
                      selectSearchResult(loc);
                      setShowSearchDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/10 border border-transparent transition-all group"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 group-hover:text-aether-cyan group-hover:bg-aether-cyan/10 transition-colors">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className="font-semibold text-white group-hover:text-aether-cyan transition-colors">
                            {loc.name}
                          </span>
                          {loc.country && (
                            <span className="text-slate-400 text-[11px]">
                              {loc.country}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          {loc.admin1 ? `${loc.admin1} • ` : ''}
                          {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-[10px] font-mono text-aether-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Connect</span>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions: Live Pill, Unit Toggle, Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Live Observation indicator */}
        <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10">
          <span className={`w-2 h-2 rounded-full ${isLoadingWeather ? 'bg-amber-400 animate-ping' : 'bg-aether-cyan shadow-[0_0_8px_#00f0ff] animate-pulse'}`} />
          <span className="text-[10px] font-mono tracking-wider text-slate-300">
            {isLoadingWeather ? 'FETCHING' : 'LIVE OPEN-METEO'}
          </span>
        </div>

        {/* Temperature Unit Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10">
          <button
            onClick={() => setUnit('C')}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all duration-200 ${
              unit === 'C'
                ? 'bg-aether-cyan/20 text-aether-cyan border border-aether-cyan/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all duration-200 ${
              unit === 'F'
                ? 'bg-aether-amber/20 text-aether-amber border border-aether-amber/40 shadow-glow-amber'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>

        {/* Resync Telemetry */}
        <button
          onClick={handleRefresh}
          disabled={isLoadingWeather}
          title="Resync Atmospheric Telemetry"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoadingWeather ? 'animate-spin text-aether-cyan' : ''}`}
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
