import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import WeatherGraph from './components/WeatherGraph';


function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Moscow'); // По умолчанию Москва
  const [inputCity, setInputCity] = useState(''); // Для хранения введенного города
  const [theme, setTheme] = useState('light'); // Светлая по умолчанию
  const [forecast, setForecast] = useState([]); // Для прогноза

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              q: city, // Используем значение из состояния city
              appid: '28bf50b336c7c531516c01229ec84287', 
              units: 'metric', // Цельсий
            },
          }
        );
        setWeather(response.data);
        // Прогноз на 5 дней
        const forecastResponse = await axios.get(
          'https://api.openweathermap.org/data/2.5/forecast',
          {
            params: {
              q: city,
              appid: '28bf50b336c7c531516c01229ec84287',
              units: 'metric',
            },
          }
        );
        // Фильтруем данные, берем только полдень (12:00) каждого дня
        const dailyForecast = forecastResponse.data.list.filter((item) =>
          item.dt_txt.includes('12:00:00')
        );
        setForecast(dailyForecast);

        setError(null);
        // Автоматическая тема по погоде
        if (theme === 'auto' && response.data.weather[0].main) {
          const weatherType = response.data.weather[0].main.toLowerCase();
          setTheme(weatherType === 'rain' || weatherType === 'clouds' ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Ошибка при загрузке погоды:', error);
        setError('Не удалось найти город. Попробуй еще раз!');
      }
    };
    fetchWeather();
  }, [city, theme]); // Обновляем при смене города или темы

  const handleCityChange = () => {
    if (inputCity.trim()) { // Проверяем, что поле не пустое
      setCity(inputCity.trim()); // Обновляем город
      setInputCity(''); // Очищаем поле ввода
    }
  };

  return (
<div className={`app ${theme}`}>
      <h1>Weather App</h1>
      <div>
        <input
          type="text"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Введите город"
        />
        <button onClick={handleCityChange}>Показать погоду</button>
      </div>
      <div>
        <button onClick={() => setTheme('light')}>Светлая</button>
        <button onClick={() => setTheme('dark')}>Темная</button>
        <button onClick={() => setTheme('auto')}>По погоде</button>
      </div>

      {/* Текущая погода */}
      {error ? (
        <p>{error}</p>
      ) : weather ? (
        <div>
          <h2>Сейчас в {weather.name}</h2>
          <p>Температура: {weather.main.temp}°C</p>
          <p>Погода: {weather.weather[0].description}</p>
        </div>
      ) : (
        <p>Загружаем...</p>
      )}

      {/* Прогноз */}
      {forecast.length > 0 && (
        <div>
          <h2>Прогноз на 5 дней</h2>
          <WeatherGraph forecast={forecast} />
        </div>
      )}
    </div>
  );
}

export default App;