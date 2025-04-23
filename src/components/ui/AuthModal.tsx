// src/components/ui/AuthModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Crown, Mail, Lock } from 'lucide-react';

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
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {isAdmin && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Crown className="text-yellow-500 h-5 w-5" />
            </div>
          )}
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleAuth}
        className={`w-full font-semibold py-3 rounded-xl transition-all ${
          isAdmin
            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black'
            : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white'
        } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
      >
        {isSignUp ? 'Create Account' : 'Sign In'}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white/80 dark:bg-gray-800/80 text-gray-500">or</span>
        </div>
      </div>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
      >
        {isSignUp ? 'Sign In Instead' : 'Create New Account'}
      </button>
    </div>
  );
};
