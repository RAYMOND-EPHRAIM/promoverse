'use client';

import { useState, useEffect } from 'react';
import { Star, Zap, Share2, MoreHorizontal, Eye, MousePointer, TrendingUp, MapPin, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface Analytics {
  views: number;
  clicks: number;
  engagementRate: string;
  boostEffectiveness: string;
  boostLevel: number;
  verse?: {
    id: string;
    name: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  verseEngagement: Array<{
    verseId: string;
    views: number;
    clicks: number;
  }>;
  locationEngagement: Array<{
    latitude: number;
    longitude: number;
    views: number;
    clicks: number;
  }>;
}

interface PromotionCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  stars: number;
  isStarred: boolean;
  boostLevel: number;
  onStar: (id: string) => Promise<void>;
  onBoost: (id: string, level: number) => Promise<void>;
}

export default function PromotionCard({
  id,
  title,
  description,
  imageUrl,
  author,
  createdAt,
  stars,
  isStarred,
  boostLevel,
  onStar,
  onBoost,
}: PromotionCardProps) {
  const router = useRouter();
  const [starred, setStarred] = useState(isStarred);
  const [starCount, setStarCount] = useState(stars);
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showVerseAnalytics, setShowVerseAnalytics] = useState(false);
  const [showLocationAnalytics, setShowLocationAnalytics] = useState(false);

  // Track view and fetch analytics
  useEffect(() => {
    const trackView = async () => {
      try {
        // Get user's current verse and location
        const verseId = localStorage.getItem('currentVerse');
        let position: GeolocationPosition | null = null;
        
        try {
          position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
        } catch (error) {
          console.warn('Could not get geolocation:', error);
        }

        // Track view
        await fetch(`/api/analytics/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'view',
            verseId,
            latitude: position?.coords.latitude,
            longitude: position?.coords.longitude,
          }),
        });

        // Fetch analytics
        const response = await fetch(`/api/analytics/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.warn('Error in analytics tracking:', error);
        // Set default analytics if tracking fails
        setAnalytics({
          views: 0,
          clicks: 0,
          engagementRate: '0%',
          boostEffectiveness: 'N/A',
          boostLevel: 0,
        });
      }
    };

    trackView();
  }, [id]);

  const handleClick = async (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('a')
    ) {
      return;
    }

    try {
      const verseId = localStorage.getItem('currentVerse');
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      await fetch(`/api/analytics/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'click',
          verseId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      router.push(`/promotions/${id}`);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await onStar(id);
      setStarred(true);
      setStarCount(starCount + 1);
    } catch (error) {
      console.error('Error starring promotion:', error);
      toast.error('Failed to star promotion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoost = async (e: React.MouseEvent, level: number) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await onBoost(id, level);
      toast.success(`Successfully boosted to level ${level}`);
    } catch (error) {
      console.error('Error boosting promotion:', error);
      toast.error('Failed to boost promotion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/promotions/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-video">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        {boostLevel > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Level {boostLevel} Boost
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-medium">{author.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{author.username}
            </p>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>

        {/* Analytics */}
        {analytics && (
          <div className="mb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAnalytics(!showAnalytics);
              }}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
            {showAnalytics && (
              <div className="mt-2 space-y-4">
                {/* Base Analytics */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Eye size={14} />
                    <span>{analytics.views} views</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <MousePointer size={14} />
                    <span>{analytics.clicks} clicks</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <TrendingUp size={14} />
                    <span>{analytics.engagementRate} engagement</span>
                  </div>
                  {analytics.boostEffectiveness !== 'N/A' && (
                    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                      <Zap size={14} />
                      <span>{analytics.boostEffectiveness} views/hour</span>
                    </div>
                  )}
                </div>

                {/* Verse Analytics */}
                {analytics.verse && (
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVerseAnalytics(!showVerseAnalytics);
                      }}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Globe size={14} />
                      {showVerseAnalytics ? 'Hide Verse Analytics' : 'Show Verse Analytics'}
                    </button>
                    {showVerseAnalytics && (
                      <div className="mt-2 space-y-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Current Verse: {analytics.verse.name}
                        </div>
                        {analytics.verseEngagement.map((engagement) => (
                          <div key={engagement.verseId} className="text-sm text-gray-600 dark:text-gray-400">
                            Verse {engagement.verseId}: {engagement.views} views, {engagement.clicks} clicks
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Location Analytics */}
                {analytics.location && (
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLocationAnalytics(!showLocationAnalytics);
                      }}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <MapPin size={14} />
                      {showLocationAnalytics ? 'Hide Location Analytics' : 'Show Location Analytics'}
                    </button>
                    {showLocationAnalytics && (
                      <div className="mt-2 space-y-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Current Location: {analytics.location.latitude}, {analytics.location.longitude}
                        </div>
                        {analytics.locationEngagement.map((engagement, index) => (
                          <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            {engagement.latitude}, {engagement.longitude}: {engagement.views} views, {engagement.clicks} clicks
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleStar}
              disabled={isLoading}
              className={`flex items-center gap-1 ${
                starred ? 'text-yellow-500' : 'text-gray-500'
              } hover:text-yellow-500 transition`}
            >
              <Star
                size={18}
                className={starred ? 'fill-current' : ''}
              />
              <span>{starCount}</span>
            </button>

            <button
              onClick={(e) => handleBoost(e, 1)}
              disabled={isLoading || boostLevel >= 1}
              className={`flex items-center gap-1 ${
                boostLevel >= 1
                  ? 'text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-500'
              } transition`}
            >
              <Zap size={18} />
              <span>Boost</span>
            </button>

            <button
              onClick={(e) => handleBoost(e, 2)}
              disabled={isLoading || boostLevel >= 2}
              className={`flex items-center gap-1 ${
                boostLevel >= 2
                  ? 'text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-500'
              } transition`}
            >
              <Zap size={18} />
              <span>Boost 2</span>
            </button>

            <button
              onClick={(e) => handleBoost(e, 3)}
              disabled={isLoading || boostLevel >= 3}
              className={`flex items-center gap-1 ${
                boostLevel >= 3
                  ? 'text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-500'
              } transition`}
            >
              <Zap size={18} />
              <span>Boost 3</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Share2 size={18} />
            </button>
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Timestamp */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
} 