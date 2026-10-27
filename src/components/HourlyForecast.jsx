import React from 'react';
import { Clock, Droplets, Wind } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

export default function HourlyForecast({ hourly, unit, accentColor }) {
  const isAmber = accentColor === 'amber';

  return (
    <div className="rounded-3xl glass-card p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-aether-cyan" />
          <h2 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">
            Hourly Telemetry
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Next 12-Hour Projection
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
        {hourly.map((item, idx) => {
          const isNow = idx === 0;
          const temp = unit === 'C' ? item.tempC : item.tempF;

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
                {temp}°
              </span>

              {/* Rain Probability / Pop */}
              <div className="mt-2 flex items-center space-x-1 text-[10px] font-mono text-sky-400">
                <Droplets className="w-2.5 h-2.5" />
                <span>{item.pop}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
