# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint with Next.js rules
```

**Required environment variable:** `TMDB_API_KEY` — create a `.env.local` file with this key before running.

## Architecture

Next.js 15 App Router app that lets users search for movies/TV shows and see their streaming availability across regions.

### Routing

- `app/page.tsx` — Home page with search UI
- `app/results/page.tsx` — Detail page (`/results?id=...&type=movie|tv&region=...`)
- `pages/api/` — API routes (uses Pages Router for API, App Router for UI)
  - `autocomplete.ts` — Combined movie+TV search with server-side caching (1hr TTL via `node-cache`)
  - `movie/[id].ts` — TMDB movie/TV details passthrough
  - `streaming/[id].ts` — TMDB watch providers for regional availability

### Data Flow

1. User types in `SearchBar` → debounced (300ms) call to `/api/autocomplete?q=...&region=...`
2. Selecting a result navigates to `/results` with id/type/region as query params
3. Results page fetches movie details + streaming providers in parallel
4. `StreamingProviders` renders grouped providers (Stream/Rent/Buy/Free) with deep links

### Global State

- **`RegionContext`** — selected country (US/AR/UK), defaults to AR; passed to all API calls
- **`LanguageContext`** — EN/ES translations loaded from `messages/en.json` and `messages/es.json`; used via `lib/useTranslations.ts`

### Key Implementation Details

**Platform deep linking** (`components/StreamingProviders.tsx`, `utils/platformUtils.ts`):
- Detects iOS/Android/desktop at runtime
- Mobile: tries app URL schemes (`nflx://`, `aiv://`, etc.) with 2s fallback to web
- Android: uses `intent://` URIs
- Desktop: always opens web URLs

**Search ranking** (`pages/api/autocomplete.ts`):
- Merges TMDB movie + TV results, exact matches first, then sorted by popularity
- Filters out results without poster images, returns top 10

**Image optimization** (`next.config.ts`):
- TMDB CDN (`image.tmdb.org`) is the only allowed remote image domain

### Path Aliases

`@/*` maps to the repository root (configured in `tsconfig.json`).

### Deployment

Auto-deploys to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`. The build output is `./out`.
