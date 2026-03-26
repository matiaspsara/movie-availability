'use client';
import { useState, useEffect, useRef } from 'react';
import { useRegion } from './RegionContext';

export default function RegionSelector() {
  const { selectedRegion, setSelectedRegion, regions } = useRegion();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleRegionChange = (region: typeof selectedRegion) => {
    setSelectedRegion(region);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-white hover:bg-[#222222] hover:border-[#3a3a3a] transition-colors duration-200 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-xl">{selectedRegion.flag}</span>
        <span className="font-medium">{selectedRegion.code}</span>
        <svg 
          width="16" 
          height="16" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 min-w-[120px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-2" role="listbox">
            {regions.map(region => (
              <button
                key={region.code}
                onClick={() => handleRegionChange(region)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-white hover:bg-[#222222] transition-colors duration-150 text-left ${
                  selectedRegion.code === region.code ? 'bg-[#222222]' : ''
                }`}
                role="option"
                aria-selected={selectedRegion.code === region.code}
              >
                <span className="text-xl">{region.flag}</span>
                <span className="font-medium">{region.code}</span>
                {selectedRegion.code === region.code && (
                  <svg 
                    width="16" 
                    height="16" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="ml-auto text-white flex-shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}