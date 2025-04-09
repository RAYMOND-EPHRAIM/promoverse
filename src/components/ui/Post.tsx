'use client';

import { useState } from 'react';
import { Star, Zap, Share2, MoreHorizontal, Eye, MousePointer, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
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
  views: number;
  clicks: number;
  engagementRate: string;
  onStar: (id: string) => Promise<void>;
  onBoost: (id: string, level: number) => Promise<void>;
}

export function PostCard({
  id,
  title,
  description,
  imageUrl,
  author,
  createdAt,
  stars,
  isStarred,
  boostLevel,
  views,
  clicks,
  engagementRate,
  onStar,
  onBoost,
}: PostCardProps) {
  const router = useRouter();
  const [starred, setStarred] = useState(isStarred);
  const [starCount, setStarCount] = useState(stars);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    router.push(`/promotions/${id}`);
  };

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await onStar(id);
      setStarred(true);
      setStarCount(starCount + 1);
    } catch (error) {
      console.error('Error starring post:', error);
      toast.error('Failed to star post');
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
      console.error('Error boosting post:', error);
      toast.error('Failed to boost post');
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
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Eye size={14} />
            <span>{views} views</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <MousePointer size={14} />
            <span>{clicks} clicks</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <TrendingUp size={14} />
            <span>{engagementRate} engagement</span>
          </div>
        </div>

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