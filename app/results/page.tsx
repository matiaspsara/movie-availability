
"use client";
import { useTranslations } from "../../lib/useTranslations";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import StreamingProviders from '../../components/StreamingProviders';
import RegionSelector from '../../components/RegionSelector';
import { useRegion } from '../../components/RegionContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FloatingParticles from '../../components/FloatingParticles';
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
};

function ResultsPageContent() {
  const t = useTranslations();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <FloatingParticles />
        <div className="text-center z-10">
          <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-2xl text-white font-medium">Loading movie details...</div>
          <div className="text-white/60 text-sm mt-2">Finding where you can watch</div>
        </div>
      </div>
    );
  }

  if (error || !movieDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <FloatingParticles />
        <div className="text-center z-10 max-w-md px-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <div className="text-2xl text-red-300 font-medium mb-4">{error || 'Movie not found'}</div>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-400 hover:to-purple-500 transition-all duration-300 font-medium"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-800/30 to-pink-900/30" />
        {movieDetails.backdrop_path && (
          <div className="absolute inset-0 opacity-10">
            <Image
              src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60" />
          </div>
        )}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>
      <FloatingParticles />
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-4 md:px-6 py-4 md:py-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg md:rounded-xl px-3 md:px-6 py-2 md:py-3 text-white hover:bg-white/20 transition-all duration-300 shadow-lg group text-sm md:text-base"
          >
            <svg 
              width="16" 
              height="16" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="group-hover:-translate-x-1 transition-transform duration-300 flex-shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="font-medium hidden sm:inline">Back to Search</span>
            <span className="font-medium sm:hidden">Back</span>
          </button>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
                <span className="text-lg md:text-xl">🎬</span>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-lg font-bold text-white">StreamFinder</h1>
                <p className="text-white/60 text-xs">{t("providersLabel")}</p>
              </div>
            </div>
            <RegionSelector />
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Movie Header */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              {/* Poster and Info as ResultCard */}
              <div className="lg:w-80 flex-shrink-0">
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
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                    {displayTitle}
                  </h1>
                  {movieDetails.tagline && (
                    <p className="text-xl text-white/70 italic mb-4">&quot;{movieDetails.tagline}&quot;</p>
                  )}
                  {/* Meta Info */}
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
                          className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white/90 text-sm font-medium hover:bg-white/20 transition-colors"
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
                    <h3 className="text-xl font-bold text-white mb-4">Overview</h3>
                    <p className="text-white/80 leading-relaxed text-lg max-w-3xl">
                      {movieDetails.overview}
                    </p>
                  </div>
                )}
                {/* Production Companies */}
                <ProductionCompanies companies={movieDetails.production_companies || []} />
              </div>
            </div>
            {/* Streaming Availability */}
            <div className="mb-12">
              <StreamingProviders
                movieId={movieId || ''}
                title={displayTitle}
                type={type as 'movie' | 'tv'}
                region={region}
              />
            </div>
            {/* Additional Actions */}
            <MovieActions />
          </div>
        </main>
        {/* Footer */}
        <footer className="w-full py-8 text-center border-t border-white/10">
          <div className="text-white/40 text-sm">
            © {new Date().getFullYear()} StreamFinder. Made with ❤️ for movie lovers everywhere.
          </div>
          <div className="text-white/30 text-xs mt-2">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-2xl text-white font-medium">Loading...</div>
        </div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}