import React from 'react';
import {
  Sun,
  Wind,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Activity,
  Compass,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import {
  AqiGaugeCard,
  UvGaugeCard,
  VisibilityGaugeCard,
} from './AtmosphericGauges';

export default function MetricsPanel({ location, unit }) {
  const { isLoadingWeather } = useWeather();

  if (isLoadingWeather && (!location || !location.airQuality)) {
    return <MetricsSkeleton />;
  }

  if (!location) return null;

  const { airQuality, uvIndex, wind, humidity, pressure, visibility, sun } = location;

  return (
    <aside className="w-full xl:w-96 flex flex-col space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-aether-cyan" />
          <h2 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">
            Atmospheric Telemetry
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Precision Sensor Suite
        </span>
      </div>

      {/* Grid of Atmospheric Metric Gauges & Instruments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
        {/* 1. Custom Air Quality Index (AQI) Gauge Card */}
        <AqiGaugeCard airQuality={airQuality} />

        {/* 2. Custom UV Index & Risk Levels Gauge Card */}
        <UvGaugeCard uvIndex={uvIndex} />

        {/* 3. Custom Atmospheric Visibility & Horizon Gauge Card */}
        <VisibilityGaugeCard visibility={visibility} unit={unit} />

        {/* 4. Wind & Aerodynamics Vector Instrument */}
        <div className="rounded-3xl glass-card p-5 border border-white/10 hover:border-aether-cyan/30 transition-all duration-300 shadow-glass-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Wind & Aerodynamics
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {wind?.type || 'Laminar Flow'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-extralight text-white font-mono">
                  {unit === 'F' ? (wind?.speedMph ?? 8) : (wind?.speedKmh ?? 12)}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {unit === 'F' ? 'mph' : 'km/h'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-300 mt-1">
                Direction: {wind?.direction || 'N'} ({wind?.angle ?? 0}°)
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                Peak Gusts: {unit === 'F' ? Math.round((wind?.gustKmh ?? 18) * 0.621371) : (wind?.gustKmh ?? 18)} {unit === 'F' ? 'mph' : 'km/h'}
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
                style={{ transform: `rotate(${(wind?.angle ?? 90) - 90}deg)` }}
              />
              <div className="w-2 h-2 rounded-full bg-white border border-black shadow" />
            </div>
          </div>
        </div>

        {/* 5. Humidity & Dew Point Saturation */}
        <div className="rounded-3xl glass-card p-5 border border-white/10 shadow-glass-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Humidity & Saturation
            </span>
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
          </div>

          <div className="flex items-baseline space-x-3 mb-2">
            <span className="text-3xl font-extralight text-white font-mono">
              {humidity?.percentage ?? 50}%
            </span>
            <span className="text-xs font-mono text-slate-400">
              Dew point: {unit === 'C' ? humidity?.dewPointC : humidity?.dewPointF}°{unit}
            </span>
          </div>

          <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full"
              style={{ width: `${humidity?.percentage ?? 50}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-300 font-light">
            Status: {humidity?.comfortLevel || 'Equilibrium'}
          </p>
        </div>

        {/* 6. Barometric Pressure & System */}
        <div className="rounded-3xl glass-card p-5 border border-white/10 shadow-glass-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
              Barometric Altimetry
            </span>
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-light text-white font-mono">
              {pressure?.hPa ?? 1013.2}
            </span>
            <span className="text-xs font-mono text-slate-400">hPa</span>
            <span className="text-[10px] font-mono text-slate-400">
              ({pressure?.inHg ?? 29.92} inHg)
            </span>
          </div>

          <p className="text-[11px] font-mono text-emerald-400 mt-1">
            Trend: {pressure?.trend || 'Stable'}
          </p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
            Atmospheric Mode: {pressure?.system || 'Barometric Equilibrium'}
          </p>
        </div>
      </div>
    </aside>
  );
}

function MetricsSkeleton() {
  return (
    <aside className="w-full xl:w-96 flex flex-col space-y-4 animate-pulse">
      <div className="flex items-center justify-between px-1">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="h-3 w-28 rounded bg-white/05" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl glass-card p-5 border border-white/10 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-32 rounded bg-white/06" />
              <div className="h-4 w-16 rounded-full bg-white/08" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-white/10" />
            <div className="h-1.5 w-full rounded-full bg-white/06" />
            <div className="h-3 w-3/4 rounded bg-white/04" />
          </div>
        ))}
      </div>
    </aside>
  );
}
