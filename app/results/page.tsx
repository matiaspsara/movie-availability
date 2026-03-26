
"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import StreamingProviders from '../../components/StreamingProviders';
import RegionSelector from '../../components/RegionSelector';
import { useRegion } from '../../components/RegionContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ResultCard from '../../components/ResultCard';
import MovieMeta from '../../components/MovieMeta';
import ProductionCompanies from '../../components/ProductionCompanies';
import MovieActions from '../../components/MovieActions';

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime?: number;
  first_air_date?: string;
  name?: string;
  number_of_seasons?: number;
  tagline?: string;
  production_companies?: { id: number; name: string; logo_path?: string }[];
  videos?: { results: { key: string; site: string; type: string; official: boolean }[] };
};

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const { selectedRegion } = useRegion();
  const router = useRouter();
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
        const response = await fetch(`/api/movie/${movieId}?type=${type}&language=${selectedRegion.tmdbLocale}`);
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
  }, [movieId, type, selectedRegion.tmdbLocale]);

  useEffect(() => {
    setRegion(selectedRegion.code);
  }, [selectedRegion.code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-[#2a2a2a] border-t-[#a1a1a1] rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-lg text-white font-medium">Loading...</div>
          <div className="text-[#555555] text-sm mt-1">Finding where you can watch</div>
        </div>
      </div>
    );
  }

  if (error || !movieDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f]">
        <div className="text-center max-w-md px-6">
          <div className="text-[#a1a1a1] mb-4 text-lg">{error || 'Movie not found'}</div>
          <button
            onClick={() => router.push('/')}
            className="bg-white text-black px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#e0e0e0] transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const displayTitle = movieDetails.title || movieDetails.name || '';
  const displayYear = movieDetails.release_date?.slice(0, 4) || movieDetails.first_air_date?.slice(0, 4);
  const rating = movieDetails.vote_average ? (movieDetails.vote_average / 2).toFixed(1) : 'N/A';
  const trailerVideo = movieDetails.videos?.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
  const trailerUrl = trailerVideo ? `https://www.youtube.com/watch?v=${trailerVideo.key}` : undefined;

  return (
    <div className="min-h-screen bg-[#0f0f0f] relative">
      {/* Backdrop image */}
      {movieDetails.backdrop_path && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
            alt=""
            fill
            className="object-cover opacity-[0.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0f0f0f]" />
        </div>
      )}

      <div className="relative flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-[#a1a1a1] hover:text-white hover:border-[#3a3a3a] hover:bg-[#1a1a1a] transition-all duration-200 text-sm group"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
              viewBox="0 0 24 24"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="font-medium hidden sm:inline">Back to Search</span>
            <span className="font-medium sm:hidden">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl hidden md:inline">🎬</span>
              <span className="text-base font-semibold text-white hidden lg:inline">WhereToWatch</span>
            </div>
            <RegionSelector />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Movie Header */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              {/* Poster */}
              <div className="lg:w-72 flex-shrink-0">
                <ResultCard
                  id={movieDetails.id}
                  title={displayTitle}
                  year={displayYear ? parseInt(displayYear) : 0}
                  poster={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                  providers={[]}
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                    {displayTitle}
                  </h1>
                  {movieDetails.tagline && (
                    <p className="text-[#a1a1a1] italic mb-4">&quot;{movieDetails.tagline}&quot;</p>
                  )}
                  <MovieMeta
                    year={displayYear || ''}
                    runtime={movieDetails.runtime}
                    seasons={movieDetails.number_of_seasons}
                    rating={rating}
                    voteAverage={movieDetails.vote_average}
                  />
                  {/* Genres */}
                  {movieDetails.genres && movieDetails.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {movieDetails.genres.map(genre => (
                        <span
                          key={genre.id}
                          className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#a1a1a1] text-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Overview */}
                {movieDetails.overview && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#555555] uppercase tracking-wider mb-3">Overview</h3>
                    <p className="text-[#a1a1a1] leading-relaxed max-w-3xl">
                      {movieDetails.overview}
                    </p>
                  </div>
                )}
                <ProductionCompanies companies={movieDetails.production_companies || []} />
              </div>
            </div>

            {/* Streaming Availability */}
            <div className="mb-8">
              <StreamingProviders
                movieId={movieId || ''}
                title={displayTitle}
                type={type as 'movie' | 'tv'}
                region={region}
              />
            </div>

            {/* Additional Actions */}
            <MovieActions trailerUrl={trailerUrl} />
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-6 text-center border-t border-[#1a1a1a]">
          <div className="text-[#555555] text-xs">
            Movie data provided by The Movie Database (TMDB)
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-[#2a2a2a] border-t-[#a1a1a1] rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-lg text-white font-medium">Loading...</div>
        </div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}
