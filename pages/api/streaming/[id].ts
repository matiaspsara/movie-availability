import type { NextApiRequest, NextApiResponse } from 'next';
import { getStreamingAvailability } from '../../../lib/justwatch';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, type, region } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing movie ID' });
  }

  if (!type || typeof type !== 'string') {
    return res.status(400).json({ error: 'Missing content type' });
  }

  if (!region || typeof region !== 'string') {
    return res.status(400).json({ error: 'Missing region' });
  }

  try {
    // Fetch movie details from TMDb first
    const contentType = type === 'tv' ? 'tv' : 'movie';
    const tmdbResponse = await fetch(
      `${BASE_URL}/${contentType}/${id}?api_key=${API_KEY}&language=en-US`
    );

    if (!tmdbResponse.ok) {
      throw new Error('Failed to fetch movie details from TMDb');
    }

    const tmdbData = await tmdbResponse.json();
    
    // Extract title and year
    const title = tmdbData.title || tmdbData.name || 'Unknown';
    const year = tmdbData.release_date?.slice(0, 4) || tmdbData.first_air_date?.slice(0, 4) || '2020';
    
    const streamingData = await getStreamingAvailability(
  id,
  region,
  type as 'movie' | 'tv'
    );

    res.status(200).json(streamingData);
  } catch (error) {
    console.error('Error fetching streaming availability:', error);
    res.status(500).json({ error: 'Failed to fetch streaming availability' });
  }
}
