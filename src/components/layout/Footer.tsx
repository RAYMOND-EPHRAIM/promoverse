// src/components/layout/Footer.tsx
export const Footer = () => {
    return (
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="max-w-6xl mx-auto px-4">
          © {new Date().getFullYear()} PromoVerse. All rights reserved.
        </div>
      </footer>
    );
  };
  