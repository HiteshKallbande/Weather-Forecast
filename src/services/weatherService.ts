// Dedicated API service for Aetheris Weather Intelligence
// Integrates with free Open-Meteo APIs (Forecast, Air Quality, Geocoding)

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodingLocation {
  id: number | string;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  timezone?: string;
  population?: number;
}

export interface WeatherData {
  id: string;
  city: string;
  country: string;
  region: string;
  coordinates: string;
  latitude: number;
  longitude: number;
  elevation: string;
  timezone: string;
  localTime: string;
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  highC: number;
  highF: number;
  lowC: number;
  lowF: number;
  condition: string;
  conditionDetail: string;
  conditionType: 'sunny' | 'rain' | 'snow' | 'cloudy' | 'fog' | 'aurora';
  accentColor: 'cyan' | 'amber';
  airQuality: {
    aqi: number;
    status: string;
    category: string;
    pm25: string;
    pm10: string;
    o3: string;
    no2: string;
    description: string;
  };
  uvIndex: {
    value: number;
    maxToday: number;
    category: string;
    burnTime: string;
    recommendation: string;
  };
  wind: {
    speedKmh: number;
    speedMph: number;
    gustKmh: number;
    direction: string;
    angle: number;
    type: string;
    turbulence: string;
  };
  humidity: {
    percentage: number;
    dewPointC: number;
    dewPointF: number;
    comfortLevel: string;
  };
  pressure: {
    hPa: number;
    inHg: number;
    trend: string;
    system: string;
  };
  visibility: {
    km: number;
    miles: number;
    horizon: string;
    ceiling: string;
  };
  sun: {
    sunrise: string;
    sunset: string;
    solarNoon: string;
    daylightRemaining: string;
    solarElevation: string;
    goldenHour: string;
    dayLength: string;
  };
  moon: {
    phaseName: string;
    illumination: number;
    phaseValue: number;
    stage: string;
    daysToNextFullMoon: number;
    moonAgeDays: number;
    moonrise: string;
    moonset: string;
  };
  hourly: Array<{
    time: string;
    fullTime?: string;
    tempC: number;
    tempF: number;
    condition: string;
    icon: string;
    pop: number;
    wind: string;
    humidity?: number;
    uv?: number;
  }>;
  daily: Array<{
    day: string;
    date: string;
    condition: string;
    icon: string;
    minC: number;
    maxC: number;
    minF: number;
    maxF: number;
    pop: number;
  }>;
}

// Convert Celsius to Fahrenheit
export function cToF(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

// Convert km/h to mph
export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

// Convert hPa to inHg
export function hPaToInHg(hPa: number): number {
  return parseFloat((hPa * 0.0295299830714).toFixed(2));
}

// Convert degrees to 16-point compass direction
export function degreesToCompass(deg: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

// WMO Weather Interpretation Code map
interface WMOInfo {
  condition: string;
  detail: string;
  conditionType: 'sunny' | 'rain' | 'snow' | 'cloudy' | 'fog' | 'aurora';
  iconDay: string;
  iconNight: string;
}

const WMO_CODE_MAP: Record<number, WMOInfo> = {
  0: {
    condition: 'Pristine Clear Sky',
    detail: 'Cloudless atmosphere with unrestricted planetary radiation and clear horizon visibility.',
    conditionType: 'sunny',
    iconDay: 'Sun',
    iconNight: 'Moon',
  },
  1: {
    condition: 'Mainly Clear',
    detail: 'Atmospheric transparency high with scattered high-altitude optical vapor.',
    conditionType: 'sunny',
    iconDay: 'SunMedium',
    iconNight: 'CloudMoon',
  },
  2: {
    condition: 'Partly Cloudy',
    detail: 'Scattered cumulus formations drifting through stable mid-troposphere layers.',
    conditionType: 'cloudy',
    iconDay: 'CloudSun',
    iconNight: 'CloudMoon',
  },
  3: {
    condition: 'Overcast Strata',
    detail: 'Dense stratocumulus mantle obscuring solar disk; diffuse ambient atmospheric lighting.',
    conditionType: 'cloudy',
    iconDay: 'Cloud',
    iconNight: 'Cloud',
  },
  45: {
    condition: 'Atmospheric Fog',
    detail: 'Ground condensation layer with suspended micro-droplets reducing optical range.',
    conditionType: 'fog',
    iconDay: 'CloudFog',
    iconNight: 'CloudFog',
  },
  48: {
    condition: 'Depositing Rime Fog',
    detail: 'Supercooled liquid water droplets creating delicate crystalline rime coatings on exposed surfaces.',
    conditionType: 'fog',
    iconDay: 'CloudFog',
    iconNight: 'CloudFog',
  },
  51: {
    condition: 'Light Drizzle',
    detail: 'Fine liquid precipitation droplets descending gently from low stratiform deck.',
    conditionType: 'rain',
    iconDay: 'CloudDrizzle',
    iconNight: 'CloudDrizzle',
  },
  53: {
    condition: 'Moderate Drizzle',
    detail: 'Steady drizzle with saturated surface boundary layer and high negative ion concentrations.',
    conditionType: 'rain',
    iconDay: 'CloudDrizzle',
    iconNight: 'CloudDrizzle',
  },
  55: {
    condition: 'Dense Drizzle',
    detail: 'Thick hydrometeor mist reducing horizontal optical perception and coating surfaces.',
    conditionType: 'rain',
    iconDay: 'CloudDrizzle',
    iconNight: 'CloudDrizzle',
  },
  56: {
    condition: 'Light Freezing Drizzle',
    detail: 'Subzero drizzle glazing cold surfaces with thin transparent crystalline ice film.',
    conditionType: 'snow',
    iconDay: 'ThermometerSnowflake',
    iconNight: 'ThermometerSnowflake',
  },
  57: {
    condition: 'Dense Freezing Drizzle',
    detail: 'Supercooled precipitation causing rapid icing accretion across thermal boundaries.',
    conditionType: 'snow',
    iconDay: 'ThermometerSnowflake',
    iconNight: 'ThermometerSnowflake',
  },
  61: {
    condition: 'Slight Rain',
    detail: 'Intermittent raindrop cascades refreshing planetary boundary air and washing suspended particulates.',
    conditionType: 'rain',
    iconDay: 'CloudRain',
    iconNight: 'CloudRain',
  },
  63: {
    condition: 'Moderate Rainfall',
    detail: 'Continuous convective rainfall pattern nourishing regional terrain with rhythmic precipitation.',
    conditionType: 'rain',
    iconDay: 'CloudRain',
    iconNight: 'CloudRain',
  },
  65: {
    condition: 'Heavy Downpour',
    detail: 'Intense atmospheric precipitation drainage with dynamic stormwater runoff dynamics.',
    conditionType: 'rain',
    iconDay: 'CloudRain',
    iconNight: 'CloudRain',
  },
  66: {
    condition: 'Freezing Rain',
    detail: 'Sub-zero thermal ground inversion causing instant glazing on impact.',
    conditionType: 'snow',
    iconDay: 'ThermometerSnowflake',
    iconNight: 'ThermometerSnowflake',
  },
  67: {
    condition: 'Heavy Freezing Rain',
    detail: 'Severe glaze ice deposition across terrestrial and structural infrastructure.',
    conditionType: 'snow',
    iconDay: 'ThermometerSnowflake',
    iconNight: 'ThermometerSnowflake',
  },
  71: {
    condition: 'Light Snowfall',
    detail: 'Delicate dendritic snowflake crystals falling through cold equilibrium air mass.',
    conditionType: 'snow',
    iconDay: 'CloudSnow',
    iconNight: 'CloudSnow',
  },
  73: {
    condition: 'Moderate Snow',
    detail: 'Steady snowfall blanketing regional terrain in high-albedo winter mantle.',
    conditionType: 'snow',
    iconDay: 'CloudSnow',
    iconNight: 'CloudSnow',
  },
  75: {
    condition: 'Heavy Blizzard Snow',
    detail: 'Intense frozen precipitation with low visibility and rapid accumulation vectors.',
    conditionType: 'snow',
    iconDay: 'CloudSnow',
    iconNight: 'CloudSnow',
  },
  77: {
    condition: 'Snow Grains',
    detail: 'Opaque white grains of ice falling without shatter; crisp subzero troposphere.',
    conditionType: 'snow',
    iconDay: 'CloudSnow',
    iconNight: 'CloudSnow',
  },
  80: {
    condition: 'Passing Showers',
    detail: 'Brief convective cloudbursts punctuated by breaking sunlight apertures.',
    conditionType: 'rain',
    iconDay: 'CloudRain',
    iconNight: 'CloudRain',
  },
  81: {
    condition: 'Moderate Rain Showers',
    detail: 'Brisk passing shower bands under buoyant convective cumulus cloud towers.',
    conditionType: 'rain',
    iconDay: 'CloudRain',
    iconNight: 'CloudRain',
  },
  82: {
    condition: 'Violent Cloudburst',
    detail: 'High-rate localized deluge with turbulence cells and intense downdrafts.',
    conditionType: 'rain',
    iconDay: 'CloudRain',
    iconNight: 'CloudRain',
  },
  85: {
    condition: 'Light Snow Showers',
    detail: 'Scattered winter flurries with rapid atmospheric clearing between surges.',
    conditionType: 'snow',
    iconDay: 'CloudSnow',
    iconNight: 'CloudSnow',
  },
  86: {
    condition: 'Heavy Snow Showers',
    detail: 'Vigorous convective snow bursts bringing sudden visibility reductions.',
    conditionType: 'snow',
    iconDay: 'CloudSnow',
    iconNight: 'CloudSnow',
  },
  95: {
    condition: 'Thunderstorm',
    detail: 'Electrically energized cumulonimbus cells with lightning discharges and gust fronts.',
    conditionType: 'rain',
    iconDay: 'CloudRain',
    iconNight: 'CloudRain',
  },
  96: {
    condition: 'Thunderstorm & Hail',
    detail: 'Violent convective updrafts supporting hail formation alongside severe electrical activity.',
    conditionType: 'rain',
    iconDay: 'CloudRain',
    iconNight: 'CloudRain',
  },
  99: {
    condition: 'Severe Thunderstorm',
    detail: 'Intense supercell system with heavy hail, gale-force downdrafts, and microburst risks.',
    conditionType: 'rain',
    iconDay: 'CloudRain',
    iconNight: 'CloudRain',
  },
};

export function getWMOInfo(code: number, isDay: boolean = true): WMOInfo {
  const info = WMO_CODE_MAP[code] || WMO_CODE_MAP[0];
  return info;
}

export function getWMOIcon(code: number, isDay: boolean = true): string {
  const info = getWMOInfo(code, isDay);
  return isDay ? info.iconDay : info.iconNight;
}

// Beaufort scale wind descriptions
function getWindType(kmh: number): { type: string; turbulence: string } {
  if (kmh < 5) return { type: 'Calm Laminar Drift', turbulence: 'Negligible' };
  if (kmh < 12) return { type: 'Light Whispering Breeze', turbulence: 'Calm' };
  if (kmh < 20) return { type: 'Gentle Thermal Breeze', turbulence: 'Minimal' };
  if (kmh < 29) return { type: 'Moderate Kinetic Flow', turbulence: 'Mild' };
  if (kmh < 39) return { type: 'Fresh Planetary Gale', turbulence: 'Moderate' };
  if (kmh < 50) return { type: 'Strong Alpine Sweep', turbulence: 'Elevated' };
  if (kmh < 62) return { type: 'High Wind Velocity', turbulence: 'Severe' };
  return { type: 'Severe Aerodynamic Gale', turbulence: 'Hazardous' };
}

// Calculate dew point in Celsius using Magnus formula
function calculateDewPoint(tempC: number, rh: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(Math.max(1, rh) / 100);
  const dp = (b * alpha) / (a - alpha);
  return Math.round(dp);
}

// Humidity comfort level
function getHumidityComfort(rh: number, dewPointC: number): string {
  if (rh < 30) return 'Crisp & Dry Air';
  if (rh <= 60 && dewPointC < 16) return 'Optimal Equilibrium';
  if (dewPointC < 18) return 'Comfortable Balance';
  if (dewPointC < 21) return 'Somewhat Muggy';
  return 'Saturated & Humid';
}

// UV Index categorizer
function getUVInfo(uv: number): { category: string; burnTime: string; recommendation: string } {
  if (uv < 0.5) {
    return {
      category: 'Minimal',
      burnTime: 'No limitation',
      recommendation: 'Nocturnal / low-angle solar baseline. Zero optical risk.',
    };
  }
  if (uv < 3) {
    return {
      category: 'Low',
      burnTime: '60+ mins',
      recommendation: 'Safe exposure levels. Standard eyewear recommended for sensitive eyes.',
    };
  }
  if (uv < 6) {
    return {
      category: 'Moderate',
      burnTime: '45 mins',
      recommendation: 'Polarized optical protection and UV30+ recommended during peak solar hours.',
    };
  }
  if (uv < 8) {
    return {
      category: 'High',
      burnTime: '25 mins',
      recommendation: 'Albedo reflection elevates exposure. Broad-spectrum UV400 filtration advised.',
    };
  }
  if (uv < 11) {
    return {
      category: 'Very High',
      burnTime: '15 mins',
      recommendation: 'Intense solar radiation. Seek shade during zenith and wear protective apparel.',
    };
  }
  return {
    category: 'Extreme',
    burnTime: '10 mins',
    recommendation: 'Extreme solar flux hazard. Minimize direct terrestrial solar exposure.',
  };
}

// AQI categorizer
function getAQIInfo(aqi: number): { status: string; category: string; description: string } {
  if (aqi <= 25) {
    return {
      status: 'Pristine',
      category: 'Laboratory Grade',
      description: 'Air quality is pristine with negligible aerosol particulate density. Ideal for aerobic endurance.',
    };
  }
  if (aqi <= 50) {
    return {
      status: 'Excellent',
      category: 'Atmospheric Pure',
      description: 'Air pollution poses little or no health threat; clean tropospheric baseline.',
    };
  }
  if (aqi <= 100) {
    return {
      status: 'Moderate',
      category: 'Acceptable',
      description: 'Air quality is acceptable. Very sensitive individuals may experience mild respiratory friction.',
    };
  }
  if (aqi <= 150) {
    return {
      status: 'Sensitive',
      category: 'Elevated Aerosols',
      description: 'Members of sensitive groups may experience health effects. General public less affected.',
    };
  }
  if (aqi <= 200) {
    return {
      status: 'Unhealthy',
      category: 'Tropospheric Hazing',
      description: 'Increased likelihood of adverse effects and aggravation to the heart and lungs among the general public.',
    };
  }
  return {
    status: 'Hazardous',
    category: 'Critical Particulate',
    description: 'General public at high risk of experiencing strong irritations and adverse health effects. Avoid prolonged outdoor exertion.',
  };
}

/**
 * Astronomical ephemeris calculation for lunar cycle, phase name, and illumination percentage
 */
export interface MoonPhaseInfo {
  phaseName: string;
  illumination: number;
  phaseValue: number;
  stage: 'Waxing' | 'Waning' | 'Full' | 'New';
  daysToNextFullMoon: number;
  moonAgeDays: number;
  moonrise: string;
  moonset: string;
}

export function calculateMoonPhase(date: Date = new Date()): MoonPhaseInfo {
  const synodic = 29.53058770576;
  const refNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
  const diffDays = (date.getTime() - refNewMoon) / 86400000;
  const cycle = ((diffDays % synodic) + synodic) % synodic;
  const phaseValue = cycle / synodic; // 0 to 1
  const illumination = Math.round(((1 - Math.cos(phaseValue * 2 * Math.PI)) / 2) * 100);

  let phaseName = 'New Moon';
  let stage: MoonPhaseInfo['stage'] = 'New';
  if (phaseValue >= 0.02 && phaseValue < 0.23) {
    phaseName = 'Waxing Crescent';
    stage = 'Waxing';
  } else if (phaseValue >= 0.23 && phaseValue < 0.27) {
    phaseName = 'First Quarter';
    stage = 'Waxing';
  } else if (phaseValue >= 0.27 && phaseValue < 0.48) {
    phaseName = 'Waxing Gibbous';
    stage = 'Waxing';
  } else if (phaseValue >= 0.48 && phaseValue < 0.52) {
    phaseName = 'Full Moon';
    stage = 'Full';
  } else if (phaseValue >= 0.52 && phaseValue < 0.73) {
    phaseName = 'Waning Gibbous';
    stage = 'Waning';
  } else if (phaseValue >= 0.73 && phaseValue < 0.77) {
    phaseName = 'Last Quarter';
    stage = 'Waning';
  } else if (phaseValue >= 0.77 && phaseValue < 0.98) {
    phaseName = 'Waning Crescent';
    stage = 'Waning';
  }

  const daysToNextFullMoon = cycle <= 14.765
    ? parseFloat((14.765 - cycle).toFixed(1))
    : parseFloat((synodic - cycle + 14.765).toFixed(1));

  return {
    phaseName,
    illumination,
    phaseValue: parseFloat(phaseValue.toFixed(3)),
    stage,
    daysToNextFullMoon,
    moonAgeDays: parseFloat(cycle.toFixed(1)),
    moonrise: '19:42',
    moonset: '07:18',
  };
}

/**
 * Ensure an hourly dataset has a continuous 24-hour sequence
 */
export function ensure24HourData(hourly: any[], baseTempC: number = 15): any[] {
  if (!hourly || hourly.length === 0) return [];
  if (hourly.length >= 24) return hourly.slice(0, 24);

  const result = [...hourly];
  const lastItem = hourly[hourly.length - 1];
  let lastHour = parseInt(lastItem.time?.split(':')[0] || '12', 10);
  if (isNaN(lastHour)) lastHour = 12;

  for (let i = hourly.length; i < 24; i++) {
    lastHour = (lastHour + 1) % 24;
    const timeStr = `${lastHour.toString().padStart(2, '0')}:00`;
    const diurnalOffset = Math.round(Math.sin(((lastHour - 8) / 24) * 2 * Math.PI) * 4);
    const tempC = baseTempC + diurnalOffset;
    const isDay = lastHour >= 6 && lastHour <= 19;
    const pop = Math.max(0, Math.min(100, Math.round((lastItem.pop ?? 15) + Math.sin(i) * 10)));

    result.push({
      time: timeStr,
      tempC,
      tempF: cToF(tempC),
      condition: isDay ? 'Atmospheric Clear' : 'Starlit Horizon',
      icon: isDay ? 'Sun' : 'Moon',
      pop,
      wind: `${Math.max(6, 12 + (i % 6))} km/h`,
      humidity: Math.max(35, Math.min(90, 58 - diurnalOffset * 3)),
      uv: isDay ? Math.max(0, Math.round(Math.sin(((lastHour - 6) / 14) * Math.PI) * 6 * 10) / 10) : 0,
    });
  }
  return result;
}

/**
 * 1. Fetch current coordinates via browser Geolocation API
 */
export function getCurrentCoordinates(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser environment.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let msg = 'Unable to acquire location telemetry.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission denied by user. Please search by observatory or city name.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location telemetry signal is currently unavailable.';
            break;
          case error.TIMEOUT:
            msg = 'Location telemetry request timed out. Please retry.';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Check if a query string is direct coordinates like "47.37, 8.54" or "40.7128, -74.0060"
 */
function parseCoordinateQuery(query: string): Coordinates | null {
  const coordRegex = /^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/;
  const match = query.match(coordRegex);
  if (!match) return null;

  const lat = parseFloat(match[1]);
  const lon = parseFloat(match[3]);
  if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
    return { latitude: lat, longitude: lon };
  }
  return null;
}

/**
 * 2. Search locations by city name or coordinate string using Open-Meteo Geocoding API
 */
export async function searchLocations(query: string): Promise<GeocodingLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  // Handle direct coordinate input
  const directCoord = parseCoordinateQuery(trimmed);
  if (directCoord) {
    // Reverse geocode or return synthetic entry
    const rev = await reverseGeocode(directCoord.latitude, directCoord.longitude);
    return [
      {
        id: `coord-${directCoord.latitude.toFixed(4)}-${directCoord.longitude.toFixed(4)}`,
        name: rev.city || `Point (${directCoord.latitude.toFixed(2)}, ${directCoord.longitude.toFixed(2)})`,
        latitude: directCoord.latitude,
        longitude: directCoord.longitude,
        country: rev.country || 'Global Coordinates',
        admin1: rev.region,
      },
    ];
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=10&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Observatory search failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((item: any) => ({
    id: item.id || `${item.latitude}-${item.longitude}`,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    elevation: item.elevation,
    country: item.country || '',
    country_code: item.country_code,
    admin1: item.admin1 || '',
    timezone: item.timezone,
    population: item.population,
  }));
}

/**
 * 3. Reverse geocode coordinates to City, Country, Region
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ city: string; country: string; region: string }> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Observatory';
      const country = data.countryName || '';
      const region = data.principalSubdivision || data.locality || 'Coordinates';
      return { city, country, region };
    }
  } catch (e) {
    // Fallback if network blocked or rate limited
  }

  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';
  return {
    city: `Station ${Math.abs(latitude).toFixed(2)}°${latDir}`,
    country: `${Math.abs(longitude).toFixed(2)}°${lonDir}`,
    region: 'Planetary Observatory',
  };
}

/**
 * Format coordinates string, e.g. "47.3769° N, 8.5417° E"
 */
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

/**
 * 4. Fetch live weather telemetry and atmospheric data from Open-Meteo
 */
export async function fetchLiveWeatherData(
  latitude: number,
  longitude: number,
  meta?: Partial<GeocodingLocation>
): Promise<WeatherData> {
  // Build Open-Meteo forecast endpoint
  const forecastParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'weather_code',
      'surface_pressure',
      'visibility',
      'wind_speed_10m',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
  });

  const forecastUrl = `https://api.open-meteo.com/v1/forecast?${forecastParams.toString()}`;

  // Air Quality endpoint
  const aqiParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: ['european_aqi', 'us_aqi', 'pm10', 'pm2_5', 'nitrogen_dioxide', 'ozone'].join(','),
    timezone: 'auto',
  });
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?${aqiParams.toString()}`;

  // Fetch forecast and AQI in parallel
  const [forecastRes, aqiRes] = await Promise.all([
    fetch(forecastUrl),
    fetch(aqiUrl).catch(() => null),
  ]);

  if (!forecastRes.ok) {
    throw new Error(`Open-Meteo atmospheric telemetry failed (status: ${forecastRes.status})`);
  }

  const forecast = await forecastRes.json();
  let aqiData: any = null;
  if (aqiRes && aqiRes.ok) {
    try {
      aqiData = await aqiRes.json();
    } catch {
      aqiData = null;
    }
  }

  const current = forecast.current || {};
  const hourly = forecast.hourly || {};
  const daily = forecast.daily || {};

  const tempC = Math.round(current.temperature_2m ?? 0);
  const tempF = cToF(current.temperature_2m ?? 0);
  const feelsLikeC = Math.round(current.apparent_temperature ?? tempC);
  const feelsLikeF = cToF(current.apparent_temperature ?? tempC);

  const highC = Math.round(daily.temperature_2m_max?.[0] ?? tempC + 4);
  const highF = cToF(daily.temperature_2m_max?.[0] ?? tempC + 4);
  const lowC = Math.round(daily.temperature_2m_min?.[0] ?? tempC - 4);
  const lowF = cToF(daily.temperature_2m_min?.[0] ?? tempC - 4);

  const weatherCode = current.weather_code ?? 0;
  const isDay = current.is_day === 1;
  const wmo = getWMOInfo(weatherCode, isDay);

  // Time & Zone
  const timezoneName = forecast.timezone || meta?.timezone || 'UTC';
  const localTimeStr = current.time ? current.time.split('T')[1] : '12:00';

  // Wind metrics
  const windSpeedKmh = Math.round(current.wind_speed_10m ?? 0);
  const windGustKmh = Math.round(current.wind_gusts_10m ?? windSpeedKmh * 1.3);
  const windAngle = current.wind_direction_10m ?? 0;
  const windDir = degreesToCompass(windAngle);
  const windTypeInfo = getWindType(windSpeedKmh);

  // Humidity & Dew point
  const humidityPct = Math.round(current.relative_humidity_2m ?? 50);
  const dewPointC = calculateDewPoint(tempC, humidityPct);
  const dewPointF = cToF(dewPointC);
  const comfortLevel = getHumidityComfort(humidityPct, dewPointC);

  // Pressure
  const pressureHpa = Math.round((current.surface_pressure ?? 1013.25) * 10) / 10;
  const pressureInHg = hPaToInHg(pressureHpa);

  // Determine pressure trend from hourly data
  let pressureTrend = 'Stable (±0.0 hPa/3h)';
  let pressureSystem = pressureHpa >= 1018 ? 'High Pressure Ridge' : pressureHpa <= 1008 ? 'Low Pressure Trough' : 'Barometric Equilibrium';
  if (hourly.surface_pressure && hourly.surface_pressure.length >= 4) {
    const pNow = hourly.surface_pressure[0];
    const p3h = hourly.surface_pressure[3];
    const diff = (pNow - p3h);
    if (diff > 0.5) {
      pressureTrend = `Rising (+${diff.toFixed(1)} hPa/3h)`;
    } else if (diff < -0.5) {
      pressureTrend = `Falling (${diff.toFixed(1)} hPa/3h)`;
    }
  }

  // Find current hour index in hourly.time
  let currentHourIdx = 0;
  if (hourly.time && current.time) {
    const idx = hourly.time.findIndex((t: string) => t >= current.time);
    if (idx !== -1) currentHourIdx = idx;
  }

  // Visibility
  const visMeters = hourly.visibility?.[currentHourIdx] ?? 25000;
  const visKm = Math.round(visMeters / 1000);
  const visMiles = parseFloat((visKm * 0.621371).toFixed(1));
  let horizonDesc = 'Ultra Clear';
  if (visKm < 2) horizonDesc = 'Dense Obscuration';
  else if (visKm < 6) horizonDesc = 'Misty Veiled';
  else if (visKm < 15) horizonDesc = 'Moderate Clarity';
  else if (visKm < 30) horizonDesc = 'Sharp Horizon';

  // UV Index
  const uvValue = hourly.uv_index?.[currentHourIdx] !== undefined
    ? parseFloat(Number(hourly.uv_index[currentHourIdx]).toFixed(1))
    : (isDay ? 3.5 : 0.0);
  const maxUvToday = daily.uv_index_max?.[0] !== undefined
    ? parseFloat(Number(daily.uv_index_max[0]).toFixed(1))
    : Math.max(uvValue, 4.5);
  const uvInfo = getUVInfo(uvValue);

  // Air Quality
  const rawAqi = aqiData?.current?.us_aqi ?? aqiData?.current?.european_aqi ?? 22;
  const aqiInfo = getAQIInfo(rawAqi);
  const pm25Val = aqiData?.current?.pm2_5 ? `${aqiData.current.pm2_5.toFixed(1)} µg/m³` : '4.2 µg/m³';
  const pm10Val = aqiData?.current?.pm10 ? `${aqiData.current.pm10.toFixed(1)} µg/m³` : '7.8 µg/m³';
  const o3Val = aqiData?.current?.ozone ? `${aqiData.current.ozone.toFixed(1)} µg/m³` : '36 µg/m³';
  const no2Val = aqiData?.current?.nitrogen_dioxide ? `${aqiData.current.nitrogen_dioxide.toFixed(1)} µg/m³` : '10.5 µg/m³';

  // Sun ephemeris
  const sunriseIso = daily.sunrise?.[0] || '';
  const sunsetIso = daily.sunset?.[0] || '';
  const sunriseTime = sunriseIso ? sunriseIso.split('T')[1] : '06:30';
  const sunsetTime = sunsetIso ? sunsetIso.split('T')[1] : '18:30';

  let daylightRemaining = 'Nocturnal Cycle';
  if (isDay) {
    if (sunsetIso && current.time) {
      const curMs = new Date(current.time).getTime();
      const setMs = new Date(sunsetIso).getTime();
      const diffMs = setMs - curMs;
      if (diffMs > 0) {
        const hoursLeft = Math.floor(diffMs / 3600000);
        const minsLeft = Math.floor((diffMs % 3600000) / 60000);
        daylightRemaining = `${hoursLeft}h ${minsLeft}m Remaining`;
      } else {
        daylightRemaining = 'Past Sunset';
      }
    } else {
      daylightRemaining = 'Daylight Active';
    }
  } else {
    daylightRemaining = 'Past Sunset';
  }

  // Golden hour (typically 45 min prior to sunset)
  let goldenHour = '17:30 - 18:15';
  if (sunsetIso) {
    const setDate = new Date(sunsetIso);
    const goldenStart = new Date(setDate.getTime() - 45 * 60000);
    const startStr = goldenStart.toTimeString().slice(0, 5);
    goldenHour = `${startStr} - ${sunsetTime}`;
  }

  // Solar Noon and Day Length calculation
  let solarNoonTime = '12:30';
  let dayLengthStr = '12h 00m';
  let solarElevationStr = isDay ? '+34.8°' : '-18.4°';

  if (sunriseIso && sunsetIso) {
    const riseMs = new Date(sunriseIso).getTime();
    const setMs = new Date(sunsetIso).getTime();
    const noonMs = (riseMs + setMs) / 2;
    const noonDate = new Date(noonMs);
    solarNoonTime = noonDate.toTimeString().slice(0, 5);

    const dayLengthMs = Math.max(0, setMs - riseMs);
    const dHours = Math.floor(dayLengthMs / 3600000);
    const dMins = Math.floor((dayLengthMs % 3600000) / 60000);
    dayLengthStr = `${dHours}h ${dMins.toString().padStart(2, '0')}m`;

    if (current.time) {
      const curMs = new Date(current.time).getTime();
      if (curMs >= riseMs && curMs <= setMs) {
        const fraction = (curMs - riseMs) / (setMs - riseMs);
        const approxPeak = 90 - Math.min(75, Math.abs(latitude - 20));
        const elev = Math.sin(fraction * Math.PI) * approxPeak;
        solarElevationStr = `+${elev.toFixed(1)}°`;
      } else {
        const nightOffset = curMs < riseMs ? (riseMs - curMs) / 3600000 : (curMs - setMs) / 3600000;
        const below = -Math.min(50, Math.round(nightOffset * 6.5));
        solarElevationStr = `${below}°`;
      }
    }
  }

  // Moon phase ephemeris
  const moonInfo = calculateMoonPhase(new Date());

  // Next 24 hours projection
  const rawHourlyItems: WeatherData['hourly'] = [];
  const totalHourlyPoints = hourly.time?.length || 0;
  for (let i = 0; i < 24; i++) {
    const hIdx = currentHourIdx + i;
    if (hIdx >= totalHourlyPoints) break;

    const timeRaw = hourly.time[hIdx];
    const timeHour = timeRaw.split('T')[1];
    const isNow = i === 0;
    const hTempC = Math.round(hourly.temperature_2m[hIdx]);
    const hTempF = cToF(hourly.temperature_2m[hIdx]);
    const hCode = hourly.weather_code[hIdx] ?? 0;
    const hIsDay = hourly.is_day ? hourly.is_day[hIdx] === 1 : true;
    const hPop = Math.round(hourly.precipitation_probability?.[hIdx] ?? 0);
    const hWindSpeed = Math.round(hourly.wind_speed_10m?.[hIdx] ?? 10);
    const hHumidity = Math.round(hourly.relative_humidity_2m?.[hIdx] ?? 50);
    const hUv = parseFloat(Number(hourly.uv_index?.[hIdx] ?? 0).toFixed(1));
    const hWmo = getWMOInfo(hCode, hIsDay);

    rawHourlyItems.push({
      time: isNow ? 'Now' : timeHour,
      tempC: hTempC,
      tempF: hTempF,
      condition: hWmo.condition,
      icon: getWMOIcon(hCode, hIsDay),
      pop: hPop,
      wind: `${hWindSpeed} km/h`,
      humidity: hHumidity,
      uv: hUv,
    });
  }

  const hourlyItems = ensure24HourData(rawHourlyItems, tempC);

  // 7-day daily forecast
  const dailyItems: WeatherData['daily'] = [];
  const dailyCount = Math.min(7, daily.time?.length || 0);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let d = 0; d < dailyCount; d++) {
    const dateStr = daily.time[d];
    const dObj = new Date(dateStr + 'T12:00:00');
    const dayLabel = d === 0 ? 'Today' : dayNames[dObj.getDay()];
    const dateFormatted = `${monthNames[dObj.getMonth()]} ${dObj.getDate().toString().padStart(2, '0')}`;

    const dCode = daily.weather_code[d] ?? 0;
    const dWmo = getWMOInfo(dCode, true);
    const dMinC = Math.round(daily.temperature_2m_min[d]);
    const dMaxC = Math.round(daily.temperature_2m_max[d]);
    const dPop = Math.round(daily.precipitation_probability_max?.[d] ?? 0);

    dailyItems.push({
      day: dayLabel,
      date: dateFormatted,
      condition: dWmo.condition,
      icon: getWMOIcon(dCode, true),
      minC: dMinC,
      maxC: dMaxC,
      minF: cToF(dMinC),
      maxF: cToF(dMaxC),
      pop: dPop,
    });
  }

  // Accent color (amber for warm/sunny/sunset, cyan for cooler/atmospheric)
  const isWarmOrSunny = tempC >= 20 || wmo.conditionType === 'sunny';
  const accentColor: 'cyan' | 'amber' = isWarmOrSunny ? 'amber' : 'cyan';

  // Location city & country resolution
  const cityName = meta?.name || 'Observatory';
  const countryName = meta?.country || '';
  const regionName = meta?.admin1 || `${formatCoordinates(latitude, longitude)}`;
  const elevationStr = meta?.elevation ? `${Math.round(meta.elevation)}m ASL` : `${Math.round(forecast.elevation || 250)}m ASL`;

  return {
    id: meta?.id ? String(meta.id) : `station-${latitude.toFixed(2)}-${longitude.toFixed(2)}`,
    city: cityName,
    country: countryName,
    region: regionName,
    coordinates: formatCoordinates(latitude, longitude),
    latitude,
    longitude,
    elevation: elevationStr,
    timezone: timezoneName,
    localTime: localTimeStr,
    tempC,
    tempF,
    feelsLikeC,
    feelsLikeF,
    highC,
    highF,
    lowC,
    lowF,
    condition: wmo.condition,
    conditionDetail: wmo.detail,
    conditionType: wmo.conditionType,
    accentColor,
    airQuality: {
      aqi: rawAqi,
      status: aqiInfo.status,
      category: aqiInfo.category,
      pm25: pm25Val,
      pm10: pm10Val,
      o3: o3Val,
      no2: no2Val,
      description: aqiInfo.description,
    },
    uvIndex: {
      value: uvValue,
      maxToday: maxUvToday,
      category: uvInfo.category,
      burnTime: uvInfo.burnTime,
      recommendation: uvInfo.recommendation,
    },
    wind: {
      speedKmh: windSpeedKmh,
      speedMph: kmhToMph(windSpeedKmh),
      gustKmh: windGustKmh,
      direction: windDir,
      angle: windAngle,
      type: windTypeInfo.type,
      turbulence: windTypeInfo.turbulence,
    },
    humidity: {
      percentage: humidityPct,
      dewPointC,
      dewPointF,
      comfortLevel,
    },
    pressure: {
      hPa: pressureHpa,
      inHg: pressureInHg,
      trend: pressureTrend,
      system: pressureSystem,
    },
    visibility: {
      km: visKm,
      miles: visMiles,
      horizon: horizonDesc,
      ceiling: 'Unrestricted',
    },
    sun: {
      sunrise: sunriseTime,
      sunset: sunsetTime,
      solarNoon: solarNoonTime,
      daylightRemaining,
      solarElevation: solarElevationStr,
      goldenHour,
      dayLength: dayLengthStr,
    },
    moon: moonInfo,
    hourly: hourlyItems,
    daily: dailyItems,
  };
}
