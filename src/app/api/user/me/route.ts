import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return NextResponse.json(user);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const bio = formData.get('bio') as string;
  const image = formData.get('image') as File | null;

  let imageUrl: string | undefined;

  if (image) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}-${image.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads', filename);
    await writeFile(filePath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      username,
      bio,
      ...(imageUrl && { image: imageUrl }),
    },
  });

  return NextResponse.json(updated);
}
