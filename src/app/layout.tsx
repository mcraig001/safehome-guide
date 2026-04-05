import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    default: 'SafeAtHome Guide — Aging-in-Place Home Safety',
    template: '%s | SafeAtHome Guide',
  },
  description: 'Independent reviews and ratings of stairlifts, walk-in tubs, grab bars, and home safety products for seniors and aging-in-place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* @ts-expect-error — Impact uses non-standard 'value' attribute instead of 'content' */}
        <meta name='impact-site-verification' value='add21af6-b994-48fb-a2d6-4b80439228f3' />
      </head>
      <body>
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl font-bold" style={{ color: '#1B4332' }}>
              SafeAtHome Guide
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/products" className="hover:text-green-800 transition-colors">Products</Link>
              <Link href="/contractors" className="hover:text-green-800 transition-colors">Find a Contractor</Link>
              <Link href="/guides" className="hover:text-green-800 transition-colors">Cost Guides</Link>
              <Link href="/compare" className="hover:text-green-800 transition-colors">Compare</Link>
              <Link href="/assess" className="hover:text-green-800 transition-colors">Home Assessment</Link>
            </nav>
            <Link
              href="/contractors"
              className="hidden md:inline-flex px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#D97706' }}
            >
              Get Free Quotes
            </Link>
          </div>
        </header>
        {children}
        <footer className="mt-20 py-12 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm text-gray-500">
            <div>
              <p className="font-serif font-semibold text-gray-800 mb-2">SafeAtHome Guide</p>
              <p>Independent reviews for families navigating aging-in-place home safety.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Products</p>
              <ul className="space-y-1">
                <li><Link href="/products/stairlifts" className="hover:underline">Stairlifts</Link></li>
                <li><Link href="/products/walk-in-tubs" className="hover:underline">Walk-In Tubs</Link></li>
                <li><Link href="/products/grab-bars" className="hover:underline">Grab Bars</Link></li>
                <li><Link href="/products/wheelchair-ramps" className="hover:underline">Wheelchair Ramps</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Resources</p>
              <ul className="space-y-1">
                <li><Link href="/guides" className="hover:underline">Cost Guides</Link></li>
                <li><Link href="/compare" className="hover:underline">Comparisons</Link></li>
                <li><Link href="/contractors" className="hover:underline">Find Contractors</Link></li>
                <li><Link href="/assess" className="hover:underline">Home Assessment</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Company</p>
              <ul className="space-y-1">
                <li><Link href="/about" className="hover:underline">About</Link></li>
                <li><Link href="/advertise" className="hover:underline">Advertise</Link></li>
                <li><a href="mailto:hello@safeatHomeguide.com" className="hover:underline">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
            <p>© {new Date().getFullYear()} SafeAtHome Guide. Some links are affiliate links — we earn a commission at no extra cost to you.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
