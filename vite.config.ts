import { Readable } from 'node:stream';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { loadEnv, type Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

type WeatherModule = typeof import('./netlify/functions/weather');

/**
 * Em desenvolvimento serve /api/weather com a mesma função que roda no Netlify,
 * lendo OPENWEATHER_API_KEY do arquivo .env (que não vai para o navegador).
 */
function weatherFunctionDev(apiKey: string | undefined): Plugin {
  return {
    name: 'weather-function-dev',
    configureServer(server) {
      server.middlewares.use('/api/weather', (req, res) => {
        void (async () => {
          // ssrLoadModule não é tipado; o caminho acima garante o formato do módulo.
          const { default: handler } = (await server.ssrLoadModule(
            '/netlify/functions/weather.ts',
          )) as WeatherModule;

          if (apiKey) process.env.OPENWEATHER_API_KEY = apiKey;

          const response = await handler(
            new Request(
              `http://localhost/api/weather${new URL(req.url ?? '/', 'http://localhost').search}`,
              {
                method: req.method,
              },
            ),
          );

          res.statusCode = response.status;
          res.setHeader('content-type', response.headers.get('content-type') ?? 'application/json');
          if (response.body) {
            Readable.fromWeb(response.body).pipe(res);
          } else {
            res.end();
          }
        })();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), weatherFunctionDev(env.OPENWEATHER_API_KEY)],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
    },
  };
});
