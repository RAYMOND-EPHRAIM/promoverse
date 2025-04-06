// src/app/api/post/[id]/like/route.ts
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { notifyUser } from '@/lib/notify';

if (liked) {
  await notifyUser({
    userId: post.authorId,
    actorId: session.user.id,
    postId: post.id,
    type: 'like',
  });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const postId = params.id;
  const userId = session.user.id;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  const alreadyLiked = post.likes.includes(userId);
  const updatedLikes = alreadyLiked
    ? post.likes.filter((id) => id !== userId)
    : [...post.likes, userId];

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { likes: updatedLikes },
  });

  return NextResponse.json({ liked: !alreadyLiked, count: updated.likes.length });
}
