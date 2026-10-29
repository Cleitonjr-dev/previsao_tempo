import { useEffect, useRef, type FormEvent } from 'react';
import './App.css';
import CloudAnimation from './features/weather/components/CloudAnimation/CloudAnimation';
import CurrentWeather from './features/weather/components/CurrentWeather/CurrentWeather';
import Forecast from './features/weather/components/Forecast/Forecast';
import RainAnimation from './features/weather/components/RainAnimation/RainAnimation';
import SnowAnimation from './features/weather/components/SnowAnimation/SnowAnimation';
import { useWeatherSearch } from './features/weather/hooks/useWeatherSearch';
import { getWeatherCondition } from './features/weather/utils/condition';

function App() {
  const { weather, forecast, error, search } = useWeatherSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  const description = weather?.weather[0];
  const condition = description ? getWeatherCondition(description.id) : 'clear';

  useEffect(() => {
    document.body.dataset.condition = condition;
  }, [condition]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void search(inputRef.current?.value ?? '');
  }

  return (
    <main className="container">
      {condition === 'rain' && <RainAnimation />}
      {condition === 'snow' && <SnowAnimation />}
      {condition === 'clouds' && <CloudAnimation />}
      <h1>Previsão do tempo</h1>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          aria-label="Nome da cidade"
          placeholder="Digite o nome da cidade"
        />
        <button type="submit">Buscar</button>
      </form>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {weather && <CurrentWeather weather={weather} />}
      {forecast && <Forecast forecast={forecast} />}
    </main>
  );
}

export default App;
