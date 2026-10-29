import type { Forecast as ForecastData } from '../../types';
import { formatDay, getDailyForecasts } from '../../utils/forecast';

interface ForecastProps {
  forecast: ForecastData;
}

function Forecast({ forecast }: ForecastProps) {
  const days = getDailyForecasts(forecast);

  return (
    <div className="my-5 rounded-[10px] bg-[rgba(255,255,255,0.8)] p-5">
      <h3 className="mb-[15px] text-[1.5rem]">Próximos 5 dias</h3>
      {/* Celular e tablet: uma linha por dia. Telas largas: 5 colunas, uma por dia. */}
      <ul className="mx-auto flex max-w-[480px] list-none flex-col gap-2.5 lg:grid lg:max-w-none lg:grid-cols-5">
        {days.map((day) => (
          <li
            key={day.date}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 rounded-[10px] bg-[rgba(255,255,255,0.7)] p-2.5 text-left lg:flex lg:flex-col lg:gap-x-0 lg:text-center"
          >
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt=""
              className="row-span-2 lg:order-2"
            />
            <p className="col-start-2 capitalize lg:order-1">{formatDay(day.date)}</p>
            <p className="col-start-2 lg:order-3">{day.description}</p>
            <div className="col-start-3 row-span-2 row-start-1 text-right lg:order-4 lg:text-center">
              <p className="font-bold">{Math.round(day.max)}ºC máx</p>
              <p>{Math.round(day.min)}ºC mín</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Forecast;
