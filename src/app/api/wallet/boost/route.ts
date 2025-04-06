// src/app/api/wallet/boost/route.ts
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId, amount } = await req.json();

  if (!postId || !amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
  });

  if (!wallet || wallet.balance < amount) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
  }

  // Deduct credits
  await prisma.wallet.update({
    where: { userId: session.user.id },
    data: {
      balance: { decrement: amount },
      history: {
        push: `Spent ${amount} credits to boost post ${postId}`,
      },
    },
  });

  // Mark post as boosted
  await prisma.post.update({
    where: { id: postId },
    data: { boosted: true },
  });

  return NextResponse.json({ success: true });
}
