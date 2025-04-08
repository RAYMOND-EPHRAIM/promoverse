import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { checkAndAwardBadges } from '@/services/badgeService';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { amount } = await request.json();
    if (!amount || amount <= 0) {
      return new NextResponse('Invalid amount', { status: 400 });
    }

    // Perform the deposit transaction
    const [user, transaction] = await prisma.$transaction([
      // Update user's wallet balance
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          walletBalance: {
            increment: amount,
          },
        },
      }),
      // Create transaction record
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          amount,
          type: 'DEPOSIT',
          description: 'Wallet deposit',
        },
      }),
    ]);

    // Check for new badges after deposit
    await checkAndAwardBadges(session.user.id);

    return NextResponse.json({
      balance: user.walletBalance,
      transaction,
    });
  } catch (error) {
    console.error('Error in deposit route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
