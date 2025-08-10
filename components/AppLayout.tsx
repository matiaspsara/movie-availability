'use client';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { RegionProvider } from './RegionContext';
import SearchBar from './SearchBar';
import RegionSelector from './RegionSelector';
import { LanguageProvider, useLanguage } from './LanguageContext';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RegionProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <header className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
              <div className="font-bold text-xl">🎬 WhereToWatch</div>
              <div className="flex-1 mx-4">
                <SearchBar />
              </div>
              <RegionSelector />
              <LanguageSelectorWrapper />
              <ThemeToggle />
            </header>
            <main className="p-4">{children}</main>
          </div>
        </RegionProvider>
      </ThemeProvider>
    </LanguageProvider>
  );

function LanguageSelectorWrapper() {
  const { language, setLanguage } = useLanguage();
  return <LanguageSelector value={language} onChange={setLanguage} />;
}
}
