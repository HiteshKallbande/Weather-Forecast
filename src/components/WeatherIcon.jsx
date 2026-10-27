import React from 'react';
import {
  Sun,
  SunMedium,
  Moon,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  Sparkles,
  Wind,
  Sunrise,
  Sunset,
  ThermometerSnowflake,
  Cloud,
} from 'lucide-react';

const iconMap = {
  Sun,
  SunMedium,
  Moon,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  Sparkles,
  Wind,
  Sunrise,
  Sunset,
  ThermometerSnowflake,
  Cloud,
};

export default function WeatherIcon({ name, className = 'w-5 h-5', glow = false, glowColor = 'cyan' }) {
  const IconComponent = iconMap[name] || Sun;

  const glowStyles = glow
    ? glowColor === 'amber'
      ? 'drop-shadow-[0_0_12px_rgba(255,170,0,0.6)] text-aether-amber'
      : 'drop-shadow-[0_0_12px_rgba(0,240,255,0.6)] text-aether-cyan'
    : '';

  return <IconComponent className={`${className} ${glowStyles} transition-all duration-300`} />;
}
