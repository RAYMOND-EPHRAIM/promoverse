import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { type, verseId, latitude, longitude } = await request.json();
    
    // Get or create analytics record
    let analytics = await prisma.promotionAnalytics.findUnique({
      where: { promotionId: params.id },
    });

    if (!analytics) {
      analytics = await prisma.promotionAnalytics.create({
        data: {
          promotionId: params.id,
          verseViews: {},
          verseClicks: {},
          locationViews: {},
          locationClicks: {},
        },
      });
    }

    // Update base metrics
    const updateData: any = {};
    if (type === 'click') {
      updateData.clicks = { increment: 1 };
    } else {
      updateData.views = { increment: 1 };
    }

    // Update verse metrics
    if (verseId) {
      const verseKey = `verse_${verseId}`;
      const verseField = type === 'click' ? 'verseClicks' : 'verseViews';
      const currentVerseData = analytics[verseField] as Record<string, number>;
      const updatedVerseData = {
        ...currentVerseData,
        [verseKey]: (currentVerseData[verseKey] || 0) + 1,
      };

      await prisma.promotionAnalytics.update({
        where: { id: analytics.id },
        data: { [verseField]: updatedVerseData },
      });
    }

    // Update location metrics
    if (latitude && longitude) {
      const locationKey = `${latitude},${longitude}`;
      const locationField = type === 'click' ? 'locationClicks' : 'locationViews';
      const currentLocationData = analytics[locationField] as Record<string, number>;
      const updatedLocationData = {
        ...currentLocationData,
        [locationKey]: (currentLocationData[locationKey] || 0) + 1,
      };

      await prisma.promotionAnalytics.update({
        where: { id: analytics.id },
        data: { [locationField]: updatedLocationData },
      });
    }

    // Update promotion metrics
    await prisma.promotion.update({
      where: { id: params.id },
      data: updateData,
    });

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error('Error in analytics tracking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [promotion, analytics] = await Promise.all([
      prisma.promotion.findUnique({
        where: { id: params.id },
        select: {
          views: true,
          clicks: true,
          boostLevel: true,
          boostedAt: true,
          verse: {
            select: {
              id: true,
              name: true,
            },
          },
          location: {
            select: {
              latitude: true,
              longitude: true,
            },
          },
        },
      }),
      prisma.promotionAnalytics.findUnique({
        where: { promotionId: params.id },
      }),
    ]);

    if (!promotion) {
      return new NextResponse('Promotion not found', { status: 404 });
    }

    // Calculate engagement metrics
    const engagementRate = promotion.views > 0
      ? ((promotion.clicks / promotion.views) * 100).toFixed(1)
      : '0.0';

    // Calculate boost effectiveness
    let boostEffectiveness = 'N/A';
    if (promotion.boostLevel > 0 && promotion.boostedAt) {
      const boostDuration = Date.now() - new Date(promotion.boostedAt).getTime();
      const hoursSinceBoost = boostDuration / (1000 * 60 * 60);
      const viewsPerHour = promotion.views / hoursSinceBoost;
      boostEffectiveness = viewsPerHour.toFixed(1);
    }

    // Calculate verse engagement
    const verseEngagement = analytics?.verseViews
      ? Object.entries(analytics.verseViews as Record<string, number>)
          .map(([verseId, views]) => ({
            verseId: verseId.replace('verse_', ''),
            views,
            clicks: (analytics.verseClicks as Record<string, number>)[verseId] || 0,
          }))
      : [];

    // Calculate location engagement
    const locationEngagement = analytics?.locationViews
      ? Object.entries(analytics.locationViews as Record<string, number>)
          .map(([coordinates, views]) => {
            const [latitude, longitude] = coordinates.split(',').map(Number);
            return {
              latitude,
              longitude,
              views,
              clicks: (analytics.locationClicks as Record<string, number>)[coordinates] || 0,
            };
          })
      : [];

    return NextResponse.json({
      views: promotion.views,
      clicks: promotion.clicks,
      engagementRate: `${engagementRate}%`,
      boostEffectiveness,
      boostLevel: promotion.boostLevel,
      verse: promotion.verse,
      location: promotion.location,
      verseEngagement,
      locationEngagement,
    });
  } catch (error) {
    console.error('Error in analytics retrieval:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 