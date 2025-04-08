'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Crown, Rocket, Users, Target, CheckCircle2 } from 'lucide-react';
import { Achievement, UserProgress } from '@/services/achievementService';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  type: 'verse' | 'promotion' | 'engagement' | 'social';
  criteria: {
    threshold: number;
    metric: string;
  };
}

interface AchievementsProps {
  achievements: Achievement[];
  progress: UserProgress[];
  metrics: {
    verseCount: number;
    promotionCount: number;
    starCount: number;
    boostCount: number;
  };
}

const ACHIEVEMENT_ICONS: Record<string, React.ReactNode> = {
  verse_explorer: <Trophy className="w-6 h-6 text-yellow-500" />,
  promotion_master: <Rocket className="w-6 h-6 text-blue-500" />,
  star_collector: <Star className="w-6 h-6 text-yellow-400" />,
  boost_champion: <Zap className="w-6 h-6 text-purple-500" />,
  verse_leader: <Crown className="w-6 h-6 text-orange-500" />,
};

const CATEGORY_ICONS = {
  verse: <Trophy className="w-5 h-5" />,
  promotion: <Star className="w-5 h-5" />,
  social: <Users className="w-5 h-5" />,
  boost: <Zap className="w-5 h-5" />,
};

export function Achievements({ achievements, progress, metrics }: AchievementsProps) {
  const getProgress = (achievementId: string) => {
    return progress.find(p => p.achievementId === achievementId)?.progress || 0;
  };

  const getCategoryAchievements = (category: string) => {
    return achievements.filter(a => a.category === category);
  };

  return (
    <div className="space-y-8">
      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-background rounded-lg border">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Verses</span>
          </div>
          <p className="text-2xl font-bold mt-2">{metrics.verseCount}</p>
        </div>
        <div className="p-4 bg-background rounded-lg border">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Promotions</span>
          </div>
          <p className="text-2xl font-bold mt-2">{metrics.promotionCount}</p>
        </div>
        <div className="p-4 bg-background rounded-lg border">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Stars</span>
          </div>
          <p className="text-2xl font-bold mt-2">{metrics.starCount}</p>
        </div>
        <div className="p-4 bg-background rounded-lg border">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Boosts</span>
          </div>
          <p className="text-2xl font-bold mt-2">{metrics.boostCount}</p>
        </div>
      </div>

      {/* Achievement Categories */}
      {Object.keys(CATEGORY_ICONS).map(category => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            {CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}
            <h3 className="text-lg font-semibold capitalize">{category} Achievements</h3>
          </div>
          <div className="grid gap-4">
            {getCategoryAchievements(category).map(achievement => {
              const currentProgress = getProgress(achievement.id);
              const progressPercentage = Math.min(
                (currentProgress / achievement.threshold) * 100,
                100
              );
              const isCompleted = currentProgress >= achievement.threshold;

              return (
                <div
                  key={achievement.id}
                  className="p-4 bg-background rounded-lg border"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{achievement.name}</h4>
                        {isCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {currentProgress} / {achievement.threshold}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        +{achievement.reward.points} points
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 