// src/utils/algorithms.ts

export function calculateTrendingScore({
    likes,
    views,
    boosted,
    createdAt,
  }: {
    likes: number;
    views: number;
    boosted: boolean;
    createdAt: Date;
  }) {
    const hoursSincePost = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  
    const likeWeight = 3;
    const viewWeight = 1;
    const boostBonus = boosted ? 50 : 0;
    const timeDecay = Math.max(1, hoursSincePost); // older = lower score
  
    const score = ((likes * likeWeight + views * viewWeight + boostBonus) / timeDecay).toFixed(2);
  
    return parseFloat(score);
  }
  