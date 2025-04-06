// src/app/(site)/trending/page.tsx
import { PostCard } from '@/components/ui/Post';
import prisma from '@/lib/prisma';
import { calculateTrendingScore } from '@/utils/algorithms';

export default async function TrendingPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { username: true } },
      analytics: true,
    },
  });

  const sorted = posts
    .map((post) => ({
      ...post,
      trendingScore: calculateTrendingScore({
        likes: post.likes?.length || 0,
        views: post.analytics?.views || 0,
        boosted: post.boosted,
        createdAt: post.createdAt,
      }),
    }))
    .sort((a, b) => b.trendingScore - a.trendingScore);

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">🔥 Trending Promos</h1>

      {sorted.length === 0 ? (
        <p className="text-gray-400">No viral promos yet. Be the spark.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sorted.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
