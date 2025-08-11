// hooks/useStreamingService.ts
import { useState, useCallback } from 'react';
import { smartOpenStreamingService } from '../utils/platformUtils';

interface UseStreamingServiceReturn {
  openService: (platformName: string, url?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useStreamingService = (): UseStreamingServiceReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openService = useCallback(async (platformName: string, url?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add a small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 150));
      
      smartOpenStreamingService(platformName, url);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open streaming service';
      setError(errorMessage);
      
      // Fallback to regular window.open
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } finally {
      // Clear loading state after animation
      setTimeout(() => {
        setIsLoading(false);
        setError(null);
      }, 300);
    }
  }, []);

  return {
    openService,
    isLoading,
    error
  };
};