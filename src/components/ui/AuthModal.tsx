// src/components/ui/AuthModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Crown } from 'lucide-react';

export const AuthModal = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (email === 'epharimray@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [email]);

  const handleAuth = async () => {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/explore');
      }
    } else {
      alert('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <h2 className="text-xl font-semibold text-center mb-4 flex items-center justify-center gap-2">
        {isSignUp ? 'Create Account' : 'Sign In to PromoVerse'}
        {isAdmin && <Crown className="text-yellow-500" size={20} />}
      </h2>
      <div className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md border bg-white text-black dark:bg-neutral-800 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {isAdmin && (
            <p className="text-xs text-yellow-500 mt-1">Admin account detected</p>
          )}
        </div>
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded-md border bg-white text-black dark:bg-neutral-800 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleAuth}
          className={`w-full font-semibold py-2 rounded-md transition ${
            isAdmin
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
      <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
        {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-indigo-600 font-medium hover:underline"
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </div>
  );
};
