import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const content = formData.get('content') as string;
  const file = formData.get('media') as File;
  const draft = formData.get('draft') === 'true';
  const scheduledFor = formData.get('scheduledFor') as string;

  if (!content || !file) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public/uploads', filename);
  await writeFile(filePath, buffer);

  const hashtags = content.match(/#\w+/g)?.map(tag => tag.replace('#', '')) || [];

  const post = await prisma.post.create({
    data: {
      content,
      mediaUrl: `/uploads/${filename}`,
      hashtags,
      draft,
      published: !draft && !scheduledFor,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      authorId: session.user.id,
    },
  });

  return NextResponse.json(post);
}
