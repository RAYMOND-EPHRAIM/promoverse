import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const promotionId = params.id;
    const userId = session.user.id;

    // Check if the user has already starred this promotion
    const existingStar = await prisma.star.findUnique({
      where: {
        userId_promotionId: {
          userId,
          promotionId,
        },
      },
    });

    if (existingStar) {
      // Remove the star
      await prisma.star.delete({
        where: {
          userId_promotionId: {
            userId,
            promotionId,
          },
        },
      });

      // Update promotion star count
      await prisma.promotion.update({
        where: { id: promotionId },
        data: {
          starCount: {
            decrement: 1,
          },
        },
      });

      // Award cosmic points for unstarring (smaller amount)
      await prisma.user.update({
        where: { id: userId },
        data: {
          cosmicPoints: {
            increment: 1,
          },
        },
      });
    } else {
      // Add a new star
      await prisma.star.create({
        data: {
          userId,
          promotionId,
        },
      });

      // Update promotion star count
      await prisma.promotion.update({
        where: { id: promotionId },
        data: {
          starCount: {
            increment: 1,
          },
        },
      });

      // Award cosmic points for starring
      await prisma.user.update({
        where: { id: userId },
        data: {
          cosmicPoints: {
            increment: 5,
          },
        },
      });
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error('Error in star route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 