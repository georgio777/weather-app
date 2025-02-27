import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Moscow'); // По умолчанию Москва
  const [inputCity, setInputCity] = useState(''); // Для хранения введенного города

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
        setError(null);
      } catch (error) {
        console.error('Ошибка при загрузке погоды:', error);
        setError('Не удалось найти город. Попробуй еще раз!');
      }
    };
    fetchWeather();
  }, [city]); // Зависимость от city — запрос повторяется при его изменении

  const handleCityChange = () => {
    if (inputCity.trim()) { // Проверяем, что поле не пустое
      setCity(inputCity.trim()); // Обновляем город
      setInputCity(''); // Очищаем поле ввода
    }
  };

  return (
    <div>
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
      {error ? (
        <p>{error}</p>
      ) : weather ? (
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