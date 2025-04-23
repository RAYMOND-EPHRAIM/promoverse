// src/app/auth/signin/page.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { AuthModal } from '@/components/ui/AuthModal';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-6 py-8"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="PromoVerse Logo"
              width={64}
              height={64}
              className="rounded-xl shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Welcome to PromoVerse
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sign in to start promoting in the universe
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <AuthModal />
        </div>

        <p className="mt-8 text-sm text-center text-gray-500 dark:text-gray-400">
          By continuing, you agree to PromoVerse's{' '}
          <a href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
}
