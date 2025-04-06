// src/components/ui/AuthModal.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const AuthModal = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleAuth = async () => {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) router.push('/explore');
    else alert('Auth failed.');
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <h2 className="text-xl font-semibold text-center mb-4">
        {isSignUp ? 'Create Account' : 'Sign In to PromoVerse'}
      </h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 mb-3 rounded-md border bg-white text-black dark:bg-neutral-800 dark:text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 mb-4 rounded-md border bg-white text-black dark:bg-neutral-800 dark:text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleAuth}
        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
      >
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
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
