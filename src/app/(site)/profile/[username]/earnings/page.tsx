// src/app/(site)/profile/[username]/earnings/page.tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EarningsPage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      posts: {
        include: {
          analytics: true,
        },
      },
    },
  });

  if (!user) return notFound();

  const postEarnings = user.posts.map((post) => {
    const views = post.analytics?.views ?? 0;
    const likes = post.likes?.length ?? 0;
    const baseEarning = Math.floor(views * 0.05 + likes * 0.25);
    const bonus = post.boosted ? 10 : 0;
    return {
      id: post.id,
      content: post.content.slice(0, 50) + (post.content.length > 50 ? '...' : ''),
      views,
      likes,
      boosted: post.boosted,
      earnings: baseEarning + bonus,
    };
  });

  const total = postEarnings.reduce((sum, p) => sum + p.earnings, 0);

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">💰 Your Earnings</h1>
      <p className="text-lg mb-6">
        Total Earnings: <span className="font-semibold text-green-500">{total} credits</span>
      </p>

      <table className="w-full text-sm border-t border-neutral-800">
        <thead>
          <tr className="text-left text-gray-400 border-b border-neutral-800">
            <th className="py-2">Promo</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Boosted</th>
            <th>Earnings</th>
          </tr>
        </thead>
        <tbody>
          {postEarnings.map((p) => (
            <tr key={p.id} className="border-b border-neutral-800 text-gray-200">
              <td className="py-2">{p.content}</td>
              <td>{p.views}</td>
              <td>{p.likes}</td>
              <td>{p.boosted ? '✅' : '—'}</td>
              <td className="text-green-400 font-medium">{p.earnings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
