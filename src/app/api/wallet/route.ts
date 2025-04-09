// src/app/api/wallet/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user with wallet and transactions
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        wallet: true,
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Use wallet balance if exists, otherwise use user's walletBalance
    const balance = user.wallet?.balance || user.walletBalance;

    return NextResponse.json({
      balance,
      transactions: user.transactions,
    });
  } catch (error) {
    console.error('Error in wallet route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
