import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';

const WeatherApp = () => {
  // State management for our app
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // Replace with your actual API key

  // Get weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error('Location not found');
      const data = await response.json();
      setWeather({
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000
      });
    } catch (err) {
      setError('Could not get weather for your location.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Weather icons mapping with improved colors
  const getWeatherIcon = (condition) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return <Sun className="w-20 h-20 text-yellow-400 drop-shadow-lg" />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="w-20 h-20 text-gray-400 drop-shadow-lg" />;
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="w-20 h-20 text-blue-400 drop-shadow-lg" />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className="w-20 h-20 text-gray-300 drop-shadow-lg" />;
    } else {
      return <Cloud className="w-20 h-20 text-gray-400 drop-shadow-lg" />;
    }
  };

  // Detect location on app load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setError("Location access denied. Please search manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch weather from OpenWeatherMap
  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('City not found or API error');
      }

      const data = await response.json();

      const weatherData = {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000
      };

      setWeather(weatherData);
    } catch (err) {
      setError('City not found. Please try again with a valid city name.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    fetchWeather();
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  // Demo function for testing
  const loadDemoData = () => {
    setWeather({
      city: 'New York',
      country: 'United States',
      temperature: 22,
      condition: 'Partly Cloudy',
      humidity: 65,
      pressure: 1013,
      windSpeed: 15,
      visibility: 10
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl tracking-tight">
            Get Weather Details
          </h1>
          <p className="text-gray-400 drop-shadow-lg text-lg font-medium">
            Real-time weather updates
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative group">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name..."
              className="w-full px-6 py-4 pr-16 rounded-2xl border border-gray-700 shadow-2xl focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 outline-none text-white placeholder-gray-500 bg-gray-900 backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl font-medium focus:border-yellow-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed font-bold"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-6 border border-gray-700">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-500 border-t-transparent"></div>
              <span className="ml-4 text-white font-semibold text-lg">Loading weather data...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 bg-opacity-80 backdrop-blur-lg border border-red-700 rounded-2xl p-5 mb-6 shadow-xl">
            <p className="text-red-200 text-center font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Weather Data Display */}
        {weather && !loading && (
          <div className="bg-gray-900 bg-opacity-90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700 transform transition-all duration-500 hover:scale-105 hover:bg-opacity-95">
            {/* Location */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-yellow-400 mr-3 drop-shadow-lg" />
                <h2 className="text-3xl font-bold text-white drop-shadow-2xl">
                  {weather.city}
                </h2>
              </div>
              <p className="text-gray-400 font-medium text-lg drop-shadow">
                {weather.country}
              </p>
            </div>

            {/* Main Weather Info */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                {getWeatherIcon(weather.condition)}
              </div>
              <div className="text-7xl font-extrabold text-white mb-3 drop-shadow-2xl tracking-tight">
                {weather.temperature}°
              </div>
              <div className="text-2xl text-gray-300 drop-shadow-lg font-semibold capitalize opacity-90">
                {weather.condition}
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Humidity */}
              <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-5 shadow-lg border border-gray-600 hover:bg-opacity-90 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Droplets className="w-6 h-6 text-blue-400 mr-3 drop-shadow" />
                  <span className="text-gray-300 text-sm font-semibold">Humidity</span>
                </div>
                <div className="text-white text-2xl font-bold drop-shadow-lg">
                  {weather.humidity}%
                </div>
              </div>

              {/* Wind Speed */}
              <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-5 shadow-lg border border-gray-600 hover:bg-opacity-90 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Wind className="w-6 h-6 text-green-400 mr-3 drop-shadow" />
                  <span className="text-gray-300 text-sm font-semibold">Wind Speed</span>
                </div>
                <div className="text-white text-2xl font-bold drop-shadow-lg">
                  {weather.windSpeed} km/h
                </div>
              </div>

              {/* Pressure */}
              <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-5 shadow-lg border border-gray-600 hover:bg-opacity-90 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Thermometer className="w-6 h-6 text-orange-400 mr-3 drop-shadow" />
                  <span className="text-gray-300 text-sm font-semibold">Pressure</span>
                </div>
                <div className="text-white text-2xl font-bold drop-shadow-lg">
                  {weather.pressure} mb
                </div>
              </div>

              {/* Visibility */}
              <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-5 shadow-lg border border-gray-600 hover:bg-opacity-90 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Eye className="w-6 h-6 text-purple-400 mr-3 drop-shadow" />
                  <span className="text-gray-300 text-sm font-semibold">Visibility</span>
                </div>
                <div className="text-white text-2xl font-bold drop-shadow-lg">
                  {weather.visibility} km
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-gray-500 text-sm font-medium opacity-80">
            Built with React & Tailwind CSS
          </p>
          <div className="flex justify-center mt-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mx-1 opacity-60"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full mx-1 opacity-60"></div>
            <div className="w-2 h-2 bg-gray-700 rounded-full mx-1 opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;