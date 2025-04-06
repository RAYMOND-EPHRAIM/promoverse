// src/app/(site)/admin/users/page.tsx
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
  const session = await getAuthSession();

  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect('/explore');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">🧑‍⚖️ Manage Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-700 text-gray-400">
              <th className="py-2">Username</th>
              <th>Email</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-neutral-800">
                <td className="py-2 font-medium">@{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <form action={`/api/admin/user/${user.id}/verify`} method="POST">
                    <button type="submit" className="text-blue-500 hover:underline">✅ Verify</button>
                  </form>
                  <form action={`/api/admin/user/${user.id}/ban`} method="POST">
                    <button type="submit" className="text-red-500 hover:underline">⛔ Ban</button>
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
