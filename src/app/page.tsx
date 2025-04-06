// src/app/page.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center py-24"
    >
      <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
        The Universe Where <span className="text-indigo-500">Anything</span> Can Be Promoted
      </h1>
      <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 mb-8">
        From memes to movements, products to protests — PromoVerse makes you seen.
      </p>
      <Link
        href="/upload"
        className="inline-block px-8 py-3 rounded-2xl text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md"
      >
        Launch Your Promo 🚀
      </Link>
    </motion.div>
  );
}
