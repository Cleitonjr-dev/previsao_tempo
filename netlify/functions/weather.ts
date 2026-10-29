import type { Config } from '@netlify/functions';

const API_URL = 'https://api.openweathermap.org/data/2.5';
const REQUEST_TIMEOUT_MS = 8000;
const MAX_CITY_LENGTH = 100;

type Endpoint = 'weather' | 'forecast';

export const config: Config = { path: '/api/weather' };

function isEndpoint(value: string | null): value is Endpoint {
  return value === 'weather' || value === 'forecast';
}

function json(body: unknown, status: number): Response {
  return Response.json(body, { status });
}

/**
 * Proxy do OpenWeather: a chave fica só aqui (variável de ambiente do servidor)
 * e nunca é enviada ao navegador.
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const params = new URL(request.url).searchParams;
  const type = params.get('type');
  const city = params.get('q')?.trim();

  if (!isEndpoint(type) || !city || city.length > MAX_CITY_LENGTH) {
    return json({ error: 'invalid_request' }, 400);
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error('Variável OPENWEATHER_API_KEY não configurada.');
    return json({ error: 'server_misconfigured' }, 500);
  }

  const url = new URL(`${API_URL}/${type}`);
  url.search = new URLSearchParams({
    q: city,
    appid: apiKey,
    lang: 'pt_br',
    units: 'metric',
  }).toString();

  let upstream: Response;
  try {
    upstream = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (error) {
    // Registra só o tipo do erro: a mensagem pode conter a URL com a chave.
    console.error('Falha ao consultar o OpenWeather:', error instanceof Error ? error.name : error);
    return json({ error: 'upstream_unavailable' }, 502);
  }

  if (upstream.status === 404) {
    return json({ error: 'not_found' }, 404);
  }

  if (!upstream.ok) {
    console.error(`OpenWeather respondeu com HTTP ${upstream.status}.`);
    return json({ error: 'upstream_error' }, 502);
  }

  return json(await upstream.json(), 200);
}
