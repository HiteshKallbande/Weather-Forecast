import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { mockLocations } from '../data/mockWeather';
import {
  fetchLiveWeatherData,
  searchLocations,
  getCurrentCoordinates,
  reverseGeocode,
  ensure24HourData,
  calculateMoonPhase,
} from '../services/weatherService';

const WeatherContext = createContext(null);

const STORAGE_UNIT_KEY = 'aetheris_telemetry_unit';
const STORAGE_FAVORITES_KEY = 'aetheris_favorite_observatories';
const STORAGE_ACTIVE_ID_KEY = 'aetheris_active_observatory_id';

// Default starter observatories with geographic coordinates
const DEFAULT_OBSERVATORIES = [
  {
    id: 'zurich',
    city: 'Zürich',
    country: 'Switzerland',
    region: 'Alps & Central Plateau',
    latitude: 47.3769,
    longitude: 8.5417,
    elevation: 408,
    timezone: 'Europe/Zurich',
  },
  {
    id: 'kyoto',
    city: 'Kyoto',
    country: 'Japan',
    region: 'Kansai Botanical Basin',
    latitude: 35.0116,
    longitude: 135.7681,
    elevation: 54,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'reykjavik',
    city: 'Reykjavik',
    country: 'Iceland',
    region: 'Faxaflói Coastal Fjord',
    latitude: 64.1466,
    longitude: -21.9426,
    elevation: 15,
    timezone: 'Atlantic/Reykjavik',
  },
  {
    id: 'aspen',
    city: 'Aspen',
    country: 'United States',
    region: 'Roaring Fork Valley, CO',
    latitude: 39.1911,
    longitude: -106.8175,
    elevation: 2405,
    timezone: 'America/Denver',
  },
  {
    id: 'monaco',
    city: 'Monaco',
    country: 'Monaco',
    region: 'Côte d’Azur Basin',
    latitude: 43.7384,
    longitude: 7.4246,
    elevation: 62,
    timezone: 'Europe/Monaco',
  },
];

export function WeatherProvider({ children }) {
  // 1. Unit State (°C or °F) with Local Storage persistence
  const [unit, setUnitState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_UNIT_KEY);
      if (saved === 'C' || saved === 'F') return saved;
    }
    return 'C';
  });

  const setUnit = useCallback((newUnit) => {
    setUnitState(newUnit);
    try {
      localStorage.setItem(STORAGE_UNIT_KEY, newUnit);
    } catch (e) {
      console.warn('Unable to persist unit preference to localStorage', e);
    }
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  }, [setUnit]);

  // 2. Persistent Favorites State
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse favorites from localStorage', e);
      }
    }
    return DEFAULT_OBSERVATORIES;
  });

  // Save favorites to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Unable to persist favorites to localStorage', e);
    }
  }, [favorites]);

  // 3. Active Location Weather State
  const [activeLocation, setActiveLocation] = useState(() => {
    // Start with rich mock data for Zurich so initial view is instantly populated
    const initial = mockLocations[0];
    return {
      ...initial,
      hourly: ensure24HourData(initial.hourly, initial.tempC),
      moon: initial.moon || calculateMoonPhase(new Date()),
      sun: {
        ...initial.sun,
        solarNoon: initial.sun?.solarNoon || '12:35',
        dayLength: initial.sun?.dayLength || '11h 34m',
      },
    };
  });

  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  // 4. City Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // 5. Geolocation State
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Fetch live weather telemetry for a target location
  const loadWeatherForLocation = useCallback(async (locMeta) => {
    if (!locMeta || typeof locMeta.latitude !== 'number' || typeof locMeta.longitude !== 'number') {
      return;
    }

    setIsLoadingWeather(true);
    setWeatherError(null);

    try {
      const liveData = await fetchLiveWeatherData(locMeta.latitude, locMeta.longitude, {
        id: locMeta.id,
        name: locMeta.city || locMeta.name,
        country: locMeta.country,
        admin1: locMeta.region || locMeta.admin1,
        elevation: locMeta.elevation,
        timezone: locMeta.timezone,
      });

      setActiveLocation(liveData);

      // Save active ID
      try {
        localStorage.setItem(STORAGE_ACTIVE_ID_KEY, liveData.id);
      } catch {}

      return liveData;
    } catch (err) {
      console.error('Failed to load atmospheric telemetry:', err);
      setWeatherError(err.message || 'Failed to fetch live weather data. Using cached telemetry.');
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Initial live telemetry sync on mount
  useEffect(() => {
    const initialTarget = favorites[0] || DEFAULT_OBSERVATORIES[0];
    loadWeatherForLocation(initialTarget);
  }, []); // Run once on mount

  // Refresh active location telemetry
  const refreshWeather = useCallback(() => {
    if (activeLocation && activeLocation.latitude && activeLocation.longitude) {
      return loadWeatherForLocation(activeLocation);
    } else {
      const fallback = favorites[0] || DEFAULT_OBSERVATORIES[0];
      return loadWeatherForLocation(fallback);
    }
  }, [activeLocation, favorites, loadWeatherForLocation]);

  // Select an observatory/location
  const selectLocation = useCallback(
    async (loc) => {
      // If loc already has full telemetry, set it, but also refresh live data
      if (loc.latitude && loc.longitude) {
        await loadWeatherForLocation(loc);
      } else {
        // Find matching default or mock
        const match = DEFAULT_OBSERVATORIES.find((d) => d.id === loc.id) || mockLocations.find((m) => m.id === loc.id);
        if (match && match.latitude && match.longitude) {
          await loadWeatherForLocation(match);
        } else {
          setActiveLocation({
            ...loc,
            hourly: ensure24HourData(loc.hourly, loc.tempC),
            moon: loc.moon || calculateMoonPhase(new Date()),
            sun: {
              ...loc.sun,
              solarNoon: loc.sun?.solarNoon || '12:30',
              dayLength: loc.sun?.dayLength || '12h 00m',
            },
          });
        }
      }
    },
    [loadWeatherForLocation]
  );

  // Search debounce ref
  const searchTimeoutRef = useRef(null);

  // Trigger search whenever searchQuery changes
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setSearchError(null);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(trimmed);
        setSearchResults(results);
        if (results.length === 0) {
          setSearchError(`No atmospheric observatories found matching "${trimmed}".`);
        } else {
          setSearchError(null);
        }
      } catch (err) {
        console.error('Search error:', err);
        setSearchError('Search failed. Check your network or try coordinates (e.g. 47.37, 8.54).');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  // Select a city from search results
  const selectSearchResult = useCallback(
    async (result) => {
      clearSearch();

      const newLoc = {
        id: `obs-${result.id || `${result.latitude}-${result.longitude}`}`,
        city: result.name,
        country: result.country || '',
        region: result.admin1 || result.country || 'Planetary Region',
        latitude: result.latitude,
        longitude: result.longitude,
        elevation: result.elevation,
        timezone: result.timezone,
      };

      // Add to favorites if not already present
      setFavorites((prev) => {
        const exists = prev.some(
          (f) =>
            f.id === newLoc.id ||
            (Math.abs(f.latitude - newLoc.latitude) < 0.05 && Math.abs(f.longitude - newLoc.longitude) < 0.05)
        );
        if (!exists) {
          return [newLoc, ...prev];
        }
        return prev;
      });

      await loadWeatherForLocation(newLoc);
    },
    [clearSearch, loadWeatherForLocation]
  );

  // Browser Geolocation
  const detectUserLocation = useCallback(async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      const coords = await getCurrentCoordinates();
      const rev = await reverseGeocode(coords.latitude, coords.longitude);

      const userLoc = {
        id: `current-loc-${coords.latitude.toFixed(2)}-${coords.longitude.toFixed(2)}`,
        city: rev.city || 'Local Observatory',
        country: rev.country || 'Current Position',
        region: rev.region || 'Browser Geolocation',
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      // Add to favorites
      setFavorites((prev) => {
        const exists = prev.some(
          (f) => Math.abs(f.latitude - userLoc.latitude) < 0.05 && Math.abs(f.longitude - userLoc.longitude) < 0.05
        );
        if (!exists) {
          return [userLoc, ...prev];
        }
        return prev;
      });

      await loadWeatherForLocation(userLoc);
    } catch (err) {
      console.error('Geolocation detection failed:', err);
      setLocationError(err.message || 'Could not acquire browser geolocation.');
    } finally {
      setIsLocating(false);
    }
  }, [loadWeatherForLocation]);

  // Favorite management
  const addFavorite = useCallback((loc) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === loc.id);
      if (!exists) {
        return [...prev, loc];
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => {
      // Keep at least 1 favorite
      if (prev.length <= 1) return prev;
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const isFavorite = useCallback(
    (id) => {
      return favorites.some((f) => f.id === id);
    },
    [favorites]
  );

  const value = {
    // Unit
    unit,
    setUnit,
    toggleUnit,

    // Favorites
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,

    // Active Weather Data
    activeLocation,
    isLoadingWeather,
    weatherError,
    setWeatherError,
    refreshWeather,
    selectLocation,

    // City Search
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    handleSearchChange,
    clearSearch,
    selectSearchResult,

    // Geolocation
    isLocating,
    locationError,
    setLocationError,
    detectUserLocation,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
