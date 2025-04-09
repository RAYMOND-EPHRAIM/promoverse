'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/helpers';

const navItems = [
  { label: 'Home', href: '/' },
];

export const Navbar = () => {
  const pathname = usePathname();

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
                pathname === item.href && 'font-semibold text-indigo-600'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
