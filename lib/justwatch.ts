// lib/justwatch.ts

const JUSTWATCH_API_BASE = 'https://apis.justwatch.com/content';

// JustWatch country codes mapping
const COUNTRY_CODES: { [key: string]: string } = {
  'US': 'en_US',
  'AR': 'es_AR', 
  'UK': 'en_GB',
  'CA': 'en_CA',
  'AU': 'en_AU',
  'DE': 'de_DE',
  'FR': 'fr_FR',
  'ES': 'es_ES',
  'IT': 'it_IT',
  'BR': 'pt_BR',
  'MX': 'es_MX',
  'JP': 'ja_JP',
  'KR': 'ko_KR',
  'IN': 'en_IN',
};

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
  title: string,
  year: string,
  region: string,
  contentType: 'movie' | 'tv'
): Promise<StreamingAvailability> {
  try {
    const countryCode = COUNTRY_CODES[region] || COUNTRY_CODES['US'];
    
    // Search for the content on JustWatch
    const searchResponse = await fetch(`${JUSTWATCH_API_BASE}/titles/${countryCode}/popular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: title,
        content_types: [contentType === 'movie' ? 'movie' : 'show'],
        release_year_from: parseInt(year) - 1,
        release_year_until: parseInt(year) + 1,
        page: 1,
        page_size: 10,
      }),
    });

    if (!searchResponse.ok) {
      throw new Error('Failed to search JustWatch');
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      return {
        offers: [],
        hasStreaming: false,
        hasRent: false,
        hasBuy: false,
        hasFree: false,
      };
    }

    // Get the first result (most relevant)
    const contentId = searchData.items[0].jw_entity_id;
    
    // Get detailed offers for this content
    const offersResponse = await fetch(`${JUSTWATCH_API_BASE}/titles/${contentType}/${contentId}/locale/${countryCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!offersResponse.ok) {
      throw new Error('Failed to fetch offers');
    }

    const offersData = await offersResponse.json();
    
    const offers: StreamingOffer[] = [];
    let hasStreaming = false;
    let hasRent = false;
    let hasBuy = false;
    let hasFree = false;

         if (offersData.offers) {
       offersData.offers.forEach((offer: { package_id: string; monetization_type: string; urls?: { standard_web?: string }; retail_price?: string; currency?: string }) => {
        const platformName = PLATFORM_NAMES[offer.package_id] || offer.package_id;
        
                 const streamingOffer: StreamingOffer = {
           platform: offer.package_id,
           platformName,
           type: offer.monetization_type as 'buy' | 'rent' | 'stream' | 'free',
           url: offer.urls?.standard_web,
           price: offer.retail_price,
           currency: offer.currency,
         };

        offers.push(streamingOffer);

        switch (offer.monetization_type) {
          case 'stream':
            hasStreaming = true;
            break;
          case 'rent':
            hasRent = true;
            break;
          case 'buy':
            hasBuy = true;
            break;
          case 'free':
            hasFree = true;
            break;
        }
      });
    }

    return {
      offers,
      hasStreaming,
      hasRent,
      hasBuy,
      hasFree,
    };
  } catch (error) {
    console.error('Error fetching streaming availability:', error);
    
         // Return mock data for now (we'll implement real API later)
     return getMockStreamingData(title);
  }
}

function getMockStreamingData(title: string): StreamingAvailability {
  const mockData: { [key: string]: StreamingOffer[] } = {
    'Inception': [
      { platform: 'nfx', platformName: 'Netflix', type: 'stream' },
      { platform: 'prv', platformName: 'Prime Video', type: 'stream' },
      { platform: 'itu', platformName: 'iTunes', type: 'rent', price: '$3.99' },
      { platform: 'ply', platformName: 'Google Play', type: 'buy', price: '$14.99' },
    ],
    'The Matrix': [
      { platform: 'hbo', platformName: 'HBO Max', type: 'stream' },
      { platform: 'itu', platformName: 'iTunes', type: 'rent', price: '$3.99' },
      { platform: 'vdu', platformName: 'Vudu', type: 'buy', price: '$12.99' },
    ],
    'Breaking Bad': [
      { platform: 'nfx', platformName: 'Netflix', type: 'stream' },
      { platform: 'amz', platformName: 'Amazon Prime', type: 'stream' },
    ],
    'Stranger Things': [
      { platform: 'nfx', platformName: 'Netflix', type: 'stream' },
    ],
    'Avengers': [
      { platform: 'dsn', platformName: 'Disney+', type: 'stream' },
      { platform: 'itu', platformName: 'iTunes', type: 'rent', price: '$4.99' },
    ],
  };

  const offers = mockData[title] || [
    { platform: 'nfx', platformName: 'Netflix', type: 'stream' },
    { platform: 'prv', platformName: 'Prime Video', type: 'stream' },
  ];

  return {
    offers,
    hasStreaming: offers.some(o => o.type === 'stream'),
    hasRent: offers.some(o => o.type === 'rent'),
    hasBuy: offers.some(o => o.type === 'buy'),
    hasFree: offers.some(o => o.type === 'free'),
  };
}
