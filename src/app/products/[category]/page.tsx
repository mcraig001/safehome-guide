import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { LeadForm } from '@/components/LeadForm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';

interface Props { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const { data: cat } = await supabase
    .from('sh_categories')
    .select('name, meta_description')
    .eq('slug', category)
    .single();
  if (!cat) return {};
  return {
    title: `${cat.name} — Reviews & Buyer's Guide`,
    description: cat.meta_description || `Compare the best ${cat.name.toLowerCase()} with SafeScore™ ratings.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const { data: cat } = await supabase
    .from('sh_categories')
    .select('*')
    .eq('slug', category)
    .single();
  if (!cat) notFound();

  const { data: products } = await supabase
    .from('sh_products')
    .select('*')
    .eq('category', category)
    .eq('is_published', true)
    .order('safe_score', { ascending: false });

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
        Best {cat.name}: Reviews & Buyer&apos;s Guide
      </h1>
      {cat.hero_text && <p className="text-lg text-gray-600 mb-8">{cat.hero_text}</p>}

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="md:col-span-2">
          <div className="grid md:grid-cols-2 gap-5">
            {(products || []).map((p: Parameters<typeof ProductCard>[0]['product']) => (
              <ProductCard key={p.slug} product={p} />
            ))}
            {(!products || products.length === 0) && (
              <p className="col-span-2 text-gray-400 py-8">Reviews coming soon.</p>
            )}
          </div>
        </div>
        <aside>
          <Suspense>
            <LeadForm
              category={category}
              headline={`Get Free ${cat.name} Quotes`}
            />
          </Suspense>
        </aside>
      </div>
    </main>
  );
}
