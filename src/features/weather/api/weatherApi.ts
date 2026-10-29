import type { CurrentWeather, Forecast } from '../types';

export const NOT_FOUND_MESSAGE = 'Cidade não encontrada. Verifique o nome digitado.';
export const GENERIC_ERROR_MESSAGE =
  'Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.';

export class WeatherApiError extends Error {}

async function request<T>(
  type: 'weather' | 'forecast',
  city: string,
  signal: AbortSignal,
): Promise<T> {
  const params = new URLSearchParams({ type, q: city });

  let response: Response;
  try {
    response = await fetch(`/api/weather?${params}`, { signal });
  } catch (error) {
    if (signal.aborted) throw error;
    console.error(error);
    throw new WeatherApiError(GENERIC_ERROR_MESSAGE);
  }

  if (response.status === 404) throw new WeatherApiError(NOT_FOUND_MESSAGE);

  if (!response.ok) {
    console.error(`Falha ao buscar ${type}: HTTP ${response.status}`);
    throw new WeatherApiError(GENERIC_ERROR_MESSAGE);
  }

  return response.json();
}

export function getCurrentWeather(city: string, signal: AbortSignal): Promise<CurrentWeather> {
  return request('weather', city, signal);
}

export function getForecast(city: string, signal: AbortSignal): Promise<Forecast> {
  return request('forecast', city, signal);
}
