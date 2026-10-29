import type { Forecast as ForecastData } from '../../types';
import { formatDay, getDailyForecasts } from '../../utils/forecast';

interface ForecastProps {
  forecast: ForecastData;
}

function Forecast({ forecast }: ForecastProps) {
  const days = getDailyForecasts(forecast);

  return (
    <div className="my-5 rounded-[10px] bg-[rgba(255,255,255,0.8)] p-5">
      <h3 className="mb-[15px] text-[1.5rem]">Previsão para os próximos 5 dias</h3>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {days.map((day) => (
          <div
            key={day.date}
            className="rounded-[10px] bg-[rgba(255,255,255,0.7)] p-2.5 text-center"
          >
            <p className="text-[1rem] capitalize">{formatDay(day.date)}</p>
            <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt="" />
            <p>{day.description}</p>
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
