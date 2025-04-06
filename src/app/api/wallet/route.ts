// src/app/api/wallet/route.ts
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
  });

  if (!wallet) {
    // Create one if it doesn't exist
    const newWallet = await prisma.wallet.create({
      data: {
        userId: session.user.id,
        balance: 100, // 👈 Optional: give welcome credits
        history: [],
      },
    });
    return NextResponse.json(newWallet);
  }

  return NextResponse.json(wallet);
}
