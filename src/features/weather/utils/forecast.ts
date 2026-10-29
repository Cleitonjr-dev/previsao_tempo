import type { DailyForecast, Forecast, ForecastSlot } from '../types';

const DAYS_SHOWN = 5;
const NOON = 12;

/** Desloca o instante para o fuso da cidade; os campos UTC do resultado são o horário local. */
function toCityTime(seconds: number, timezone: number): Date {
  return new Date((seconds + timezone) * 1000);
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Intervalo de 3 h mais próximo do meio-dia local; em empate, o mais cedo. */
function pickMidday(slots: ForecastSlot[], timezone: number): ForecastSlot | undefined {
  let best: ForecastSlot | undefined;
  let bestDistance = Infinity;

  for (const slot of slots) {
    const distance = Math.abs(toCityTime(slot.dt, timezone).getUTCHours() - NOON);
    if (distance < bestDistance) {
      best = slot;
      bestDistance = distance;
    }
  }

  return best;
}

/**
 * Agrupa a previsão de 3 em 3 horas por dia (no fuso da cidade) e devolve os 5 dias
 * seguintes ao de hoje, com a mínima e a máxima de cada dia.
 */
export function getDailyForecasts(forecast: Forecast, now: number = Date.now()): DailyForecast[] {
  const { timezone } = forecast.city;
  const today = dateKey(toCityTime(Math.floor(now / 1000), timezone));
  const byDay = new Map<string, ForecastSlot[]>();

  for (const slot of forecast.list) {
    const key = dateKey(toCityTime(slot.dt, timezone));
    if (key <= today) continue;
    byDay.set(key, [...(byDay.get(key) ?? []), slot]);
  }

  const days: DailyForecast[] = [];

  for (const [date, slots] of [...byDay].sort(([a], [b]) => a.localeCompare(b))) {
    const midday = pickMidday(slots, timezone);
    const weather = midday?.weather[0];
    if (!midday || !weather) continue;

    days.push({
      date,
      min: Math.min(...slots.map((slot) => slot.main.temp_min)),
      max: Math.max(...slots.map((slot) => slot.main.temp_max)),
      icon: weather.icon,
      description: weather.description,
    });
  }

  return days.slice(0, DAYS_SHOWN);
}

/** Ex.: "sexta-feira, 30". */
export function formatDay(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    timeZone: 'UTC',
  });
}
