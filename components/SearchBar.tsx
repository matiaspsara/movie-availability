'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRegion } from './RegionContext';

type SearchResult = {
  id: number;
  title: string;
  year: string;
  type: string;
  poster: string | null;
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedRegion } = useRegion();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}&region=${selectedRegion.code}`);
          const data = await response.json();
          setResults(data);
          setShowDropdown(true);
        } catch (err) {
          console.error('Autocomplete error', err);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setShowDropdown(false);
        setIsLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [query, selectedRegion.code]);

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.title);
    setShowDropdown(false);
    router.push(`/results?id=${result.id}&type=${result.type}&region=${selectedRegion.code}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && results.length > 0) {
      handleResultClick(results[0]);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 group-focus-within:opacity-40 transition duration-300"></div>
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
              {isLoading ? (
                <div className="animate-spin">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"/>
                    <line x1="12" y1="18" x2="12" y2="22"/>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                    <line x1="2" y1="12" x2="6" y2="12"/>
                    <line x1="18" y1="12" x2="22" y2="12"/>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                  </svg>
                </div>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              )}
            </div>
            <input
              type="text"
              placeholder="Search for movies, TV shows..."
              className="w-full pl-16 pr-20 py-6 bg-transparent text-white placeholder-white/60 text-lg font-medium focus:outline-none"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer hover:from-blue-400 hover:to-purple-500 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!query.trim() || isLoading}
            >
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/30">
          {results.map(result => (
            <div
              key={`${result.type}-${result.id}`}
              className="px-6 py-4 hover:bg-white/10 cursor-pointer transition-all duration-200 flex items-center gap-4 border-b border-white/10 last:border-b-0"
              onClick={() => handleResultClick(result)}
            >
              <div className="w-12 h-16 rounded-lg overflow-hidden shadow-lg flex-shrink-0 bg-gray-700">
                {result.poster ? (
                  <Image 
                    src={result.poster} 
                    alt={result.title}
                    width={48}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                    <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-lg truncate">{result.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-white/60 text-sm">{result.year}</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full text-white/80 text-xs font-medium border border-white/10">
                    {result.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-white/40 flex-shrink-0">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {showDropdown && results.length === 0 && !isLoading && query.trim() && (
        <div className="absolute z-50 w-full mt-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8 text-center">
            <div className="text-white/60 mb-2">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h4 className="text-white font-medium mb-2">No results found</h4>
            <p className="text-white/60 text-sm">Try searching for a different movie or TV show</p>
          </div>
        </div>
      )}
    </div>
  );
}