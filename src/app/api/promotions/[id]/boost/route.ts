import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkAndAwardBadges } from '@/services/badgeService';

const BOOST_LEVELS = [
  { level: 1, cost: 100, multiplier: 1.5 },
  { level: 2, cost: 250, multiplier: 2 },
  { level: 3, cost: 500, multiplier: 3 },
];

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { level } = await request.json();
    if (!level || level < 1 || level > 3) {
      return new NextResponse('Invalid boost level', { status: 400 });
    }

    const boostCost = level * 50; // $50 per level

    // Check if user has enough balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { walletBalance: true },
    });

    if (!user || user.walletBalance < boostCost) {
      return new NextResponse('Insufficient funds', { status: 400 });
    }

    // Perform the boost transaction
    const [updatedPromotion, updatedUser, transaction] = await prisma.$transaction([
      // Update promotion boost level
      prisma.promotion.update({
        where: { id: params.id },
        data: {
          boostLevel: level,
          boostedAt: new Date(),
        },
      }),
      // Update user's wallet balance
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          walletBalance: {
            decrement: boostCost,
          },
        },
      }),
      // Create transaction record
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          amount: -boostCost,
          type: 'BOOST',
          description: `Boosted promotion to level ${level}`,
        },
      }),
    ]);

    // Check for new badges after boost
    await checkAndAwardBadges(session.user.id);

    return NextResponse.json({
      promotion: updatedPromotion,
      balance: updatedUser.walletBalance,
      transaction,
    });
  } catch (error) {
    console.error('Error in boost route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 