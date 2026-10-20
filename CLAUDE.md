# CLAUDE.md: Goblin Games website

The website of **Goblin Games** (legal name Goblin Games Company), a one-person game studio
(Jason Wilczak), with a page for each game. The first game is **The Last God**, a dark-fantasy
roguelike auto-shooter coming to Steam. Content comes from the game's own repo
(`jasonwilczak/the-last-god`, private); this repo never edits it.

## Decisions already made (2026-10-20, with the developer)
- **Stack:** Astro, static output, deployed to **GitHub Pages** with GitHub's official Astro
  workflow (`withastro/action`). This repo is public; nothing private goes in it.
- **Domain:** the studio's own domain, set as a custom domain on Pages (`public/CNAME`). The domain
  is still to be filled in `content/studio/studio.json`; until then, build for the
  `*.github.io` URL.
- **The trailer goes on YouTube and is embedded** (it's 61 MB; never commit video over a few MB).
  `game.json` `trailer.youtubeId` is empty until it's uploaded; show the hero art instead.
- **Animations** are small MP4s with a still poster. Show the poster, and load and play the video
  only when it scrolls into view (an IntersectionObserver: muted, looped, `playsinline`). This
  keeps a visit to a few MB (GitHub Pages' soft limit is about 100 GB a month).
- **No cookies, no tracking banner.** If analytics are wanted later, use Cloudflare Web Analytics
  (cookie-less).
- **Mobile first:** the developer works from a phone and most visitors will be on one.
- **Studio, then games:** the site must take a second game by adding a folder under
  `content/games/`, not by copying pages.

## Pages
1. **`/` studio home:**
   - the goblin logo (`content/studio/assets/`), with the artist's credit somewhere visible;
   - a short about;
   - a card per game (`content/games/*/game.json`: capsule art, title, tagline, status);
   - contact and links (only those set in studio.json; skip blanks).
2. **`/games/the-last-god`**, laid out like a Steam page:
   - a hero (`art.hero`, with `art.logo` over it) and a big **Wishlist on Steam** button (from
     `steam.url`; if empty, a disabled "Coming soon to Steam");
   - the trailer (when set), the short description, and `about` (markdown: **bold**, *italics*)
     with `about_animation` after it;
   - the features, each with its `animations`;
   - a screenshot gallery (thumbs that open the full image), the demo section and the facts;
   - system requirements, credits, and the AI disclosure, worded exactly as given (it matches
     Steam's).
3. **`/games/the-last-god/press`:** a fact sheet (`facts`), the short and long description,
   screenshots and logos to download, credits, contact.
4. A **404**, social preview tags (Open Graph with the capsule as the image), and the favicon (from
   `favicon-*.png`).

## The look (from the game's art style guide)
- **Colours** (the game's UI theme):
  - background `#0E0C0D`; panel `#1A191B`; text `#E6DFD3`;
  - gold accent `#D4AF5A` (hover `#E8C877`); muted text `#6E6B66`.
  - Gold means "yours" in the game; violet is for enemies and red for danger, so keep both out of
    the site's chrome.
- **Fonts** (all SIL OFL, licences included in `content/fonts/`; self-host them, no Google Fonts
  call):
  - **MedievalSharp** for the studio name "Goblin Games";
  - **Cinzel Decorative** for game titles;
  - **Cinzel** for headings;
  - **Alegreya Sans** for body text.
- **Mood:** dark, ash and gold, restrained. Big art, little chrome, generous spacing. No stock
  icons or emoji.

## Content rules (they come from the game's story bible; don't break them)
- Never reveal the game's secrets: who the Narrator is, Death's purpose, the ring choice, or the
  cycle. Secret pantheons are only hinted at ("Some realms are not on any map"). Use the store
  text as written rather than writing new story copy.
- The lost loved one is never named or described.
- Keep the AI disclosure and the credits whole wherever the game is shown.

## Content files
- **`content/studio/studio.json`:** the studio; nulls are unknown yet (domain, email, links), so
  skip them.
- **`content/games/the-last-god/game.json`:** everything for the game page. `steam.appId` and
  `trailer.youtubeId` are null until they exist.
- **Assets:**
  - `content/games/the-last-god/assets/` holds screenshots (WebP, full and thumb), animations
    (MP4 and poster) and art (hero, logo, capsules);
  - `content/studio/assets/` holds the goblin logo and favicons;
  - `content/fonts/` holds the fonts.
- The content is regenerated in the game repo by its export and copied in; don't hand-edit the
  text in `game.json` (change it at the source, the game's store copy), but layout is free.
