// src/app/(site)/admin/dashboard/page.tsx
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const session = await getAuthSession();

  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect('/explore');
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">🛠️ Admin Dashboard</h1>
      <ul className="space-y-3">
        <li><a href="/admin/posts" className="text-indigo-600 hover:underline">Moderate Posts</a></li>
        <li><a href="/admin/users" className="text-indigo-600 hover:underline">Manage Users</a></li>
        <li><a href="/admin/reports" className="text-indigo-600 hover:underline">Reported Content</a></li>
      </ul>
    </div>
  );
}
