import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiFunction: () => Promise<{ data?: T; error?: string }>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await apiFunction();
      if (result.error) {
        setError(result.error);
        options.onError?.(result.error);
      } else if (result.data) {
        setData(result.data);
        options.onSuccess?.(result.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, error, isLoading, refetch: fetchData };
}

// Example hooks for specific features
export function usePromotions(params?: { category?: string; verse?: string }) {
  return useApi(() => api.getPromotions(params));
}

export function useAnalytics(id: string) {
  return useApi(() => api.getAnalytics(id));
}

export function useWallet() {
  return useApi(() => api.getWallet());
}

export function useVerses() {
  return useApi(() => api.getVerses());
} 