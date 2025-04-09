import { useFetch } from './useFetch';
import { apiPost } from '@/utils/api';

interface AnalyticsData {
  views: number;
  clicks: number;
  engagementRate: number;
  locationViews: Record<string, number>;
  locationClicks: Record<string, number>;
  verseViews: Record<string, number>;
  verseClicks: Record<string, number>;
}

interface TrackEventData {
  type: 'view' | 'click';
  location?: {
    latitude: number;
    longitude: number;
  };
  verseId?: string;
}

export function useAnalytics(postId: string) {
  const { data, isLoading, error, mutate } = useFetch<AnalyticsData>(
    `/api/analytics/${postId}`,
    {
      revalidateOnFocus: true,
    }
  );

  const trackEvent = async (eventData: TrackEventData) => {
    const response = await apiPost<AnalyticsData>(`/api/analytics/${postId}/track`, eventData);
    if (response.data) {
      mutate(response.data);
    }
    return response;
  };

  return {
    analytics: data,
    isLoading,
    error,
    trackEvent,
    refresh: mutate,
  };
} 