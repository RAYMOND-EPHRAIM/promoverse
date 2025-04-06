// src/app/api/post/[id]/comment/route.ts
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: 'Missing comment' }, { status: 400 });

  const comment = await prisma.comment.create({
    data: {
      text,
      authorId: session.user.id,
      postId: params.id,
    },
    include: { author: { select: { username: true } } },
  });

  return NextResponse.json(comment);
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const comments = await prisma.comment.findMany({
    where: { postId: params.id },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(comments);
}
