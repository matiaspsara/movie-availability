'use client';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { RegionProvider } from './RegionContext';
import SearchBar from './SearchBar';
import RegionSelector from './RegionSelector';
import ThemeToggle from './ThemeToggle';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RegionProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <header className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
            <div className="font-bold text-xl">🎬 StreamFinder</div>
            <div className="flex-1 mx-4">
              <SearchBar />
            </div>
            <RegionSelector />
            <ThemeToggle />
          </header>
          <main className="p-4">{children}</main>
        </div>
      </RegionProvider>
    </ThemeProvider>
  );
}
