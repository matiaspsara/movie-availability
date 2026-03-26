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
          const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}&region=${selectedRegion.code}&language=${selectedRegion.tmdbLocale}`);
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
  }, [query, selectedRegion.code, selectedRegion.tmdbLocale]);

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
        <div className="relative">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] focus-within:border-[#3a3a3a] rounded-2xl overflow-hidden transition-colors duration-200">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#555555] pointer-events-none">
              {isLoading ? (
                <div className="animate-spin">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6" />
                    <line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                    <line x1="2" y1="12" x2="6" y2="12" />
                    <line x1="18" y1="12" x2="22" y2="12" />
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                  </svg>
                </div>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              )}
            </div>
            <input
              type="text"
              placeholder="Search for movies, TV shows..."
              className="w-full pl-12 pr-5 py-4 sm:py-5 bg-transparent text-white placeholder-[#555555] text-base sm:text-lg focus:outline-none"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showDropdown && results.length > 0 && (
        <div
          className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-white/10"
          style={{ overscrollBehavior: 'contain' }}
        >
          {results.map(result => (
            <div
              key={`${result.type}-${result.id}`}
              className="px-4 py-3 hover:bg-[#222222] cursor-pointer transition-colors duration-150 flex items-center gap-4 border-b border-[#2a2a2a] last:border-b-0"
              onClick={() => handleResultClick(result)}
            >
              <div className="w-10 h-14 rounded-md overflow-hidden flex-shrink-0 bg-[#222222]">
                {result.poster ? (
                  <Image
                    src={result.poster}
                    alt={result.title}
                    width={40}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
                    <svg width="16" height="16" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{result.title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[#555555] text-sm">{result.year}</span>
                  <span className="px-2 py-0.5 bg-[#222222] rounded text-[#a1a1a1] text-xs border border-[#2a2a2a]">
                    {result.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-[#3a3a3a] flex-shrink-0">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Empty State */}
      {showDropdown && results.length === 0 && !isLoading && query.trim() && (
        <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-6 text-center">
            <h4 className="text-[#a1a1a1] font-medium mb-1">No results found</h4>
            <p className="text-[#555555] text-sm">Try a different title</p>
          </div>
        </div>
      )}
    </div>
  );
}