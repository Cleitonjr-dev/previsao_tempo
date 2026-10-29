import type { Forecast, ForecastSlot } from '../types';
import { formatDay, getDailyForecasts } from './forecast';

const SAO_PAULO = -3 * 3600;

function slot(
  utc: string,
  min: number,
  max: number,
  icon = '10d',
  description = 'chuva',
): ForecastSlot {
  return {
    dt: Date.parse(utc) / 1000,
    main: { temp_min: min, temp_max: max },
    weather: [{ id: 500, main: 'Rain', description, icon }],
  };
}

/** Intervalos de 3 h a partir de um instante UTC. */
function every3h(startUtc: string, count: number, build: (index: number) => [number, number]) {
  return Array.from({ length: count }, (_, index) => {
    const [min, max] = build(index);
    return slot(new Date(Date.parse(startUtc) + index * 3 * 3600_000).toISOString(), min, max);
  });
}

describe('getDailyForecasts', () => {
  it('should skip today and return the next 5 days', () => {
    const forecast: Forecast = {
      city: { timezone: SAO_PAULO },
      list: every3h('2026-10-29T15:00:00Z', 40, () => [15, 25]),
    };
    // 29/10 12:30 em São Paulo
    const now = Date.parse('2026-10-29T15:30:00Z');

    const days = getDailyForecasts(forecast, now);

    expect(days.map((day) => day.date)).toEqual([
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
      '2026-11-02',
      '2026-11-03',
    ]);
  });

  it('should use the lowest minimum and the highest maximum of the day', () => {
    const forecast: Forecast = {
      city: { timezone: SAO_PAULO },
      list: [
        slot('2026-10-30T12:00:00Z', 18, 22),
        slot('2026-10-30T15:00:00Z', 20, 29),
        slot('2026-10-30T21:00:00Z', 14, 24),
      ],
    };

    const [day] = getDailyForecasts(forecast, Date.parse('2026-10-29T12:00:00Z'));

    expect(day).toMatchObject({ date: '2026-10-30', min: 14, max: 29 });
  });

  it('should group days by the city time zone, not the browser one', () => {
    // 02:00 UTC de 31/10 ainda é 30/10 23:00 em São Paulo.
    const forecast: Forecast = {
      city: { timezone: SAO_PAULO },
      list: [slot('2026-10-31T02:00:00Z', 10, 12), slot('2026-10-31T15:00:00Z', 20, 30)],
    };

    const days = getDailyForecasts(forecast, Date.parse('2026-10-29T12:00:00Z'));

    expect(days.map((day) => [day.date, day.min, day.max])).toEqual([
      ['2026-10-30', 10, 12],
      ['2026-10-31', 20, 30],
    ]);
  });

  it('should describe the day with the interval closest to noon', () => {
    const forecast: Forecast = {
      city: { timezone: 0 },
      list: [
        slot('2026-10-30T00:00:00Z', 10, 12, '01n', 'céu limpo'),
        slot('2026-10-30T12:00:00Z', 15, 25, '10d', 'chuva leve'),
        slot('2026-10-30T21:00:00Z', 12, 14, '04n', 'nublado'),
      ],
    };

    const [day] = getDailyForecasts(forecast, Date.parse('2026-10-29T12:00:00Z'));

    expect(day).toMatchObject({ icon: '10d', description: 'chuva leve' });
  });

  it('should return nothing when there is no future day', () => {
    const forecast: Forecast = {
      city: { timezone: 0 },
      list: [slot('2026-10-29T18:00:00Z', 10, 12)],
    };

    expect(getDailyForecasts(forecast, Date.parse('2026-10-29T12:00:00Z'))).toEqual([]);
  });
});

describe('formatDay', () => {
  it('should write the weekday and the day in Portuguese', () => {
    expect(formatDay('2026-10-30')).toBe('sexta-feira, 30');
    expect(formatDay('2026-11-01')).toBe('domingo, 01');
  });
});
