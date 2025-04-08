'use client';

import { useState, useEffect } from 'react';
import { Star, Eye, MousePointer, Users, TrendingUp, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { User, Promotion } from '@prisma/client';

interface VerseStatsProps {
  verseId: string;
}

interface Stats {
  totalPromotions: number;
  totalViews: number;
  totalClicks: number;
  engagementRate: number;
  topTags: string[];
  activeUsers: number;
  topPromoters: Array<{
    user: User;
    promotionCount: number;
    totalViews: number;
    totalClicks: number;
  }>;
  topPromotions: Array<{
    promotion: Promotion;
    views: number;
    clicks: number;
    engagementRate: number;
  }>;
}

export default function VerseStats({ verseId }: VerseStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/verses/${verseId}/stats`);
        if (!response.ok) {
          throw new Error('Failed to fetch verse stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [verseId]);

  if (loading) {
    return <div className="text-center py-8">Loading verse stats...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">No stats available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500" />
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Promotions</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalPromotions}</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <Eye className="text-blue-500" />
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Views</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalViews}</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <MousePointer className="text-green-500" />
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Clicks</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalClicks}</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <Users className="text-purple-500" />
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Active Users</h3>
          </div>
          <p className="text-2xl font-bold">{stats.activeUsers}</p>
        </div>
      </div>

      {/* Top Tags */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Tags</h3>
        <div className="flex flex-wrap gap-2">
          {stats.topTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Top Promoters */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Promoters</h3>
        <div className="space-y-4">
          {stats.topPromoters.map((promoter, index) => (
            <div
              key={promoter.user.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{promoter.user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {promoter.promotionCount} promotions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{promoter.totalViews} views</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {promoter.totalClicks} clicks
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Promotions */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Promotions</h3>
        <div className="space-y-4">
          {stats.topPromotions.map((promo, index) => (
            <div
              key={promo.promotion.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{promo.promotion.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(promo.promotion.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{promo.views} views</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {promo.engagementRate.toFixed(1)}% engagement
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 