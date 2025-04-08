// src/components/ui/Feed.tsx
'use client';

import { PromotionCard } from './PromotionCard';
import { useState } from 'react';

// Mock data - replace with actual data fetching
const mockPromotions = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'Join us for the biggest music festival of the year!',
    imageUrl: '/festival.jpg',
    author: {
      username: 'musicverse',
      avatar: '/default-avatar.png',
    },
    verse: 'MusicVerse',
    stats: {
      stars: 156,
      comments: 42,
      shares: 23,
      views: 1234,
    },
    boostLevel: 2,
    cosmicPoints: 50,
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    description: 'The future of technology starts here.',
    imageUrl: '/conference.jpg',
    author: {
      username: 'techverse',
      avatar: '/default-avatar.png',
    },
    verse: 'TechVerse',
    stats: {
      stars: 89,
      comments: 31,
      shares: 15,
      views: 876,
    },
    boostLevel: 1,
    cosmicPoints: 30,
  },
  {
    id: '3',
    title: 'Art Exhibition',
    description: 'Contemporary art from emerging artists.',
    imageUrl: '/art.jpg',
    author: {
      username: 'artverse',
      avatar: '/default-avatar.png',
    },
    verse: 'ArtVerse',
    stats: {
      stars: 67,
      comments: 28,
      shares: 12,
      views: 654,
    },
    boostLevel: 0,
    cosmicPoints: 20,
  },
];

export function Feed() {
  const [promotions, setPromotions] = useState(mockPromotions);

  const handleBoost = async (promotionId: string) => {
    try {
      const response = await fetch(`/api/promotions/${promotionId}/boost`, {
        method: 'POST',
      });
      
      if (response.ok) {
        // Update the local state to reflect the boost
        setPromotions(prevPromotions =>
          prevPromotions.map(promotion =>
            promotion.id === promotionId
              ? { ...promotion, boostLevel: (promotion.boostLevel || 0) + 1 }
              : promotion
          )
        );
      }
    } catch (error) {
      console.error('Error boosting promotion:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {promotions.map((promotion) => (
        <PromotionCard
          key={promotion.id}
          {...promotion}
          onBoost={() => handleBoost(promotion.id)}
        />
      ))}
    </div>
  );
}
