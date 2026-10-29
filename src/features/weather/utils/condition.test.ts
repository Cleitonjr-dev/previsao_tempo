import { getWeatherCondition } from './condition';

describe('getWeatherCondition', () => {
  it.each([
    [200, 'rain'],
    [301, 'rain'],
    [500, 'rain'],
    [531, 'rain'],
    [600, 'snow'],
    [622, 'snow'],
    [801, 'clouds'],
    [803, 'clouds'],
    [804, 'clouds'],
    [800, 'clear'],
    [701, 'clear'],
    [781, 'clear'],
  ])('should map code %i to %s', (id, expected) => {
    expect(getWeatherCondition(id)).toBe(expected);
  });
});
