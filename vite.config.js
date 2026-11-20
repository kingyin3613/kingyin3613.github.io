import { defineConfig } from 'vite';
import { renderSections } from './src/render/html.js';

export default defineConfig({
  plugins: [
    {
      name: 'site-sections',
      transformIndexHtml: {
        order: 'pre',
        handler: (html) => renderSections(html),
      },
    },
  ],
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    sourcemap: false,
  },
  worker: { format: 'es' },
});
