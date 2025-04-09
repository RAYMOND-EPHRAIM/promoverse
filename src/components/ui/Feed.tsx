// src/components/ui/Feed.tsx
'use client';

import PromotionCard from './PromotionCard';
import { useState } from 'react';

// Mock data - replace with actual data fetching
const mockPromotions = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'Join us for the biggest music festival of the year!',
    imageUrl: '/festival.jpg',
    author: {
      name: 'MusicVerse Team',
      username: 'musicverse',
      avatar: '/default-avatar.png',
    },
    createdAt: new Date().toISOString(),
    stars: 156,
    isStarred: false,
    boostLevel: 2,
    onStar: async () => {},
    onBoost: async () => {},
  },
  {
    id: '2',
    title: 'Tech Conference 2024',
    description: 'The future of technology starts here.',
    imageUrl: '/conference.jpg',
    author: {
      name: 'TechVerse Team',
      username: 'techverse',
      avatar: '/default-avatar.png',
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    stars: 89,
    isStarred: false,
    boostLevel: 1,
    onStar: async () => {},
    onBoost: async () => {},
  },
  {
    id: '3',
    title: 'Art Exhibition',
    description: 'Contemporary art from emerging artists.',
    imageUrl: '/art.jpg',
    author: {
      name: 'ArtVerse Team',
      username: 'artverse',
      avatar: '/default-avatar.png',
    },
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    stars: 67,
    isStarred: false,
    boostLevel: 0,
    onStar: async () => {},
    onBoost: async () => {},
  },
];

export function Feed() {
  const [promotions, setPromotions] = useState(mockPromotions);

  const handleStar = async (promotionId: string) => {
    try {
      const response = await fetch(`/api/promotions/${promotionId}/star`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setPromotions(prevPromotions =>
          prevPromotions.map(promotion =>
            promotion.id === promotionId
              ? { ...promotion, isStarred: true, stars: promotion.stars + 1 }
              : promotion
          )
        );
      }
    } catch (error) {
      console.error('Error starring promotion:', error);
    }
  };

  const handleBoost = async (promotionId: string, level: number) => {
    try {
      const response = await fetch(`/api/promotions/${promotionId}/boost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level }),
      });
      
      if (response.ok) {
        setPromotions(prevPromotions =>
          prevPromotions.map(promotion =>
            promotion.id === promotionId
              ? { ...promotion, boostLevel: level }
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
          onStar={() => handleStar(promotion.id)}
          onBoost={(id, level) => handleBoost(id, level)}
        />
      ))}
    </div>
  );
}
