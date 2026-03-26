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

// Platform detection utilities
const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

// Get streaming service URLs for different platforms
const getStreamingUrls = (platformName: string, contentUrl?: string) => {
  const fallbackWeb = contentUrl || '#';
  
  switch (platformName.toLowerCase()) {
    case 'netflix':
      return {
        web: contentUrl || 'https://www.netflix.com',
        ios: 'nflx://',
        android: contentUrl || 'https://www.netflix.com'
      };
    
    case 'prime video':
    case 'amazon prime':
      return {
        web: contentUrl || 'https://www.amazon.com/Prime-Video',
        ios: 'aiv://',
        android: 'intent://www.amazon.com/Prime-Video#Intent;package=com.amazon.avod.thirdpartyclient;end;'
      };
    
    case 'hulu':
      return {
        web: contentUrl || 'https://www.hulu.com',
        ios: 'hulu://',
        android: 'intent://www.hulu.com#Intent;package=com.hulu.plus;end;'
      };
    
    case 'hbo max':
      return {
        web: contentUrl || 'https://www.max.com',
        ios: 'hbomax://',
        android: 'intent://www.max.com#Intent;package=com.hbo.hbonow;end;'
      };
    
    case 'disney+':
      return {
        web: contentUrl || 'https://www.disneyplus.com',
        ios: 'disneyplus://',
        android: 'intent://www.disneyplus.com#Intent;package=com.disney.disneyplus;end;'
      };
    
    case 'apple tv+':
      return {
        web: contentUrl || 'https://tv.apple.com',
        ios: 'com.apple.tv://',
        android: fallbackWeb
      };
    
    case 'paramount+':
      return {
        web: contentUrl || 'https://www.paramountplus.com',
        ios: 'cbsaa://',
        android: 'intent://www.paramountplus.com#Intent;package=com.cbs.app;end;'
      };
    
    case 'peacock':
      return {
        web: contentUrl || 'https://www.peacocktv.com',
        ios: 'peacocktv://',
        android: 'intent://www.peacocktv.com#Intent;package=com.peacocktv.peacockandroid;end;'
      };
    
    case 'youtube':
      return {
        web: contentUrl || 'https://www.youtube.com',
        ios: 'youtube://',
        android: 'intent://www.youtube.com#Intent;package=com.google.android.youtube;end;'
      };
    
    case 'crunchyroll':
      return {
        web: contentUrl || 'https://www.crunchyroll.com',
        ios: 'crunchyroll://',
        android: 'intent://www.crunchyroll.com#Intent;package=com.crunchyroll.crunchyroid;end;'
      };

    case 'tubi':
      return {
        web: contentUrl || 'https://tubitv.com',
        ios: 'tubitv://',
        android: 'intent://tubitv.com#Intent;package=com.tubitv;end;'
      };
    
    case 'pluto tv':
      return {
        web: contentUrl || 'https://pluto.tv',
        ios: 'plutotv://',
        android: 'intent://pluto.tv#Intent;package=tv.pluto.android;end;'
      };

    case 'vudu':
      return {
        web: contentUrl || 'https://www.vudu.com',
        ios: 'vudu://',
        android: 'intent://www.vudu.com#Intent;package=air.com.vudu.air.DownloaderTablet;end;'
      };

    case 'mubi':
      return {
        web: contentUrl || 'https://mubi.com',
        ios: 'mubi://',
        android: 'intent://mubi.com#Intent;package=com.mubi;end;'
      };

    default:
      return {
        web: fallbackWeb
      };
  }
};

// Smart function to open streaming service
const openStreamingService = (platformName: string, contentUrl?: string): void => {
  const urls = getStreamingUrls(platformName, contentUrl);
  
  if (!isMobile()) {
    // Desktop: Always open web URL
    window.open(urls.web, '_blank', 'noopener,noreferrer');
    return;
  }
  
  // Mobile: Try to open app, fallback to web
  let appUrl: string | undefined;
  
  if (isIOS() && urls.ios) {
    appUrl = urls.ios;
  } else if (isAndroid() && urls.android) {
    appUrl = urls.android;
  }
  
  if (appUrl && !appUrl.startsWith('intent://')) {
    // For iOS and simple schemes, use the iframe method
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.style.top = '-1000px';
    iframe.src = appUrl;
    document.body.appendChild(iframe);
    
    setTimeout(() => {
      document.body.removeChild(iframe);
      // If we're still here, the app probably didn't open
      if (document.hasFocus()) {
        window.open(urls.web, '_blank', 'noopener,noreferrer');
      }
    }, 1500);
  } else if (appUrl) {
    // For Android intent URLs, use location.href
    try {
      window.location.href = appUrl;
      // Fallback after delay
      setTimeout(() => {
        window.open(urls.web, '_blank', 'noopener,noreferrer');
      }, 2000);
    } catch (error) {
      window.open(urls.web, '_blank', 'noopener,noreferrer');
    }
  } else {
    window.open(urls.web, '_blank', 'noopener,noreferrer');
  }
};

interface Offer {
  platform: string;
  platformName: string;
  url?: string;
  price?: string;
  type: string;
}

export default function StreamingProviders({ movieId, title, type, region }: Props) {
  const t = useTranslations();
  const [streamingData, setStreamingData] = useState<StreamingAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clickingCard, setClickingCard] = useState<string | null>(null);

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

  const handlePlatformClick = async (offer: Offer) => {
    const cardKey = `${offer.platform}-${offer.type}`;
    setClickingCard(cardKey);
    
    try {
      // Add small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Use the smart platform opening function
      openStreamingService(offer.platformName, offer.url);
      
    } catch (error) {
      console.error('Error opening streaming service:', error);
      // Fallback to regular window.open
      if (offer.url) {
        window.open(offer.url, '_blank', 'noopener,noreferrer');
      }
    } finally {
      // Clear the clicking state after a delay
      setTimeout(() => setClickingCard(null), 300);
    }
  };

  function PlatformCard({ offer, index, showPrice = false }: { offer: Offer; index: number; showPrice?: boolean }) {
    const cardKey = `${offer.platform}-${offer.type}-${index}`;
    const isClicking = clickingCard === cardKey;
    const mobile = isMobile();
    
    return (
      <div
        key={cardKey}
        className="group cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
        onClick={() => handlePlatformClick(offer)}
      >
        <div className={`
          bg-gradient-to-br ${platformColors[offer.platformName] || 'from-gray-600 to-gray-700'}
          rounded-xl p-4 transition-all duration-200
          hover:-translate-y-0.5 border border-white/10
          ${isClicking ? 'scale-95' : ''}
        `}>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="text-2xl flex-shrink-0">{platformIcons[offer.platformName] || '📺'}</div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-white text-sm truncate">{offer.platformName}</div>
                <div className="text-white/80 text-xs flex items-center gap-1">
                  {showPrice ? (offer.price || 'Check Price') : 'Included'}
                  {mobile && (
                    <span className="text-white/60 text-xs">• Tap to open {offer.platformName === 'Apple TV+' ? 'web' : 'app'}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center h-full pl-2 flex-shrink-0">
              {isClicking ? (
                <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 group-hover:text-white transition-colors group-hover:translate-x-1">
                  {mobile ? (
                    // Mobile icon (phone/app)
                    <>
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12.01" y2="18"/>
                    </>
                  ) : (
                    // Desktop icon (arrow)
                    <>
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </>
                  )}
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-[#222222] rounded-lg w-1/3"></div>
          <div className="space-y-4">
            <div className="h-5 bg-[#1a1a1a] rounded w-1/4"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-[#1a1a1a] rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !streamingData) {
    return (
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8">
        <div className="text-center">
          <h3 className="text-base font-medium text-[#a1a1a1] mb-1">Unable to load streaming availability</h3>
        </div>
      </div>
    );
  }

  const { offers, hasStreaming, hasRent, hasBuy, hasFree } = streamingData;

  if (offers.length === 0) {
    return (
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8">
        <div className="text-center">
          <h3 className="text-base font-medium text-[#a1a1a1] mb-1">Not available in {region}</h3>
          <p className="text-[#555555] text-sm">
            No streaming information found for <span className="text-[#a1a1a1]">{title}</span>.
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

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-semibold text-white">Where to Watch</h3>
        {isMobile() && (
          <span className="text-[#555555] text-xs">Tap to open app</span>
        )}
      </div>

      {/* Streaming Services */}
      {streamingOffers.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs font-semibold text-[#555555] uppercase tracking-wider mb-4">
            Streaming — {streamingOffers.length} available
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {streamingOffers.map((offer: Offer, index: number) => (
              <PlatformCard key={`stream-${index}`} offer={offer} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Rent Options */}
      {rentOffers.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs font-semibold text-[#555555] uppercase tracking-wider mb-4">
            Rent — {rentOffers.length} available
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rentOffers.map((offer: Offer, index: number) => (
              <PlatformCard key={`rent-${index}`} offer={offer} index={index} showPrice />
            ))}
          </div>
        </div>
      )}

      {/* Buy Options */}
      {buyOffers.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs font-semibold text-[#555555] uppercase tracking-wider mb-4">
            Buy — {buyOffers.length} available
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {buyOffers.map((offer: Offer, index: number) => (
              <PlatformCard key={`buy-${index}`} offer={offer} index={index} showPrice />
            ))}
          </div>
        </div>
      )}

      {/* Free Options */}
      {freeOffers.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs font-semibold text-[#555555] uppercase tracking-wider mb-4">
            Free — {freeOffers.length} available
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {freeOffers.map((offer: Offer, index: number) => (
              <PlatformCard key={`free-${index}`} offer={offer} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="pt-6 border-t border-[#2a2a2a]">
        <div className="flex flex-wrap gap-2">
          {hasStreaming && (
            <div className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#a1a1a1] text-xs font-medium">
              Streaming
            </div>
          )}
          {hasRent && (
            <div className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#a1a1a1] text-xs font-medium">
              Rent
            </div>
          )}
          {hasBuy && (
            <div className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#a1a1a1] text-xs font-medium">
              Buy
            </div>
          )}
          {hasFree && (
            <div className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#a1a1a1] text-xs font-medium">
              Free
            </div>
          )}
        </div>
      </div>
    </div>
  );
}