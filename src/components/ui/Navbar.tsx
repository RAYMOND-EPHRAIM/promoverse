'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/utils/helpers';
import { useState } from 'react';
import { Bell } from 'lucide-react';

const navItems = [
  { label: 'Explore', href: '/explore' },
  { label: 'Trending', href: '/trending' },
  { label: 'Upload', href: '/upload' },
  { label: 'Wallet', href: '/wallet' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/hashtag/${encodeURIComponent(search.trim().replace(/^#/, ''))}`);
    setSearch('');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-black shadow-sm border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 md:px-6 gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
          PromoVerse
        </Link>

        <nav className="hidden md:flex gap-6 items-center text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-indigo-600',
                pathname.startsWith(item.href) && 'font-semibold text-indigo-600'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="flex-1 md:flex-none relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="# Search hashtag"
            className="w-full md:w-64 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm text-black dark:text-white placeholder:text-gray-400"
          />
        </form>

        <Link href="/notifications" className="ml-2">
          <Bell className="w-5 h-5 text-gray-400 hover:text-indigo-600 transition" />
        </Link>
      </div>
    </header>
  );
};
