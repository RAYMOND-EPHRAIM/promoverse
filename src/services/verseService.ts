import { prisma } from '@/lib/prisma';
import { Promotion, User } from '@prisma/client';

interface VerseStats {
  totalPromotions: number;
  totalViews: number;
  totalClicks: number;
  engagementRate: number;
  topTags: string[];
  activeUsers: number;
}

interface VerseRecommendation {
  verseId: string;
  name: string;
  description: string;
  relevanceScore: number;
  matchReasons: string[];
}

export class VerseService {
  private static instance: VerseService;

  private constructor() {}

  public static getInstance(): VerseService {
    if (!VerseService.instance) {
      VerseService.instance = new VerseService();
    }
    return VerseService.instance;
  }

  public async getVerseStats(verseId: string): Promise<VerseStats> {
    const promotions = await prisma.promotion.findMany({
      where: { verse: verseId },
      include: {
        analytics: true,
        author: true,
      },
    });

    const stats: VerseStats = {
      totalPromotions: promotions.length,
      totalViews: 0,
      totalClicks: 0,
      engagementRate: 0,
      topTags: [],
      activeUsers: 0,
    };

    const tagCounts = new Map<string, number>();
    const activeUserIds = new Set<string>();

    promotions.forEach((promotion) => {
      if (promotion.analytics) {
        stats.totalViews += promotion.analytics.views;
        stats.totalClicks += promotion.analytics.clicks;
      }
      if (promotion.authorId) {
        activeUserIds.add(promotion.authorId);
      }
      promotion.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    stats.activeUsers = activeUserIds.size;
    stats.engagementRate = stats.totalViews > 0 
      ? (stats.totalClicks / stats.totalViews) * 100 
      : 0;

    // Get top 5 tags
    stats.topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    return stats;
  }

  public async getVerseRecommendations(
    userId: string,
    currentVerse: string
  ): Promise<VerseRecommendation[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stars: {
          include: {
            promotion: true,
          },
        },
        promotions: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get all verses from user's engagement
    const verseEngagement = new Map<string, number>();
    const verseTags = new Map<string, Set<string>>();

    // Process stars
    user.stars.forEach((star) => {
      if (star.promotion.verse) {
        const count = verseEngagement.get(star.promotion.verse) || 0;
        verseEngagement.set(star.promotion.verse, count + 1);
        
        if (!verseTags.has(star.promotion.verse)) {
          verseTags.set(star.promotion.verse, new Set());
        }
        star.promotion.tags.forEach((tag) => 
          verseTags.get(star.promotion.verse)?.add(tag)
        );
      }
    });

    // Process created promotions
    user.promotions.forEach((promotion) => {
      if (promotion.verse) {
        const count = verseEngagement.get(promotion.verse) || 0;
        verseEngagement.set(promotion.verse, count + 1);
        
        if (!verseTags.has(promotion.verse)) {
          verseTags.set(promotion.verse, new Set());
        }
        promotion.tags.forEach((tag) => 
          verseTags.get(promotion.verse)?.add(tag)
        );
      }
    });

    // Get all verses
    const allVerses = await prisma.verse.findMany();
    
    // Calculate recommendations
    const recommendations = allVerses
      .filter((verse) => verse.id !== currentVerse)
      .map((verse) => {
        const engagementScore = verseEngagement.get(verse.id) || 0;
        const tagOverlap = verseTags.has(verse.id) 
          ? Array.from(verseTags.get(verse.id) || []).length 
          : 0;
        
        const score = (engagementScore * 0.6) + (tagOverlap * 0.4);
        const reasons: string[] = [];

        if (engagementScore > 0) {
          reasons.push(`You've engaged with ${engagementScore} promotions in this verse`);
        }
        if (tagOverlap > 0) {
          reasons.push(`Shares ${tagOverlap} tags with your interests`);
        }

        return {
          verseId: verse.id,
          name: verse.name,
          description: verse.description,
          relevanceScore: score,
          matchReasons: reasons,
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);

    return recommendations;
  }

  public async getTrendingVerses(limit: number = 5): Promise<VerseStats[]> {
    const verses = await prisma.verse.findMany({
      include: {
        promotions: {
          include: {
            analytics: true,
          },
        },
      },
    });

    const verseStats = await Promise.all(
      verses.map((verse) => this.getVerseStats(verse.id))
    );

    return verseStats
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, limit);
  }

  public async getVerseLeaderboard(verseId: string): Promise<{
    topPromoters: Array<{
      user: User;
      promotionCount: number;
      totalViews: number;
      totalClicks: number;
    }>;
    topPromotions: Array<{
      promotion: Promotion;
      views: number;
      clicks: number;
      engagementRate: number;
    }>;
  }> {
    const promotions = await prisma.promotion.findMany({
      where: { verse: verseId },
      include: {
        analytics: true,
        author: true,
      },
    });

    // Calculate top promoters
    const promoterStats = new Map<string, {
      user: User;
      promotionCount: number;
      totalViews: number;
      totalClicks: number;
    }>();

    promotions.forEach((promotion) => {
      if (!promotion.author) return;

      const stats = promoterStats.get(promotion.authorId) || {
        user: promotion.author,
        promotionCount: 0,
        totalViews: 0,
        totalClicks: 0,
      };

      stats.promotionCount++;
      if (promotion.analytics) {
        stats.totalViews += promotion.analytics.views;
        stats.totalClicks += promotion.analytics.clicks;
      }

      promoterStats.set(promotion.authorId, stats);
    });

    // Calculate top promotions
    const promotionStats = promotions
      .filter((p) => p.analytics)
      .map((promotion) => ({
        promotion,
        views: promotion.analytics?.views || 0,
        clicks: promotion.analytics?.clicks || 0,
        engagementRate: promotion.analytics?.views
          ? (promotion.analytics.clicks / promotion.analytics.views) * 100
          : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    return {
      topPromoters: Array.from(promoterStats.values())
        .sort((a, b) => b.totalViews - a.totalViews)
        .slice(0, 10),
      topPromotions: promotionStats,
    };
  }
} 