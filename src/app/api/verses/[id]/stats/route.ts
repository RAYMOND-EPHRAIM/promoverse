import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { VerseService } from '@/services/verseService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const verseService = VerseService.getInstance();
    const [stats, leaderboard] = await Promise.all([
      verseService.getVerseStats(params.id),
      verseService.getVerseLeaderboard(params.id),
    ]);

    return NextResponse.json({
      ...stats,
      ...leaderboard,
    });
  } catch (error) {
    console.error('Error getting verse stats:', error);
    return NextResponse.json(
      { error: 'Failed to get verse stats' },
      { status: 500 }
    );
  }
} 