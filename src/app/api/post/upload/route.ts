import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File;

    if (!title || !description || !image) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Save image to public/uploads directory
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${image.name}`;
    const path = join(process.cwd(), 'public/uploads', filename);
    await writeFile(path, buffer);

    // Create post in database
    const post = await prisma.promotion.create({
      data: {
        title,
        description,
        imageUrl: `/uploads/${filename}`,
        authorId: session.user.id,
        content: description, // Using description as content for now
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in post upload:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 