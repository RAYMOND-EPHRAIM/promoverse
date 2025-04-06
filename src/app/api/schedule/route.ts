import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    if (req.headers.get('x-cron-key') !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

  try {
    const now = new Date();

    const duePosts = await prisma.post.findMany({
      where: {
        draft: false,
        published: false,
        scheduledFor: {
          lte: now,
        },
      },
    });

    if (!duePosts.length) {
      return NextResponse.json({ message: 'No scheduled posts to publish.' });
    }

    const updates = await Promise.all(
      duePosts.map((post) =>
        prisma.post.update({
          where: { id: post.id },
          data: { published: true },
        })
      )
    );

    return NextResponse.json({
      message: `Published ${updates.length} scheduled posts.`,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Scheduler failed' }, { status: 500 });
  }
}
