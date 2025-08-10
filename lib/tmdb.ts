// lib/tmdb.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function tmdbSearch(query: string, type: 'movie' | 'tv', region?: string) {
  const res = await fetch(
    `${BASE_URL}/search/${type}?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}${
      region ? `&region=${region}` : ''
    }`
  );
  if (!res.ok) throw new Error('TMDb search failed');
  return res.json();
}
