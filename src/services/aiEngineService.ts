import { prisma } from '@/lib/prisma';
import { Promotion, User } from '@prisma/client';

interface UserPreferences {
  interests: string[];
  preferredVerses: string[];
  engagementHistory: {
    promotionId: string;
    interactionType: 'view' | 'click' | 'star' | 'boost';
    timestamp: Date;
  }[];
}

interface Recommendation {
  promotion: Promotion;
  relevanceScore: number;
  matchReasons: string[];
}

export class AIEngineService {
  private static instance: AIEngineService;

  private constructor() {}

  public static getInstance(): AIEngineService {
    if (!AIEngineService.instance) {
      AIEngineService.instance = new AIEngineService();
    }
    return AIEngineService.instance;
  }

  private async getUserPreferences(userId: string): Promise<UserPreferences> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stars: {
          include: {
            promotion: true,
          },
        },
        promotions: {
          include: {
            analytics: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Extract interests from user's stars and created promotions
    const interests = new Set<string>();
    const preferredVerses = new Set<string>();
    const engagementHistory = [];

    // Process stars
    user.stars.forEach((star) => {
      if (star.promotion.verse) {
        preferredVerses.add(star.promotion.verse);
      }
      if (star.promotion.tags) {
        star.promotion.tags.forEach((tag) => interests.add(tag));
      }
      engagementHistory.push({
        promotionId: star.promotionId,
        interactionType: 'star',
        timestamp: star.createdAt,
      });
    });

    // Process created promotions
    user.promotions.forEach((promotion) => {
      if (promotion.verse) {
        preferredVerses.add(promotion.verse);
      }
      if (promotion.tags) {
        promotion.tags.forEach((tag) => interests.add(tag));
      }
      if (promotion.analytics) {
        engagementHistory.push({
          promotionId: promotion.id,
          interactionType: 'view',
          timestamp: promotion.analytics.lastViewedAt,
        });
      }
    });

    return {
      interests: Array.from(interests),
      preferredVerses: Array.from(preferredVerses),
      engagementHistory,
    };
  }

  private calculateRelevanceScore(
    promotion: Promotion,
    preferences: UserPreferences
  ): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Verse match
    if (promotion.verse && preferences.preferredVerses.includes(promotion.verse)) {
      score += 0.4;
      reasons.push(`Matches your preferred verse: ${promotion.verse}`);
    }

    // Tag matches
    const matchingTags = promotion.tags.filter((tag) =>
      preferences.interests.includes(tag)
    );
    if (matchingTags.length > 0) {
      score += 0.3 * (matchingTags.length / promotion.tags.length);
      reasons.push(`Matches your interests: ${matchingTags.join(', ')}`);
    }

    // Engagement history
    const userEngagement = preferences.engagementHistory.filter(
      (e) => e.promotionId === promotion.id
    );
    if (userEngagement.length > 0) {
      score += 0.2;
      reasons.push('You have previously engaged with this promotion');
    }

    // Boost level
    if (promotion.boostLevel > 0) {
      score += 0.1 * promotion.boostLevel;
      reasons.push('This promotion is boosted');
    }

    return { score, reasons };
  }

  public async getRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<Recommendation[]> {
    const preferences = await this.getUserPreferences(userId);
    const recentPromotions = await prisma.promotion.findMany({
      where: {
        OR: [
          { verse: { in: preferences.preferredVerses } },
          { tags: { hasSome: preferences.interests } },
        ],
        NOT: {
          authorId: userId, // Don't recommend user's own promotions
        },
      },
      include: {
        author: true,
        analytics: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Get more than needed to filter
    });

    const recommendations = recentPromotions
      .map((promotion) => {
        const { score, reasons } = this.calculateRelevanceScore(
          promotion,
          preferences
        );
        return {
          promotion,
          relevanceScore: score,
          matchReasons: reasons,
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    return recommendations;
  }

  public async getVerseRecommendations(
    userId: string,
    currentVerse: string
  ): Promise<string[]> {
    const preferences = await this.getUserPreferences(userId);
    
    // Get verses from user's engagement history
    const verseEngagement = new Map<string, number>();
    preferences.engagementHistory.forEach((engagement) => {
      const promotion = preferences.engagementHistory.find(
        (e) => e.promotionId === engagement.promotionId
      );
      if (promotion) {
        const count = verseEngagement.get(promotion.promotionId) || 0;
        verseEngagement.set(promotion.promotionId, count + 1);
      }
    });

    // Sort verses by engagement
    const sortedVerses = Array.from(verseEngagement.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([verse]) => verse)
      .filter((verse) => verse !== currentVerse);

    return sortedVerses.slice(0, 5); // Return top 5 recommended verses
  }
}
