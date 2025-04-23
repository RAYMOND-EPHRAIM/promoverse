// src/app/api/wallet/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            cosmicPoints: true,
            cosmicRank: true,
            badges: true,
          },
        },
      },
    });

    if (!wallet) {
      // Create a new wallet if one doesn't exist
      const newWallet = await prisma.wallet.create({
        data: {
          userId: session.user.id,
          balance: 0,
          history: [],
        },
        include: {
          user: {
            select: {
              cosmicPoints: true,
              cosmicRank: true,
              badges: true,
            },
          },
        },
      });
      return NextResponse.json(newWallet);
    }

    return NextResponse.json(wallet);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, type } = body;

    if (!amount || !type) {
      return NextResponse.json(
        { error: 'Amount and type are required' },
        { status: 400 }
      );
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => {
      // Update wallet balance
      const wallet = await tx.wallet.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          balance: amount,
          history: [{
            amount,
            type,
            timestamp: new Date(),
          }],
        },
        update: {
          balance: { increment: amount },
          history: {
            push: [{
              amount,
              type,
              timestamp: new Date(),
            }],
          },
        },
      });

      // Update user's cosmic points based on transaction type
      if (type === 'boost' || type === 'star') {
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            cosmicPoints: { increment: Math.abs(amount) },
          },
        });
      }

      return wallet;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json(
      { error: 'Failed to update wallet' },
      { status: 500 }
    );
  }
}
