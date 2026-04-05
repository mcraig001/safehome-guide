'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/contractors', label: 'Find a Contractor' },
  { href: '/guides', label: 'Cost Guides' },
  { href: '/compare', label: 'Compare' },
  { href: '/assess', label: 'Home Assessment' },
  { href: '/resources', label: 'Grant Resources' },
  { href: '/glossary', label: 'Glossary' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="p-2 rounded-lg text-gray-600 hover:text-green-800 hover:bg-gray-50 transition-colors"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 pb-1 border-t border-gray-100 mt-2">
              <Link
                href="/contractors"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#D97706' }}
              >
                Get Free Quotes
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
