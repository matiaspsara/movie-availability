// lib/justwatch.ts

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
  'crt': 'Criterion Channel',
  'ind': 'IndieFlix',
  'tub': 'Tubi',
  'plx': 'Pluto TV',
  'rok': 'Roku Channel',
  'xum': 'Xumo',
  'cwk': 'CW Seed',
  'cwt': 'CW TV',
  'abc': 'ABC',
  'nbc': 'NBC',
  'cbs': 'CBS',
  'fox': 'FOX',
  'pbs': 'PBS',
  'tbs': 'TBS',
  'tnt': 'TNT',
  'usa': 'USA Network',
  'syr': 'Syfy',
  'amc': 'AMC',
  'fx': 'FX',
  'fxx': 'FXX',
  'fxn': 'FXM',
  'tlc': 'TLC',
  'hgt': 'HGTV',
  'fd': 'Food Network',
  'trv': 'Travel Channel',
  'aet': 'A&E',
  'lft': 'Lifetime',
  'hln': 'HLN',
  'cnn': 'CNN',
  'msn': 'MSNBC',
  'cnb': 'CNBC',
  'blm': 'Bloomberg',
  'esp': 'ESPN',
  'esp2': 'ESPN2',
  'espn': 'ESPN+',
  'fs1': 'FS1',
  'fs2': 'FS2',
  'golf': 'Golf Channel',
  'ten': 'Tennis Channel',
  'nhl': 'NHL Network',
  'mlb': 'MLB Network',
  'nba': 'NBA TV',
  'nfl': 'NFL Network',
  'nflr': 'NFL RedZone',
  'ncaa': 'NCAA Network',
  'sec': 'SEC Network',
  'btn': 'Big Ten Network',
  'pac': 'Pac-12 Network',
  'acc': 'ACC Network',
  'lon': 'Longhorn Network',
};

export interface StreamingOffer {
  platform: string;
  platformName: string;
  type: 'buy' | 'rent' | 'stream' | 'free';
  url?: string;
  price?: string;
  currency?: string;
}

export interface StreamingAvailability {
  offers: StreamingOffer[];
  hasStreaming: boolean;
  hasRent: boolean;
  hasBuy: boolean;
  hasFree: boolean;
}

export async function getStreamingAvailability(
  id: string,
  region: string,
  contentType: 'movie' | 'tv'
): Promise<StreamingAvailability> {
  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  const url = `${BASE_URL}/${contentType}/${id}/watch/providers?api_key=${API_KEY}`;
  const res = await fetch(url);
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
  const providers = data.results?.[region]?.flatrate || [];
  const rentProviders = data.results?.[region]?.rent || [];
  const buyProviders = data.results?.[region]?.buy || [];
  const freeProviders = data.results?.[region]?.free || [];

  const offers: StreamingOffer[] = [];
  providers.forEach((provider: any) => {
    offers.push({
      platform: provider.provider_id,
      platformName: provider.provider_name,
      type: 'stream',
      url: provider.link,
    });
  });
  rentProviders.forEach((provider: any) => {
    offers.push({
      platform: provider.provider_id,
      platformName: provider.provider_name,
      type: 'rent',
      url: provider.link,
    });
  });
  buyProviders.forEach((provider: any) => {
    offers.push({
      platform: provider.provider_id,
      platformName: provider.provider_name,
      type: 'buy',
      url: provider.link,
    });
  });
  freeProviders.forEach((provider: any) => {
    offers.push({
      platform: provider.provider_id,
      platformName: provider.provider_name,
      type: 'free',
      url: provider.link,
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
