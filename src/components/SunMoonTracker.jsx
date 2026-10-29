import React, { useMemo } from 'react';
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Clock,
  Compass,
  Sparkles,
  Orbit,
  Eye,
  Calendar,
} from 'lucide-react';

/**
 * Convert HH:MM time string to minutes from midnight
 */
function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 720;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 720;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return 720;
  return hours * 60 + minutes;
}

/**
 * Format minutes from midnight back to HH:MM (24h)
 */
function formatMinutesToTime(totalMins) {
  const norm = ((Math.round(totalMins) % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export default function SunMoonTracker({ sun, moon, localTime, accentColor = 'cyan' }) {
  const isAmber = accentColor === 'amber';

  const sunriseStr = sun?.sunrise || '06:30';
  const sunsetStr = sun?.sunset || '18:30';
  const solarNoonStr = sun?.solarNoon || '12:30';
  const dayLengthStr = sun?.dayLength || '12h 00m';
  const daylightStatus = sun?.daylightRemaining || 'Daylight Active';
  const goldenHour = sun?.goldenHour || '17:40 - 18:22';
  const solarElevation = sun?.solarElevation || '+32.4°';

  // Compute Solar Coordinates & Arc Position
  const solarPosition = useMemo(() => {
    const riseMins = parseTimeToMinutes(sunriseStr);
    const setMins = parseTimeToMinutes(sunsetStr);
    const noonMins = parseTimeToMinutes(solarNoonStr);

    let curMins = 720;
    if (localTime) {
      curMins = parseTimeToMinutes(localTime);
    } else {
      const now = new Date();
      curMins = now.getHours() * 60 + now.getMinutes();
    }

    const isDay = curMins >= riseMins && curMins <= setMins;

    // Center = 250, RadiusX = 190, RadiusY = 120, HorizonY = 150
    const centerX = 250;
    const horizonY = 150;
    const rx = 190;
    const ry = 115;

    let progress = 0;
    let sunX = centerX - rx;
    let sunY = horizonY;

    if (isDay) {
      const daySpan = Math.max(1, setMins - riseMins);
      progress = Math.min(1, Math.max(0, (curMins - riseMins) / daySpan));

      // Angle from PI (sunrise) to 0 (sunset)
      const theta = Math.PI * (1 - progress);
      sunX = centerX + rx * Math.cos(theta);
      sunY = horizonY - ry * Math.sin(theta);
    } else {
      // Night progression
      const nightSpan = (1440 - setMins) + riseMins;
      let nightProgress = 0;
      if (curMins > setMins) {
        nightProgress = (curMins - setMins) / nightSpan;
      } else {
        nightProgress = (1440 - setMins + curMins) / nightSpan;
      }
      progress = nightProgress;
      // Below horizon subtle placement
      const theta = Math.PI * (1 - progress);
      sunX = centerX + rx * Math.cos(theta);
      sunY = horizonY + 30 + Math.sin(progress * Math.PI) * 20;
    }

    return {
      isDay,
      progress,
      curTime: formatMinutesToTime(curMins),
      sunX: Math.round(sunX * 10) / 10,
      sunY: Math.round(sunY * 10) / 10,
    };
  }, [sunriseStr, sunsetStr, solarNoonStr, localTime]);

  // Moon phase metrics fallback
  const lunarData = useMemo(() => {
    if (moon && moon.phaseName) {
      return moon;
    }
    return {
      phaseName: 'Waxing Gibbous',
      illumination: 84,
      phaseValue: 0.38,
      stage: 'Waxing',
      daysToNextFullMoon: 3.2,
      moonAgeDays: 11.4,
      moonrise: '17:15',
      moonset: '06:05',
    };
  }, [moon]);

  // Render SVG arc path for traversed daylight
  const traversedArcPath = useMemo(() => {
    if (!solarPosition.isDay || solarPosition.progress <= 0) return '';
    const centerX = 250;
    const horizonY = 150;
    const rx = 190;
    const ry = 115;
    const startX = centerX - rx;
    const startY = horizonY;

    return `M ${startX} ${startY} A ${rx} ${ry} 0 0 1 ${solarPosition.sunX} ${solarPosition.sunY}`;
  }, [solarPosition]);

  return (
    <div className="rounded-3xl glass-card p-5 sm:p-6 border border-white/10 shadow-glass-subtle">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
            <Orbit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">
                Celestial Ephemeris
              </h2>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/05 text-slate-300 border border-white/10">
                Orbital Tracker
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Solar Zenith • Terrestrial Horizon Arc • Lunar Illumination
            </p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center space-x-2 self-start sm:self-auto font-mono text-xs">
          <span
            className={`px-2.5 py-1 rounded-full border text-[10px] flex items-center space-x-1.5 ${
              solarPosition.isDay
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-glow-amber'
                : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                solarPosition.isDay ? 'bg-amber-400' : 'bg-indigo-400'
              }`}
            />
            <span>{solarPosition.isDay ? 'Daylight Telemetry' : 'Nocturnal Cycle'}</span>
          </span>
        </div>
      </div>

      {/* Grid Layout: Main Solar Arc Widget (Left/Top) + Lunar Phase Card (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Glowing Celestial Arc Indicator */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full max-w-lg aspect-[500/220] select-none">
            <svg
              viewBox="0 0 500 220"
              className="w-full h-full overflow-visible"
            >
              <defs>
                {/* Glowing Sun Filters */}
                <filter id="sunOrbGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ffaa00" floodOpacity="0.8" />
                  <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#ff7700" floodOpacity="0.5" />
                </filter>

                <filter id="arcGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.4" />
                </filter>

                {/* Arc Gradient */}
                <linearGradient id="solarArcGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#fef08a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.7" />
                </linearGradient>

                {/* Day Fill Gradient */}
                <radialGradient id="skyZenithGlow" cx="50%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.12" />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#0b0f19" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Sky Dome Ambient Shading */}
              <ellipse
                cx="250"
                cy="150"
                rx="190"
                ry="115"
                fill="url(#skyZenithGlow)"
              />

              {/* Base Horizon Line */}
              <line
                x1="30"
                y1="150"
                x2="470"
                y2="150"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x="250"
                y="166"
                textAnchor="middle"
                fill="rgba(148, 163, 184, 0.6)"
                fontSize="9"
                fontFamily="monospace"
              >
                TERRESTRIAL HORIZON 0°
              </text>

              {/* Full Sky Dome Arc (Dotted Track) */}
              <path
                d="M 60 150 A 190 115 0 0 1 440 150"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />

              {/* Traversed Sun Arc with Golden Neon Glow */}
              {solarPosition.isDay && (
                <path
                  d={traversedArcPath}
                  fill="none"
                  stroke="url(#solarArcGrad)"
                  strokeWidth="3.5"
                  filter="url(#arcGlow)"
                  strokeLinecap="round"
                />
              )}

              {/* Milestone Markers */}
              {/* 1. Sunrise on Horizon */}
              <g transform="translate(60, 150)">
                <circle r="5" fill="#f59e0b" />
                <circle r="9" fill="none" stroke="#f59e0b" strokeOpacity="0.3" strokeWidth="1.5" />
                <text
                  x="0"
                  y="26"
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {sunriseStr}
                </text>
                <text
                  x="0"
                  y="38"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  SUNRISE
                </text>
              </g>

              {/* 2. Solar Noon Zenith Apex */}
              <g transform="translate(250, 35)">
                <circle r="4" fill="#fef08a" />
                <circle r="8" fill="none" stroke="#fef08a" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="0" y1="8" x2="0" y2="115" stroke="rgba(254, 240, 138, 0.15)" strokeDasharray="3 3" />
                <text
                  x="0"
                  y="-14"
                  textAnchor="middle"
                  fill="#fef08a"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {solarNoonStr}
                </text>
                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  SOLAR NOON (ZENITH)
                </text>
              </g>

              {/* 3. Sunset on Horizon */}
              <g transform="translate(440, 150)">
                <circle r="5" fill="#ea580c" />
                <circle r="9" fill="none" stroke="#ea580c" strokeOpacity="0.3" strokeWidth="1.5" />
                <text
                  x="0"
                  y="26"
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {sunsetStr}
                </text>
                <text
                  x="0"
                  y="38"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  SUNSET
                </text>
              </g>

              {/* Current Active Celestial Sun Indicator */}
              {solarPosition.isDay ? (
                <g transform={`translate(${solarPosition.sunX}, ${solarPosition.sunY})`}>
                  {/* Outer Radiant Pulse Wave */}
                  <circle
                    r="14"
                    fill="none"
                    stroke="#ffaa00"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    className="animate-ping"
                  />
                  {/* Glow Base */}
                  <circle
                    r="10"
                    fill="#ffdd00"
                    filter="url(#sunOrbGlow)"
                  />
                  <circle
                    r="6"
                    fill="#ffffff"
                  />

                  {/* Sun Position Tooltip Box */}
                  <g transform="translate(0, -22)">
                    <rect
                      x="-42"
                      y="-16"
                      width="84"
                      height="16"
                      rx="8"
                      fill="#060911"
                      stroke="#ffaa00"
                      strokeWidth="1"
                      strokeOpacity="0.7"
                    />
                    <text
                      x="0"
                      y="-5"
                      textAnchor="middle"
                      fill="#fef08a"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {solarElevation}
                    </text>
                  </g>
                </g>
              ) : (
                /* Nocturnal Sun indicator below horizon */
                <g transform={`translate(${solarPosition.sunX}, ${solarPosition.sunY})`}>
                  <circle r="5" fill="#6366f1" fillOpacity="0.6" />
                  <text
                    x="0"
                    y="14"
                    textAnchor="middle"
                    fill="#818cf8"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    SUN {solarElevation}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Solar Metrics Summary Ribbon */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 mt-1 border-t border-white/[0.06]">
            {/* Total Photoperiod */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center sm:text-left">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Daylight Span</span>
              <span className="text-xs font-mono font-semibold text-white">{dayLengthStr}</span>
            </div>

            {/* Current Solar Status */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center sm:text-left">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Solar Regime</span>
              <span className="text-xs font-mono font-semibold text-amber-300 truncate block">
                {daylightStatus}
              </span>
            </div>

            {/* Golden Hour */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center sm:text-left">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Golden Hour</span>
              <span className="text-xs font-mono font-semibold text-white">{goldenHour}</span>
            </div>

            {/* Solar Elevation */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center sm:text-left">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Solar Altitude</span>
              <span className="text-xs font-mono font-semibold text-emerald-400">{solarElevation}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Moon Phase Observatory Card */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center space-x-2">
              <Moon className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                Lunar Phase
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
              {lunarData.stage || 'Waxing'}
            </span>
          </div>

          {/* Visual Moon Disk Graphic */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center">
              {/* Lunar Ambient Glow */}
              <div
                className="absolute inset-0 rounded-full blur-xl bg-violet-600/20"
                style={{
                  opacity: Math.max(0.2, (lunarData.illumination || 50) / 100),
                }}
              />

              {/* Realistic SVG Moon Disk */}
              <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-[0_0_15px_rgba(167,139,250,0.4)]">
                <defs>
                  <radialGradient id="lunarSurface" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#64748b" />
                  </radialGradient>
                  <radialGradient id="lunarDark" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0b0f19" />
                  </radialGradient>
                  <clipPath id="moonCircle">
                    <circle cx="50" cy="50" r="46" />
                  </clipPath>
                </defs>

                {/* Base Dark Moon Circle */}
                <circle cx="50" cy="50" r="46" fill="url(#lunarDark)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                {/* Illuminated Surface Shape */}
                <g clipPath="url(#moonCircle)">
                  {/* Full illuminated base */}
                  <circle cx="50" cy="50" r="46" fill="url(#lunarSurface)" />

                  {/* Shadow overlay based on phase angle */}
                  {lunarData.illumination < 98 && (
                    <path
                      d={
                        lunarData.illumination < 50
                          ? `M 50 4 A 46 46 0 0 0 50 96 A ${(50 - lunarData.illumination) * 0.9} 46 0 0 1 50 4 Z`
                          : `M 50 4 A 46 46 0 0 1 50 96 A ${(lunarData.illumination - 50) * 0.9} 46 0 0 1 50 4 Z`
                      }
                      fill="url(#lunarDark)"
                      fillOpacity="0.88"
                    />
                  )}

                  {/* Mare / Crater textures */}
                  <circle cx="38" cy="38" r="9" fill="#475569" fillOpacity="0.25" />
                  <circle cx="62" cy="48" r="14" fill="#475569" fillOpacity="0.2" />
                  <circle cx="48" cy="68" r="8" fill="#475569" fillOpacity="0.22" />
                  <circle cx="32" cy="58" r="5" fill="#475569" fillOpacity="0.18" />
                </g>
              </svg>
            </div>
          </div>

          {/* Moon Name & Illumination Percentage */}
          <div className="text-center space-y-1">
            <h3 className="text-sm font-semibold text-white font-mono">
              {lunarData.phaseName}
            </h3>
            <p className="text-xs font-mono text-violet-300">
              {lunarData.illumination}% Illumination
            </p>
          </div>

          {/* Illumination Progress Bar */}
          <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(167,139,250,0.5)]"
              style={{ width: `${lunarData.illumination}%` }}
            />
          </div>

          {/* Lunar Ephemeris Details */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Next Full Moon</span>
              </span>
              <span className="text-white font-medium">In {lunarData.daysToNextFullMoon} days</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Lunar Age</span>
              </span>
              <span className="text-white font-medium">{lunarData.moonAgeDays} days</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Moonrise / Set</span>
              <span className="text-white font-medium">
                {lunarData.moonrise || '18:40'} / {lunarData.moonset || '06:15'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
