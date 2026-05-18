import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('City not found. Please try again.');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  const getWeatherEmoji = (condition) => {
    const c = condition.toLowerCase();
    if (c.includes('clear')) return '☀️';
    if (c.includes('cloud')) return '☁️';
    if (c.includes('rain')) return '🌧️';
    if (c.includes('storm')) return '⛈️';
    if (c.includes('snow')) return '❄️';
    if (c.includes('mist') || c.includes('fog')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="App">
      <div className="container">
        <h1>🌍 Weather App</h1>
        <p className="subtitle">Search any city in the world</p>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city name (e.g. Kuala Lumpur)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={fetchWeather}>Search</button>
        </div>

        {/* Loading */}
        {loading && <p className="loading">Fetching weather...</p>}

        {/* Error */}
        {error && <p className="error">⚠️ {error}</p>}

        {/* Weather Card */}
        {weather && (
          <div className="weather-card">
            <div className="city-name">
              📍 {weather.name}, {weather.sys.country}
            </div>

            <div className="weather-main">
              <span className="weather-emoji">
                {getWeatherEmoji(weather.weather[0].description)}
              </span>
              <span className="temperature">
                {Math.round(weather.main.temp)}°C
              </span>
            </div>

            <div className="weather-desc">
              {weather.weather[0].description}
            </div>

            <div className="weather-details">
              <div className="detail">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">
                  {Math.round(weather.main.feels_like)}°C
                </span>
              </div>
              <div className="detail">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">
                  {weather.main.humidity}%
                </span>
              </div>
              <div className="detail">
                <span className="detail-label">Wind</span>
                <span className="detail-value">
                  {weather.wind.speed} m/s
                </span>
              </div>
              <div className="detail">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">
                  {weather.main.pressure} hPa
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;