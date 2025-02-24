import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              q: 'Moscow', // Пока хардкодим город
              appid: '28bf50b336c7c531516c01229ec84287', // Вставь свой ключ
              units: 'metric', // Цельсий
            },
          }
        );
        setWeather(response.data);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div>
      <h1>Weather App</h1>
      {weather ? (
        <div>
          <p>Город: {weather.name}</p>
          <p>Температура: {weather.main.temp}°C</p>
          <p>Погода: {weather.weather[0].description}</p>
        </div>
      ) : (
        <p>Загружаем...</p>
      )}
    </div>
  );
}

export default App;