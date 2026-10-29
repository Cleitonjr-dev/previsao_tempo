import {
  GENERIC_ERROR_MESSAGE,
  NOT_FOUND_MESSAGE,
  WeatherApiError,
  getCurrentWeather,
  getForecast,
} from './weatherApi';

const signal = new AbortController().signal;

function mockFetch(response: Response | Error) {
  const fetchMock = vi.fn(() =>
    response instanceof Error ? Promise.reject(response) : Promise.resolve(response),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('weatherApi', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should ask the proxy for the current weather', async () => {
    const fetchMock = mockFetch(Response.json({ name: 'Recife' }));

    await expect(getCurrentWeather('Recife', signal)).resolves.toEqual({ name: 'Recife' });
    expect(fetchMock).toHaveBeenCalledWith('/api/weather?type=weather&q=Recife', { signal });
  });

  it('should ask the proxy for the forecast', async () => {
    const fetchMock = mockFetch(Response.json({ list: [] }));

    await getForecast('Recife', signal);

    expect(fetchMock).toHaveBeenCalledWith('/api/weather?type=forecast&q=Recife', { signal });
  });

  it('should encode the city so it cannot add query parameters', async () => {
    const fetchMock = mockFetch(Response.json({}));

    await getCurrentWeather('São Paulo&type=forecast#x', signal);

    const [url] = fetchMock.mock.calls[0] as unknown as [string];
    const params = new URL(url, 'http://localhost').searchParams;
    expect(params.get('type')).toBe('weather');
    expect(params.get('q')).toBe('São Paulo&type=forecast#x');
  });

  it('should explain when the city does not exist', async () => {
    mockFetch(new Response(null, { status: 404 }));

    await expect(getCurrentWeather('Xyz', signal)).rejects.toThrow(NOT_FOUND_MESSAGE);
  });

  it.each([400, 500, 502])('should hide HTTP %i behind a friendly message', async (status) => {
    mockFetch(new Response(null, { status }));

    const error = await getCurrentWeather('Recife', signal).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(WeatherApiError);
    expect((error as Error).message).toBe(GENERIC_ERROR_MESSAGE);
  });

  it('should hide network failures behind a friendly message', async () => {
    mockFetch(new TypeError('Failed to fetch'));

    await expect(getForecast('Recife', signal)).rejects.toThrow(GENERIC_ERROR_MESSAGE);
  });

  it('should let an aborted request through untouched', async () => {
    const controller = new AbortController();
    controller.abort();
    mockFetch(Object.assign(new Error('aborted'), { name: 'AbortError' }));

    await expect(getForecast('Recife', controller.signal)).rejects.toMatchObject({
      name: 'AbortError',
    });
  });
});
