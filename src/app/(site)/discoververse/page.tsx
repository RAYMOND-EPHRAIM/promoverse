'use client';

import { Feed } from '@/components/ui/Feed';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function DiscoverVerse() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">DiscoverVerse</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore promotions across different cosmic verses
        </p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search promotions, verses, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-neutral-800 dark:text-white"
          />
        </div>
        <Link
          href="/promotions/new"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <span>Create Promotion</span>
          <span className="text-xl">🚀</span>
        </Link>
      </div>

      {/* Featured Verses */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Filter size={20} />
          Featured Verses
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'MusicVerse', icon: '🎵', color: 'bg-purple-100 dark:bg-purple-900' },
            { name: 'EventVerse', icon: '🎉', color: 'bg-blue-100 dark:bg-blue-900' },
            { name: 'ArtVerse', icon: '🎨', color: 'bg-pink-100 dark:bg-pink-900' },
            { name: 'TechVerse', icon: '💻', color: 'bg-green-100 dark:bg-green-900' },
          ].map((verse) => (
            <Link
              key={verse.name}
              href={`/verse/${verse.name.toLowerCase()}`}
              className={`${verse.color} p-4 rounded-xl hover:opacity-90 transition`}
            >
              <div className="text-3xl mb-2">{verse.icon}</div>
              <h3 className="font-medium">{verse.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Promotions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Trending Promotions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feed />
        </div>
      </div>

      {/* Boosted Promotions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Boosted Promotions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feed />
        </div>
      </div>
    </div>
  );
} 