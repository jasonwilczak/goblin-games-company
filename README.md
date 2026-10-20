# Goblin Games: website

The studio site and a page for each game. Astro, deployed to GitHub Pages.

- **`content/`:** the text and art, exported from each game's repo (The Last God first).
- **`CLAUDE.md`:** the decisions, the look and the content rules.
- **Deploy:** push to `main`; GitHub Actions builds and publishes. Pages > Source: GitHub Actions.
- **Still to fill in** (`content/studio/studio.json`, `content/games/the-last-god/game.json`):
  - the domain;
  - the contact email and social links;
  - the Steam app ID (game and demo);
  - the trailer's YouTube id.

## Run it locally

```sh
npm install
npm run dev      # http://localhost:4321/goblin-games-company/
npm run build    # static site in dist/
```

`npm run build` first turns the TTFs in `content/fonts/` into WOFF2 (`scripts/fonts.mjs`).
