import './WeatherInformations.css';
import { useContext, useEffect } from 'react';
import { WeatherContext } from '../../WeatherContext/WeatherContext';

function WeatherInformations({ weather }) {
  const { updateBackgroundColor } = useContext(WeatherContext);

  useEffect(() => {
    if (weather && weather.weather && weather.weather[0].description) {
      updateBackgroundColor(weather.weather[0].description);
    }
  }, [weather, updateBackgroundColor]);

  if (!weather || !weather.weather) {
    return null;
  }

  return (
    <div className='weather-container'>
      <h2>{weather.name}</h2>
      <div className='weather-info'>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt={weather.weather[0].description}/>
        <p className='temperature'>{Math.round(weather.main.temp)}ºC</p>
      </div>
      <p className='description'>{weather.weather[0].description}</p>
      <div className='details'>
        <p>Sensação térmica: {Math.round(weather.main.feels_like)}ºC</p>
        <p>Umidade: {weather.main.humidity}%</p>
        <p>Pressão: {weather.main.pressure} hPa</p>
      </div>
    </div>
  );
}

export default WeatherInformations;
