import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.email !== 'epharimray@gmail.com') {
    redirect('/');
  }
  return user;
}

export function isAdmin(email: string | null | undefined) {
  return email === 'epharimray@gmail.com';
} 