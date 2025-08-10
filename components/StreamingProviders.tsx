'use client';
import { useState, useEffect } from 'react';
import { StreamingAvailability, StreamingOffer } from '../lib/justwatch';

interface Props {
  movieId: string;
  title: string;
  type: 'movie' | 'tv';
  region: string;
}

const platformColors: { [key: string]: string } = {
  'Netflix': 'bg-red-600',
  'Prime Video': 'bg-blue-600',
  'Hulu': 'bg-green-600',
  'HBO Max': 'bg-purple-600',
  'Disney+': 'bg-blue-500',
  'Apple TV+': 'bg-gray-800',
  'Paramount+': 'bg-blue-700',
  'Peacock': 'bg-blue-400',
  'Crunchyroll': 'bg-orange-500',
  'Funimation': 'bg-purple-500',
  'Showtime': 'bg-red-700',
  'Starz': 'bg-purple-700',
  'Amazon Prime': 'bg-blue-600',
  'iTunes': 'bg-gray-700',
  'Google Play': 'bg-green-500',
  'Vudu': 'bg-blue-500',
  'Microsoft Store': 'bg-green-600',
  'YouTube': 'bg-red-500',
  'HIDIVE': 'bg-purple-600',
  'VRV': 'bg-orange-600',
  'BTS': 'bg-purple-500',
  'MUBI': 'bg-red-600',
  'Shudder': 'bg-red-800',
  'Acorn TV': 'bg-green-700',
  'BritBox': 'bg-blue-800',
  'Discovery+': 'bg-yellow-600',
  'Philharmonic': 'bg-purple-800',
  'Criterion Channel': 'bg-gray-600',
  'IndieFlix': 'bg-purple-500',
  'Tubi': 'bg-blue-500',
  'Pluto TV': 'bg-purple-600',
  'Roku Channel': 'bg-purple-700',
  'Xumo': 'bg-blue-600',
  'CW Seed': 'bg-purple-500',
  'CW TV': 'bg-purple-600',
  'ABC': 'bg-blue-600',
  'NBC': 'bg-blue-700',
  'CBS': 'bg-blue-800',
  'FOX': 'bg-red-600',
  'PBS': 'bg-blue-600',
  'TBS': 'bg-orange-500',
  'TNT': 'bg-blue-600',
  'USA Network': 'bg-blue-700',
  'Syfy': 'bg-blue-600',
  'AMC': 'bg-red-600',
  'FX': 'bg-purple-600',
  'FXX': 'bg-purple-700',
  'FXM': 'bg-purple-800',
  'TLC': 'bg-pink-500',
  'HGTV': 'bg-green-600',
  'Food Network': 'bg-orange-500',
  'Travel Channel': 'bg-blue-500',
  'History': 'bg-gray-600',
  'A&E': 'bg-red-600',
  'Lifetime': 'bg-pink-500',
  'HLN': 'bg-red-600',
  'CNN': 'bg-red-600',
  'MSNBC': 'bg-blue-600',
  'Fox News': 'bg-red-600',
  'CNBC': 'bg-blue-600',
  'Bloomberg': 'bg-orange-500',
  'ESPN': 'bg-red-600',
  'ESPN2': 'bg-red-700',
  'ESPN+': 'bg-red-800',
  'FS1': 'bg-blue-600',
  'FS2': 'bg-blue-700',
  'NBC Sports': 'bg-blue-600',
  'CBS Sports': 'bg-blue-600',
  'Golf Channel': 'bg-green-600',
  'Tennis Channel': 'bg-green-500',
  'NHL Network': 'bg-gray-600',
  'MLB Network': 'bg-blue-600',
  'NBA TV': 'bg-blue-600',
  'NFL Network': 'bg-red-600',
  'NFL RedZone': 'bg-red-700',
  'NCAA Network': 'bg-blue-600',
  'SEC Network': 'bg-blue-600',
  'Big Ten Network': 'bg-blue-600',
  'Pac-12 Network': 'bg-blue-600',
  'ACC Network': 'bg-blue-600',
  'Longhorn Network': 'bg-orange-600',
  'ESPN Deportes': 'bg-red-600',
  'Fox Deportes': 'bg-red-600',
  'Univision Deportes': 'bg-blue-600',
  'TUDN': 'bg-blue-600',
  'beIN Sports': 'bg-orange-500',
  'GolTV': 'bg-blue-600',
  'TyC Sports': 'bg-blue-600',
  'ESPN Brasil': 'bg-red-600',
  'Fox Sports Brasil': 'bg-red-600',
  'Globo': 'bg-blue-600',
  'Rede Bandeirantes': 'bg-blue-600',
  'SBT': 'bg-blue-600',
  'Record': 'bg-blue-600',
  'CNN Brasil': 'bg-red-600',
  'GloboNews': 'bg-blue-600',
  'BandNews': 'bg-blue-600',
  'CNN en Español': 'bg-red-600',
  'Fox News en Español': 'bg-red-600',
  'MSNBC en Español': 'bg-blue-600',
  'CNBC en Español': 'bg-blue-600',
  'Bloomberg en Español': 'bg-orange-500',
  'ESPN en Español': 'bg-red-600',
  'Fox Sports en Español': 'bg-red-600',
  'Univision': 'bg-blue-600',
  'UniMás': 'bg-blue-600',
  'Galavisión': 'bg-blue-600',
  'Telemundo': 'bg-blue-600',
  'USA Network en Español': 'bg-blue-600',
  'NBC Universo': 'bg-blue-600',
  'Discovery en Español': 'bg-yellow-600',
  'Nat Geo en Español': 'bg-yellow-600',
  'History en Español': 'bg-gray-600',
  'A&E en Español': 'bg-red-600',
  'Lifetime en Español': 'bg-pink-500',
  'HGTV en Español': 'bg-green-600',
  'Food Network en Español': 'bg-orange-500',
  'Travel Channel en Español': 'bg-blue-500',
  'TLC en Español': 'bg-pink-500',
  'HLN en Español': 'bg-red-600',
  'CNN International': 'bg-red-600',
  'BBC World News': 'bg-red-600',
  'Sky News': 'bg-blue-600',
  'Euronews': 'bg-blue-600',
  'DW News': 'bg-blue-600',
  'France 24': 'bg-blue-600',
  'RT': 'bg-red-600',
  'Al Jazeera': 'bg-black',
  'CNN Arabic': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'France 24 Arabic': 'bg-blue-600',
  'DW Arabic': 'bg-blue-600',
  'RT Arabic': 'bg-red-600',
  'Al Jazeera Arabic': 'bg-black',
  'CNN Türk': 'bg-red-600',
  'BBC Türkçe': 'bg-red-600',
  'TRT World': 'bg-red-600',
  'CNN Indonesia': 'bg-red-600',
  'BBC Indonesia': 'bg-red-600',
  'CNN Philippines': 'bg-red-600',
  'BBC Philippines': 'bg-red-600',
  'CNN Thailand': 'bg-red-600',
  'BBC Thailand': 'bg-red-600',
  'CNN Malaysia': 'bg-red-600',
  'BBC Malaysia': 'bg-red-600',
  'CNN Singapore': 'bg-red-600',
  'BBC Singapore': 'bg-red-600',
  'CNN Vietnam': 'bg-red-600',
  'BBC Vietnam': 'bg-red-600',
  'CNN Cambodia': 'bg-red-600',
  'BBC Cambodia': 'bg-red-600',
  'CNN Laos': 'bg-red-600',
  'BBC Laos': 'bg-red-600',
  'CNN Myanmar': 'bg-red-600',
  'BBC Myanmar': 'bg-red-600',
  'CNN Bangladesh': 'bg-red-600',
  'BBC Bangladesh': 'bg-red-600',
  'CNN Sri Lanka': 'bg-red-600',
  'BBC Sri Lanka': 'bg-red-600',
  'CNN Nepal': 'bg-red-600',
  'BBC Nepal': 'bg-red-600',
  'CNN Bhutan': 'bg-red-600',
  'BBC Bhutan': 'bg-red-600',
  'CNN Maldives': 'bg-red-600',
  'BBC Maldives': 'bg-red-600',
  'CNN Pakistan': 'bg-red-600',
  'BBC Pakistan': 'bg-red-600',
  'CNN Afghanistan': 'bg-red-600',
  'BBC Afghanistan': 'bg-red-600',
  'CNN Iran': 'bg-red-600',
  'BBC Persian': 'bg-red-600',
  'CNN Iraq': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Syria': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Lebanon': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Jordan': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Palestine': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Israel': 'bg-red-600',
  'BBC Hebrew': 'bg-red-600',
  'CNN Egypt': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Libya': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Tunisia': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Algeria': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Morocco': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Sudan': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN South Sudan': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Ethiopia': 'bg-red-600',
  'BBC Amharic': 'bg-red-600',
  'CNN Somalia': 'bg-red-600',
  'BBC Somali': 'bg-red-600',
  'CNN Kenya': 'bg-red-600',
  'BBC Swahili': 'bg-red-600',
  'CNN Tanzania': 'bg-red-600',
  'BBC Swahili': 'bg-red-600',
  'CNN Uganda': 'bg-red-600',
  'BBC Swahili': 'bg-red-600',
  'CNN Rwanda': 'bg-red-600',
  'BBC Swahili': 'bg-red-600',
  'CNN Burundi': 'bg-red-600',
  'BBC Swahili': 'bg-red-600',
  'CNN Democratic Republic of the Congo': 'bg-red-600',
  'BBC Swahili': 'bg-red-600',
  'CNN Republic of the Congo': 'bg-red-600',
  'BBC Swahili': 'bg-red-600',
  'CNN Central African Republic': 'bg-red-600',
  'BBC Swahili': 'bg-red-600',
  'CNN Chad': 'bg-red-600',
  'BBC Arabic': 'bg-red-600',
  'CNN Cameroon': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Nigeria': 'bg-red-600',
  'BBC Hausa': 'bg-red-600',
  'CNN Niger': 'bg-red-600',
  'BBC Hausa': 'bg-red-600',
  'CNN Mali': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Burkina Faso': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Senegal': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Gambia': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Guinea-Bissau': 'bg-red-600',
  'BBC Portuguese': 'bg-red-600',
  'CNN Guinea': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Sierra Leone': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Liberia': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Ivory Coast': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Ghana': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Togo': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Benin': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Equatorial Guinea': 'bg-red-600',
  'BBC Spanish': 'bg-red-600',
  'CNN Gabon': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN São Tomé and Príncipe': 'bg-red-600',
  'BBC Portuguese': 'bg-red-600',
  'CNN Angola': 'bg-red-600',
  'BBC Portuguese': 'bg-red-600',
  'CNN Zambia': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Malawi': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Mozambique': 'bg-red-600',
  'BBC Portuguese': 'bg-red-600',
  'CNN Zimbabwe': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Botswana': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Namibia': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN South Africa': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Lesotho': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Eswatini': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Madagascar': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Mauritius': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Seychelles': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Comoros': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Mayotte': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Réunion': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN French Guiana': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN French Polynesia': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN New Caledonia': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Wallis and Futuna': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Saint Pierre and Miquelon': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Guadeloupe': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Martinique': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Saint Martin': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Saint Barthélemy': 'bg-red-600',
  'BBC French': 'bg-red-600',
  'CNN Saint Lucia': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Saint Vincent and the Grenadines': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Grenada': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Dominica': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Antigua and Barbuda': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Saint Kitts and Nevis': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Montserrat': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Anguilla': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN British Virgin Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Turks and Caicos Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Cayman Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Bermuda': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Falkland Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN South Georgia and the South Sandwich Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN British Indian Ocean Territory': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Pitcairn Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Saint Helena, Ascension and Tristan da Cunha': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Gibraltar': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Akrotiri and Dhekelia': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN British Antarctic Territory': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN British Virgin Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Turks and Caicos Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Cayman Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Bermuda': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Falkland Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN South Georgia and the South Sandwich Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN British Indian Ocean Territory': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Pitcairn Islands': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Saint Helena, Ascension and Tristan da Cunha': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Gibraltar': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN Akrotiri and Dhekelia': 'bg-red-600',
  'BBC English': 'bg-red-600',
  'CNN British Antarctic Territory': 'bg-red-600',
  'BBC English': 'bg-red-600',
};

const typeLabels = {
  stream: 'Stream',
  rent: 'Rent',
  buy: 'Buy',
  free: 'Free',
};

const typeColors = {
  stream: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  buy: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  free: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

export default function StreamingProviders({ movieId, title, type, region }: Props) {
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
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !streamingData) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Unable to load streaming availability at this time.
        </p>
      </div>
    );
  }

  const { offers, hasStreaming, hasRent, hasBuy, hasFree } = streamingData;

  if (offers.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Where to Watch</h3>
        <p className="text-gray-600 dark:text-gray-400">
          No streaming information available for {title} in {region}.
        </p>
      </div>
    );
  }

  // Group offers by type
  const streamingOffers = offers.filter(o => o.type === 'stream');
  const rentOffers = offers.filter(o => o.type === 'rent');
  const buyOffers = offers.filter(o => o.type === 'buy');
  const freeOffers = offers.filter(o => o.type === 'free');

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Where to Watch</h3>
      
      {/* Streaming Services */}
      {streamingOffers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Streaming Services
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {streamingOffers.map((offer, index) => (
              <div
                key={`${offer.platform}-${index}`}
                className={`${platformColors[offer.platformName] || 'bg-gray-600'} rounded-lg p-3 text-white text-center hover:opacity-90 transition-opacity cursor-pointer`}
                onClick={() => offer.url && window.open(offer.url, '_blank')}
              >
                <div className="font-semibold text-sm">{offer.platformName}</div>
                <div className="text-xs opacity-90">Included</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rent Options */}
      {rentOffers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Rent
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {rentOffers.map((offer, index) => (
              <div
                key={`${offer.platform}-${index}`}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => offer.url && window.open(offer.url, '_blank')}
              >
                <div className="font-semibold text-sm text-gray-900 dark:text-white">{offer.platformName}</div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {offer.price || 'Check Price'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buy Options */}
      {buyOffers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Buy
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {buyOffers.map((offer, index) => (
              <div
                key={`${offer.platform}-${index}`}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => offer.url && window.open(offer.url, '_blank')}
              >
                <div className="font-semibold text-sm text-gray-900 dark:text-white">{offer.platformName}</div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {offer.price || 'Check Price'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Free Options */}
      {freeOffers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Free
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {freeOffers.map((offer, index) => (
              <div
                key={`${offer.platform}-${index}`}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => offer.url && window.open(offer.url, '_blank')}
              >
                <div className="font-semibold text-sm text-gray-900 dark:text-white">{offer.platformName}</div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">Free</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
          {hasStreaming && <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">Streaming Available</span>}
          {hasRent && <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">Rent Available</span>}
          {hasBuy && <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">Buy Available</span>}
          {hasFree && <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">Free Available</span>}
        </div>
      </div>
    </div>
  );
}
