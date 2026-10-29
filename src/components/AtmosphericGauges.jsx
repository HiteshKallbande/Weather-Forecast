import React from 'react';
import {
  Activity,
  Sun,
  Eye,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Maximize2,
  Wind,
} from 'lucide-react';

/**
 * Helper to compute color and tier for AQI
 */
export function getAqiDetails(aqi = 25) {
  if (aqi <= 50) {
    return {
      status: 'Pristine',
      category: 'Tropospheric Pure',
      color: '#10b981', // emerald
      gradient: 'from-emerald-400 to-teal-400',
      shadowColor: 'rgba(16, 185, 129, 0.35)',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      description: 'Optimal ambient air composition. Particulate density negligible.',
    };
  }
  if (aqi <= 100) {
    return {
      status: 'Moderate',
      category: 'Acceptable Baseline',
      color: '#f59e0b', // amber
      gradient: 'from-amber-400 to-yellow-400',
      shadowColor: 'rgba(245, 158, 11, 0.35)',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      description: 'Air quality is acceptable. Very sensitive individuals may note mild friction.',
    };
  }
  if (aqi <= 150) {
    return {
      status: 'Sensitive',
      category: 'Elevated Particulate',
      color: '#f97316', // orange
      gradient: 'from-orange-400 to-amber-500',
      shadowColor: 'rgba(249, 115, 22, 0.35)',
      badgeBg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      description: 'Sensitive groups may experience respiratory irritation. Limit strenuous aerobic work.',
    };
  }
  if (aqi <= 200) {
    return {
      status: 'Unhealthy',
      category: 'Aerosol Hazing',
      color: '#ef4444', // red
      gradient: 'from-rose-500 to-red-600',
      shadowColor: 'rgba(239, 68, 68, 0.35)',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      description: 'Active aerosol concentration. General public may experience adverse respiratory effects.',
    };
  }
  return {
    status: 'Hazardous',
    category: 'Critical Aerosol',
    color: '#a855f7', // purple
    gradient: 'from-purple-500 to-rose-600',
    shadowColor: 'rgba(168, 85, 247, 0.35)',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    description: 'Health alert: high particulate saturation. Curtail all outdoor physical activities.',
  };
}

/**
 * 1. Air Quality Index (AQI) Semi-Circular Radial Gauge Card
 */
export function AqiGaugeCard({ airQuality }) {
  const aqi = airQuality?.aqi ?? 22;
  const aqiInfo = getAqiDetails(aqi);

  // Gauge calculations for 180° semi-circle
  // Radius = 75, Center = (100, 85), Arc length = PI * 75 = 235.6
  const radius = 75;
  const arcLength = Math.PI * radius;
  const fraction = Math.min(1, Math.max(0.04, aqi / 200));
  const dashOffset = arcLength * (1 - fraction);

  // Indicator dot position on the arc
  const theta = Math.PI * (1 - fraction);
  const dotX = 100 + radius * Math.cos(theta);
  const dotY = 85 - radius * Math.sin(theta);

  // Pollutant raw numbers for progress bars
  const pm25Num = parseFloat(airQuality?.pm25 || '3.5') || 3.5;
  const pm10Num = parseFloat(airQuality?.pm10 || '6.2') || 6.2;
  const o3Num = parseFloat(airQuality?.o3 || '38') || 38;
  const no2Num = parseFloat(airQuality?.no2 || '9.4') || 9.4;

  return (
    <div className="rounded-3xl glass-card p-5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 shadow-glass-subtle">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
            Air Quality Index
          </span>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shadow-sm ${aqiInfo.badgeBg}`}>
          {airQuality?.status || aqiInfo.status}
        </span>
      </div>

      {/* SVG Radial Semi-Circle Gauge */}
      <div className="relative w-full max-w-[200px] mx-auto aspect-[200/105] select-none my-1">
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          <defs>
            <filter id="aqiGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={aqiInfo.color} floodOpacity="0.6" />
            </filter>

            {/* Gauge Background Track */}
            <linearGradient id="aqiTrackGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 25 85 A 75 75 0 0 1 175 85"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Colored Active Progress Arc */}
          <path
            d="M 25 85 A 75 75 0 0 1 175 85"
            fill="none"
            stroke={aqiInfo.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={dashOffset}
            filter="url(#aqiGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Glowing Indicator Bead */}
          <circle
            cx={dotX}
            cy={dotY}
            r="6"
            fill="#ffffff"
            stroke={aqiInfo.color}
            strokeWidth="3"
            filter="url(#aqiGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Center Value Display */}
          <text
            x="100"
            y="72"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="26"
            fontWeight="200"
            fontFamily="monospace"
          >
            {aqi}
          </text>
          <text
            x="100"
            y="88"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="8"
            fontFamily="monospace"
          >
            AQI SCALE
          </text>
        </svg>
      </div>

      {/* Description & Category */}
      <div className="text-center mb-3">
        <p className="text-xs font-mono font-semibold text-white">
          {airQuality?.category || aqiInfo.category}
        </p>
        <p className="text-[11px] text-slate-300 font-light mt-0.5 leading-relaxed">
          {airQuality?.description || aqiInfo.description}
        </p>
      </div>

      {/* Pollutant Breakdown with Mini Progress Bars */}
      <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/[0.06]">
        {/* PM2.5 */}
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400">PM2.5</span>
            <span className="text-white font-semibold">{pm25Num} µg</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${Math.min(100, (pm25Num / 25) * 100)}%` }}
            />
          </div>
        </div>

        {/* PM10 */}
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400">PM10</span>
            <span className="text-white font-semibold">{pm10Num} µg</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-400 rounded-full"
              style={{ width: `${Math.min(100, (pm10Num / 50) * 100)}%` }}
            />
          </div>
        </div>

        {/* Ozone O3 */}
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400">O₃</span>
            <span className="text-white font-semibold">{o3Num} µg</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-400 rounded-full"
              style={{ width: `${Math.min(100, (o3Num / 100) * 100)}%` }}
            />
          </div>
        </div>

        {/* Nitrogen Dioxide NO2 */}
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400">NO₂</span>
            <span className="text-white font-semibold">{no2Num} µg</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full"
              style={{ width: `${Math.min(100, (no2Num / 40) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper to compute UV Risk Tier details
 */
export function getUvDetails(uv = 3.5) {
  if (uv < 3) {
    return {
      tier: 'Low',
      level: 1,
      color: '#10b981',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      burnTime: '60+ mins',
      protection: 'Zero to minimal optical risk. Safe exposure.',
    };
  }
  if (uv < 6) {
    return {
      tier: 'Moderate',
      level: 2,
      color: '#f59e0b',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      burnTime: '45 mins',
      protection: 'Eyewear and SPF 30+ recommended around solar noon.',
    };
  }
  if (uv < 8) {
    return {
      tier: 'High',
      level: 3,
      color: '#f97316',
      badgeBg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      burnTime: '25 mins',
      protection: 'Seek shade during peak hours. Broad-spectrum UV400 filtration advised.',
    };
  }
  if (uv < 11) {
    return {
      tier: 'Very High',
      level: 4,
      color: '#ef4444',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      burnTime: '15 mins',
      protection: 'Intense solar flux. Protective headwear and UV50+ recommended.',
    };
  }
  return {
    tier: 'Extreme',
    level: 5,
    color: '#8b5cf6',
    badgeBg: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    burnTime: '10 mins',
    protection: 'Extreme solar radiation hazard. Minimize unshaded terrestrial exposure.',
  };
}

/**
 * 2. UV Index & Solar Radiation Gauge Card
 */
export function UvGaugeCard({ uvIndex }) {
  const uvValue = uvIndex?.value ?? 3.5;
  const maxToday = uvIndex?.maxToday ?? 5.2;
  const uvDetails = getUvDetails(uvValue);

  // Segmented Risk Tiers: 5 segments
  const tiers = [
    { label: 'Low', range: '0-2', color: '#10b981' },
    { label: 'Mod', range: '3-5', color: '#f59e0b' },
    { label: 'High', range: '6-7', color: '#f97316' },
    { label: 'Very High', range: '8-10', color: '#ef4444' },
    { label: 'Ext', range: '11+', color: '#8b5cf6' },
  ];

  // Radial arc for UV (180° semi-circle)
  const radius = 75;
  const arcLength = Math.PI * radius;
  const fraction = Math.min(1, Math.max(0.04, uvValue / 11));
  const dashOffset = arcLength * (1 - fraction);

  const theta = Math.PI * (1 - fraction);
  const dotX = 100 + radius * Math.cos(theta);
  const dotY = 85 - radius * Math.sin(theta);

  // Peak marker fraction
  const maxFraction = Math.min(1, Math.max(0.04, maxToday / 11));
  const maxTheta = Math.PI * (1 - maxFraction);
  const maxDotX = 100 + radius * Math.cos(maxTheta);
  const maxDotY = 85 - radius * Math.sin(maxTheta);

  return (
    <div className="rounded-3xl glass-card p-5 border border-white/10 hover:border-amber-500/30 transition-all duration-300 shadow-glass-subtle">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
            UV Solar Flux
          </span>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shadow-sm ${uvDetails.badgeBg}`}>
          {uvIndex?.category || uvDetails.tier} Risk
        </span>
      </div>

      {/* SVG Radial Meter */}
      <div className="relative w-full max-w-[200px] mx-auto aspect-[200/105] select-none my-1">
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          <defs>
            <filter id="uvGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={uvDetails.color} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Background Track */}
          <path
            d="M 25 85 A 75 75 0 0 1 175 85"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active UV Progress Arc */}
          <path
            d="M 25 85 A 75 75 0 0 1 175 85"
            fill="none"
            stroke={uvDetails.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={dashOffset}
            filter="url(#uvGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Max Today Marker */}
          {maxToday > uvValue && (
            <circle
              cx={maxDotX}
              cy={maxDotY}
              r="4"
              fill="#fbbf24"
              stroke="#0b0f19"
              strokeWidth="1.5"
              title={`Max Today: ${maxToday}`}
            />
          )}

          {/* Active Value Indicator Bead */}
          <circle
            cx={dotX}
            cy={dotY}
            r="6"
            fill="#ffffff"
            stroke={uvDetails.color}
            strokeWidth="3"
            filter="url(#uvGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Center Value */}
          <text
            x="100"
            y="72"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="26"
            fontWeight="200"
            fontFamily="monospace"
          >
            {uvValue}
          </text>
          <text
            x="100"
            y="88"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="8"
            fontFamily="monospace"
          >
            UV INDEX
          </text>
        </svg>
      </div>

      {/* Risk Tiers Segmented Progress Bar */}
      <div className="grid grid-cols-5 gap-1 mb-3 pt-1">
        {tiers.map((t, idx) => {
          const isActive = idx + 1 === uvDetails.level;
          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  isActive
                    ? 'shadow-[0_0_8px_currentColor]'
                    : 'opacity-30'
                }`}
                style={{ backgroundColor: t.color, color: t.color }}
              />
              <span className={`text-[8px] font-mono mt-1 ${isActive ? 'text-white font-bold' : 'text-slate-500'}`}>
                {t.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Recommendations & Burn Time */}
      <div className="space-y-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Safe Exposure</span>
          </span>
          <span className="text-white font-semibold">
            {uvIndex?.burnTime || uvDetails.burnTime}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Peak Zenith UV</span>
          <span className="text-amber-300 font-semibold">{maxToday}</span>
        </div>

        <p className="text-[11px] text-slate-300 font-light pt-1 leading-relaxed border-t border-white/[0.04]">
          {uvIndex?.recommendation || uvDetails.protection}
        </p>
      </div>
    </div>
  );
}

/**
 * Helper for Visibility tiers
 */
export function getVisibilityDetails(km = 35) {
  if (km >= 30) {
    return {
      tier: 'Ultra Clear',
      color: '#10b981',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      description: 'Infinite visual clarity. Atmospheric particulate scattering at minimum.',
      clarityPct: 98,
    };
  }
  if (km >= 15) {
    return {
      tier: 'Sharp Horizon',
      color: '#38bdf8',
      badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      description: 'High optical transparency across distant horizon landmarks.',
      clarityPct: 82,
    };
  }
  if (km >= 6) {
    return {
      tier: 'Moderate Clarity',
      color: '#f59e0b',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      description: 'Subtle atmospheric haze present. Moderate horizon definition.',
      clarityPct: 60,
    };
  }
  return {
    tier: 'Veiled / Fog',
    color: '#ef4444',
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    description: 'Dense condensation or particulate layer obscuring long-range horizon.',
    clarityPct: 25,
  };
}

/**
 * 3. Atmospheric Visibility & Optical Horizon Gauge Card
 */
export function VisibilityGaugeCard({ visibility, unit = 'C' }) {
  const visKm = visibility?.km ?? 35;
  const visMiles = visibility?.miles ?? parseFloat((visKm * 0.621371).toFixed(1));
  const horizon = visibility?.horizon || 'Ultra Clear';
  const ceiling = visibility?.ceiling || 'Unrestricted';
  const visDetails = getVisibilityDetails(visKm);

  // Semi-circle gauge (0 to 50 km)
  const radius = 75;
  const arcLength = Math.PI * radius;
  const fraction = Math.min(1, Math.max(0.04, visKm / 50));
  const dashOffset = arcLength * (1 - fraction);

  const theta = Math.PI * (1 - fraction);
  const dotX = 100 + radius * Math.cos(theta);
  const dotY = 85 - radius * Math.sin(theta);

  return (
    <div className="rounded-3xl glass-card p-5 border border-white/10 hover:border-sky-500/30 transition-all duration-300 shadow-glass-subtle">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
            Atmospheric Visibility
          </span>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shadow-sm ${visDetails.badgeBg}`}>
          {horizon}
        </span>
      </div>

      {/* SVG Radial Semi-Circle Meter */}
      <div className="relative w-full max-w-[200px] mx-auto aspect-[200/105] select-none my-1">
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          <defs>
            <filter id="visGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={visDetails.color} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 25 85 A 75 75 0 0 1 175 85"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active Visibility Progress Arc */}
          <path
            d="M 25 85 A 75 75 0 0 1 175 85"
            fill="none"
            stroke={visDetails.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={dashOffset}
            filter="url(#visGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Active Indicator Bead */}
          <circle
            cx={dotX}
            cy={dotY}
            r="6"
            fill="#ffffff"
            stroke={visDetails.color}
            strokeWidth="3"
            filter="url(#visGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Center Distance Readout */}
          <text
            x="100"
            y="72"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="26"
            fontWeight="200"
            fontFamily="monospace"
          >
            {unit === 'F' ? visMiles : visKm}
          </text>
          <text
            x="100"
            y="88"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="8"
            fontFamily="monospace"
          >
            {unit === 'F' ? 'MILES' : 'KILOMETERS'}
          </text>
        </svg>
      </div>

      {/* Optical Clarity Progress Bar */}
      <div className="space-y-1 mb-3 pt-1">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400">Tropospheric Clarity</span>
          <span className="text-sky-300 font-semibold">{visDetails.clarityPct}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full shadow-[0_0_8px_#38bdf8]"
            style={{ width: `${visDetails.clarityPct}%` }}
          />
        </div>
      </div>

      {/* Altimetry & Optical Horizon Details */}
      <div className="space-y-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400 flex items-center space-x-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Horizon Ceiling</span>
          </span>
          <span className="text-white font-medium">{ceiling}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Dual Metric</span>
          <span className="text-slate-200">
            {visKm} km / {visMiles} mi
          </span>
        </div>

        <p className="text-[11px] text-slate-300 font-light pt-1 leading-relaxed border-t border-white/[0.04]">
          {visDetails.description}
        </p>
      </div>
    </div>
  );
}

/**
 * Combined Atmospheric Gauges Component
 */
export default function AtmosphericGauges({ location, unit = 'C' }) {
  if (!location) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AqiGaugeCard airQuality={location.airQuality} />
      <UvGaugeCard uvIndex={location.uvIndex} />
      <VisibilityGaugeCard visibility={location.visibility} unit={unit} />
    </div>
  );
}
