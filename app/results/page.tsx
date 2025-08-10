'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import AppLayout from '../../components/AppLayout';
import StreamingProviders from '../../components/StreamingProviders';
import { useRegion } from '../../components/RegionContext';
import Image from 'next/image';

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime?: number;
  first_air_date?: string;
  name?: string;
  number_of_seasons?: number;
};

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const { selectedRegion } = useRegion();
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const movieId = searchParams?.get('id');
  const type = searchParams?.get('type') || 'movie';

  useEffect(() => {
    if (!movieId) {
      setError('No movie ID provided');
      setLoading(false);
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`/api/movie/${movieId}?type=${type}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovieDetails(data);
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, type]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error || !movieDetails) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg text-red-500">{error || 'Movie not found'}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title || movieDetails.name || ''}
                width={500}
                height={750}
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold mb-2">
                {movieDetails.title || movieDetails.name}
              </h1>
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{movieDetails.release_date?.slice(0, 4) || movieDetails.first_air_date?.slice(0, 4)}</span>
                {movieDetails.runtime && <span>{Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m</span>}
                {movieDetails.number_of_seasons && <span>{movieDetails.number_of_seasons} seasons</span>}
                <span>⭐ {movieDetails.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {movieDetails.genres?.map(genre => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {movieDetails.overview}
              </p>
              
                             {/* Streaming Providers Section */}
               <div className="mt-8">
                 <StreamingProviders
                   movieId={movieId || ''}
                   title={movieDetails.title || movieDetails.name || ''}
                   type={type as 'movie' | 'tv'}
                   region={selectedRegion.code}
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}
