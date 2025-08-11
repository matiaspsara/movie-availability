// pages/api/autocomplete.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import NodeCache from 'node-cache';
import { tmdbSearch } from '../../lib/tmdb';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, region } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  const cacheKey = `autocomplete:${region || 'all'}:${q.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.status(200).json(cached);

  try {
    const [movies, tv] = await Promise.all([
      tmdbSearch(q, 'movie', region as string),
      tmdbSearch(q, 'tv', region as string),
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

    // Sort by relevance: exact match (case-insensitive), then popularity
    const lowerQ = q.trim().toLowerCase();
    combined.sort((a, b) => {
      // Exact match first
      const aExact = a.title.trim().toLowerCase() === lowerQ ? 1 : 0;
      const bExact = b.title.trim().toLowerCase() === lowerQ ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      // Higher popularity first
      return b.popularity - a.popularity;
    });

    // Only include results with a poster image
    const results = combined
      .filter(item => !!item.poster)
      .slice(0, 10)
      .map(({ popularity, ...rest }) => rest);
    cache.set(cacheKey, results);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch autocomplete results' });
  }
}
