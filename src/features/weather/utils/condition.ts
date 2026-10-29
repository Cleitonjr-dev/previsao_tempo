export type WeatherCondition = 'clear' | 'clouds' | 'rain' | 'snow';

/**
 * Converte o código de condição do OpenWeather em um dos climas que têm animação.
 * Faixas: 2xx trovoada, 3xx garoa e 5xx chuva; 6xx neve; 801-804 nuvens.
 */
export function getWeatherCondition(id: number): WeatherCondition {
  if (id >= 200 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id >= 801 && id <= 804) return 'clouds';
  return 'clear';
}
