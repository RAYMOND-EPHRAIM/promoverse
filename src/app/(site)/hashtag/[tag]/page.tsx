import { PostCard } from '@/components/ui/Post';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

interface HashtagPageProps {
  params: {
    tag: string;
  };
}

// Optional: SEO metadata for better visibility
export function generateMetadata({ params }: HashtagPageProps): Metadata {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `#${tag} | PromoVerse`,
    description: `Explore posts tagged with #${tag} on PromoVerse.`,
  };
}

export default async function HashtagPage({ params }: HashtagPageProps) {
  const tag = decodeURIComponent(params.tag);

  const posts = await prisma.post.findMany({
    where: {
      hashtags: {
        has: tag,
      },
    },
    orderBy: [
      { boosted: 'desc' },
      { createdAt: 'desc' },
    ],
    include: {
      author: {
        select: { username: true },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">#{tag}</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">No promos found for this hashtag yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post: typeof posts[0]) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
