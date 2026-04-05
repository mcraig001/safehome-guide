import { supabase } from '@/lib/supabase';
import { ComparisonTable } from '@/components/ComparisonTable';
import { LeadForm } from '@/components/LeadForm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight, BarChart2 } from 'lucide-react';

interface Props { params: Promise<{ slug: string }> }

// Map comparison slugs to database queries + page content
const COMPARISON_META: Record<string, {
  title: string;
  description: string;
  category: string;
  intro: string;
  verdict: string;
}> = {
  'best-stairlifts': {
    title: 'Best Stairlifts of 2026: Compared and Ranked',
    description: 'Side-by-side stairlift comparison: prices, safety scores, weight limits, and warranty. Find the best model for your home.',
    category: 'stairlifts',
    intro: 'We tested and scored every major stairlift brand on safety, ease of use, installation quality, and value. Here\'s how they stack up.',
    verdict: 'For most straight staircases, a mid-range model in the $3,000–$4,500 range offers the best balance of reliability and features. Curved staircases require custom rails — get at least two quotes before deciding.',
  },
  'best-walk-in-tubs': {
    title: 'Best Walk-In Tubs of 2026: Compared',
    description: 'Top walk-in tubs compared side by side. Prices, features, drain times, and expert ratings to help you choose.',
    category: 'walk-in-tubs',
    intro: 'Walk-in tubs vary widely in quality, drain speed, and features. We scored the top brands on safety, ease of entry, hydrotherapy options, and value.',
    verdict: 'Prioritize fast-drain technology (under 2 minutes) and a low step-over threshold (under 3 inches). Hydrotherapy jets add cost but are worth it if joint pain is a factor.',
  },
  'best-grab-bars': {
    title: 'Best Grab Bars of 2026: Safety, Style, and Installation',
    description: 'Top grab bars compared — weight ratings, finishes, and which ones are easiest to install correctly.',
    category: 'grab-bars',
    intro: 'Not all grab bars are equal. Weight rating, surface texture, and mounting hardware all affect safety. We compared the top models for home use.',
    verdict: 'For most bathrooms, a 32-inch stainless steel bar with a textured grip surface is the right choice. Match the finish to your fixtures for a cleaner look.',
  },
  'best-medical-alerts': {
    title: 'Best Medical Alert Systems of 2026',
    description: 'Medical alert systems compared on response time, monthly cost, GPS coverage, and fall detection accuracy.',
    category: 'medical-alerts',
    intro: 'Medical alert systems can call for help when a fall or emergency happens. We evaluated response time, false alarm rate, GPS range, and monthly subscription cost.',
    verdict: 'If your loved one goes outdoors, choose a GPS-enabled system. For primarily home use, a base station + pendant combination is more affordable and reliable.',
  },
  'best-rollator-walkers': {
    title: 'Best Rollator Walkers of 2026: Compared and Ranked',
    description: 'Top rollator walkers compared on weight, wheel size, seat comfort, and ease of folding. Find the best rollator for indoor or outdoor use.',
    category: 'mobility-aids',
    intro: 'Rollator walkers vary significantly in weight, wheel size, and stability. We scored the top models on safety, maneuverability, comfort, and value — whether you need it mostly indoors or for outdoor use.',
    verdict: 'For outdoor use, choose a rollator with 8-inch wheels for better terrain handling. For indoor use, a compact lightweight model under 15 lbs is easier to maneuver in tight spaces. Always check weight capacity and seat height before buying.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = COMPARISON_META[slug];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const meta = COMPARISON_META[slug];
  if (!meta) notFound();

  const { data: products } = await supabase
    .from('sh_products')
    .select('*')
    .eq('category', meta.category)
    .eq('is_published', true)
    .order('safe_score', { ascending: false })
    .limit(5);

  // Related comparisons
  const related = Object.entries(COMPARISON_META)
    .filter(([s]) => s !== slug)
    .slice(0, 4);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href={`/products/${meta.category}`} className="hover:text-gray-600 transition-colors capitalize">
          {meta.category.replace(/-/g, ' ')}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-600">Compare</span>
      </nav>

      <div className="flex items-center gap-2 mb-3">
        <BarChart2 size={16} style={{ color: '#1B4332' }} />
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>Comparison</span>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-4 leading-tight" style={{ color: '#1A1A1A' }}>
        {meta.title}
      </h1>

      <p className="text-lg text-gray-700 leading-relaxed mb-10 max-w-3xl">
        {meta.intro}
      </p>

      {/* Main comparison table */}
      {products && products.length > 0 ? (
        <>
          <section className="mb-10">
            <ComparisonTable products={products} />
          </section>

          {/* Verdict */}
          <section className="mb-10">
            <div className="rounded-xl p-6 border-l-4" style={{ backgroundColor: '#f0fdf4', borderColor: '#1B4332' }}>
              <h2 className="font-serif text-xl font-semibold mb-2" style={{ color: '#1B4332' }}>
                Our Verdict
              </h2>
              <p className="text-gray-700 leading-relaxed">{meta.verdict}</p>
            </div>
          </section>

          {/* Individual product links */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-5" style={{ color: '#1A1A1A' }}>
              Full Reviews
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p: { slug: string; category: string; brand: string; name: string; safe_score?: number }) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.category}/${p.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-700 hover:shadow-sm transition-all group"
                >
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">{p.brand}</div>
                    <div className="font-semibold text-sm text-gray-800 group-hover:text-green-800 transition-colors">
                      {p.name}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-green-700 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="py-16 text-center text-gray-400">
          <p className="text-lg">No products available for comparison yet.</p>
          <p className="text-sm mt-2">Check back soon — we&apos;re adding products regularly.</p>
        </div>
      )}

      {/* Get quotes + related */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="rounded-xl p-6 border border-amber-200" style={{ backgroundColor: '#fffbeb' }}>
            <h2 className="font-serif text-xl font-semibold mb-2 text-amber-900">
              Ready to get quotes?
            </h2>
            <p className="text-amber-800 text-sm mb-4">
              A CAPS-certified contractor can assess your home and recommend the right product for your specific situation.
            </p>
            <Link
              href="/contractors"
              className="inline-block px-6 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#D97706' }}
            >
              Find a CAPS Contractor Near You
            </Link>
          </div>

          {/* Related comparisons */}
          {related.length > 0 && (
            <div className="mt-8">
              <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
                More Comparisons
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {related.map(([s, m]) => (
                  <Link
                    key={s}
                    href={`/compare/${s}`}
                    className="p-4 rounded-xl border border-gray-100 hover:border-green-700 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#1B4332' }}>
                      <BarChart2 size={12} />
                      <span className="uppercase tracking-wide font-medium">Compare</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-green-800 transition-colors leading-tight">
                      {m.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside>
          <Suspense>
            <LeadForm category={meta.category} headline="Get Free Quotes" />
          </Suspense>
        </aside>
      </div>
    </main>
  );
}
