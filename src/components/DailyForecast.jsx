import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { useWeather } from '../context/WeatherContext';

export default function DailyForecast({ daily, unit }) {
  const { isLoadingWeather } = useWeather();

  if (isLoadingWeather && (!daily || daily.length === 0)) {
    return <DailySkeleton />;
  }

  const items = daily || [];

  // Find global min and max across all 7 days to calculate bar percentages
  const allMins = items.map((d) => (unit === 'C' ? d.minC : d.minF));
  const allMaxs = items.map((d) => (unit === 'C' ? d.maxC : d.maxF));
  const weekMin = allMins.length > 0 ? Math.min(...allMins) : 0;
  const weekMax = allMaxs.length > 0 ? Math.max(...allMaxs) : 30;
  const totalRange = weekMax - weekMin || 1;

  return (
    <div className="rounded-3xl glass-card p-6 border border-white/10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-aether-cyan" />
          <h2 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">
            7-Day Synoptic Outlook
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Weekly Microclimate Variance
        </span>
      </div>

      <div className="space-y-3">
        {items.map((day, idx) => {
          const isToday = idx === 0;
          const min = unit === 'C' ? day.minC : day.minF;
          const max = unit === 'C' ? day.maxC : day.maxF;

          // Bar offset and width percentage
          const leftPercent = Math.max(0, ((min - weekMin) / totalRange) * 100);
          const widthPercent = Math.max(12, ((max - min) / totalRange) * 100);

          return (
            <div
              key={day.day + idx}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ${
                isToday
                  ? 'bg-white/[0.06] border border-white/15'
                  : 'bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04]'
              }`}
            >
              {/* Day & Date */}
              <div className="w-24 flex flex-col">
                <span className={`text-xs font-semibold ${isToday ? 'text-white' : 'text-slate-300'}`}>
                  {day.day}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {day.date}
                </span>
              </div>

              {/* Weather Icon & Condition */}
              <div className="flex items-center space-x-2.5 w-36 sm:w-48">
                <WeatherIcon name={day.icon} className="w-4 h-4 text-slate-300 flex-shrink-0" />
                <span className="text-xs text-slate-300 font-light truncate">
                  {day.condition}
                </span>
              </div>

              {/* Rain Chance */}
              <div className="hidden sm:flex items-center space-x-1 w-14 text-[10px] font-mono text-sky-400">
                {day.pop > 0 && (
                  <>
                    <Droplets className="w-3 h-3 flex-shrink-0" />
                    <span>{day.pop}%</span>
                  </>
                )}
              </div>

              {/* Min Temp */}
              <span className="text-xs font-mono text-slate-400 w-8 text-right">
                {min}°
              </span>

              {/* Range Gradient Bar */}
              <div className="flex-1 mx-3 h-1.5 bg-white/[0.08] rounded-full relative overflow-hidden hidden sm:block">
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-aether-cyan via-sky-400 to-aether-amber shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />
              </div>

              {/* Max Temp */}
              <span className="text-xs font-mono font-semibold text-white w-8 text-right">
                {max}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DailySkeleton() {
  return (
    <div className="rounded-3xl glass-card p-6 border border-white/10 animate-pulse">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-white/10" />
          <div className="h-4 w-40 rounded bg-white/10" />
        </div>
        <div className="h-3 w-32 rounded bg-white/05" />
      </div>

      <div className="space-y-3">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
          >
            <div className="w-24 space-y-1">
              <div className="h-3 w-14 rounded bg-white/08" />
              <div className="h-2.5 w-10 rounded bg-white/04" />
            </div>

            <div className="flex items-center space-x-2 w-36 sm:w-48">
              <div className="w-4 h-4 rounded-full bg-white/10" />
              <div className="h-3 w-28 rounded bg-white/06" />
            </div>

            <div className="hidden sm:block h-3 w-8 rounded bg-white/04" />

            <div className="h-3 w-6 rounded bg-white/06" />

            <div className="flex-1 mx-3 h-1.5 bg-white/[0.05] rounded-full hidden sm:block" />

            <div className="h-3 w-6 rounded bg-white/08" />
          </div>
        ))}
      </div>
    </div>
  );
}
