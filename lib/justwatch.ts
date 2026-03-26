export async function getStreamingAvailability(
  id: string,
  region: string,
  type: 'movie' | 'tv'
): Promise<StreamingAvailability> {
  const API_URL = `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`;
  const res = await fetch(API_URL);
  if (!res.ok) {
    return {
      offers: [],
      hasStreaming: false,
      hasRent: false,
      hasBuy: false,
      hasFree: false,
    };
  }
  const data = await res.json();
  const regionData = data.results?.[region];
  const regionLink: string | undefined = regionData?.link;
  const providers = regionData?.flatrate || [];
  const rentProviders = regionData?.rent || [];
  const buyProviders = regionData?.buy || [];
  const freeProviders = regionData?.free || [];

  const offers: StreamingOffer[] = [];
  providers.forEach((provider: { provider_id: string; provider_name: string }) => {
    offers.push({
      platform: provider.provider_id,
      platformName: provider.provider_name,
      type: 'stream',
      url: regionLink,
    });
  });
  rentProviders.forEach((provider: { provider_id: string; provider_name: string }) => {
    offers.push({
      platform: provider.provider_id,
      platformName: provider.provider_name,
      type: 'rent',
      url: regionLink,
    });
  });
  buyProviders.forEach((provider: { provider_id: string; provider_name: string }) => {
    offers.push({
      platform: provider.provider_id,
      platformName: provider.provider_name,
      type: 'buy',
      url: regionLink,
    });
  });
  freeProviders.forEach((provider: { provider_id: string; provider_name: string }) => {
    offers.push({
      platform: provider.provider_id,
      platformName: provider.provider_name,
      type: 'free',
      url: regionLink,
    });
  });

  return {
    offers,
    hasStreaming: providers.length > 0,
    hasRent: rentProviders.length > 0,
    hasBuy: buyProviders.length > 0,
    hasFree: freeProviders.length > 0,
  };
}
// lib/justwatch.ts

export interface StreamingOffer {
  platform: string;
  platformName: string;
  url?: string;
  price?: string;
  type: string;
}

export interface StreamingAvailability {
  offers: StreamingOffer[];
  hasStreaming: boolean;
  hasRent: boolean;
  hasBuy: boolean;
  hasFree: boolean;
}

// ...existing code...

// Streaming platform mapping
const PLATFORM_NAMES: { [key: string]: string } = {
  'nfx': 'Netflix',
  'prv': 'Prime Video',
  'hst': 'Hulu',
  'hbo': 'HBO Max',
  'dsn': 'Disney+',
  'app': 'Apple TV+',
  'pep': 'Paramount+',
  'pct': 'Peacock',
  'crk': 'Crunchyroll',
  'fun': 'Funimation',
  'shw': 'Showtime',
  'stz': 'Starz',
  'amz': 'Amazon Prime',
  'itu': 'iTunes',
  'ply': 'Google Play',
  'vdu': 'Vudu',
  'msf': 'Microsoft Store',
  'yot': 'YouTube',
  'hid': 'HIDIVE',
  'vrp': 'VRV',
  'bts': 'BTS',
  'mcr': 'MUBI',
  'shd': 'Shudder',
  'acr': 'Acorn TV',
  'bri': 'BritBox',
  'dcp': 'Discovery+',

  'phl': 'Philharmonic',
  };


