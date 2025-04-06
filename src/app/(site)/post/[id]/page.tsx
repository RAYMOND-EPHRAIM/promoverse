import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/ui/Post';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { author: true },
  });

  if (!post) return {};

  return {
    title: `${post.author.username} | PromoVerse`,
    description: post.content.slice(0, 100),
    openGraph: {
      title: `Promo by @${post.author.username}`,
      description: post.content,
      url: `https://your-domain.com/post/${post.id}`,
      images: [
        {
          url: `https://your-domain.com${post.mediaUrl}`,
          width: 1200,
          height: 630,
          alt: post.content.slice(0, 60),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `@${post.author.username} | PromoVerse`,
      description: post.content,
      images: [`https://your-domain.com${post.mediaUrl}`],
    },
  };
}

export default async function PromoPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { username: true } },
      analytics: true,
    },
  });

  if (!post || !post.published || post.draft) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-4">Shared Promo by @{post.author.username}</h1>
      <PostCard post={post} />
    </div>
  );
}
