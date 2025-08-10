'use client';
import { useState, useEffect } from 'react';
import { useRegion } from './RegionContext';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { selectedRegion } = useRegion();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        // Mock API response for GitHub Pages deployment
        const mockResults = [
          { id: 1, title: 'Inception', year: '2010', type: 'movie', poster: 'https://image.tmdb.org/t/p/w92/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg' },
          { id: 2, title: 'The Matrix', year: '1999', type: 'movie', poster: 'https://image.tmdb.org/t/p/w92/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
          { id: 3, title: 'The Mandalorian', year: '2019', type: 'tv', poster: 'https://image.tmdb.org/t/p/w92/sWgBv7LV2PRoQgkxwlibdGXKq1q.jpg' },
        ].filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase())
        );
        
        setResults(mockResults);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query, selectedRegion.code]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search movies or TV shows..."
        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 mt-1 rounded shadow-lg">
          {results.map(r => (
            <li
              key={`${r.type}-${r.id}`}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
              onClick={() => {
                setQuery(r.title);
                setShowDropdown(false);
              }}
            >
              {r.poster && (
                <img src={r.poster} alt="" className="w-8 h-12 object-cover rounded" />
              )}
              <span>{r.title}</span>
              <span className="text-sm text-gray-500 ml-auto">
                {r.year} • {r.type.toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
