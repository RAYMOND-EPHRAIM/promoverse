// src/app/api/analytics/[postId]/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;

    const analytics = await prisma.analytics.upsert({
      where: { postId },
      update: { views: { increment: 1 } },
      create: { postId, views: 1, clicks: 0 },
    });

    return NextResponse.json(analytics);
  } catch (err) {
    return NextResponse.json({ error: 'Analytics failed' }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const analytics = await prisma.analytics.findUnique({
      where: { postId: params.postId },
    });

    return NextResponse.json(analytics);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
