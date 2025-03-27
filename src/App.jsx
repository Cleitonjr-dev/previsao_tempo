import { useState, useRef, useContext } from 'react';
import './App.css';
import WeatherInformations from './components/WeatherInformations/WeatherInformations';
import WeatherInformations5Days from './components/WeatherInformations5Days/WeatherInformations5Days';
import { getCurrentWeather, get5DaysForecast } from './http/weatherApi';
import { WeatherContext } from './WeatherContext/WeatherContext';
import RainAnimation from './components/RainAnimation/RainAnimation';
import SnowAnimation from './components/SnowAnimation/SnowAnimation';
import CloudAnimation from './components/CloudAnimation/CloudAnimation';


function App() {
  const [weather, setWeather] = useState(null);
  const [weather5Days, setWeather5Days] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef();
  const { isRaining, isSnowing, isClouding } = useContext(WeatherContext);

  async function searchCity() {
    const city = inputRef.current.value.trim();

    setError(null);
    setWeather(null);
    setWeather5Days(null);

    if (!city) {
      setError('Por favor, digite o nome de uma cidade.');
      return;
    }

    try {
      const [currentWeather, fiveDaysForecast] = await Promise.all([
        getCurrentWeather(city),
        get5DaysForecast(city),
      ]);

      setWeather(currentWeather);
      setWeather5Days(fiveDaysForecast);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      {isRaining && <RainAnimation />}
      {isSnowing && <SnowAnimation />}
      {isClouding && <CloudAnimation />}
      <h1>Previsão do tempo</h1>
      <input ref={inputRef} type="text" placeholder="Digite o nome da cidade" onKeyUp={e => e.key === 'Enter' && searchCity()}/>
      <button onClick={searchCity}>Buscar</button>

      {error && <div className="error-message">{error}</div>}

      {weather && <WeatherInformations weather={weather} />}
      {weather5Days && <WeatherInformations5Days weather5Days={weather5Days} />}
    </div>
  );
}

export default App;
