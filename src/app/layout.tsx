// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/utils/helpers';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PromoVerse',
  description: 'The Universe Where Anything Can Be Promoted',
  icons: [
    { rel: 'icon', url: '/icon-192.png' }
  ],
  manifest: '/manifest.json'
};

export const viewport = {
  themeColor: '#4f46e5'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, 'bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white')}>
        <Providers>
          <Navbar />
          <main className="min-h-screen px-4 md:px-12 max-w-6xl mx-auto pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
