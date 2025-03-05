import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import './App.css';
import WeatherGraph from './components/WeatherGraph';
import { WeatherData, ForecastItem } from './types/weather';
import { weatherTranslations } from './translations/weather';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('Moscow');
  const [inputCity, setInputCity] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [forecast, setForecast] = useState<ForecastItem[]>([]);

  useEffect(() => {
    const fetchWeather = async (): Promise<void> => {
      try {
        const response = await axios.get<WeatherData>(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              q: city,
              appid: '28bf50b336c7c531516c01229ec84287',
              units: 'metric',
            },
          }
        );
        setWeather(response.data);

        const forecastResponse = await axios.get<{ list: ForecastItem[] }>(
          'https://api.openweathermap.org/data/2.5/forecast',
          {
            params: {
              q: city,
              appid: '28bf50b336c7c531516c01229ec84287',
              units: 'metric',
            },
          }
        );

        const dailyForecast = forecastResponse.data.list.filter((item) =>
          item.dt_txt.includes('12:00:00')
        );
        setForecast(dailyForecast);

        setError(null);
        if (theme === 'auto' && response.data.weather[0].main) {
          const weatherType = response.data.weather[0].main.toLowerCase();
          setTheme(weatherType === 'rain' || weatherType === 'clouds' ? 'dark' : 'light');
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Ошибка при загрузке погоды:', axiosError);
        setError('Не удалось найти город. Попробуй еще раз!');
      }
    };
    fetchWeather();
  }, [city, theme]);

  const handleCityChange = (): void => {
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setInputCity('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleCityChange();
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto'): void => {
    setTheme(newTheme);
  };

  return (
    <div className={`app ${theme}`}>
      <h1>Weather App</h1>
      <div>
        <input
          type="text"
          value={inputCity}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputCity(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите город"
        />
        <button onClick={handleCityChange}>Показать погоду</button>
      </div>
      <div>
        <button onClick={() => handleThemeChange('light')}>Светлая</button>
        <button onClick={() => handleThemeChange('dark')}>Темная</button>
        <button onClick={() => handleThemeChange('auto')}>По погоде</button>
      </div>

      {error ? (
        <p>{error}</p>
      ) : weather ? (
        <div>
          <h2>Сейчас в {weather.name}</h2>
          <p>Температура: {weather.main.temp}°C</p>
          <p>Погода: {weatherTranslations[weather.weather[0].description] || weather.weather[0].description}</p>
        </div>
      ) : (
        <p>Загружаем...</p>
      )}

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