'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import AppLayout from '../../components/AppLayout';
import StreamingProviders from '../../components/StreamingProviders';
import { useRegion } from '../../components/RegionContext';
import Image from 'next/image';
import RegionSelector from '../../components/RegionSelector';

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
  const [region, setRegion] = useState(selectedRegion.code);

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

  useEffect(() => {
    setRegion(selectedRegion.code);
  }, [selectedRegion.code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950">
        <div className="text-2xl text-blue-200">Loading...</div>
      </div>
    );
  }

  if (error || !movieDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950">
        <div className="text-2xl text-red-300">{error || 'Movie not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950">
      {/* Header: Back, Title, Region */}
      <header className="w-full px-4 py-4 flex items-center justify-between gap-2 md:gap-8">
        <button
          onClick={() => window.location.href = '/'}
          className="bg-white/10 text-white px-4 py-2 rounded-lg shadow hover:bg-white/20 transition-colors text-base md:text-lg"
        >
          ← Back
        </button>
        <h1 className="text-2xl md:text-4xl font-bold text-center text-white tracking-tight drop-shadow-lg flex-1">
          Where to Watch
        </h1>
        <div className="flex-shrink-0">
          <RegionSelector />
        </div>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-4">
        <div className="w-full max-w-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-3xl shadow-2xl p-4 md:p-8 flex flex-col md:flex-row gap-8 items-center">
          {/* Poster */}
          <div className="w-full md:w-1/3 flex-shrink-0 flex justify-center mb-6 md:mb-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={movieDetails.title || movieDetails.name || ''}
              width={300}
              height={450}
              className="rounded-2xl shadow-xl w-full h-auto object-cover max-w-xs"
            />
          </div>
          {/* Info Section */}
          <div className="w-full md:w-2/3 flex flex-col gap-4 items-center md:items-start">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center md:text-left">
              {movieDetails.title || movieDetails.name}
            </h2>
            <div className="flex flex-wrap gap-2 mb-2 justify-center md:justify-start">
              {movieDetails.genres?.map(genre => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-blue-800 text-blue-100"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mb-2 text-sm md:text-base text-blue-200 justify-center md:justify-start">
              <span className="flex items-center gap-1"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline"><circle cx="9" cy="9" r="8"/></svg> {movieDetails.release_date?.slice(0, 4) || movieDetails.first_air_date?.slice(0, 4)}</span>
              {movieDetails.runtime && <span className="flex items-center gap-1"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline"><rect x="3" y="7" width="12" height="4"/></svg> {Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m</span>}
              {movieDetails.number_of_seasons && <span className="flex items-center gap-1"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline"><rect x="3" y="7" width="12" height="4"/></svg> {movieDetails.number_of_seasons} seasons</span>}
              <span className="flex items-center gap-1"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline"><polygon points="9,2 11,7 16,7 12,10 14,15 9,12 4,15 6,10 2,7 7,7"/></svg> {movieDetails.vote_average.toFixed(1)}</span>
            </div>
            <p className="text-blue-100 leading-relaxed mb-2 text-center md:text-left max-w-xl">
              {movieDetails.overview}
            </p>
            {/* Where to Watch Section */}
            <div className="mt-2 w-full">
              <StreamingProviders
                movieId={movieId || ''}
                title={movieDetails.title || movieDetails.name || ''}
                type={type as 'movie' | 'tv'}
                region={region}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 text-center text-blue-200 text-sm mt-auto">
        &copy; {new Date().getFullYear()} Where to Watch. Made with ❤️ for movie lovers everywhere.
      </footer>
    </div>
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
