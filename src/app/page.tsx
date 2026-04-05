import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { LeadForm } from '@/components/LeadForm';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { Shield, Star, Users } from 'lucide-react';
import { Suspense } from 'react';

async function getFeaturedProducts() {
  const { data } = await supabase
    .from('sh_products')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .limit(3);
  return data || [];
}

async function getCategories() {
  const { data } = await supabase
    .from('sh_categories')
    .select('*')
    .eq('is_published', true)
    .order('sort_order');
  return data || [];
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-4" style={{ backgroundColor: '#1B4332' }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
            Help Your Family Stay Safe at Home
          </h1>
          <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto">
            Honest reviews of stairlifts, walk-in tubs, and home safety products — plus
            a directory of CAPS-certified contractors near you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="px-6 py-3 rounded-lg font-semibold text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#D97706', color: '#fff' }}
            >
              Browse Products
            </Link>
            <Link
              href="/contractors"
              className="px-6 py-3 rounded-lg font-semibold text-base border-2 border-white text-white hover:bg-white hover:text-green-900 transition-colors"
            >
              Find a Contractor
            </Link>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
          <div className="flex items-center gap-2 text-gray-700">
            <Shield size={20} style={{ color: '#1B4332' }} />
            <span className="text-sm font-medium">CAPS-Certified Contractors Only</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Star size={20} style={{ color: '#D97706' }} />
            <span className="text-sm font-medium">Independent SafeScore™ Ratings</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users size={20} style={{ color: '#1B4332' }} />
            <span className="text-sm font-medium">No Ads, No Sponsored Rankings</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-center mb-10" style={{ color: '#1A1A1A' }}>
            What Are You Looking For?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((cat: { slug: string; name: string; icon?: string }) => (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-100 hover:border-green-700 text-center text-sm font-medium transition-colors group"
              >
                {cat.icon && <span className="text-2xl mb-1">{cat.icon}</span>}
                <span className="group-hover:text-green-800 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16 px-4" style={{ backgroundColor: '#F5F5F0' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Top-Rated Products
            </h2>
            <p className="text-gray-500 mb-8">Independently scored on safety, ease of use, and value.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((p: Parameters<typeof ProductCard>[0]['product']) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/products" className="font-semibold hover:underline" style={{ color: '#1B4332' }}>
                See all products →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter signup */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup
            headline="Free: The Aging-in-Place Home Safety Checklist"
            subtext="A room-by-room checklist of the most important modifications, in priority order. Trusted by 1,000+ families."
            source="homepage"
          />
        </div>
      </section>

      {/* Lead Form CTA */}
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-semibold" style={{ color: '#1A1A1A' }}>
              Get Free Quotes from Local Contractors
            </h2>
            <p className="mt-2 text-gray-500">CAPS-certified professionals only. No obligation.</p>
          </div>
          <Suspense>
            <LeadForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
