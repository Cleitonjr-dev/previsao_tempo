import { useEffect, useRef, useState } from 'react';
import {
  GENERIC_ERROR_MESSAGE,
  WeatherApiError,
  getCurrentWeather,
  getForecast,
} from '../api/weatherApi';
import type { CurrentWeather, Forecast } from '../types';

export const EMPTY_CITY_MESSAGE = 'Por favor, digite o nome de uma cidade.';

interface SearchState {
  weather: CurrentWeather | null;
  forecast: Forecast | null;
  error: string | null;
}

const IDLE: SearchState = { weather: null, forecast: null, error: null };

export function useWeatherSearch() {
  const [state, setState] = useState<SearchState>(IDLE);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);

  async function search(rawCity: string) {
    controller.current?.abort();

    const city = rawCity.trim();
    if (!city) {
      setState({ ...IDLE, error: EMPTY_CITY_MESSAGE });
      return;
    }

    const current = new AbortController();
    controller.current = current;
    setState(IDLE);

    try {
      const [weather, forecast] = await Promise.all([
        getCurrentWeather(city, current.signal),
        getForecast(city, current.signal),
      ]);
      setState({ weather, forecast, error: null });
    } catch (error) {
      if (current.signal.aborted) return;
      setState({
        ...IDLE,
        error: error instanceof WeatherApiError ? error.message : GENERIC_ERROR_MESSAGE,
      });
    }
  }

  return { ...state, search };
}
