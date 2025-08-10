import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, type } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing movie ID' });
  }

  const contentType = type === 'tv' ? 'tv' : 'movie';

  try {
    const response = await fetch(
      `${BASE_URL}/${contentType}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos,images`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
}
