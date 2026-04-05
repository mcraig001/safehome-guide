import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Shield, ChevronRight } from 'lucide-react';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Home Safety Products — SafeScore™ Ratings',
  description: 'Browse 56 independently reviewed aging-in-place products. SafeScore™ ratings for stairlifts, walk-in tubs, grab bars, medical alerts, and more.',
  openGraph: {
    title: 'Home Safety Products — SafeScore™ Ratings',
    description: 'Browse 56 independently reviewed aging-in-place products with SafeScore™ ratings.',
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  stairlifts: '🪜',
  'walk-in-tubs': '🛁',
  'grab-bars': '🔩',
  'wheelchair-ramps': '♿',
  'medical-alerts': '🚨',
  'home-elevators': '🛗',
  'bath-safety': '🚿',
  'mobility-aids': '🦽',
  'smart-home-safety': '🏠',
  'door-access': '🔐',
};

export default async function ProductsPage() {
  const { data: categories } = await supabase
    .from('sh_categories')
    .select('*')
    .eq('is_published', true)
    .order('sort_order');

  const { data: products } = await supabase
    .from('sh_products')
    .select('*')
    .eq('is_published', true)
    .order('safe_score', { ascending: false });

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://www.safeathomeguides.com' },
    { name: 'Products', url: 'https://www.safeathomeguides.com/products' },
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} style={{ color: '#1B4332' }} />
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>SafeScore™ Rated</span>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
        Home Safety Products
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        {products?.length ?? 0} products independently scored on safety, ease of use, installation, and value.
      </p>

      {/* Category browse cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
        {(categories || []).map((cat: { slug: string; name: string }) => (
          <Link
            key={cat.slug}
            href={`/products/${cat.slug}`}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-100 hover:border-green-700 text-center text-sm font-medium transition-colors group"
          >
            <span className="text-2xl mb-1">{CATEGORY_ICONS[cat.slug] ?? '📦'}</span>
            <span className="group-hover:text-green-800 transition-colors leading-tight">{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* Top picks section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-semibold" style={{ color: '#1A1A1A' }}>
            Top-Rated Products
          </h2>
          <span className="text-sm text-gray-400">Sorted by SafeScore™</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(products || []).map((p: Parameters<typeof ProductCard>[0]['product']) => (
            <ProductCard key={p.slug} product={p} />
          ))}
          {(!products || products.length === 0) && (
            <p className="col-span-3 text-gray-400 text-center py-12">
              Products coming soon — check back shortly.
            </p>
          )}
        </div>
      </div>

      {/* Browse by category */}
      <div className="mt-12 rounded-2xl p-8 border border-gray-100" style={{ backgroundColor: '#F5F5F0' }}>
        <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
          Browse by Category
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(categories || []).map((cat: { slug: string; name: string }) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100 hover:border-green-700 hover:shadow-sm transition-all group"
            >
              <span className="text-xl shrink-0">{CATEGORY_ICONS[cat.slug] ?? '📦'}</span>
              <span className="font-medium text-gray-700 group-hover:text-green-800 transition-colors text-sm">{cat.name}</span>
              <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-green-700 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
