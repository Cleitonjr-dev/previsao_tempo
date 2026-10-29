import { useEffect, useRef, type FormEvent } from 'react';
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
    <main className="mx-auto max-w-[1000px] p-5 text-center">
      {condition !== 'clear' && (
        // Corta as animações na área da tela: sem isso a página ganha rolagem horizontal.
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden motion-reduce:hidden">
          {condition === 'rain' && <RainAnimation />}
          {condition === 'snow' && <SnowAnimation />}
          {condition === 'clouds' && <CloudAnimation />}
        </div>
      )}
      <h1 className="text-[3rem] text-white">Previsão do tempo</h1>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          aria-label="Nome da cidade"
          placeholder="Digite o nome da cidade"
          className="mt-[30px] w-[60%] max-w-[300px] rounded-[20px_0_0_20px] border-none p-2.5 outline-none"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-[0_20px_20px_0] border-0 bg-[#ff9800] p-2.5 font-bold text-white hover:bg-[#f57c00]"
        >
          Buscar
        </button>
      </form>

      {error && (
        <div role="alert" className="mt-2.5 font-bold text-[red]">
          {error}
        </div>
      )}

      {weather && <CurrentWeather weather={weather} />}
      {forecast && <Forecast forecast={forecast} />}
    </main>
  );
}

export default App;
