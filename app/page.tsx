"use client";
import { useTranslations } from "../lib/useTranslations";
type SearchResult = {
  id: number;
  title: string;
  year: string;
  type: string;
  poster?: string;
  poster_path?: string;
};
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Mock Region Context for demo
const regions = [
  { code: 'US', flag: '🇺🇸' },
  { code: 'AR', flag: '🇦🇷' },
  { code: 'UK', flag: '🇬🇧' },
];

// Real SearchBar with API integration
function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRegion] = useState(regions[1]); // AR default
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        fetch(`/api/autocomplete?q=${encodeURIComponent(query)}&region=${selectedRegion.code}`)
          .then(res => res.json())
          .then(data => {
            setResults(data);
            setShowDropdown(true);
          })
          .catch(() => setResults([]));
      } else {
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, selectedRegion.code]);

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.title);
    setShowDropdown(false);
    router.push(`/results?id=${result.id}&type=${result.type}&region=${selectedRegion.code}`);
  };

  // Prevent wheel events from propagating to the page when the dropdown is at its scroll edges
  const onDropdownWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const delta = e.deltaY;
    const atTop = el.scrollTop === 0;
    const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
    // if scrolling up while already at top OR scrolling down while already at bottom -> prevent page scroll
    if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0]?.clientY ?? null;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (touchStartRef.current == null) return;
    const currentY = e.touches[0]?.clientY ?? 0;
    const delta = touchStartRef.current - currentY; // positive when swiping up
    const atTop = el.scrollTop === 0;
    const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
    if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="relative w-full">
      {/* Search input area (unchanged) */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for movies, TV shows..."
            className="w-full pl-16 pr-6 py-6 bg-transparent text-white placeholder-white/60 text-lg font-medium focus:outline-none"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer hover:from-blue-400 hover:to-purple-500 transition-all duration-300 shadow-lg"
              onClick={() => {
                if (results.length > 0) {
                  handleResultClick(results[0]);
                } else if (query.trim()) {
                  router.push(`/results?title=${encodeURIComponent(query)}&region=${selectedRegion.code}`);
                }
              }}
            >
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Search Results Dropdown */}
      {showDropdown && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl
                     max-h-[60vh] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/30"
          onWheel={onDropdownWheel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {results.map(result => (
            <div
              key={`${result.type}-${result.id}`}
              className="px-6 py-4 hover:bg-white/10 cursor-pointer transition-all duration-200 flex items-center gap-4 border-b border-white/10 last:border-b-0"
              onClick={() => handleResultClick(result)}
            >
              <div className="w-12 h-16 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={result.poster_path || result.poster || ''}
                  alt={result.title}
                  width={48}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-lg">{result.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-white/60 text-sm">{result.year}</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full text-white/80 text-xs font-medium border border-white/10">
                    {result.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-white/40">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// Modern Region Selector
function RegionSelector() {
  const [selectedRegion, setSelectedRegion] = useState(regions[1]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
      >
        <span className="text-xl">{selectedRegion.flag}</span>
        <span className="font-medium">{selectedRegion.code}</span>
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50">
          {regions.map(region => (
            <button
              key={region.code}
              onClick={() => {
                setSelectedRegion(region);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-white/20 transition-all duration-200"
            >
              <span className="text-xl">{region.flag}</span>
              <span className="font-medium">{region.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Floating particles animation
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
}

// Main Homepage Component
export default function Homepage() {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-800/30 to-pink-900/30" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000" />
      </div>
      
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-6 py-8 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-2xl">🎬</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">WhereToWatch</h1>
              <p className="text-white/60 text-sm">{t("providersLabel")}</p>
            </div>
          </div>
          <RegionSelector />
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-4xl mx-auto text-center">
            {/* Hero Section */}
            <div className="mb-16">
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                Where to
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Watch</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 font-medium mb-4 max-w-2xl mx-auto leading-relaxed">
                Discover where your favorite movies and TV shows are streaming
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-white/50 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  Netflix
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-2000"></div>
                  Prime Video
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-4000"></div>
                  Hulu
                </div>
                <div className="text-white/30">+ many more</div>
              </div>
            </div>

            {/* Search Section */}
            <div className="w-full max-w-2xl mx-auto mb-16">
              <SearchBar />
              <div className="mt-6 text-center">
                <p className="text-white/50 text-sm">
                  Search across multiple streaming platforms in your region
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="group">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-blue-500/25">
                    <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Smart Search</h3>
                  <p className="text-white/70 leading-relaxed">
                    Intelligent search across all major streaming platforms with real-time availability
                  </p>
                </div>
              </div>
              
              <div className="group">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-purple-500/25">
                    <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      <path d="m10 7-3 3 3 3"/>
                      <path d="m14 7 3 3-3 3"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Regional Support</h3>
                  <p className="text-white/70 leading-relaxed">
                    Get accurate streaming information for your specific region and country
                  </p>
                </div>
              </div>
              
              <div className="group">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-green-500/25">
                    <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Always Updated</h3>
                  <p className="text-white/70 leading-relaxed">
                    Real-time data ensures you always get the most current streaming availability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-8 text-center">
          <div className="text-white/40 text-sm">
            © {new Date().getFullYear()} WhereToWatch. Made with ❤️ for movie lovers everywhere.
          </div>
        </footer>
      </div>
    </div>
  );
}