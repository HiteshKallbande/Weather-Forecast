import React from 'react';
import {
  Compass,
  LayoutDashboard,
  Radio,
  BarChart3,
  Activity,
  Sliders,
  Plus,
  X,
  MapPin,
  Trash2,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { useWeather } from '../context/WeatherContext';

export default function Sidebar({
  isOpen,
  onClose,
  activeNav,
  onSelectNav,
}) {
  const {
    favorites,
    activeLocation,
    selectLocation,
    removeFavorite,
    unit,
    detectUserLocation,
    isLocating,
  } = useWeather();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'radar', label: 'Radar & Satellite', icon: Radio, badge: 'Live' },
    { id: 'trends', label: 'Atmospheric Trends', icon: BarChart3 },
    { id: 'solar', label: 'Solar Ephemeris', icon: Activity },
    { id: 'settings', label: 'Observatory Settings', icon: Sliders },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 lg:w-80 flex flex-col glass-panel border-r border-white/10 p-5 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 shadow-glow-cyan">
              <Compass className="w-5 h-5 text-aether-cyan animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-0 rounded-xl bg-aether-cyan/10 blur-sm pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-[0.25em] text-sm text-white">AETHERIS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-aether-cyan animate-pulse" />
              </div>
              <p className="text-[10px] tracking-widest text-slate-400 font-mono uppercase">
                Atmospheric Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="py-4">
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400 mb-2 px-3">
            Telemetry Feed
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.08] text-white border border-white/15 shadow-glow-cyan'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-aether-cyan' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-aether-cyan/15 text-aether-cyan border border-aether-cyan/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* GPS Quick Action */}
        <div className="px-1 pb-3">
          <button
            onClick={detectUserLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-aether-cyan/10 to-indigo-500/10 hover:from-aether-cyan/20 hover:to-indigo-500/20 border border-aether-cyan/30 text-xs text-white transition-all group"
          >
            <div className="flex items-center space-x-2">
              <Navigation className={`w-3.5 h-3.5 text-aether-cyan ${isLocating ? 'animate-spin' : ''}`} />
              <span className="font-medium text-[11px]">
                {isLocating ? 'Locating...' : 'Use My Position (GPS)'}
              </span>
            </div>
            <span className="text-[9px] font-mono text-aether-cyan px-1.5 py-0.5 rounded bg-aether-cyan/20">
              LIVE
            </span>
          </button>
        </div>

        {/* Saved Observatories / Locations */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between mb-3 px-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
              Observatories ({favorites.length})
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              PERSISTENT
            </span>
          </div>

          <div className="space-y-2">
            {favorites.map((loc) => {
              const isSelected = activeLocation?.id === loc.id;
              // If activeLocation is currently this observatory, show live temp; otherwise fall back to loc data or coords
              const displayTemp = isSelected && activeLocation
                ? unit === 'C' ? activeLocation.tempC : activeLocation.tempF
                : loc.tempC !== undefined
                ? unit === 'C' ? loc.tempC : loc.tempF
                : null;

              const conditionLabel = isSelected && activeLocation
                ? activeLocation.condition
                : loc.condition || (loc.region ? loc.region : 'Station Active');

              const iconName = isSelected && activeLocation
                ? activeLocation.hourly?.[0]?.icon || 'Sun'
                : loc.conditionType === 'rain' ? 'CloudRain' : 'Sun';

              return (
                <div
                  key={loc.id}
                  className={`w-full group relative rounded-xl transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? 'glass-card border-aether-cyan/40 bg-white/[0.08] shadow-glow-cyan'
                      : 'border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-aether-cyan to-aether-amber rounded-r-full" />
                  )}

                  <button
                    onClick={() => {
                      selectLocation(loc);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full text-left p-3 pr-8"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className="font-semibold text-xs text-white tracking-wide truncate">
                            {loc.city || loc.name}
                          </span>
                          {loc.country && (
                            <span className="text-[10px] text-slate-400 font-mono truncate">
                              {loc.country}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {conditionLabel}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center justify-end space-x-1.5">
                          <WeatherIcon
                            name={iconName}
                            className="w-3.5 h-3.5 text-slate-300"
                          />
                          {displayTemp !== null && (
                            <span className="font-mono text-sm font-semibold text-white">
                              {displayTemp}°
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 block">
                          {loc.latitude ? `${loc.latitude.toFixed(1)}°` : ''}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Remove Favorite Button */}
                  {favorites.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(loc.id);
                      }}
                      title="Remove observatory"
                      className="absolute right-2 top-2 p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Observatory Calibration Footer */}
        <div className="pt-4 mt-2 border-t border-white/[0.08]">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] font-mono text-slate-300 font-medium">
                  SENSOR ARRAY ACTIVE
                </p>
                <p className="text-[9px] font-mono text-slate-400">
                  Open-Meteo High Res Telemetry
                </p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          </div>
        </div>
      </aside>
    </>
  );
}
