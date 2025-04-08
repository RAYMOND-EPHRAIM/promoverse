import prisma from '@/lib/prisma';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'verse' | 'promotion' | 'social' | 'boost';
  threshold: number;
  reward: {
    cosmicPoints: number;
    badge?: string;
  };
}

interface UserProgress {
  achievementId: string;
  current: number;
  target: number;
  completed: boolean;
  completedAt?: Date;
}

export class AchievementService {
  private static instance: AchievementService;
  private achievements: Achievement[];

  private constructor() {
    this.achievements = [
      {
        id: 'verse-pioneer',
        name: 'Verse Pioneer',
        description: 'Create your first verse',
        icon: 'compass',
        category: 'verse',
        threshold: 1,
        reward: { cosmicPoints: 100, badge: 'verse-pioneer' },
      },
      {
        id: 'verse-master',
        name: 'Verse Master',
        description: 'Create 10 verses',
        icon: 'compass',
        category: 'verse',
        threshold: 10,
        reward: { cosmicPoints: 500, badge: 'verse-master' },
      },
      {
        id: 'promotion-novice',
        name: 'Promotion Novice',
        description: 'Create your first promotion',
        icon: 'megaphone',
        category: 'promotion',
        threshold: 1,
        reward: { cosmicPoints: 50, badge: 'promotion-novice' },
      },
      {
        id: 'promotion-expert',
        name: 'Promotion Expert',
        description: 'Create 50 promotions',
        icon: 'megaphone',
        category: 'promotion',
        threshold: 50,
        reward: { cosmicPoints: 1000, badge: 'promotion-expert' },
      },
      {
        id: 'social-butterfly',
        name: 'Social Butterfly',
        description: 'Receive 100 stars on your promotions',
        icon: 'star',
        category: 'social',
        threshold: 100,
        reward: { cosmicPoints: 300, badge: 'social-butterfly' },
      },
      {
        id: 'boost-champion',
        name: 'Boost Champion',
        description: 'Use 50 boosts',
        icon: 'zap',
        category: 'boost',
        threshold: 50,
        reward: { cosmicPoints: 800, badge: 'boost-champion' },
      },
    ];
  }

  public static getInstance(): AchievementService {
    if (!AchievementService.instance) {
      AchievementService.instance = new AchievementService();
    }
    return AchievementService.instance;
  }

  public getAchievements(): Achievement[] {
    return this.achievements;
  }

  public async getUserProgress(userId: string, metrics: any): Promise<UserProgress[]> {
    const progress: UserProgress[] = [];
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
    });

    for (const achievement of this.achievements) {
      const userAchievement = userAchievements.find(
        (ua) => ua.achievementId === achievement.id
      );

      let current = 0;
      switch (achievement.category) {
        case 'verse':
          current = metrics.verseCount;
          break;
        case 'promotion':
          current = metrics.promotionCount;
          break;
        case 'social':
          current = metrics.starCount;
          break;
        case 'boost':
          current = metrics.boostCount;
          break;
      }

      progress.push({
        achievementId: achievement.id,
        current,
        target: achievement.threshold,
        completed: current >= achievement.threshold,
        completedAt: userAchievement?.completedAt,
      });
    }

    return progress;
  }

  public async checkAndAwardAchievements(userId: string, metrics: any): Promise<void> {
    const progress = await this.getUserProgress(userId, metrics);
    const completedAchievements = progress.filter((p) => p.completed && !p.completedAt);

    if (completedAchievements.length === 0) return;

    for (const achievement of completedAchievements) {
      const achievementData = this.achievements.find(
        (a) => a.id === achievement.achievementId
      );

      if (!achievementData) continue;

      // Award achievement
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.achievementId,
          completedAt: new Date(),
        },
      });

      // Award cosmic points
      await prisma.user.update({
        where: { id: userId },
        data: {
          cosmicPoints: {
            increment: achievementData.reward.cosmicPoints,
          },
        },
      });

      // Award badge if exists
      if (achievementData.reward.badge) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            badges: {
              push: achievementData.reward.badge,
            },
          },
        });
      }
    }
  }
} 