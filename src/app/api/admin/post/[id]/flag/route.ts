// src/app/api/admin/post/[id]/flag/route.ts
import prisma from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.post.update({
    where: { id: params.id },
    data: {
      content: `[FLAGGED] ${Date.now()} — ${params.id}`,
    },
  });

  return NextResponse.redirect('/admin/posts');
}
