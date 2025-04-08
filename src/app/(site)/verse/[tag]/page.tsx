'use client';

import { Feed } from '@/components/ui/Feed';
import { ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const VERSE_ICONS: Record<string, string> = {
  musicverse: '🎵',
  eventverse: '🎉',
  artverse: '🎨',
  techverse: '💻',
};

const VERSE_COLORS: Record<string, string> = {
  musicverse: 'bg-purple-100 dark:bg-purple-900',
  eventverse: 'bg-blue-100 dark:bg-blue-900',
  artverse: 'bg-pink-100 dark:bg-pink-900',
  techverse: 'bg-green-100 dark:bg-green-900',
};

export default function VersePage() {
  const params = useParams();
  const tag = params.tag as string;
  const verseName = tag.charAt(0).toUpperCase() + tag.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/discoververse"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft size={16} />
          Back to DiscoverVerse
        </Link>
        <div className={`${VERSE_COLORS[tag]} p-6 rounded-xl mb-4`}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{VERSE_ICONS[tag]}</div>
            <div>
              <h1 className="text-3xl font-bold">{verseName}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore promotions in the {verseName} universe
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Promotions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Star size={20} className="text-yellow-500" />
          Featured Promotions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feed />
        </div>
      </div>

      {/* Recent Promotions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Promotions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feed />
        </div>
      </div>
    </div>
  );
} 