'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, TrendingUp, User, Wallet, Zap, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discoververse', label: 'DiscoverVerse', icon: Compass },
    { href: '/starmap', label: 'StarMap', icon: TrendingUp },
    { href: '/wallet', label: 'Wallet', icon: Wallet },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t dark:border-neutral-800 md:relative md:border-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="hidden md:block">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500" size={24} />
              <span className="text-xl font-bold">PromoVerse</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Create Promotion Button */}
          {session && (
            <Link
              href="/promotions/new"
              className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Zap size={18} />
              <span>Create</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 