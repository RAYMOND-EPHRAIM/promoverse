import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const promotion = await prisma.promotion.findUnique({
      where: { id: params.id },
      include: {
        analytics: true,
      },
    });

    if (!promotion) {
      return new NextResponse('Promotion not found', { status: 404 });
    }

    // Calculate engagement rate
    const engagementRate = promotion.analytics
      ? `${((promotion.analytics.clicks / promotion.analytics.views) * 100).toFixed(1)}%`
      : '0%';

    // Calculate boost effectiveness (views per hour)
    const boostEffectiveness = promotion.boostedAt
      ? `${Math.round(
          promotion.analytics?.views /
            ((Date.now() - new Date(promotion.boostedAt).getTime()) / (1000 * 60 * 60))
        )}`
      : 'N/A';

    return NextResponse.json({
      views: promotion.analytics?.views || 0,
      clicks: promotion.analytics?.clicks || 0,
      engagementRate,
      boostEffectiveness,
      boostLevel: promotion.boostLevel || 0,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { type, verseId, latitude, longitude } = body;

    const promotion = await prisma.promotion.findUnique({
      where: { id: params.id },
      include: {
        analytics: true,
      },
    });

    if (!promotion) {
      return new NextResponse('Promotion not found', { status: 404 });
    }

    // Update analytics
    if (type === 'view') {
      await prisma.analytics.upsert({
        where: { postId: params.id },
        update: {
          views: { increment: 1 },
        },
        create: {
          postId: params.id,
          views: 1,
          clicks: 0,
        },
      });
    } else if (type === 'click') {
      await prisma.analytics.upsert({
        where: { postId: params.id },
        update: {
          clicks: { increment: 1 },
        },
        create: {
          postId: params.id,
          views: 0,
          clicks: 1,
        },
      });
    }

    return new NextResponse('OK');
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 