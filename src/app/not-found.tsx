import Link from 'next/link';
import type { Metadata } from 'next';
import { Home, Search, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl font-serif font-bold mb-4" style={{ color: '#1B4332' }}>404</div>
      <h1 className="font-serif text-2xl font-semibold mb-3" style={{ color: '#1A1A1A' }}>
        Page not found
      </h1>
      <p className="text-gray-500 mb-10 text-lg">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Link
          href="/products"
          className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gray-100 hover:border-green-700 hover:shadow-sm transition-all group"
        >
          <Search size={24} style={{ color: '#1B4332' }} />
          <span className="font-semibold text-sm text-gray-800 group-hover:text-green-800 transition-colors">Browse Products</span>
        </Link>
        <Link
          href="/guides"
          className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gray-100 hover:border-green-700 hover:shadow-sm transition-all group"
        >
          <BookOpen size={24} style={{ color: '#1B4332' }} />
          <span className="font-semibold text-sm text-gray-800 group-hover:text-green-800 transition-colors">Read Guides</span>
        </Link>
        <Link
          href="/"
          className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gray-100 hover:border-green-700 hover:shadow-sm transition-all group"
        >
          <Home size={24} style={{ color: '#1B4332' }} />
          <span className="font-semibold text-sm text-gray-800 group-hover:text-green-800 transition-colors">Go Home</span>
        </Link>
      </div>

      <Link
        href="/contractors"
        className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#D97706' }}
      >
        Find a Contractor Near You
      </Link>
    </main>
  );
}
