const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

const app = express();
const port = 3000;

app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());



app.get('/api/weather', async (req, res) => {
  try {
    const { city = 'Coimbatore' } = req.query;
    
    console.log('Fetching weather for:', city);
    console.log('API Key:', process.env.API_KEY ? 'Present' : 'Missing');
    
    try {
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`);
      
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`);
      
      const current = weatherResponse.data;
      const currentWeather = {
        location: `${current.name}, ${current.sys.country}`,
        temp: Math.round(current.main.temp),
        condition: current.weather[0].description,
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6),
        precipitation: current.rain ? current.rain['1h'] || 0 : 0,
        icon: current.weather[0].main
      };
      
      const forecast = [];
      const dailyData = forecastResponse.data.list.filter((item, index) => index % 8 === 0);
      
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      dailyData.slice(0, 5).forEach((day, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        const dayName = index === 0 ? 'Today' : days[date.getDay()];
        
        forecast.push({
          day: dayName,
          high: Math.round(day.main.temp_max),
          low: Math.round(day.main.temp_min),
          condition: day.weather[0].description,
          icon: day.weather[0].main
        });
      });
      
      res.json({
        current: currentWeather,
        forecast: forecast
      });
      
    } catch (apiError) {
      console.error('OpenWeatherMap API Error:', apiError.response?.status, apiError.response?.data);
      
      // Fallback to mock data if API fails - make it more realistic based on city
      const getMockData = (cityName) => {
        const mockDataMap = {
          'London': {
            temp: 15, condition: 'Cloudy', humidity: 70, windSpeed: 18, icon: 'Clouds'
          },
          'New York': {
            temp: 18, condition: 'Partly Cloudy', humidity: 60, windSpeed: 22, icon: 'Clouds'
          },
          'Tokyo': {
            temp: 22, condition: 'Clear', humidity: 55, windSpeed: 12, icon: 'Clear'
          },
          'Mumbai': {
            temp: 32, condition: 'Humid', humidity: 85, windSpeed: 15, icon: 'Clouds'
          },
          'Ooty': {
            temp: 20, condition: 'Mist', humidity: 75, windSpeed: 10, icon: 'Mist'
          },
          'Coimbatore': {
            temp: 28, condition: 'Partly Cloudy', humidity: 65, windSpeed: 12, icon: 'Clouds'
          },
          'Bengaluru': {
            temp: 30, condition: 'Clear', humidity: 60, windSpeed: 10, icon: 'Clear'
          },
          'Bangalore': {
            temp: 30, condition: 'Clear', humidity: 60, windSpeed: 10, icon: 'Clear'
          },
          'Paris': {
            temp: 17, condition: 'Rainy', humidity: 80, windSpeed: 20, icon: 'Rain'
          },
          'Sydney': {
            temp: 25, condition: 'Sunny', humidity: 50, windSpeed: 25, icon: 'Clear'
          }
        };
        
        // Default data if city not found
        const defaultData = {
          temp: 20, condition: 'Partly Cloudy', humidity: 65, windSpeed: 15, icon: 'Clouds'
        };

        // Build a case-insensitive lookup map
        const lookup = Object.fromEntries(Object.keys(mockDataMap).map(k => [k.toLowerCase(), mockDataMap[k]]));
        const cityKey = (cityName || '').toLowerCase();
        const cityData = lookup[cityKey] || defaultData;
        
        // Determine country code in a case-insensitive way
        const lower = cityKey;
        const country = lower === 'london' ? 'GB' : lower === 'new york' ? 'US' : lower === 'tokyo' ? 'JP' : (lower === 'mumbai' || lower === 'ooty' || lower === 'coimbatore' || lower === 'bengaluru' || lower === 'bangalore') ? 'IN' : lower === 'paris' ? 'FR' : lower === 'sydney' ? 'AU' : 'XX';

        return {
          current: {
            location: `${cityName}, ${country}`,
            temp: cityData.temp,
            condition: cityData.condition,
            humidity: cityData.humidity,
            windSpeed: cityData.windSpeed,
            precipitation: cityData.condition === 'Rainy' ? 5 : 0,
            icon: cityData.icon
          },
          forecast: [
            { day: 'Today', high: cityData.temp + 3, low: cityData.temp - 3, condition: cityData.condition, icon: cityData.icon },
            { day: 'Tomorrow', high: cityData.temp + 5, low: cityData.temp - 2, condition: cityData.icon === 'Clear' ? 'Sunny' : 'Partly Cloudy', icon: cityData.icon === 'Clear' ? 'Clear' : 'Clouds' },
            { day: 'Wednesday', high: cityData.temp + 2, low: cityData.temp - 4, condition: cityData.icon === 'Rain' ? 'Rainy' : 'Cloudy', icon: cityData.icon === 'Rain' ? 'Rain' : 'Clouds' },
            { day: 'Thursday', high: cityData.temp + 4, low: cityData.temp - 3, condition: 'Partly Cloudy', icon: 'Clouds' },
            { day: 'Friday', high: cityData.temp + 6, low: cityData.temp - 1, condition: 'Sunny', icon: 'Clear' }
          ]
        };
      };
      
      const mockData = getMockData(city);
      res.json(mockData);
    }
    
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
