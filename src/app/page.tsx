import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { LeadForm } from '@/components/LeadForm';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { faqSchema } from '@/lib/schema';
import { Shield, Star, Users, BarChart2, BookOpen, ClipboardList } from 'lucide-react';
import { Suspense } from 'react';

const HOME_FAQS = [
  { question: 'What is a CAPS-certified contractor?', answer: 'CAPS stands for Certified Aging-in-Place Specialist. It\'s a credential from the National Association of Home Builders (NAHB) that indicates a contractor has completed training on home modification techniques for seniors. CAPS contractors are trained in ADA-compliant design, fall prevention, and the specific needs of older adults.' },
  { question: 'How much does a stairlift cost?', answer: 'A straight stairlift costs $2,000–$5,000 installed. Curved stairlifts require custom rails and typically cost $8,000–$15,000. Refurbished straight stairlifts are available for $1,000–$2,500.' },
  { question: 'Does Medicare cover home safety modifications?', answer: 'Standard Medicare Parts A and B do not cover home modifications like stairlifts or grab bars. Some Medicare Advantage plans include home safety benefits. Medicaid HCBS waivers and VA grants can also cover modifications for qualifying individuals.' },
  { question: 'What is SafeScore™?', answer: 'SafeScore™ is our independent 0-100 rating system. We score each product on safety features, ease of use, installation quality, and value — based on manufacturer specifications, clinical data, and verified user reviews. Products are never paid to receive higher scores.' },
  { question: 'Are there grants to pay for home modifications?', answer: 'Yes. Programs include the USDA Section 504 program (grants up to $10,000 for rural homeowners), VA grants (up to $109,986 for qualifying veterans), Medicaid HCBS waivers, and local programs through Area Agencies on Aging.' },
];

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
  const homeFaqSchema = faqSchema(HOME_FAQS);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }} />
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
              href="/assess"
              className="px-6 py-3 rounded-lg font-semibold text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#D97706', color: '#fff' }}
            >
              Free Home Assessment
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 rounded-lg font-semibold text-base border-2 border-white text-white hover:bg-white hover:text-green-900 transition-colors"
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

      {/* Stats bar */}
      <section className="py-10 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-serif text-3xl font-bold" style={{ color: '#1B4332' }}>56</div>
              <div className="text-sm text-gray-500 mt-1">Products Reviewed</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold" style={{ color: '#1B4332' }}>150+</div>
              <div className="text-sm text-gray-500 mt-1">CAPS Contractors Listed</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold" style={{ color: '#1B4332' }}>50</div>
              <div className="text-sm text-gray-500 mt-1">States Covered</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold" style={{ color: '#1B4332' }}>78</div>
              <div className="text-sm text-gray-500 mt-1">Cost & Buyer's Guides</div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield size={16} style={{ color: '#1B4332' }} />
              <span className="text-sm">CAPS-Certified Contractors Only</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Star size={16} style={{ color: '#D97706' }} />
              <span className="text-sm">Independent SafeScore™ Ratings</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={16} style={{ color: '#1B4332' }} />
              <span className="text-sm">No Paid Rankings or Sponsored Content</span>
            </div>
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

      {/* Popular Guides */}
      <section className="py-16 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} style={{ color: '#1B4332' }} />
                <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>Guides</span>
              </div>
              <h2 className="font-serif text-3xl font-semibold" style={{ color: '#1A1A1A' }}>Cost Guides & Buyer&apos;s Guides</h2>
              <p className="text-gray-500 mt-1">No fluff — just what things cost and how to choose.</p>
            </div>
            <Link href="/guides" className="hidden md:block font-semibold text-sm hover:underline" style={{ color: '#1B4332' }}>
              View all 78 guides →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { slug: 'stairlift-cost-guide', title: 'How Much Does a Stairlift Cost?', icon: '🪜', tag: 'Cost Guide' },
              { slug: 'home-safety-checklist-for-elderly', title: 'Home Safety Checklist for Elderly', icon: '📋', tag: 'Planning' },
              { slug: 'home-modification-grants-for-seniors', title: 'Home Modification Grants for Seniors', icon: '💰', tag: 'Grants' },
              { slug: 'does-medicare-cover-stairlifts', title: 'Does Medicare Cover Stairlifts?', icon: '🏥', tag: 'Insurance' },
              { slug: 'aging-in-place-planning-guide', title: 'How to Plan for Aging in Place', icon: '🏠', tag: 'Planning' },
              { slug: 'free-stairlift-for-seniors', title: 'How to Get a Free Stairlift', icon: '💰', tag: 'Grants' },
            ].map(g => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-green-200 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xl">{g.icon}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#D97706' }}>{g.tag}</span>
                </div>
                <h3 className="font-serif font-semibold text-gray-900 group-hover:text-green-800 transition-colors leading-tight">{g.title}</h3>
                <p className="text-xs text-green-800 mt-2 font-medium">Read guide →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Compare section */}
      <section className="py-16 px-4" style={{ backgroundColor: '#F5F5F0' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 size={16} style={{ color: '#1B4332' }} />
                <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>Comparisons</span>
              </div>
              <h2 className="font-serif text-3xl font-semibold" style={{ color: '#1A1A1A' }}>Side-by-Side Comparisons</h2>
              <p className="text-gray-500 mt-1">Top products ranked by SafeScore™ so you can choose with confidence.</p>
            </div>
            <Link href="/compare" className="hidden md:block font-semibold text-sm hover:underline" style={{ color: '#1B4332' }}>
              View all comparisons →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { slug: 'best-stairlifts', title: 'Best Stairlifts of 2026', icon: '🪜', count: 6 },
              { slug: 'best-walk-in-tubs', title: 'Best Walk-In Tubs of 2026', icon: '🛁', count: 5 },
              { slug: 'best-grab-bars', title: 'Best Grab Bars of 2026', icon: '🔩', count: 6 },
              { slug: 'best-medical-alerts', title: 'Best Medical Alert Systems', icon: '🚨', count: 5 },
              { slug: 'best-rollator-walkers', title: 'Best Rollator Walkers', icon: '🦽', count: 5 },
              { slug: 'best-wheelchair-ramps', title: 'Best Wheelchair Ramps', icon: '♿', count: 6 },
            ].map(c => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:border-green-700 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 group-hover:text-green-800 transition-colors leading-tight">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.count} products compared</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Free Assessment CTA */}
      <section className="py-16 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: '#1B4332' }}>
            <ClipboardList size={40} className="mx-auto mb-4 opacity-80 text-white" />
            <h2 className="font-serif text-3xl font-bold text-white mb-3">
              Not Sure Where to Start?
            </h2>
            <p className="text-white opacity-80 max-w-xl mx-auto mb-8 text-lg">
              Take our free 5-question home safety assessment and get personalized recommendations in under 2 minutes.
            </p>
            <Link
              href="/assess"
              className="inline-block px-10 py-4 rounded-lg font-semibold text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#D97706', color: '#fff' }}
            >
              Take the Free Assessment →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-16 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold mb-8 text-center" style={{ color: '#1A1A1A' }}>
            Common Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'What is a CAPS-certified contractor?',
                a: 'CAPS stands for Certified Aging-in-Place Specialist. It\'s a credential from the National Association of Home Builders (NAHB) that indicates a contractor has completed training on home modification techniques for seniors and people with disabilities. CAPS contractors are trained in ADA-compliant design, fall prevention, and the specific needs of older adults.',
              },
              {
                q: 'How much does a stairlift cost?',
                a: 'A straight stairlift costs $2,000–$5,000 installed. Curved stairlifts (for staircases with turns or landings) require custom rails and typically cost $8,000–$15,000. Refurbished straight stairlifts are available for $1,000–$2,500. See our complete stairlift cost guide for a full breakdown.',
              },
              {
                q: 'Does Medicare cover home safety modifications?',
                a: 'Standard Medicare (Parts A and B) does not cover home modifications like stairlifts or grab bars. However, some Medicare Advantage (Part C) plans include "home safety" supplemental benefits. Medicaid HCBS waivers and VA grants can also cover modifications for qualifying individuals. See our insurance guides for details.',
              },
              {
                q: 'What is SafeScore™?',
                a: 'SafeScore™ is our independent 0-100 rating system for home safety products. We score each product across four dimensions: safety features, ease of use, installation quality, and value. The scores are based on manufacturer specifications, clinical studies, and thousands of verified user reviews. Products are never paid to receive a higher score.',
              },
              {
                q: 'Are there grants to pay for home modifications?',
                a: 'Yes. Several programs help fund aging-in-place modifications: the USDA Section 504 program (grants up to $10,000 for rural homeowners), VA grants (up to $109,986 for qualifying veterans), Medicaid HCBS waivers, and local programs through Area Agencies on Aging. See our complete grants guide for every available program.',
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-6 bg-white">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
