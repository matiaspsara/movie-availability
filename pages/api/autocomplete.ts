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

    const results = [
      ...movies.results.map((item: { id: number; title: string; release_date?: string; poster_path?: string }) => ({
        id: item.id,
        title: item.title,
        year: item.release_date ? item.release_date.slice(0, 4) : '—',
        type: 'movie',
        poster: item.poster_path
          ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
          : null,
      })),
      ...tv.results.map((item: { id: number; name: string; first_air_date?: string; poster_path?: string }) => ({
        id: item.id,
        title: item.name,
        year: item.first_air_date ? item.first_air_date.slice(0, 4) : '—',
        type: 'tv',
        poster: item.poster_path
          ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
          : null,
      })),
    ].slice(0, 10);

    cache.set(cacheKey, results);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch autocomplete results' });
  }
}
