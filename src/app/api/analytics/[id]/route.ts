import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const analytics = await prisma.analytics.findUnique({
      where: { postId: params.id },
      include: {
        post: {
          select: {
            verse: true,
            location: true,
          },
        },
      },
    });

    if (!analytics) {
      // Create default analytics if none exist
      const newAnalytics = await prisma.analytics.create({
        data: {
          postId: params.id,
          views: 0,
          clicks: 0,
          engagementRate: 0,
        },
        include: {
          post: {
            select: {
              verse: true,
              location: true,
            },
          },
        },
      });
      return NextResponse.json(newAnalytics);
    }

    // Calculate engagement rate
    const engagementRate = analytics.clicks > 0 
      ? ((analytics.clicks / analytics.views) * 100).toFixed(1) + '%'
      : '0%';

    return NextResponse.json({
      ...analytics,
      engagementRate,
      boostEffectiveness: analytics.post?.boostedAt 
        ? `${(analytics.views / (Date.now() - analytics.post.boostedAt.getTime()) * 3600000).toFixed(1)}`
        : 'N/A',
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, verseId, latitude, longitude } = body;

    // Update basic analytics
    const analytics = await prisma.analytics.upsert({
      where: { postId: params.id },
      create: {
        postId: params.id,
        views: type === 'view' ? 1 : 0,
        clicks: type === 'click' ? 1 : 0,
        engagementRate: 0,
      },
      update: {
        views: type === 'view' ? { increment: 1 } : undefined,
        clicks: type === 'click' ? { increment: 1 } : undefined,
      },
    });

    // Update promotion analytics if verse or location data exists
    if (verseId || (latitude && longitude)) {
      await prisma.promotionAnalytics.upsert({
        where: { promotionId: params.id },
        create: {
          promotionId: params.id,
          verseViews: verseId ? { [verseId]: type === 'view' ? 1 : 0 } : {},
          verseClicks: verseId ? { [verseId]: type === 'click' ? 1 : 0 } : {},
          locationViews: latitude && longitude 
            ? { [`${latitude},${longitude}`]: type === 'view' ? 1 : 0 }
            : {},
          locationClicks: latitude && longitude
            ? { [`${latitude},${longitude}`]: type === 'click' ? 1 : 0 }
            : {},
        },
        update: {
          verseViews: verseId ? {
            increment: { [verseId]: type === 'view' ? 1 : 0 }
          } : undefined,
          verseClicks: verseId ? {
            increment: { [verseId]: type === 'click' ? 1 : 0 }
          } : undefined,
          locationViews: latitude && longitude ? {
            increment: { [`${latitude},${longitude}`]: type === 'view' ? 1 : 0 }
          } : undefined,
          locationClicks: latitude && longitude ? {
            increment: { [`${latitude},${longitude}`]: type === 'click' ? 1 : 0 }
          } : undefined,
        },
      });
    }

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error updating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to update analytics' },
      { status: 500 }
    );
  }
} 