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
  const isAuthPage = children?.toString().includes('SignInPage') ?? false;
  
  return (
    <html lang="en">
      <body className={cn(inter.className, 'bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white')}>
        <Providers>
          {!isAuthPage && <Navbar />}
          <main className={cn(
            'min-h-screen',
            !isAuthPage && 'px-4 md:px-12 max-w-6xl mx-auto pt-16'
          )}>
            {children}
          </main>
          {!isAuthPage && <Footer />}
        </Providers>
      </body>
    </html>
  );
}
