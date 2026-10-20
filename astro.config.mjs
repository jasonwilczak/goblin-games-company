import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

// With a domain in studio.json the site lives at its root; until then it's the
// project page on github.io, under /goblin-games-company.
const studio = JSON.parse(readFileSync(new URL('./content/studio/studio.json', import.meta.url), 'utf8'));
const domain = studio.domain?.replace(/^https?:\/\//, '').replace(/\/+$/, '');

export default defineConfig({
  site: domain ? `https://${domain}` : 'https://jasonwilczak.github.io',
  base: domain ? '/' : '/goblin-games-company',
  trailingSlash: 'ignore',
  output: 'static',
  vite: {
    // Every asset is a real file, so it can be downloaded and used as a social image.
    build: { assetsInlineLimit: 0 },
  },
});
