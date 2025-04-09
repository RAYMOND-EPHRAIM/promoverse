// src/app/(site)/trending/page.tsx
import { PostCard } from '@/components/ui/Post';
import prisma from '@/lib/prisma';
import { calculateTrendingScore } from '@/utils/algorithms';

export default async function TrendingPage() {
  try {
    // First check if we can connect to the database
    await prisma.$connect();
    
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
        analytics: true,
      },
    });

    // Calculate trending scores and sort
    const postsWithScores = posts.map(post => ({
      ...post,
      trendingScore: calculateTrendingScore(post),
    })).sort((a, b) => b.trendingScore - a.trendingScore);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Trending Posts</h1>
        {postsWithScores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsWithScores.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                description={post.description}
                imageUrl={post.imageUrl}
                author={post.author}
                createdAt={post.createdAt.toISOString()}
                stars={post.stars}
                isStarred={post.isStarred}
                boostLevel={post.boostLevel}
                views={post.analytics?.views || 0}
                clicks={post.analytics?.clicks || 0}
                engagementRate={`${post.analytics?.engagementRate || 0}%`}
                onStar={async (id) => {
                  'use server';
                  await prisma.post.update({
                    where: { id },
                    data: { stars: { increment: 1 }, isStarred: true },
                  });
                }}
                onBoost={async (id, level) => {
                  'use server';
                  await prisma.post.update({
                    where: { id },
                    data: { boostLevel: level },
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600 dark:text-gray-400">
              No trending posts yet. Be the first to create one!
            </h2>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in TrendingPage:', error);
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl text-red-600 dark:text-red-400">
              Database connection error. Please check your environment variables.
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Make sure your DATABASE_URL is properly set in the .env file.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl text-red-600 dark:text-red-400">
            Error loading trending posts. Please try again later.
          </h2>
        </div>
      </div>
    );
  } finally {
    // Always disconnect from the database
    await prisma.$disconnect();
  }
}
