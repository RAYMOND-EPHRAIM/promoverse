'use client';

import { Feed } from '@/components/ui/Feed';
import { Star, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';

export default function StarMap() {
  const [timeRange, setTimeRange] = useState('today');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Star className="text-yellow-500" size={24} />
          StarMap
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover the most stellar promotions across the cosmos
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-2 mb-8">
        {['today', 'week', 'month', 'all'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg transition ${
              timeRange === range
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Trending Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Rising Stars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feed />
        </div>
      </div>

      {/* Most Boosted */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap size={20} className="text-yellow-500" />
          Supernova Promotions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feed />
        </div>
      </div>

      {/* Cosmic Leaders */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Star size={20} className="text-yellow-500" />
          Cosmic Leaders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feed />
        </div>
      </div>
    </div>
  );
} 