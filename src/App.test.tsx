import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { GENERIC_ERROR_MESSAGE, NOT_FOUND_MESSAGE } from './features/weather/api/weatherApi';
import { EMPTY_CITY_MESSAGE } from './features/weather/hooks/useWeatherSearch';

function weatherBody(id: number, description: string) {
  return {
    name: 'Recife',
    weather: [{ id, main: 'X', description, icon: '10d' }],
    main: { temp: 27.6, feels_like: 30.2, humidity: 80, pressure: 1012 },
  };
}

function forecastBody(id: number, description: string) {
  const start = Date.now() / 1000;
  return {
    city: { timezone: 0 },
    list: Array.from({ length: 40 }, (_, index) => ({
      dt: start + index * 3 * 3600,
      main: { temp_min: 20, temp_max: 30 },
      weather: [{ id, main: 'X', description, icon: '10d' }],
    })),
  };
}

function mockApi(id: number, description: string) {
  const fetchMock = vi.fn((input: string) =>
    Promise.resolve(
      Response.json(
        input.includes('type=forecast')
          ? forecastBody(id, description)
          : weatherBody(id, description),
      ),
    ),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

async function search(city: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Nome da cidade'), city);
  await user.click(screen.getByRole('button', { name: 'Buscar' }));
}

const rain = () => document.querySelector('.rain-container');
const snow = () => document.querySelector('.snowflakes');
const clouds = () => document.querySelector('.cloud-container');

describe('App', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should start with the search form only', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Previsão do tempo' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(document.body.dataset.condition).toBe('clear');
  });

  it('should ask for a city when the field is empty', async () => {
    const fetchMock = mockApi(800, 'céu limpo');
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByRole('alert')).toHaveTextContent(EMPTY_CITY_MESSAGE);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should show the current weather and the 5 day forecast', async () => {
    mockApi(800, 'céu limpo');
    render(<App />);

    await search('Recife');

    expect(await screen.findByRole('heading', { name: 'Recife' })).toBeInTheDocument();
    expect(screen.getByText('28ºC')).toBeInTheDocument();
    expect(screen.getByText('Sensação térmica: 30ºC')).toBeInTheDocument();
    expect(screen.getByText('Umidade: 80%')).toBeInTheDocument();
    expect(screen.getByText('Pressão: 1012 hPa')).toBeInTheDocument();
    expect(screen.getByText('Previsão para os próximos 5 dias')).toBeInTheDocument();
    expect(screen.getAllByText('20ºC min / 30ºC máx')).toHaveLength(5);
  });

  it('should search when Enter is pressed', async () => {
    const fetchMock = mockApi(800, 'céu limpo');
    render(<App />);

    await userEvent.type(screen.getByLabelText('Nome da cidade'), 'Recife{Enter}');

    expect(await screen.findByRole('heading', { name: 'Recife' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each([
    [500, 'chuva leve', rain, 'rain'],
    [301, 'garoa', rain, 'rain'],
    [600, 'neve leve', snow, 'snow'],
    [804, 'nublado', clouds, 'clouds'],
  ])('should animate code %i (%s)', async (id, description, animation, condition) => {
    mockApi(id, description);
    render(<App />);

    await search('Recife');

    await waitFor(() => expect(animation()).toBeInTheDocument());
    expect(document.body.dataset.condition).toBe(condition);
    expect(animation()).toHaveAttribute('aria-hidden', 'true');
  });

  it('should not animate a clear sky', async () => {
    mockApi(800, 'céu limpo');
    render(<App />);

    await search('Recife');

    await screen.findByRole('heading', { name: 'Recife' });
    expect(rain() ?? snow() ?? clouds()).toBeNull();
    expect(document.body.dataset.condition).toBe('clear');
  });

  it('should explain when the city is not found', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response(null, { status: 404 }))),
    );
    render(<App />);

    await search('Xyz');

    expect(await screen.findByRole('alert')).toHaveTextContent(NOT_FOUND_MESSAGE);
  });

  it('should show a friendly message when the service fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response(null, { status: 502 }))),
    );
    render(<App />);

    await search('Recife');

    expect(await screen.findByRole('alert')).toHaveTextContent(GENERIC_ERROR_MESSAGE);
  });

  it('should stop the rain and restore the background after a failed search', async () => {
    mockApi(500, 'chuva leve');
    render(<App />);
    await search('Recife');
    await waitFor(() => expect(rain()).toBeInTheDocument());

    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response(null, { status: 404 }))),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(NOT_FOUND_MESSAGE);
    expect(rain()).toBeNull();
    expect(document.body.dataset.condition).toBe('clear');
    expect(screen.queryByRole('heading', { name: 'Recife' })).not.toBeInTheDocument();
  });

  it('should keep only the latest search when two are started', async () => {
    const resolvers: Array<(response: Response) => void> = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (input: string, init: RequestInit) =>
          new Promise<Response>((resolve, reject) => {
            init.signal?.addEventListener('abort', () =>
              reject(new DOMException('aborted', 'AbortError')),
            );
            resolvers.push(resolve);
            void input;
          }),
      ),
    );
    render(<App />);
    const user = userEvent.setup();
    const input = screen.getByLabelText('Nome da cidade');

    await user.type(input, 'Recife');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    // As duas primeiras requisições foram canceladas; atende as da segunda busca.
    resolvers[2]?.(Response.json(weatherBody(800, 'céu limpo')));
    resolvers[3]?.(Response.json(forecastBody(800, 'céu limpo')));

    expect(await screen.findByRole('heading', { name: 'Recife' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
