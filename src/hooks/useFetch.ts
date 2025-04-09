import useSWR from 'swr';
import { apiRequest } from '@/utils/api';

interface UseFetchOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  revalidateOnFocus?: boolean;
}

export function useFetch<T>(
  endpoint: string | null,
  options: UseFetchOptions<T> = {}
) {
  const {
    onSuccess,
    onError,
    revalidateOnFocus = true,
  } = options;

  const { data, error, isLoading, mutate } = useSWR<T>(
    endpoint,
    async (url) => {
      const response = await apiRequest<T>(url);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    {
      revalidateOnFocus,
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError: (error) => {
        if (onError) {
          onError(error.message);
        }
      },
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    error: error?.message,
    mutate,
  };
} 