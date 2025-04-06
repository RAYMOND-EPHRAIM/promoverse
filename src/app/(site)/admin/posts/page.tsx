// src/app/(site)/admin/posts/page.tsx
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminPostsPage() {
  const session = await getAuthSession();

  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect('/explore');
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { username: true, email: true } },
    },
  });

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">🧹 Moderate Promos</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-700 text-gray-400">
              <th className="py-2">User</th>
              <th>Content</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-neutral-800">
                <td className="py-2">
                  @{post.author.username} <br />
                  <span className="text-xs text-gray-500">{post.author.email}</span>
                </td>
                <td>{post.content}</td>
                <td>
                  {post.boosted ? (
                    <span className="text-green-500">Boosted</span>
                  ) : (
                    <span className="text-gray-500">Normal</span>
                  )}
                </td>
                <td className="space-x-2">
                  <form action={`/api/admin/post/${post.id}/delete`} method="POST">
                    <button type="submit" className="text-red-500 hover:underline">Delete</button>
                  </form>
                  {post.boosted && (
                    <form action={`/api/admin/post/${post.id}/deboost`} method="POST">
                      <button type="submit" className="text-yellow-500 hover:underline">De-Boost</button>
                    </form>
                  )}
                  <form action={`/api/admin/post/${post.id}/flag`} method="POST">
                    <button type="submit" className="text-indigo-500 hover:underline">Flag</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
