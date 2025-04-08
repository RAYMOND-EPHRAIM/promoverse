'use client';

import { CosmicProfile } from '@/components/ui/CosmicProfile';
import { Feed } from '@/components/ui/Feed';
import { Star, Users, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  // Mock data - replace with actual data fetching
  const user = {
    name: 'John Doe',
    username: 'johndoe',
    avatar: '/default-avatar.png',
    bio: 'Cosmic explorer and promotion enthusiast',
    joinDate: '2024-01-01',
    stats: {
      promotions: 42,
      stars: 156,
      followers: 1234,
    },
    cosmicPoints: 750,
    cosmicRank: 'Stargazer',
    badges: ['Early Adopter', 'Star Collector', 'Verse Explorer'],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-6">
          <Image
            src={user.avatar}
            alt={user.name}
            width={96}
            height={96}
            className="rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{user.bio}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{user.stats.followers.toLocaleString()} followers</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm">
          <div className="text-gray-600 dark:text-gray-400 mb-1">Promotions</div>
          <div className="text-2xl font-bold">{user.stats.promotions}</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm">
          <div className="text-gray-600 dark:text-gray-400 mb-1">Stars</div>
          <div className="text-2xl font-bold">{user.stats.stars}</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm">
          <div className="text-gray-600 dark:text-gray-400 mb-1">Followers</div>
          <div className="text-2xl font-bold">{user.stats.followers.toLocaleString()}</div>
        </div>
      </div>

      {/* Cosmic Profile */}
      <div className="mb-8">
        <CosmicProfile
          cosmicPoints={user.cosmicPoints}
          cosmicRank={user.cosmicRank}
          badges={user.badges}
        />
      </div>

      {/* Promotions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Promotions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feed />
        </div>
      </div>
    </div>
  );
}
