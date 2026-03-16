import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Safety Products',
  description: 'Browse independently rated stairlifts, walk-in tubs, grab bars, and more. SafeScore™ ratings for every product.',
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
    .order('safe_score', { ascending: false })
    .limit(24);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
        Home Safety Products
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        Every product independently scored on safety, ease of use, installation, and value.
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link href="/products" className="px-4 py-2 rounded-full text-sm font-medium bg-green-800 text-white">
          All
        </Link>
        {(categories || []).map((cat: { slug: string; name: string }) => (
          <Link
            key={cat.slug}
            href={`/products/${cat.slug}`}
            className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:border-green-700 hover:text-green-800 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
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
    </main>
  );
}
