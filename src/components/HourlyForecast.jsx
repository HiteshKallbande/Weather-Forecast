import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Clock,
  Droplets,
  TrendingUp,
  Thermometer,
  Layers,
  Sparkles,
  Wind,
  Compass,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { useWeather } from '../context/WeatherContext';

/**
 * Custom Dark Glassmorphic Tooltip for Recharts
 */
function CustomGlassTooltip({ active, payload, label, unit, isAmber }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const tempVal = data.temp;
  const popVal = data.pop;

  return (
    <div className="rounded-2xl glass-card p-3.5 border border-white/20 shadow-2xl backdrop-blur-xl bg-midnight-950/95 min-w-[190px] animate-in fade-in zoom-in-95 duration-150">
      {/* Header: Time and Condition Badge */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <div className="flex items-center space-x-1.5 font-mono text-xs">
          <Clock className={`w-3.5 h-3.5 ${isAmber ? 'text-aether-amber' : 'text-aether-cyan'}`} />
          <span className="font-semibold text-white">{data.time}</span>
          {data.isNow && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-white/10 text-white font-mono uppercase tracking-wider">
              Live
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <WeatherIcon name={data.icon} className="w-4 h-4 text-slate-200" />
        </div>
      </div>

      {/* Condition Description */}
      <div className="text-[11px] text-slate-300 font-medium mb-2.5 truncate">
        {data.condition}
      </div>

      {/* Metrics Grid */}
      <div className="space-y-2">
        {/* Temperature */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
            <Thermometer className="w-3 h-3 text-rose-400" />
            <span>Temperature</span>
          </span>
          <span className="text-sm font-mono font-bold text-white flex items-baseline space-x-0.5">
            <span>{tempVal}</span>
            <span className="text-[10px] text-slate-400">°{unit}</span>
          </span>
        </div>

        {/* Rain Probability */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
            <Droplets className="w-3 h-3 text-sky-400" />
            <span>Precipitation</span>
          </span>
          <span className="text-xs font-mono font-semibold text-sky-400">
            {popVal}%
          </span>
        </div>

        {/* Rain progress bar */}
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full"
            style={{ width: `${Math.min(100, Math.max(5, popVal))}%` }}
          />
        </div>

        {/* Supplementary telemetry: Wind & Humidity */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-slate-400">
          {data.wind && (
            <span className="flex items-center space-x-1">
              <Wind className="w-2.5 h-2.5 text-slate-400" />
              <span>{data.wind}</span>
            </span>
          )}
          {data.humidity !== undefined && (
            <span>RH {data.humidity}%</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HourlyForecast({ hourly, unit = 'C', accentColor = 'cyan' }) {
  const { isLoadingWeather } = useWeather();
  const [metricFocus, setMetricFocus] = useState('combined'); // 'combined' | 'temperature' | 'precipitation'
  const [displayMode, setDisplayMode] = useState('chart'); // 'chart' | 'strip'

  const isAmber = accentColor === 'amber';
  const primaryGlowColor = isAmber ? '#ffaa00' : '#00f0ff';
  const precipGlowColor = '#38bdf8';

  const items = hourly || [];

  // Format data for Recharts (24 hours projection)
  const chartData = useMemo(() => {
    return items.map((item, idx) => ({
      time: item.time,
      displayTime: item.time === 'Now' ? 'Now' : item.time.slice(0, 5),
      temp: unit === 'C' ? item.tempC : item.tempF,
      pop: item.pop ?? 0,
      condition: item.condition,
      icon: item.icon,
      wind: item.wind,
      humidity: item.humidity,
      uv: item.uv,
      isNow: idx === 0,
    }));
  }, [items, unit]);

  // Derived telemetry metrics for the 24-hour window
  const telemetrySummary = useMemo(() => {
    if (!chartData.length) return null;
    const temps = chartData.map((d) => d.temp);
    const pops = chartData.map((d) => d.pop);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const maxPop = Math.max(...pops);
    const tempDelta = maxTemp - minTemp;

    return { maxTemp, minTemp, maxPop, tempDelta };
  }, [chartData]);

  if (isLoadingWeather && (!hourly || hourly.length === 0)) {
    return <HourlySkeleton />;
  }

  const minTemp = telemetrySummary ? Math.floor(telemetrySummary.minTemp - 2) : 0;
  const maxTemp = telemetrySummary ? Math.ceil(telemetrySummary.maxTemp + 2) : 40;

  return (
    <div className="rounded-3xl glass-card p-5 sm:p-6 border border-white/10 shadow-glass-subtle">
      {/* Component Header & Interactive Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl ${isAmber ? 'bg-aether-amber/15 text-aether-amber' : 'bg-aether-cyan/15 text-aether-cyan'}`}>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">
                24-Hour Atmospheric Telemetry
              </h2>
              <span className="hidden sm:inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/05 text-slate-300 border border-white/10">
                24H Waveform
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Continuous thermal and precipitation probability gradient
            </p>
          </div>
        </div>

        {/* View & Metric Mode Pills */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Metric Selector */}
          <div className="inline-flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.08]">
            <button
              onClick={() => setMetricFocus('combined')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                metricFocus === 'combined'
                  ? 'bg-white/15 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Combined Temperature & Precipitation"
            >
              Dual
            </button>
            <button
              onClick={() => setMetricFocus('temperature')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                metricFocus === 'temperature'
                  ? isAmber
                    ? 'bg-aether-amber/20 text-aether-amber font-semibold'
                    : 'bg-aether-cyan/20 text-aether-cyan font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Temperature Only"
            >
              Temp
            </button>
            <button
              onClick={() => setMetricFocus('precipitation')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                metricFocus === 'precipitation'
                  ? 'bg-sky-500/20 text-sky-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Precipitation Probability"
            >
              Rain
            </button>
          </div>

          {/* Chart / Strip Toggle */}
          <button
            onClick={() => setDisplayMode((prev) => (prev === 'chart' ? 'strip' : 'chart'))}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
            title={displayMode === 'chart' ? 'Switch to Card Strip' : 'Switch to Waveform Graph'}
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Graph View */}
      {displayMode === 'chart' ? (
        <div className="w-full">
          {/* Recharts Glowing Waveform Chart */}
          <div className="w-full h-64 sm:h-72 -ml-2 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 12, right: 12, left: -14, bottom: 0 }}
              >
                <defs>
                  {/* Glowing Drop-shadow Filters */}
                  <filter id="temperatureGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="4"
                      floodColor={primaryGlowColor}
                      floodOpacity="0.6"
                    />
                  </filter>
                  <filter id="precipGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="3"
                      floodColor="#38bdf8"
                      floodOpacity="0.5"
                    />
                  </filter>

                  {/* Temperature Gradient */}
                  <linearGradient id="tempAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={primaryGlowColor} stopOpacity={0.35} />
                    <stop offset="60%" stopColor={primaryGlowColor} stopOpacity={0.08} />
                    <stop offset="100%" stopColor={primaryGlowColor} stopOpacity={0.0} />
                  </linearGradient>

                  {/* Precipitation Gradient */}
                  <linearGradient id="popAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={precipGlowColor} stopOpacity={0.3} />
                    <stop offset="70%" stopColor={precipGlowColor} stopOpacity={0.05} />
                    <stop offset="100%" stopColor={precipGlowColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                {/* Cyber Grid Lines */}
                <CartesianGrid
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                {/* X-Axis: 24-Hour Time progression */}
                <XAxis
                  dataKey="displayTime"
                  stroke="rgba(148, 163, 184, 0.4)"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  interval={chartData.length > 16 ? 2 : 1}
                />

                {/* Left Y-Axis: Temperature */}
                <YAxis
                  yAxisId="tempAxis"
                  domain={[minTemp, maxTemp]}
                  stroke="rgba(148, 163, 184, 0.4)"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}°`}
                  hide={metricFocus === 'precipitation'}
                />

                {/* Right Y-Axis: Rain Probability (0 - 100%) */}
                <YAxis
                  yAxisId="popAxis"
                  orientation="right"
                  domain={[0, 100]}
                  stroke="rgba(56, 189, 248, 0.4)"
                  tick={{ fill: '#38bdf8', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                  hide={metricFocus === 'temperature'}
                />

                {/* Interactive Glassmorphic Tooltip */}
                <Tooltip
                  content={
                    <CustomGlassTooltip unit={unit} isAmber={isAmber} />
                  }
                  cursor={{
                    stroke: primaryGlowColor,
                    strokeWidth: 1.5,
                    strokeDasharray: '4 4',
                    strokeOpacity: 0.5,
                  }}
                />

                {/* Precipitation Area (Behind Temperature) */}
                {(metricFocus === 'combined' || metricFocus === 'precipitation') && (
                  <Area
                    yAxisId="popAxis"
                    type="monotone"
                    dataKey="pop"
                    name="Rain Probability"
                    stroke={precipGlowColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#popAreaGradient)"
                    filter="url(#precipGlow)"
                    activeDot={{
                      r: 5,
                      fill: '#060911',
                      stroke: precipGlowColor,
                      strokeWidth: 2,
                    }}
                  />
                )}

                {/* Temperature Glowing Area */}
                {(metricFocus === 'combined' || metricFocus === 'temperature') && (
                  <Area
                    yAxisId="tempAxis"
                    type="monotone"
                    dataKey="temp"
                    name="Temperature"
                    stroke={primaryGlowColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tempAreaGradient)"
                    filter="url(#temperatureGlow)"
                    activeDot={{
                      r: 6,
                      fill: '#0b0f19',
                      stroke: primaryGlowColor,
                      strokeWidth: 3,
                    }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* Horizontal Cards Carousel */
        <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {chartData.map((item, idx) => {
            const isNow = idx === 0;

            return (
              <div
                key={idx}
                className={`flex-shrink-0 flex flex-col items-center justify-between p-3.5 rounded-2xl transition-all duration-300 w-24 ${
                  isNow
                    ? isAmber
                      ? 'bg-white/[0.09] border border-aether-amber/40 shadow-glow-amber'
                      : 'bg-white/[0.09] border border-aether-cyan/40 shadow-glow-cyan'
                    : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15'
                }`}
              >
                <span className={`text-[11px] font-mono ${isNow ? 'font-bold text-white' : 'text-slate-400'}`}>
                  {item.time}
                </span>

                <div className="my-2.5">
                  <WeatherIcon
                    name={item.icon}
                    className="w-6 h-6"
                    glow={isNow}
                    glowColor={isAmber ? 'amber' : 'cyan'}
                  />
                </div>

                <span className="text-sm font-semibold text-white font-mono">
                  {item.temp}°{unit}
                </span>

                <div className="mt-2 flex items-center space-x-1 text-[10px] font-mono text-sky-400">
                  <Droplets className="w-2.5 h-2.5" />
                  <span>{item.pop}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 24-Hour Telemetry Summary Metric Chips */}
      {telemetrySummary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-4 border-t border-white/[0.06]">
          {/* Max Temp */}
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Thermometer className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-400 block">Peak Thermal</span>
              <span className="text-xs font-mono font-semibold text-white">
                {telemetrySummary.maxTemp}°{unit}
              </span>
            </div>
          </div>

          {/* Min Temp */}
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Thermometer className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-400 block">Nocturnal Low</span>
              <span className="text-xs font-mono font-semibold text-white">
                {telemetrySummary.minTemp}°{unit}
              </span>
            </div>
          </div>

          {/* Max Precip */}
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-400 block">Precip Risk</span>
              <span className="text-xs font-mono font-semibold text-sky-300">
                {telemetrySummary.maxPop}%
              </span>
            </div>
          </div>

          {/* Thermal Delta */}
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-400 block">Thermal Delta</span>
              <span className="text-xs font-mono font-semibold text-white">
                Δ {telemetrySummary.tempDelta}°{unit}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HourlySkeleton() {
  return (
    <div className="rounded-3xl glass-card p-6 border border-white/10 animate-pulse">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10" />
          <div className="space-y-1.5">
            <div className="h-4 w-44 rounded bg-white/10" />
            <div className="h-2.5 w-60 rounded bg-white/05" />
          </div>
        </div>
        <div className="h-7 w-28 rounded-xl bg-white/05" />
      </div>

      <div className="w-full h-64 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-4" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}
