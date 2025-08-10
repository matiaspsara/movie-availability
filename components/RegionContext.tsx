'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type Region = {
  code: string;
  flag: string;
};

const regions = [
  { code: 'US', flag: '🇺🇸' },
  { code: 'AR', flag: '🇦🇷' },
  { code: 'UK', flag: '🇬🇧' },
];

type RegionContextType = {
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  regions: Region[];
};

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [selectedRegion, setSelectedRegion] = useState(regions.find(r => r.code === 'AR') || regions[0]);

  return (
    <RegionContext.Provider value={{ selectedRegion, setSelectedRegion, regions }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}
