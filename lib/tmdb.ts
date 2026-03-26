// lib/tmdb.ts

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function tmdbSearch(query: string, type: 'movie' | 'tv', region?: string, language = 'en-US') {
  const res = await fetch(
    `${BASE_URL}/search/${type}?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}${
      region ? `&region=${region}` : ''
    }`
  );
  if (!res.ok) throw new Error('TMDb search failed');
  return res.json();
}
