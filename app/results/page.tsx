
"use client";
import { useTranslations } from "../../lib/useTranslations";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import StreamingProviders from '../../components/StreamingProviders';
import RegionSelector from '../../components/RegionSelector';
import { useRegion } from '../../components/RegionContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
}

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
              {/* Poster */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                      alt={displayTitle}
                      width={320}
                      height={480}
                      className="w-full h-auto object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                </div>
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
                  <div className="flex flex-wrap gap-6 mb-6 text-white/80">
                    {displayYear && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="6" cy="6" r="5"/>
                            <line x1="6" y1="1" x2="6" y2="6"/>
                          </svg>
                        </div>
                        <span className="font-medium">{displayYear}</span>
                      </div>
                    )}
                    
                    {movieDetails.runtime && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="6" cy="6" r="5"/>
                            <polyline points="6,3 6,6 8,8"/>
                        </svg>
                        </div>
                        <span className="font-medium">
                          {Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m
                        </span>
                      </div>
                    )}
                    
                    {movieDetails.number_of_seasons && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="8" height="6" rx="1"/>
                            <line x1="4" y1="21" x2="4" y2="9"/>
                            <line x1="8" y1="21" x2="8" y2="9"/>
                          </svg>
                        </div>
                        <span className="font-medium">{movieDetails.number_of_seasons} seasons</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="6,1 7.5,4.5 11,4.5 8.25,7 9.75,10.5 6,8.5 2.25,10.5 3.75,7 1,4.5 4.5,4.5"/>
                        </svg>
                      </div>
                      <span className="font-medium">{rating}/5</span>
                      <span className="text-white/60 text-sm">({movieDetails.vote_average.toFixed(1)}/10)</span>
                    </div>
                  </div>

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
                {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Production</h3>
                    <div className="flex flex-wrap gap-3">
                      {movieDetails.production_companies.slice(0, 4).map(company => (
                        <div
                          key={company.id}
                          className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2"
                        >
                          {company.logo_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                              alt={company.name}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain rounded"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded flex items-center justify-center">
                              <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2">
                                <rect x="1" y="3" width="10" height="8" rx="1"/>
                                <path d="M1 6h10"/>
                              </svg>
                            </div>
                          )}
                          <span className="text-white/80 text-sm font-medium">{company.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  </svg>
                </div>
                More Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-white transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5,3 19,12 5,21"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Watch Trailer</div>
                    <div className="text-sm text-white/60">View on YouTube</div>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-white transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Add to Watchlist</div>
                    <div className="text-sm text-white/60">Save for later</div>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-white transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Share</div>
                    <div className="text-sm text-white/60">Tell friends</div>
                  </div>
                </button>
              </div>
            </div>
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