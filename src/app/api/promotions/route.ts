import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const content = formData.get('content') as string;
  const file = formData.get('media') as File | null;
  const draft = formData.get('draft') === 'true';
  const scheduledFor = formData.get('scheduledFor') as string;
  const category = formData.get('category') as string;
  const verses = JSON.parse(formData.get('verses') as string || '[]');

  if (!content) return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  if (!category) return NextResponse.json({ error: 'Category is required' }, { status: 400 });

  let mediaUrl = null;
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads', filename);
    await writeFile(filePath, buffer);
    mediaUrl = `/uploads/${filename}`;
  }

  const promotion = await prisma.promotion.create({
    data: {
      content,
      mediaUrl,
      verses,
      category,
      draft,
      published: !draft && !scheduledFor,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      authorId: session.user.id,
    },
  });

  return NextResponse.json(promotion);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const verse = searchParams.get('verse');
  const authorId = searchParams.get('authorId');
  const boosted = searchParams.get('boosted') === 'true';

  const where: any = {
    published: true,
    draft: false,
  };

  if (category && category !== 'All') {
    where.category = category;
  }

  if (verse) {
    where.verses = {
      has: verse,
    };
  }

  if (authorId) {
    where.authorId = authorId;
  }

  if (boosted) {
    where.boosted = true;
  }

  const promotions = await prisma.promotion.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      analytics: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(promotions);
} 