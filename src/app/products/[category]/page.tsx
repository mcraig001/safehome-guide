import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { LeadForm } from '@/components/LeadForm';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight, BarChart2, BookOpen, Shield } from 'lucide-react';

interface Props { params: Promise<{ category: string }> }

// Category-specific content enrichment
const CATEGORY_META: Record<string, {
  guideSlug?: string;
  compareSlug?: string;
  guideName?: string;
  compareName?: string;
  intro?: string;
  buyingTips: string[];
}> = {
  stairlifts: {
    guideSlug: 'stairlift-cost-guide',
    compareSlug: 'best-stairlifts',
    guideName: 'Stairlift Cost Guide',
    compareName: 'Best Stairlifts of 2026',
    intro: 'Stairlifts restore independence when stairs become a barrier. Straight models cost $2,000–$5,000 installed; curved models $8,000–$15,000. All products below are scored on safety features, ease of use, and reliability.',
    buyingTips: [
      'Measure your staircase width — anything under 28 inches may need a specialty model',
      'Ask for a swivel seat: it makes dismounting at the top much safer',
      'Insist on battery backup so the lift works during power outages',
      'Get at least 2–3 installation quotes before deciding',
    ],
  },
  'walk-in-tubs': {
    guideSlug: 'walk-in-tub-cost-guide',
    compareSlug: 'best-walk-in-tubs',
    guideName: 'Walk-In Tub Cost Guide',
    compareName: 'Best Walk-In Tubs of 2026',
    intro: 'Walk-in tubs eliminate the step-over that causes most tub falls. Budget $3,500–$10,000 installed. Key factors: drain speed, step height, and whether hydrotherapy jets are worth the premium for your situation.',
    buyingTips: [
      'Look for fast-drain technology — ideally under 2 minutes to drain',
      'Check the step-over height: the lower the better (under 3 inches is ideal)',
      'Confirm your water heater can supply enough hot water for the tub capacity',
      'Ask your contractor about Medicaid or VA grant eligibility before purchasing',
    ],
  },
  'grab-bars': {
    guideSlug: 'grab-bar-installation-guide',
    compareSlug: 'best-grab-bars',
    guideName: 'Grab Bar Installation Guide',
    compareName: 'Best Grab Bars of 2026',
    intro: 'Grab bars are the most cost-effective bathroom safety investment — $75–$200 installed, per bar. They prevent tens of thousands of bathroom falls per year. Placement matters as much as the bar itself.',
    buyingTips: [
      'Bars must anchor into wall studs or with rated toggle anchors — drywall alone is unsafe',
      'Choose a textured grip surface over smooth chrome for wet environments',
      'ADA placement: 33–36 inches from floor, horizontal near toilet and shower',
      'Match the finish to your existing fixtures for a cleaner look',
    ],
  },
  'wheelchair-ramps': {
    guideSlug: 'wheelchair-ramp-cost-guide',
    compareSlug: 'best-wheelchair-ramps',
    guideName: 'Wheelchair Ramp Cost Guide',
    compareName: 'Best Wheelchair Ramps',
    intro: 'Wheelchair ramps range from $100 for a small threshold ramp to $3,500+ for a permanent modular system. ADA guidelines recommend 1:12 slope — one foot of ramp per inch of rise. The right choice depends on whether the need is temporary or permanent.',
    buyingTips: [
      'Use the 1:12 rule: a 6-inch step needs a 6-foot ramp minimum',
      'Modular aluminum ramps can be disassembled and moved — good for renters',
      'Permanent ramps may require a building permit — check local requirements',
      'Non-slip surface texture is critical for wet weather and outdoor ramps',
    ],
  },
  'medical-alerts': {
    guideSlug: 'medical-alert-cost-guide',
    compareSlug: 'best-medical-alerts',
    guideName: 'Medical Alert Cost Guide',
    compareName: 'Best Medical Alert Systems',
    intro: 'Medical alert systems cost $20–$55/month and can automatically call for help when a fall happens — even if the user cannot press a button. For seniors living alone, this is one of the most important safety investments available.',
    buyingTips: [
      'Choose GPS-enabled if your loved one leaves the home regularly',
      'Fall detection adds $5–$10/month and is worth it for most users',
      'Avoid long-term contracts — top providers are month-to-month',
      'Test the response time yourself by pressing the button after signing up',
    ],
  },
  'home-elevators': {
    guideSlug: 'home-elevator-cost-guide',
    compareSlug: undefined,
    guideName: 'Home Elevator Cost Guide',
    compareName: undefined,
    intro: 'Home elevators and vertical platform lifts provide full-floor access for wheelchair users or anyone who cannot use stairs safely. Vertical platform lifts start at $3,000; pneumatic elevators run $18,000–$35,000 installed.',
    buyingTips: [
      'Wheelchair users need a full elevator or vertical platform lift — not a stairlift',
      'Pneumatic (vacuum) elevators are freestanding — no shaft construction needed',
      'Factor in annual maintenance costs ($200–$500/year) when budgeting',
      'Check HOA and local building codes before ordering',
    ],
  },
  'bath-safety': {
    guideSlug: 'bathroom-safety-modifications-for-seniors',
    compareSlug: 'best-bath-safety-products',
    guideName: 'Bathroom Safety Guide',
    compareName: 'Best Bath Safety Products',
    intro: 'The bathroom is the highest-risk room in the home for older adults — 80% of senior falls happen there. Bath safety products like shower chairs, transfer benches, and non-slip mats address the most common hazards at low cost.',
    buyingTips: [
      'A shower chair + grab bar combination addresses most bathroom fall risks',
      'Transfer benches let users slide in sideways — eliminating the step-over entirely',
      'Non-slip mats must have suction cups on the bottom to stay in place when wet',
      'A handheld showerhead costs under $50 and dramatically improves shower safety',
    ],
  },
  'mobility-aids': {
    guideSlug: undefined,
    compareSlug: 'best-rollator-walkers',
    guideName: undefined,
    compareName: 'Best Rollator Walkers',
    intro: 'Rollators, walkers, and mobility aids help maintain independence for adults with balance or strength challenges. The right choice depends on whether the primary use is indoors, outdoors, or both — and whether a seat for resting is important.',
    buyingTips: [
      'For outdoor use, choose 8-inch wheels for better terrain handling',
      'For indoor use, a compact lightweight model (under 15 lbs) is easier to maneuver',
      'Always check weight capacity and seat height before purchasing',
      'Many rollators fold flat for transport — important for active users',
    ],
  },
  'smart-home-safety': {
    guideSlug: undefined,
    compareSlug: 'best-smart-home-safety-devices',
    guideName: undefined,
    compareName: 'Best Smart Home Safety Devices',
    intro: 'Smart home safety devices — smoke detectors, carbon monoxide alarms, smart locks, and monitoring systems — provide an additional layer of protection. Many connect to smartphones so family caregivers can monitor safety remotely.',
    buyingTips: [
      'Interconnected smoke and CO detectors are safer than standalone units',
      'Smart locks let caregivers check door status and grant access remotely',
      'Smart home hubs (Amazon Echo Show) enable voice-controlled calling and emergency alerts',
      'Look for devices that work without a subscription if ongoing costs are a concern',
    ],
  },
  'door-access': {
    guideSlug: undefined,
    compareSlug: 'best-smart-door-locks',
    guideName: undefined,
    compareName: 'Best Smart Door Locks',
    intro: 'Door access and keyless entry products eliminate the struggle with keys and locks — important for people with arthritis, cognitive decline, or reduced hand strength. Smart deadbolts, keypad locks, and garage door openers are the most common solutions.',
    buyingTips: [
      'Keypad locks eliminate the need to fumble with keys — critical for arthritis',
      'Smart locks let you check if doors were locked from your phone',
      'Choose a lock with a physical backup key in case of battery failure',
      'Wi-Fi enabled locks (vs Bluetooth only) allow remote control from anywhere',
    ],
  },
};

// Category-level FAQs for schema markup
const CATEGORY_FAQS: Record<string, { question: string; answer: string }[]> = {
  stairlifts: [
    { question: 'How much does a stairlift cost?', answer: 'A straight stairlift costs $2,000–$5,000 installed. Curved stairlifts for non-straight staircases cost $8,000–$15,000 due to custom rail fabrication. Refurbished straight models start at $1,200.' },
    { question: 'Does Medicare cover stairlifts?', answer: 'Standard Medicare Parts A and B do not cover stairlifts. Some Medicare Advantage plans include home safety benefits. VA grants and Medicaid HCBS waivers may cover stairlifts for qualifying individuals.' },
    { question: 'What is the weight limit for a stairlift?', answer: 'Standard stairlifts handle 250–300 lbs. Heavy-duty models (available from Bruno, Harmar, and others) support 350–600 lbs at a higher price.' },
    { question: 'How long does stairlift installation take?', answer: 'A straight stairlift installs in 2–4 hours. Curved stairlifts with custom rails take a full day.' },
  ],
  'walk-in-tubs': [
    { question: 'How much does a walk-in tub cost?', answer: 'Walk-in tubs cost $1,500–$5,000 for the unit plus $1,000–$3,000 for installation — total $2,500–$8,000. Hydrotherapy models cost more.' },
    { question: 'How long does a walk-in tub take to drain?', answer: 'Standard models drain in 3–5 minutes. Fast-drain models drain in under 2 minutes. You must remain inside the tub during draining.' },
    { question: 'Does insurance cover walk-in tubs?', answer: 'Standard health insurance does not cover walk-in tubs. Some Medicare Advantage plans and Medicaid HCBS waivers may cover bathroom modifications for qualifying seniors.' },
  ],
  'grab-bars': [
    { question: 'How much does grab bar installation cost?', answer: 'Grab bar installation costs $75–$200 per bar including labor. A full bathroom safety set (3–4 bars) runs $400–$900 professionally installed.' },
    { question: 'Where should grab bars be installed?', answer: 'ADA guidelines: horizontal bar inside shower (33–36 inches from floor), vertical bar at shower entry, horizontal bar next to toilet (33 inches from floor, 42 inches long).' },
    { question: 'How strong do grab bars need to be?', answer: 'ADA requires 250 lb rating minimum. Quality grab bars are rated to 500 lbs. Proper installation into wall studs or with rated anchors is as important as the bar\'s own rating.' },
  ],
  'medical-alerts': [
    { question: 'How much does a medical alert system cost?', answer: 'Medical alert systems cost $20–$55/month for monitoring. GPS mobile systems are $30–$50/month. Fall detection adds $5–$10/month. Most providers offer month-to-month billing.' },
    { question: 'What is the best medical alert system?', answer: 'For seniors at home, Bay Alarm Medical and Medical Guardian have strong track records on response time and fall detection. For GPS coverage, Medical Guardian MGMove and Lively Mobile Plus are top-rated.' },
    { question: 'How accurate is automatic fall detection?', answer: 'Medical alert fall detection is accurate for 65–85% of falls. No system catches every fall — always wear the manual help button as well.' },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const { data: cat } = await supabase
    .from('sh_categories')
    .select('name, meta_description')
    .eq('slug', category)
    .single();
  if (!cat) return {};
  const title = `Best ${cat.name} of 2026: Reviews & Buyer's Guide`;
  const description = cat.meta_description || `Compare the best ${cat.name.toLowerCase()} with independent SafeScore™ ratings. Honest reviews, real costs, and expert buying tips.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
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

  const meta = CATEGORY_META[category] ?? { buyingTips: [] };

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://www.safeathomeguides.com' },
    { name: 'Products', url: 'https://www.safeathomeguides.com/products' },
    { name: cat.name, url: `https://www.safeathomeguides.com/products/${category}` },
  ]);
  const categoryFaqs = CATEGORY_FAQS[category];
  const faqSchemaData = categoryFaqs ? faqSchema(categoryFaqs) : null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      {faqSchemaData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }} />}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-gray-600 transition-colors">Products</Link>
        <ChevronRight size={14} />
        <span className="text-gray-600">{cat.name}</span>
      </nav>

      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} style={{ color: '#1B4332' }} />
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>SafeScore™ Rated</span>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
        Best {cat.name} of 2026: Reviews &amp; Buyer&apos;s Guide
      </h1>

      {meta.intro && (
        <p className="text-lg text-gray-600 mb-8 max-w-3xl leading-relaxed border-l-4 pl-4" style={{ borderColor: '#1B4332' }}>
          {meta.intro}
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2">
          {/* Quick links row */}
          {(meta.guideSlug || meta.compareSlug) && (
            <div className="flex flex-wrap gap-3 mb-8">
              {meta.guideSlug && meta.guideName && (
                <Link
                  href={`/guides/${meta.guideSlug}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors hover:border-green-700 hover:text-green-800"
                  style={{ borderColor: '#1B4332', color: '#1B4332' }}
                >
                  <BookOpen size={14} />
                  {meta.guideName}
                </Link>
              )}
              {meta.compareSlug && meta.compareName && (
                <Link
                  href={`/compare/${meta.compareSlug}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors hover:border-green-700 hover:text-green-800"
                  style={{ borderColor: '#1B4332', color: '#1B4332' }}
                >
                  <BarChart2 size={14} />
                  {meta.compareName}
                </Link>
              )}
            </div>
          )}

          {/* Product grid */}
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {(products || []).map((p: Parameters<typeof ProductCard>[0]['product']) => (
              <ProductCard key={p.slug} product={p} />
            ))}
            {(!products || products.length === 0) && (
              <p className="col-span-2 text-gray-400 py-8">Reviews coming soon.</p>
            )}
          </div>

          {/* Buying tips */}
          {meta.buyingTips.length > 0 && (
            <div className="rounded-xl border border-gray-100 p-6 mb-8" style={{ backgroundColor: '#FAFAF7' }}>
              <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
                {cat.name} Buying Tips
              </h2>
              <ul className="space-y-3">
                {meta.buyingTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="shrink-0 font-semibold text-green-800 mt-0.5">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQ section */}
          {categoryFaqs && categoryFaqs.length > 0 && (
            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold mb-5" style={{ color: '#1A1A1A' }}>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {categoryFaqs.map((faq, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#FAFAF7' }}>
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Find a contractor CTA */}
          <div className="rounded-xl p-6 border border-amber-200" style={{ backgroundColor: '#fffbeb' }}>
            <h2 className="font-serif text-lg font-semibold mb-2 text-amber-900">
              Need professional installation?
            </h2>
            <p className="text-amber-800 text-sm mb-4 leading-relaxed">
              CAPS-certified contractors are trained specifically in aging-in-place modifications.
              Get free quotes with no obligation.
            </p>
            <Link
              href="/contractors"
              className="inline-block px-6 py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#D97706' }}
            >
              Find a CAPS Contractor →
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Suspense>
            <LeadForm
              category={category}
              headline={`Get Free ${cat.name} Quotes`}
            />
          </Suspense>

          {meta.compareSlug && meta.compareName && (
            <Link
              href={`/compare/${meta.compareSlug}`}
              className="block p-5 rounded-xl border-2 hover:shadow-sm transition-all group"
              style={{ borderColor: '#1B4332' }}
            >
              <div className="flex items-center gap-1.5 text-xs mb-2 font-semibold uppercase tracking-wide" style={{ color: '#1B4332' }}>
                <BarChart2 size={12} />
                Side-by-Side Comparison
              </div>
              <p className="font-semibold text-sm text-gray-800 group-hover:text-green-800 transition-colors leading-tight">
                {meta.compareName} →
              </p>
            </Link>
          )}

          {meta.guideSlug && meta.guideName && (
            <Link
              href={`/guides/${meta.guideSlug}`}
              className="block p-5 rounded-xl border border-gray-100 hover:border-green-700 hover:shadow-sm transition-all group"
              style={{ backgroundColor: '#FAFAF7' }}
            >
              <div className="flex items-center gap-1.5 text-xs mb-2 font-semibold uppercase tracking-wide text-gray-400">
                <BookOpen size={12} />
                Cost Guide
              </div>
              <p className="font-semibold text-sm text-gray-800 group-hover:text-green-800 transition-colors leading-tight">
                {meta.guideName} →
              </p>
            </Link>
          )}

          <div className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#FAFAF7' }}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Other Categories</p>
            <div className="space-y-1.5">
              {Object.keys(CATEGORY_META)
                .filter(c => c !== category)
                .slice(0, 6)
                .map(c => (
                  <Link
                    key={c}
                    href={`/products/${c}`}
                    className="block text-sm text-gray-600 hover:text-green-800 hover:underline transition-colors"
                  >
                    {c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
