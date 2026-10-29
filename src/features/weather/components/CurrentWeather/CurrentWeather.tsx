import type { CurrentWeather as CurrentWeatherData } from '../../types';
import './CurrentWeather.css';

interface CurrentWeatherProps {
  weather: CurrentWeatherData;
}

function CurrentWeather({ weather }: CurrentWeatherProps) {
  const [condition] = weather.weather;

  if (!condition) {
    return null;
  }

  return (
    <div className="weather-container">
      <h2>{weather.name}</h2>
      <div className="weather-info">
        <img
          src={`https://openweathermap.org/img/wn/${condition.icon}@2x.png`}
          alt={condition.description}
        />
        <p className="temperature">{Math.round(weather.main.temp)}ºC</p>
      </div>
      <p className="description">{condition.description}</p>
      <div className="details">
        <p>Sensação térmica: {Math.round(weather.main.feels_like)}ºC</p>
        <p>Umidade: {weather.main.humidity}%</p>
        <p>Pressão: {weather.main.pressure} hPa</p>
      </div>
    </div>
  );
}

export default CurrentWeather;
