'use client';

import { Star, MessageCircle, Share2, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

interface PromotionCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: {
    username: string;
    avatar: string;
  };
  verse: string;
  stats: {
    stars: number;
    comments: number;
    shares: number;
    views: number;
  };
  boostLevel?: number;
  cosmicPoints?: number;
}

export function PromotionCard({
  id,
  title,
  description,
  imageUrl,
  author,
  verse,
  stats,
  boostLevel = 0,
  cosmicPoints = 0,
}: PromotionCardProps) {
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(stats.stars);

  const handleStar = async () => {
    try {
      const response = await fetch(`/api/promotions/${id}/star`, {
        method: 'POST',
      });
      if (response.ok) {
        setIsStarred(!isStarred);
        setStarCount(prev => isStarred ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error starring promotion:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/profile/${author.username}`} className="flex items-center gap-2">
            <Image
              src={author.avatar}
              alt={author.username}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-medium">{author.username}</span>
          </Link>
          <Link
            href={`/verse/${verse.toLowerCase()}`}
            className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded-full text-sm"
          >
            {verse}
          </Link>
        </div>
        <Link href={`/promotions/${id}`}>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{description}</p>
        </Link>
      </div>

      {/* Image */}
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        {boostLevel > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
            <Zap size={14} />
            <span>Level {boostLevel}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleStar}
              className={`flex items-center gap-1 ${
                isStarred ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Star size={18} fill={isStarred ? 'currentColor' : 'none'} />
              <span>{starCount}</span>
            </button>
            <Link
              href={`/promotions/${id}#comments`}
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400"
            >
              <MessageCircle size={18} />
              <span>{stats.comments}</span>
            </Link>
            <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Share2 size={18} />
              <span>{stats.shares}</span>
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {stats.views.toLocaleString()} views
          </div>
        </div>

        {/* Cosmic Points */}
        {cosmicPoints > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span className="text-purple-500">{cosmicPoints} Cosmic Points</span>
          </div>
        )}
      </div>
    </div>
  );
} 