import prisma from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.post.update({
    where: { id: params.id },
    data: { flagged: false },
  });

  return NextResponse.redirect('/admin/reports');
}
