'use client';

import { Star, Zap, Trophy, Award } from 'lucide-react';

interface CosmicProfileProps {
  cosmicPoints: number;
  cosmicRank: string;
  badges: string[];
}

const RANK_THRESHOLDS = [
  { rank: 'Novice', points: 0 },
  { rank: 'Explorer', points: 100 },
  { rank: 'Stargazer', points: 500 },
  { rank: 'Cosmic Pioneer', points: 1000 },
  { rank: 'Galactic Master', points: 5000 },
];

const BADGE_ICONS: Record<string, React.ReactNode> = {
  'Early Adopter': <Star className="text-yellow-500" size={16} />,
  'Star Collector': <Star className="text-yellow-500" size={16} />,
  'Boost Master': <Zap className="text-yellow-500" size={16} />,
  'Verse Explorer': <Award className="text-blue-500" size={16} />,
  'Cosmic Creator': <Trophy className="text-purple-500" size={16} />,
};

export function CosmicProfile({ cosmicPoints, cosmicRank, badges }: CosmicProfileProps) {
  const nextRank = RANK_THRESHOLDS.find(threshold => threshold.points > cosmicPoints);
  const progress = nextRank
    ? (cosmicPoints / nextRank.points) * 100
    : 100;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
      {/* Cosmic Points and Rank */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Cosmic Status</h3>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500" size={16} />
            <span className="font-medium">{cosmicPoints} Points</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Current Rank</span>
            <span className="font-medium">{cosmicRank}</span>
          </div>
          {nextRank && (
            <>
              <div className="h-2 bg-gray-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Next Rank</span>
                <span className="font-medium">
                  {nextRank.rank} ({nextRank.points - cosmicPoints} points needed)
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Cosmic Badges</h3>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
            >
              {BADGE_ICONS[badge]}
              <span className="text-sm">{badge}</span>
            </div>
          ))}
          {badges.length === 0 && (
            <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-4">
              No badges yet. Keep exploring to earn them!
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 