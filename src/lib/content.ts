import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

// Everything the pages show comes from content/. A new game is a new folder
// under content/games/ with a game.json; nothing here needs to change.

export interface Studio {
  name: string;
  legal_name: string;
  domain: string | null;
  tagline: string | null;
  about: string;
  contact_email: string | null;
  links: Record<string, string | null>;
  logo: { image: string; credit: string; credit_url: string | null };
  games: string[];
}

export interface Screenshot { id: string; full: string; thumb: string; alt: string; width: number; height: number }
export interface Animation { id: string; video: string; poster: string; alt: string }
export interface Feature { title: string; text: string; animations?: string[] }
export interface Credit { role: string; who: string[] }

export interface Game {
  slug: string;
  title: string;
  tagline: string;
  status: string;
  steam: { appId: number | string | null; demoAppId: number | string | null; url: string | null };
  trailer: { youtubeId: string | null };
  short_description: string;
  about: string[];
  about_animation?: string;
  features: Feature[];
  closing_line?: string;
  demo?: { short_description: string; includes: string[]; full_game_adds?: string };
  facts: Record<string, string | string[]>;
  requirements: Record<string, Record<string, string>>;
  ai_disclosure: string;
  credits: Credit[];
  screenshots: Screenshot[];
  animations: Animation[];
  art: Record<string, string>;
}

const studioJson = import.meta.glob<Studio>('/content/studio/studio.json', { eager: true, import: 'default' });
const gameJson = import.meta.glob<Game>('/content/games/*/game.json', { eager: true, import: 'default' });
const files = import.meta.glob<string>('/content/**/assets/**/*', { eager: true, query: '?url', import: 'default' });

export const studio: Studio = studioJson['/content/studio/studio.json'];

/** Built URL of a file named relative to a content folder, e.g. asset('games/the-last-god', 'assets/art/hero.webp'). */
export function asset(folder: string, path: string): string {
  const url = files[`/content/${folder}/${path}`];
  if (!url) throw new Error(`Missing asset: content/${folder}/${path}`);
  return url;
}

export const studioAsset = (path: string) => asset('studio', path);

// Games in the order studio.json lists them; any other folder follows, by name.
const listed = new Map(studio.games.map((slug, i) => [slug, i]));
export const games: Game[] = Object.entries(gameJson)
  .map(([path, game]) => ({ ...game, slug: game.slug ?? path.split('/')[3] }))
  .sort((a, b) => (listed.get(a.slug) ?? 1e9) - (listed.get(b.slug) ?? 1e9) || a.slug.localeCompare(b.slug));

export const gameAsset = (game: Game, path: string) => asset(`games/${game.slug}`, path);

const artImages = import.meta.glob<ImageMetadata>('/content/games/*/assets/art/*.{webp,png,jpg}', { eager: true, import: 'default' });

/** The capsule as a 1200px JPEG for link previews (not every app reads WebP there). */
export async function socialImage(game: Game): Promise<string> {
  const src = artImages[`/content/games/${game.slug}/${game.art.capsule}`];
  if (!src) return gameAsset(game, game.art.capsule);
  return (await getImage({ src, format: 'jpg', width: 1200, quality: 82 })).src;
}

/** A link inside the site, with the base path in front. */
export function href(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** The small markdown the store copy uses: **bold** and *italics*. */
export function inline(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

const linkNames: Record<string, string> = {
  steam_developer: 'Steam',
  youtube: 'YouTube',
  x: 'X',
  bluesky: 'Bluesky',
  instagram: 'Instagram',
  discord: 'Discord',
  reddit: 'Reddit',
};

/** The studio's links that are set, blanks skipped. */
export const studioLinks = Object.entries(studio.links)
  .filter((entry): entry is [string, string] => Boolean(entry[1]))
  .map(([key, url]) => ({ label: linkNames[key] ?? key, url }));

export const fileName = (path: string) => path.split('/').pop() ?? path;
