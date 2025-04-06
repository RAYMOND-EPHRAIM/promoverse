import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function ReportsPage() {
  const session = await getAuthSession();

  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect('/explore');
  }

  const flaggedPosts = await prisma.post.findMany({
    where: { flagged: true },
    include: {
      author: { select: { username: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">🚩 Flagged Promos</h1>

      {flaggedPosts.length === 0 ? (
        <p className="text-gray-400">No flagged posts found. Good vibes only 💫</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-700 text-gray-400">
              <th className="py-2">User</th>
              <th>Content</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flaggedPosts.map((post) => (
              <tr key={post.id} className="border-b border-neutral-800">
                <td className="py-2">@{post.author.username}</td>
                <td>{post.content}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <form action={`/api/admin/post/${post.id}/delete`} method="POST">
                    <button type="submit" className="text-red-500 hover:underline">Delete</button>
                  </form>
                  <form action={`/api/admin/post/${post.id}/unflag`} method="POST">
                    <button type="submit" className="text-green-500 hover:underline">Unflag</button>
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
