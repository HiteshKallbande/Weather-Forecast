import React from 'react';
import {
  MapPin,
  Mountain,
  Compass,
  ArrowUp,
  ArrowDown,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sparkles,
  Star,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { useWeather } from '../context/WeatherContext';

export default function HeroWeather({ location, unit }) {
  const { isLoadingWeather, isFavorite, addFavorite, removeFavorite } = useWeather();

  // If loading and no location data available yet, show skeleton
  if (isLoadingWeather && !location) {
    return <HeroSkeleton unit={unit} />;
  }

  if (!location) {
    return null;
  }

  const currentTemp = unit === 'C' ? location.tempC : location.tempF;
  const feelsLike = unit === 'C' ? location.feelsLikeC : location.feelsLikeF;
  const high = unit === 'C' ? location.highC : location.highF;
  const low = unit === 'C' ? location.lowC : location.lowF;

  const isAmber = location.accentColor === 'amber';
  const accentTextClass = isAmber ? 'text-aether-amber' : 'text-aether-cyan';
  const accentBgClass = isAmber ? 'bg-aether-amber/10' : 'bg-aether-cyan/10';

  const isBookmarked = isFavorite(location.id);

  const toggleBookmark = () => {
    if (isBookmarked) {
      removeFavorite(location.id);
    } else {
      addFavorite(location);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl glass-card border border-white/10 p-6 sm:p-8 lg:p-10 transition-all duration-500 group">
      {/* Ambient Radial Glow Layers */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isAmber
            ? 'bg-gradient-to-br from-aether-amber/20 via-orange-500/10 to-transparent'
            : 'bg-gradient-to-br from-aether-cyan/25 via-blue-500/10 to-transparent'
        }`}
      />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Top Location Telemetry Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${accentBgClass} border border-white/10`}>
              <MapPin className={`w-4 h-4 ${accentTextClass}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {location.city}
                </h1>
                <span className="text-sm font-light text-slate-400">
                  {location.country}
                </span>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${accentBgClass} ${accentTextClass} border border-white/10`}>
                  {location.region}
                </span>

                {/* Favorite Bookmark Button */}
                <button
                  onClick={toggleBookmark}
                  title={isBookmarked ? 'Saved to observatories' : 'Save observatory'}
                  className={`p-1.5 rounded-lg border transition-all ${
                    isBookmarked
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/10'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                {location.coordinates}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
              <Mountain className="w-3.5 h-3.5 text-slate-400" />
              <span>{location.elevation}</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-aether-cyan" />
              <span>{location.localTime} LOCAL</span>
            </div>
          </div>
        </div>

        {/* Hero Main Weather Stats Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
          {/* Giant Temperature & Main Condition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-baseline space-x-2">
              <span className="text-7xl sm:text-8xl lg:text-9xl font-extralight tracking-tighter text-white font-sans drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                {currentTemp}
              </span>
              <span className={`text-4xl sm:text-5xl font-light ${accentTextClass}`}>
                °{unit}
              </span>

              {/* Feels Like & High/Low Pills */}
              <div className="flex flex-col space-y-1.5 ml-4 sm:ml-6 pb-2">
                <div className="flex items-center space-x-1 text-xs font-mono text-slate-300 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10">
                  <span>Feels like</span>
                  <span className="font-semibold text-white">{feelsLike}°</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <ArrowUp className="w-3 h-3 mr-0.5" /> {high}°
                  </span>
                  <span className="flex items-center text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                    <ArrowDown className="w-3 h-3 mr-0.5" /> {low}°
                  </span>
                </div>
              </div>
            </div>

            {/* Condition Title */}
            <div className="mt-4 flex items-center space-x-3">
              <span className="text-xl sm:text-2xl font-medium tracking-wide text-white">
                {location.condition}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                {location.pressure?.system || 'Atmospheric Equilibrium'}
              </span>
            </div>

            {/* Detailed Atmospheric Narrative */}
            <p className="mt-3 text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-xl font-light">
              {location.conditionDetail}
            </p>
          </div>

          {/* Luxury Graphic / Condition Centerpiece */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm relative overflow-hidden">
            <div className="relative flex items-center justify-center w-36 h-36">
              {/* Outer Decorative Orbit Ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full border border-white/10" />

              {/* Main Weather Icon with Glow */}
              <WeatherIcon
                name={location.hourly?.[0]?.icon || 'Sun'}
                className="w-16 h-16 relative z-10"
                glow={true}
                glowColor={isAmber ? 'amber' : 'cyan'}
              />

              {/* Pulsing Light Glow Behind Icon */}
              <div
                className={`absolute w-20 h-20 rounded-full blur-xl pointer-events-none ${
                  isAmber ? 'bg-aether-amber/30' : 'bg-aether-cyan/30'
                }`}
              />
            </div>

            {/* Micro Observation Badge */}
            <div className="mt-4 text-center">
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                Atmosphere Clarity
              </span>
              <p className="text-sm font-semibold text-white tracking-wide">
                {location.visibility?.horizon || 'Clear Horizon'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/[0.08]">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center space-x-3">
            <Wind className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Wind</p>
              <p className="text-xs font-semibold text-white font-mono">
                {location.wind.speedKmh} km/h {location.wind.direction}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center space-x-3">
            <Droplets className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Humidity</p>
              <p className="text-xs font-semibold text-white font-mono">
                {location.humidity.percentage}%
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center space-x-3">
            <Gauge className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Pressure</p>
              <p className="text-xs font-semibold text-white font-mono">
                {location.pressure.hPa} hPa
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center space-x-3">
            <Eye className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Visibility</p>
              <p className="text-xs font-semibold text-white font-mono">
                {location.visibility.km} km
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dedicated Frosted Glass Skeleton Loader for Hero Section
function HeroSkeleton({ unit }) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-card border border-white/10 p-6 sm:p-8 lg:p-10 animate-pulse">
      {/* Background glow placeholder */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />

      {/* Top Header Row Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-36 rounded-lg bg-white/[0.08]" />
              <div className="h-4 w-20 rounded-md bg-white/[0.05]" />
            </div>
            <div className="h-3 w-48 rounded bg-white/[0.04]" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="h-7 w-24 rounded-xl bg-white/[0.05]" />
          <div className="h-7 w-28 rounded-xl bg-white/[0.05]" />
        </div>
      </div>

      {/* Hero Body Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-baseline space-x-4">
            <div className="h-24 w-44 rounded-2xl bg-white/[0.08]" />
            <div className="space-y-2">
              <div className="h-6 w-24 rounded-lg bg-white/[0.05]" />
              <div className="h-6 w-32 rounded-lg bg-white/[0.05]" />
            </div>
          </div>
          <div className="h-7 w-56 rounded-lg bg-white/[0.07]" />
          <div className="space-y-2 max-w-lg">
            <div className="h-3.5 w-full rounded bg-white/[0.04]" />
            <div className="h-3.5 w-4/5 rounded bg-white/[0.04]" />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="w-32 h-32 rounded-full bg-white/[0.04] flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/[0.06]" />
          </div>
          <div className="mt-4 h-3 w-28 rounded bg-white/[0.05]" />
          <div className="mt-2 h-4 w-36 rounded bg-white/[0.07]" />
        </div>
      </div>

      {/* Highlights Bar Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/[0.08]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-2">
            <div className="h-3 w-12 rounded bg-white/[0.04]" />
            <div className="h-4 w-20 rounded bg-white/[0.07]" />
          </div>
        ))}
      </div>
    </div>
  );
}
