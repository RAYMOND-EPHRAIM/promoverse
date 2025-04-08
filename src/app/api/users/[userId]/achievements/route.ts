import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AchievementService } from '@/services/achievementService';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.userId;

    // Fetch user data with related metrics
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        verses: true,
        promotions: true,
        stars: true,
        boosts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate metrics
    const metrics = {
      verseCount: user.verses.length,
      promotionCount: user.promotions.length,
      starCount: user.stars.length,
      boostCount: user.boosts.length,
    };

    // Get achievements and progress
    const achievementService = AchievementService.getInstance();
    const achievements = achievementService.getAchievements();
    const progress = await achievementService.getUserProgress(userId, metrics);

    return NextResponse.json({
      achievements,
      progress,
      metrics,
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 