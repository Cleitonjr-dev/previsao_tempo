import type { Forecast as ForecastData } from '../../types';
import { formatDay, getDailyForecasts } from '../../utils/forecast';
import './Forecast.css';

interface ForecastProps {
  forecast: ForecastData;
}

function Forecast({ forecast }: ForecastProps) {
  const days = getDailyForecasts(forecast);

  return (
    <div className="weather-container">
      <h3>Previsão para os próximos 5 dias</h3>
      <div className="weather-list">
        {days.map((day) => (
          <div key={day.date} className="weather-item">
            <p className="forecast-day">{formatDay(day.date)}</p>
            <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt="" />
            <p className="forecast-description">{day.description}</p>
            <p>
              {Math.round(day.min)}ºC min / {Math.round(day.max)}ºC máx
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
