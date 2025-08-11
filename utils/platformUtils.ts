// utils/platformUtils.ts

export interface PlatformUrls {
  web: string;
  ios?: string;
  android?: string;
}

// Platform detection utilities
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

// Platform-specific URLs for streaming services
export const getStreamingUrls = (platformName: string, contentUrl?: string): PlatformUrls => {
  const fallbackWeb = contentUrl || '#';
  
  switch (platformName.toLowerCase()) {
    case 'netflix':
      return {
        web: contentUrl || 'https://www.netflix.com',
        ios: 'nflx://', // Netflix iOS app scheme
        android: 'https://www.netflix.com' // Netflix Android uses web URLs
      };
    
    case 'prime video':
    case 'amazon prime':
      return {
        web: contentUrl || 'https://www.amazon.com/Prime-Video',
        ios: 'aiv://', // Amazon Prime Video iOS scheme
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
        ios: 'com.apple.tv://', // Apple TV iOS scheme
        android: fallbackWeb // Apple TV+ not available as Android app
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
    
    case 'crunchyroll':
      return {
        web: contentUrl || 'https://www.crunchyroll.com',
        ios: 'crunchyroll://',
        android: 'intent://www.crunchyroll.com#Intent;package=com.crunchyroll.crunchyroid;end;'
      };
    
    case 'youtube':
      return {
        web: contentUrl || 'https://www.youtube.com',
        ios: 'youtube://',
        android: 'intent://www.youtube.com#Intent;package=com.google.android.youtube;end;'
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

// Function to handle opening the appropriate URL
export const openStreamingService = async (platformName: string, contentUrl?: string): Promise<void> => {
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
  
  if (appUrl) {
    try {
      // Try to open the app
      const appWindow = window.open(appUrl, '_blank');
      
      // Set a timeout to fallback to web if app doesn't open
      setTimeout(() => {
        if (appWindow) {
          appWindow.close();
        }
        window.open(urls.web, '_blank', 'noopener,noreferrer');
      }, 2000);
      
    } catch (error) {
      // If app opening fails, open web URL
      console.warn(`Failed to open ${platformName} app:`, error);
      window.open(urls.web, '_blank', 'noopener,noreferrer');
    }
  } else {
    // No app URL available, open web
    window.open(urls.web, '_blank', 'noopener,noreferrer');
  }
};

// Enhanced function that tries app first, then web with user feedback
export const smartOpenStreamingService = (platformName: string, contentUrl?: string): void => {
  const urls = getStreamingUrls(platformName, contentUrl);
  
  if (!isMobile()) {
    window.open(urls.web, '_blank', 'noopener,noreferrer');
    return;
  }
  
  let appUrl: string | undefined;
  
  if (isIOS() && urls.ios) {
    appUrl = urls.ios;
  } else if (isAndroid() && urls.android) {
    appUrl = urls.android;
  }
  
  if (appUrl) {
    // Create a hidden iframe to attempt app opening
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = appUrl;
    document.body.appendChild(iframe);
    
    // Clean up and fallback after a short delay
    setTimeout(() => {
      document.body.removeChild(iframe);
      // If we're still here, the app probably didn't open
      // Check if the page is still focused (app didn't open)
      if (document.hasFocus()) {
        window.open(urls.web, '_blank', 'noopener,noreferrer');
      }
    }, 1500);
  } else {
    window.open(urls.web, '_blank', 'noopener,noreferrer');
  }
};