// src/app/api/wallet/boost/route.ts
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

const BOOST_LEVELS = [
  { cost: 25, multiplier: 1.5 },  // Level 1
  { cost: 50, multiplier: 2.0 },  // Level 2
  { cost: 100, multiplier: 3.0 }, // Level 3
  { cost: 200, multiplier: 4.0 }, // Level 4
  { cost: 500, multiplier: 5.0 }, // Level 5
];

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { promotionId, amount } = await req.json();
  if (!promotionId || !amount) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Get user's wallet
  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
  });

  if (!wallet || wallet.balance < amount) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
  }

  // Get current promotion boost level
  const promotion = await prisma.promotion.findUnique({
    where: { id: promotionId },
    select: { boostLevel: true },
  });

  if (!promotion) {
    return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
  }

  // Calculate new boost level
  const currentLevel = promotion.boostLevel || 0;
  const newLevel = Math.min(currentLevel + 1, BOOST_LEVELS.length - 1);
  const boostCost = BOOST_LEVELS[newLevel].cost;

  if (amount < boostCost) {
    return NextResponse.json(
      { error: `Minimum boost amount is ${boostCost} credits` },
      { status: 400 }
    );
  }

  // Update wallet and promotion
  const [updatedWallet, updatedPromotion] = await Promise.all([
    prisma.wallet.update({
      where: { userId: session.user.id },
      data: {
        balance: {
          decrement: amount,
        },
        history: {
          push: {
            type: 'boost',
            amount: -amount,
            promotionId,
            timestamp: new Date(),
          },
        },
      },
    }),
    prisma.promotion.update({
      where: { id: promotionId },
      data: {
        boosted: true,
        boostLevel: newLevel,
      },
    }),
  ]);

  // Award cosmic points for boosting
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      cosmicPoints: {
        increment: Math.floor(amount / 10), // 1 point per 10 credits spent
      },
    },
  });

  return NextResponse.json({
    success: true,
    boostLevel: newLevel,
    remainingBalance: updatedWallet.balance,
  });
}
