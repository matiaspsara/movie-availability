// utils/enhancedPlatformUtils.ts

export interface PlatformUrls {
  web: string;
  ios?: string;
  android?: string;
}

export interface StreamingAnalytics {
  platform: string;
  contentTitle: string;
  contentId: string;
  actionType: 'stream' | 'rent' | 'buy' | 'free';
  deviceType: 'desktop' | 'mobile';
  openMethod: 'app' | 'web' | 'fallback';
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

export const getDeviceType = (): 'desktop' | 'mobile' => {
  return isMobile() ? 'mobile' : 'desktop';
};

// Enhanced platform URLs with deep linking support
export const getStreamingUrls = (platformName: string, contentUrl?: string, contentId?: string): PlatformUrls => {
  const fallbackWeb = contentUrl || '#';
  
  switch (platformName.toLowerCase()) {
    case 'netflix':
      return {
        web: contentUrl || 'https://www.netflix.com',
        ios: contentId ? `nflx://www.netflix.com/title/${contentId}` : 'nflx://',
        android: contentUrl || 'https://www.netflix.com'
      };
    
    case 'prime video':
    case 'amazon prime':
      return {
        web: contentUrl || 'https://www.amazon.com/Prime-Video',
        ios: contentId ? `aiv://aiv/play?asin=${contentId}` : 'aiv://',
        android: `intent://www.amazon.com/Prime-Video#Intent;package=com.amazon.avod.thirdpartyclient;end;`
      };
    
    case 'hulu':
      return {
        web: contentUrl || 'https://www.hulu.com',
        ios: contentId ? `hulu://play/${contentId}` : 'hulu://',
        android: 'intent://www.hulu.com#Intent;package=com.hulu.plus;end;'
      };
    
    case 'hbo max':
    case 'max':
      return {
        web: contentUrl || 'https://www.max.com',
        ios: contentId ? `hbomax://feature/${contentId}` : 'hbomax://',
        android: 'intent://www.max.com#Intent;package=com.hbo.hbonow;end;'
      };
    
    case 'disney+':
      return {
        web: contentUrl || 'https://www.disneyplus.com',
        ios: contentId ? `disneyplus://play/${contentId}` : 'disneyplus://',
        android: 'intent://www.disneyplus.com#Intent;package=com.disney.disneyplus;end;'
      };
    
    case 'apple tv+':
      return {
        web: contentUrl || 'https://tv.apple.com',
        ios: contentId ? `com.apple.tv://play/${contentId}` : 'com.apple.tv://',
        android: fallbackWeb // Apple TV+ not available as Android app
      };
    
    case 'paramount+':
      return {
        web: contentUrl || 'https://www.paramountplus.com',
        ios: contentId ? `cbsaa://play/${contentId}` : 'cbsaa://',
        android: 'intent://www.paramountplus.com#Intent;package=com.cbs.app;end;'
      };
    
    case 'peacock':
      return {
        web: contentUrl || 'https://www.peacocktv.com',
        ios: contentId ? `peacocktv://play/${contentId}` : 'peacocktv://',
        android: 'intent://www.peacocktv.com#Intent;package=com.peacocktv.peacockandroid;end;'
      };
    
    case 'youtube':
      return {
        web: contentUrl || 'https://www.youtube.com',
        ios: contentId ? `youtube://watch?v=${contentId}` : 'youtube://',
        android: 'intent://www.youtube.com#Intent;package=com.google.android.youtube;end;'
      };
    
    case 'crunchyroll':
      return {
        web: contentUrl || 'https://www.crunchyroll.com',
        ios: contentId ? `crunchyroll://watch/${contentId}` : 'crunchyroll://',
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

    default:
      return {
        web: fallbackWeb
      };
  }
};

// Analytics tracking function (you can customize this based on your analytics provider)
export const trackStreamingAction = (analytics: StreamingAnalytics): void => {
  try {
    // Example with Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'streaming_platform_click', {
        platform: analytics.platform,
        content_title: analytics.contentTitle,
        content_id: analytics.contentId,
        action_type: analytics.actionType,
        device_type: analytics.deviceType,
        open_method: analytics.openMethod,
      });
    }

    // Example with custom analytics
    console.log('Streaming Analytics:', analytics);
    
    // You can also send to your own analytics endpoint
    // fetch('/api/analytics/streaming', {
    //   method: 'POST',
    //   body: JSON.stringify(analytics)
    // });
  } catch (error) {
    console.warn('Failed to track streaming action:', error);
  }
};

// Enhanced function with analytics and better error handling
export const openStreamingServiceWithAnalytics = async (
  platformName: string, 
  contentUrl?: string,
  contentId?: string,
  contentTitle?: string,
  actionType: 'stream' | 'rent' | 'buy' | 'free' = 'stream'
): Promise<{ success: boolean; method: string; error?: string }> => {
  
  const urls = getStreamingUrls(platformName, contentUrl, contentId);
  const deviceType = getDeviceType();
  
  // Prepare analytics data
  const analyticsData: StreamingAnalytics = {
    platform: platformName,
    contentTitle: contentTitle || 'Unknown',
    contentId: contentId || 'Unknown',
    actionType,
    deviceType,
    openMethod: 'web' // Will be updated based on actual method used
  };

  if (!isMobile()) {
    // Desktop: Always open web URL
    try {
      window.open(urls.web, '_blank', 'noopener,noreferrer');
      analyticsData.openMethod = 'web';
      trackStreamingAction(analyticsData);
      return { success: true, method: 'web' };
    } catch (error) {
      return { success: false, method: 'web', error: 'Failed to open web URL' };
    }
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
      let appOpened = false;

      if (!appUrl.startsWith('intent://')) {
        // For iOS and simple schemes, use the iframe method
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.position = 'absolute';
        iframe.style.top = '-1000px';
        iframe.src = appUrl;
        document.body.appendChild(iframe);

        // Check if app opened by monitoring page visibility
        const handleVisibilityChange = () => {
          if (document.hidden) {
            appOpened = true;
            analyticsData.openMethod = 'app';
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        setTimeout(() => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          document.body.removeChild(iframe);
          
          if (!appOpened) {
            // App didn't open, fallback to web
            window.open(urls.web, '_blank', 'noopener,noreferrer');
            analyticsData.openMethod = 'fallback';
          }
          
          trackStreamingAction(analyticsData);
        }, 2000);

        return { success: true, method: appOpened ? 'app' : 'fallback' };

      } else {
        // For Android intent URLs, use location.href
        const beforeTime = Date.now();
        window.location.href = appUrl;
        
        setTimeout(() => {
          const afterTime = Date.now();
          // If we're still here after 2.5 seconds, app probably didn't open
          if (afterTime - beforeTime >= 2500) {
            window.open(urls.web, '_blank', 'noopener,noreferrer');
            analyticsData.openMethod = 'fallback';
          } else {
            analyticsData.openMethod = 'app';
          }
          trackStreamingAction(analyticsData);
        }, 2500);

        return { success: true, method: 'app_attempt' };
      }
    } catch (error) {
      // Fallback to web
      try {
        window.open(urls.web, '_blank', 'noopener,noreferrer');
        analyticsData.openMethod = 'fallback';
        trackStreamingAction(analyticsData);
        return { success: true, method: 'fallback' };
      } catch (webError) {
        return { success: false, method: 'fallback', error: 'Failed to open both app and web' };
      }
    }
  } else {
    // No app URL available, open web
    try {
      window.open(urls.web, '_blank', 'noopener,noreferrer');
      analyticsData.openMethod = 'web';
      trackStreamingAction(analyticsData);
      return { success: true, method: 'web' };
    } catch (error) {
      return { success: false, method: 'web', error: 'Failed to open web URL' };
    }
  }
};