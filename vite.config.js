import fs from 'node:fs/promises';
import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

function spaFallback() {
  return {
    name: 'spa-fallback',
    configurePreviewServer(server) {
      const fallbackPath = path.resolve(
        server.config.root ?? process.cwd(),
        server.config.build.outDir,
        'index.html',
      );

      let cachedHtml;

      const loadFallbackHtml = async () => {
        if (cachedHtml) {
          return cachedHtml;
        }

        cachedHtml = await fs.readFile(fallbackPath, 'utf-8');
        return cachedHtml;
      };

      server.middlewares.use(async (req, res, next) => {
        try {
          if (req.method !== 'GET') {
            return next();
          }

          const requestUrl = req.originalUrl || req.url;

          if (!requestUrl || requestUrl.includes('.') || requestUrl.startsWith('/@fs/')) {
            return next();
          }

          const html = await loadFallbackHtml();

          res.setHeader('Content-Type', 'text/html');
          res.end(html);
          return undefined;
        } catch (error) {
          return next(error);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), spaFallback()],
});
