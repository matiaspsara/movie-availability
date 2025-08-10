"use client";
import AppLayout from '../components/AppLayout';

import SearchBar from '../components/SearchBar';
import RegionSelector from '../components/RegionSelector';


import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950">
      {/* Top Bar */}
      <header className="w-full py-8 flex flex-col items-center justify-center relative">
        <div className="absolute right-8 top-8">
          <RegionSelector />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white tracking-tight mb-2 drop-shadow-lg">
          Where to Watch
        </h1>
        <p className="text-lg md:text-xl text-blue-200 text-center font-medium mb-2">
          Where can you watch this?
        </p>
      </header>

      {/* Main Search Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white/5 rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <label className="text-xl text-white mb-4 font-semibold">
            Search for a movie or show
          </label>
          <div className="w-full">
            {/* Modern SearchBar with autocomplete */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-2xl pointer-events-none">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div className="pl-12">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-blue-200 text-sm mt-auto">
  &copy; {new Date().getFullYear()} Where to Watch. Made with ❤️ for movie lovers everywhere.
      </footer>
    </div>
  );
}
