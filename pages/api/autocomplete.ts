// pages/api/autocomplete.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import NodeCache from 'node-cache';
import { tmdbSearch } from '../../lib/tmdb';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, region, language } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  const lang = typeof language === 'string' ? language : 'en-US';
  const regionCode = typeof region === 'string' ? region : 'US';
  const cacheKey = `autocomplete:${regionCode}:${lang}:${q.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.status(200).json(cached);

  try {
    const [movies, tv] = await Promise.all([
      tmdbSearch(q, 'movie', regionCode, lang),
      tmdbSearch(q, 'tv', regionCode, lang),
    ]);

    // Combine and normalize results
    const combined = [
      ...movies.results.map((item: { id: number; title: string; release_date?: string; poster_path?: string; popularity?: number }) => ({
        id: item.id,
        title: item.title,
        year: item.release_date ? item.release_date.slice(0, 4) : '—',
        type: 'movie',
        poster: item.poster_path
          ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
          : null,
        popularity: item.popularity ?? 0,
      })),
      ...tv.results.map((item: { id: number; name: string; first_air_date?: string; poster_path?: string; popularity?: number }) => ({
        id: item.id,
        title: item.name,
        year: item.first_air_date ? item.first_air_date.slice(0, 4) : '—',
        type: 'tv',
        poster: item.poster_path
          ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
          : null,
        popularity: item.popularity ?? 0,
      })),
    ];

    // Sort by relevance: exact match first, then popularity
    const lowerQ = q.trim().toLowerCase();
    combined.sort((a, b) => {
      const aExact = a.title.trim().toLowerCase() === lowerQ ? 1 : 0;
      const bExact = b.title.trim().toLowerCase() === lowerQ ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      return b.popularity - a.popularity;
    });

    const top = combined
      .filter(item => !!item.poster)
      .slice(0, 10)
      .map(({ popularity, ...rest }) => rest);

    // Fetch streaming providers for each result in parallel
    const withProviders = await Promise.allSettled(
      top.map(async (item) => {
        try {
          const provRes = await fetch(
            `${BASE_URL}/${item.type}/${item.id}/watch/providers?api_key=${API_KEY}`
          );
          if (!provRes.ok) return { ...item, providers: [] };
          const provData = await provRes.json();
          const flatrate = provData.results?.[regionCode]?.flatrate || [];
          return {
            ...item,
            providers: flatrate.slice(0, 4).map((p: { provider_name: string; logo_path: string }) => ({
              name: p.provider_name,
              logo: `https://image.tmdb.org/t/p/w45${p.logo_path}`,
            })),
          };
        } catch {
          return { ...item, providers: [] };
        }
      })
    );

    const results = withProviders.map((r, i) =>
      r.status === 'fulfilled' ? r.value : { ...top[i], providers: [] }
    );

    cache.set(cacheKey, results);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch autocomplete results' });
  }
}
