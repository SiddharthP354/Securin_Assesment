import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'

export default function dashboard() {
  const navigate = useNavigate()
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchCity, setSearchCity] = useState('Ooty')
  const [inputCity, setInputCity] = useState('')

  useEffect(() => {
    fetchWeatherData()
  }, [])

  const fetchWeatherData = async (city = searchCity) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000/api/weather?city=${city}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setWeatherData(data)
      setError(null)
      setSearchCity(city)
      console.log('Weather data received:', data)
    } catch (error) {
      console.error('Error fetching weather data:', error)
      setError('Failed to fetch weather data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (inputCity.trim()) {
      fetchWeatherData(inputCity.trim())
    }
  }

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌤️'
    }
    return icons[condition] || '🌤️'
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Current Weather</h1>
          <button type="button" className="logout-btn" onClick={() => navigate('/login')}>Logout</button>
        </div>
        <div className="loading">Loading weather data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Current Weather</h1>
          <button type="button" className="logout-btn" onClick={() => navigate('/login')}>Logout</button>
        </div>
        <div className="error">{error}</div>
        <button onClick={() => fetchWeatherData(searchCity)} className="submit-btn" style={{ marginTop: '1rem' }}>Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Current Weather</h1>
        <button type="button" className="logout-btn" onClick={() => navigate('/login')}>Logout</button>
      </div>
      
      <div className="search-section">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-group">
            <input
              type="text"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              placeholder="Enter city name..."
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </div>
        </form>
      </div>
      
      <div className="weather-content">
        <div className="current-weather">
          <h2>{weatherData.current.location}</h2>
          <div className="current-details">
            <div className="temp-main">
              <span className="weather-icon">{getWeatherIcon(weatherData.current.icon)}</span>
              <span className="temperature">{weatherData.current.temp}°C</span>
            </div>
            <div className="condition">{weatherData.current.condition}</div>
            <div className="weather-stats">
              <span>Humidity: {weatherData.current.humidity}%</span>
              <span>Wind: {weatherData.current.windSpeed} km/h</span>
              <span>Precipitation: {weatherData.current.precipitation}mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


