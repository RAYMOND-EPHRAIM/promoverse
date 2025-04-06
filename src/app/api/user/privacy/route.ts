import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      publicProfile: true,
      allowDMs: true,
      allowTagging: true,
    },
  });

  return NextResponse.json(user);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const data = await req.json();

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      publicProfile: data.publicProfile,
      allowDMs: data.allowDMs,
      allowTagging: data.allowTagging,
    },
  });

  return NextResponse.json(updated);
}
