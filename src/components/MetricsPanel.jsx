import React from 'react';
import {
  ShieldAlert,
  Sun,
  Wind,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Eye,
  Activity,
  Compass,
  ArrowUpRight,
} from 'lucide-react';

export default function MetricsPanel({ location, unit }) {
  const { airQuality, uvIndex, wind, humidity, pressure, sun, visibility } = location;

  return (
    <aside className="w-full xl:w-96 flex flex-col space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-aether-cyan" />
          <h2 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">
            Atmospheric Metrics
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Precision Telemetry
        </span>
      </div>

      {/* Grid of Atmospheric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
        {/* 1. Air Quality Index (AQI) */}
        <div className="rounded-3xl glass-card p-5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Air Quality Index (AQI)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
              {airQuality.status}
            </span>
          </div>

          <div className="flex items-baseline space-x-3 mb-2">
            <span className="text-4xl font-extralight text-white font-mono">
              {airQuality.aqi}
            </span>
            <span className="text-xs font-mono text-slate-400">
              AQI • {airQuality.category}
            </span>
          </div>

          {/* AQI Progress bar */}
          <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-aether-cyan rounded-full shadow-[0_0_8px_#34d399]"
              style={{ width: `${Math.min(100, (airQuality.aqi / 150) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-300 font-light leading-relaxed mb-3">
            {airQuality.description}
          </p>

          <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/[0.06] text-center">
            <div className="p-1.5 rounded-lg bg-white/[0.02]">
              <span className="text-[9px] font-mono text-slate-400 block">PM2.5</span>
              <span className="text-[10px] font-mono text-white font-semibold">{airQuality.pm25}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.02]">
              <span className="text-[9px] font-mono text-slate-400 block">PM10</span>
              <span className="text-[10px] font-mono text-white font-semibold">{airQuality.pm10}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.02]">
              <span className="text-[9px] font-mono text-slate-400 block">O₃</span>
              <span className="text-[10px] font-mono text-white font-semibold">{airQuality.o3}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.02]">
              <span className="text-[9px] font-mono text-slate-400 block">NO₂</span>
              <span className="text-[10px] font-mono text-white font-semibold">{airQuality.no2}</span>
            </div>
          </div>
        </div>

        {/* 2. UV Index & Solar Radiation */}
        <div className="rounded-3xl glass-card p-5 border border-white/10 hover:border-aether-amber/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              UV Solar Radiation
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-aether-amber/15 text-aether-amber border border-aether-amber/30">
              {uvIndex.category}
            </span>
          </div>

          <div className="flex items-baseline space-x-3 mb-2">
            <span className="text-4xl font-extralight text-white font-mono">
              {uvIndex.value}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Max Today: {uvIndex.maxToday}
            </span>
          </div>

          {/* UV Meter bar */}
          <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full shadow-glow-amber"
              style={{ width: `${Math.min(100, (uvIndex.value / 11) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-300 font-light leading-relaxed">
            {uvIndex.recommendation}
          </p>
        </div>

        {/* 3. Wind & Aerodynamics Vector */}
        <div className="rounded-3xl glass-card p-5 border border-white/10 hover:border-aether-cyan/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Wind & Aerodynamics
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {wind.type}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-extralight text-white font-mono">
                  {wind.speedKmh}
                </span>
                <span className="text-xs font-mono text-slate-400">km/h</span>
              </div>
              <p className="text-[11px] font-mono text-slate-300 mt-1">
                Direction: {wind.direction} ({wind.angle}°)
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                Peak Gusts: {wind.gustKmh} km/h
              </p>
            </div>

            {/* Visual Compass Needle */}
            <div className="relative w-16 h-16 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center">
              <span className="absolute top-1 text-[8px] font-mono text-slate-400 font-bold">N</span>
              <span className="absolute bottom-1 text-[8px] font-mono text-slate-400">S</span>
              <span className="absolute right-1 text-[8px] font-mono text-slate-400">E</span>
              <span className="absolute left-1 text-[8px] font-mono text-slate-400">W</span>
              <div
                className="w-10 h-0.5 bg-gradient-to-r from-aether-cyan to-transparent rounded-full shadow-[0_0_8px_#00f0ff] transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${wind.angle - 90}deg)` }}
              />
              <div className="w-2 h-2 rounded-full bg-white border border-black shadow" />
            </div>
          </div>
        </div>

        {/* 4. Humidity & Dew Point */}
        <div className="rounded-3xl glass-card p-5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Humidity & Saturation
            </span>
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
          </div>

          <div className="flex items-baseline space-x-3 mb-2">
            <span className="text-3xl font-extralight text-white font-mono">
              {humidity.percentage}%
            </span>
            <span className="text-xs font-mono text-slate-400">
              Dew point: {unit === 'C' ? humidity.dewPointC : humidity.dewPointF}°
            </span>
          </div>

          <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full"
              style={{ width: `${humidity.percentage}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-300 font-light">
            Status: {humidity.comfortLevel}
          </p>
        </div>

        {/* 5. Barometric Pressure & System */}
        <div className="rounded-3xl glass-card p-5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Barometric Altimetry
            </span>
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-light text-white font-mono">
              {pressure.hPa}
            </span>
            <span className="text-xs font-mono text-slate-400">hPa</span>
            <span className="text-[10px] font-mono text-slate-400">
              ({pressure.inHg} inHg)
            </span>
          </div>

          <p className="text-[11px] font-mono text-emerald-400 mt-1">
            Trend: {pressure.trend}
          </p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
            Atmospheric Mode: {pressure.system}
          </p>
        </div>

        {/* 6. Solar Ephemeris & Twilight Arc */}
        <div className="rounded-3xl glass-card p-5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Solar Ephemeris
            </span>
            <span className="text-[10px] font-mono text-aether-amber">
              {sun.daylightRemaining}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center space-x-2.5">
              <Sunrise className="w-4 h-4 text-aether-amber" />
              <div>
                <span className="text-[9px] font-mono text-slate-400 block">SUNRISE</span>
                <span className="text-xs font-mono font-semibold text-white">{sun.sunrise}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center space-x-2.5">
              <Sunset className="w-4 h-4 text-orange-400" />
              <div>
                <span className="text-[9px] font-mono text-slate-400 block">SUNSET</span>
                <span className="text-xs font-mono font-semibold text-white">{sun.sunset}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
            <span>Golden Hour: {sun.goldenHour}</span>
            <span>Elevation: {sun.solarElevation}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
