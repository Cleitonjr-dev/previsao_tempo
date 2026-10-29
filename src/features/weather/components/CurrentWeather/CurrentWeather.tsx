import type { CurrentWeather as CurrentWeatherData } from '../../types';

interface CurrentWeatherProps {
  weather: CurrentWeatherData;
}

function CurrentWeather({ weather }: CurrentWeatherProps) {
  const [condition] = weather.weather;

  if (!condition) {
    return null;
  }

  return (
    <div className="my-5 rounded-[10px] bg-[rgba(255,255,255,0.8)] p-5">
      <h2 className="text-[2rem]">{weather.name}</h2>
      <div className="flex items-center justify-center">
        <img
          src={`https://openweathermap.org/img/wn/${condition.icon}@2x.png`}
          alt={condition.description}
          className="w-[100px]"
        />
        <p className="text-[2.5rem] font-bold">{Math.round(weather.main.temp)}ºC</p>
      </div>
      <p className="mb-2.5 text-[1.3rem] capitalize">{condition.description}</p>
      <div className="flex justify-around">
        <p>Sensação térmica: {Math.round(weather.main.feels_like)}ºC</p>
        <p>Umidade: {weather.main.humidity}%</p>
        <p>Pressão: {weather.main.pressure} hPa</p>
      </div>
    </div>
  );
}

export default CurrentWeather;
