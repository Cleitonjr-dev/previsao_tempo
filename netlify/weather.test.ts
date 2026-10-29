// @vitest-environment node
import handler from './functions/weather';

const KEY = 'chave-secreta-de-teste';

function call(query: string, method = 'GET') {
  return handler(new Request(`https://site.test/api/weather${query}`, { method }));
}

function mockUpstream(response: Response | Error) {
  const fetchMock = vi.fn(() =>
    response instanceof Error ? Promise.reject(response) : Promise.resolve(response),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('weather function', () => {
  beforeEach(() => {
    vi.stubEnv('OPENWEATHER_API_KEY', KEY);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should forward the request to OpenWeather with the server key and fixed options', async () => {
    const fetchMock = mockUpstream(Response.json({ name: 'Recife' }));

    const response = await call('?type=weather&q=Recife');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'Recife' });
    const [url] = fetchMock.mock.calls[0] as unknown as [URL];
    expect(url.origin + url.pathname).toBe('https://api.openweathermap.org/data/2.5/weather');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      q: 'Recife',
      appid: KEY,
      lang: 'pt_br',
      units: 'metric',
    });
  });

  it('should support the forecast endpoint', async () => {
    const fetchMock = mockUpstream(Response.json({ list: [] }));

    await call('?type=forecast&q=Recife');

    const [url] = fetchMock.mock.calls[0] as unknown as [URL];
    expect(url.pathname).toBe('/data/2.5/forecast');
  });

  it('should keep a city with special characters as a single value', async () => {
    const fetchMock = mockUpstream(Response.json({}));

    await call(`?type=weather&q=${encodeURIComponent('São Paulo&units=imperial')}`);

    const [url] = fetchMock.mock.calls[0] as unknown as [URL];
    expect(url.searchParams.get('q')).toBe('São Paulo&units=imperial');
    expect(url.searchParams.get('units')).toBe('metric');
  });

  it.each([
    ['', 'no parameters'],
    ['?type=weather', 'no city'],
    ['?type=weather&q=%20%20', 'blank city'],
    ['?type=other&q=Recife', 'unknown type'],
    [`?type=weather&q=${'a'.repeat(101)}`, 'city too long'],
  ])('should reject %s (%s)', async (query) => {
    const fetchMock = mockUpstream(Response.json({}));

    const response = await call(query);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should reject methods other than GET', async () => {
    const response = await call('?type=weather&q=Recife', 'POST');

    expect(response.status).toBe(405);
  });

  it('should fail clearly when the key is not configured', async () => {
    vi.stubEnv('OPENWEATHER_API_KEY', '');
    const fetchMock = mockUpstream(Response.json({}));

    const response = await call('?type=weather&q=Recife');

    expect(response.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should pass a city not found through as 404', async () => {
    mockUpstream(new Response('{"cod":"404"}', { status: 404 }));

    expect((await call('?type=weather&q=Xyz')).status).toBe(404);
  });

  it('should answer 502 when OpenWeather fails or is unreachable', async () => {
    mockUpstream(new Response(null, { status: 401 }));
    expect((await call('?type=weather&q=Recife')).status).toBe(502);

    mockUpstream(new TypeError('fetch failed'));
    expect((await call('?type=weather&q=Recife')).status).toBe(502);
  });

  it('should never put the key in a response or in the logs', async () => {
    mockUpstream(new Response(null, { status: 401 }));
    const consoleError = vi.spyOn(console, 'error');

    const response = await call('?type=weather&q=Recife');

    expect(await response.text()).not.toContain(KEY);
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(KEY);
  });
});
