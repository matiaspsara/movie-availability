'use client';
import { useTranslations } from "../lib/useTranslations";
import { useState, useEffect } from 'react';
import { StreamingAvailability } from '../lib/justwatch';

interface Props {
  movieId: string;
  title: string;
  type: 'movie' | 'tv';
  region: string;
}

const platformColors: { [key: string]: string } = {
  'Netflix': 'from-red-600 to-red-700',
  'Prime Video': 'from-blue-600 to-blue-700',
  'Amazon Prime': 'from-blue-600 to-blue-700',
  'Hulu': 'from-green-500 to-green-600',
  'HBO Max': 'from-purple-600 to-purple-700',
  'Disney+': 'from-blue-500 to-blue-600',
  'Apple TV+': 'from-gray-700 to-gray-800',
  'Paramount+': 'from-blue-700 to-blue-800',
  'Peacock': 'from-blue-400 to-blue-500',
  'Crunchyroll': 'from-orange-500 to-orange-600',
  'YouTube': 'from-red-500 to-red-600',
  'iTunes': 'from-gray-600 to-gray-700',
  'Google Play': 'from-green-500 to-green-600',
  'Vudu': 'from-blue-500 to-blue-600',
  'MUBI': 'from-red-600 to-red-700',
  'Tubi': 'from-blue-500 to-blue-600',
  'Pluto TV': 'from-purple-600 to-purple-700',
};

const platformIcons: { [key: string]: string } = {
  'Netflix': '🎬',
  'Prime Video': '📺',
  'Amazon Prime': '📺',
  'Hulu': '🟢',
  'HBO Max': '🎭',
  'Disney+': '🏰',
  'Apple TV+': '🍎',
  'Paramount+': '⭐',
  'Peacock': '🦚',
  'Crunchyroll': '📺',
  'YouTube': '▶️',
  'iTunes': '🎵',
  'Google Play': '▶️',
  'Vudu': '📽️',
  'MUBI': '🎨',
  'Tubi': '📺',
  'Pluto TV': '🪐',
};

export default function StreamingProviders({ movieId, title, type, region }: Props) {
  const t = useTranslations();
  const [streamingData, setStreamingData] = useState<StreamingAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreamingData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/streaming/${movieId}?type=${type}&region=${region}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch streaming data');
        }
        
        const data = await response.json();
        setStreamingData(data);
      } catch (err) {
        setError('Failed to load streaming availability');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamingData();
  }, [movieId, type, region]);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gradient-to-r from-white/20 to-white/10 rounded-lg w-1/3"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-white/15 to-white/5 rounded w-1/2"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !streamingData) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Unable to Load</h3>
          <p className="text-white/60">
            Unable to load streaming availability at this time.
          </p>
        </div>
      </div>
    );
  }

  const { offers, hasStreaming, hasRent, hasBuy, hasFree } = streamingData;

  if (offers.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Not Available</h3>
          <p className="text-white/60">
            No streaming information available for <span className="text-white font-medium">{title}</span> in {region}.
          </p>
        </div>
      </div>
    );
  }

  // Group offers by type
  const streamingOffers = offers.filter(o => o.type === 'stream');
  const rentOffers = offers.filter(o => o.type === 'rent');
  const buyOffers = offers.filter(o => o.type === 'buy');
  const freeOffers = offers.filter(o => o.type === 'free');



  // Move Offer and PlatformCard outside to avoid redeclaration and ensure proper typing
  interface Offer {
    platform: string;
    platformName: string;
    url?: string;
    price?: string;
    type: string;
  }

  function PlatformCard({ offer, index, showPrice = false }: { offer: Offer; index: number; showPrice?: boolean }) {
    return (
      <div
        key={`${offer.platform}-${index}`}
        className="group cursor-pointer"
        onClick={() => offer.url && window.open(offer.url, '_blank')}
      >
        <div className={`bg-gradient-to-br ${platformColors[offer.platformName] || 'from-gray-600 to-gray-700'} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{platformIcons[offer.platformName] || '📺'}</div>
              <div>
                <div className="font-bold text-white text-sm">{offer.platformName}</div>
                <div className="text-white/80 text-xs">
                  {showPrice ? (offer.price || 'Check Price') : 'Included'}
                </div>
              </div>
            </div>
            <div className="text-white/60 group-hover:text-white transition-colors">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
        </div>
  {/* Use translation for app name */}
  <h3 className="text-2xl font-bold text-white">{t("appName")}</h3>
      </div>
      
      {/* Streaming Services */}
      {streamingOffers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h4 className="text-lg font-semibold text-white">Streaming Services</h4>
            <div className="px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-xs font-medium">
              {streamingOffers.length} available
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streamingOffers.map((offer: Offer, index: number) => (
              <PlatformCard key={`stream-${index}`} offer={offer} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Rent Options */}
      {rentOffers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <h4 className="text-lg font-semibold text-white">Rent</h4>
            <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-xs font-medium">
              {rentOffers.length} available
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rentOffers.map((offer: Offer, index: number) => (
              <PlatformCard key={`rent-${index}`} offer={offer} index={index} showPrice />
            ))}
          </div>
        </div>
      )}

      {/* Buy Options */}
      {buyOffers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <h4 className="text-lg font-semibold text-white">Buy</h4>
            <div className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-xs font-medium">
              {buyOffers.length} available
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyOffers.map((offer: Offer, index: number) => (
              <PlatformCard key={`buy-${index}`} offer={offer} index={index} showPrice />
            ))}
          </div>
        </div>
      )}

      {/* Free Options */}
      {freeOffers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <h4 className="text-lg font-semibold text-white">Free</h4>
            <div className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-400 text-xs font-medium">
              {freeOffers.length} available
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeOffers.map((offer: Offer, index: number) => (
              <PlatformCard key={`free-${index}`} offer={offer} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="pt-6 border-t border-white/10">
        <div className="flex flex-wrap gap-3">
          {hasStreaming && (
            <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">Streaming Available</span>
            </div>
          )}
          {hasRent && (
            <div className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg border border-blue-500/30">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium">Rent Available</span>
            </div>
          )}
          {hasBuy && (
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg border border-purple-500/30">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm font-medium">Buy Available</span>
            </div>
          )}
          {hasFree && (
            <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg border border-yellow-500/30">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm font-medium">Free Available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}