import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { LeadForm } from '@/components/LeadForm';
import { faqSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { BookOpen, DollarSign, ChevronRight } from 'lucide-react';

interface Props { params: Promise<{ slug: string }> }

// Map guide slugs → product categories + static guide content
const GUIDE_META: Record<string, {
  title: string;
  description: string;
  category: string;
  intro: string;
  faqs: { question: string; answer: string }[];
  costBreakdown?: { item: string; low: number; high: number }[];
}> = {
  'stairlift-cost-guide': {
    title: 'How Much Does a Stairlift Cost in 2026?',
    description: 'Complete stairlift cost guide: new vs refurbished, straight vs curved, installation fees, and financing options. Updated March 2026.',
    category: 'stairlifts',
    intro: 'Stairlifts range from $2,000 for a basic straight-rail model to over $15,000 for a custom curved installation. The biggest cost drivers are the staircase shape, weight capacity, and brand. This guide breaks down every cost factor so you know exactly what to budget.',
    faqs: [
      { question: 'Does Medicare cover stairlifts?', answer: 'Standard Medicare (Parts A and B) does not cover stairlifts because they are not classified as durable medical equipment. Some Medicare Advantage plans and Medicaid programs may offer partial coverage — check with your specific plan.' },
      { question: 'How long does stairlift installation take?', answer: 'A straight stairlift takes 2–4 hours to install. Curved stairlifts, which require custom-bent rails, typically take a full day.' },
      { question: 'Can I install a stairlift myself?', answer: 'Most manufacturers strongly advise against DIY installation for safety and warranty reasons. Some basic straight models have DIY kits, but professional installation is standard and often required for warranty coverage.' },
      { question: 'What is the weight limit for most stairlifts?', answer: 'Standard stairlifts handle 250–300 lbs. Heavy-duty models (available from most major brands) support 350–500 lbs, at a 20–40% price premium.' },
    ],
    costBreakdown: [
      { item: 'Straight stairlift (new)', low: 2000, high: 5000 },
      { item: 'Curved stairlift (new)', low: 8000, high: 15000 },
      { item: 'Refurbished straight', low: 1000, high: 2500 },
      { item: 'Professional installation', low: 200, high: 500 },
      { item: 'Extended warranty (3 yr)', low: 300, high: 700 },
    ],
  },
  'walk-in-tub-cost-guide': {
    title: 'Walk-In Tub Cost Guide: What to Expect in 2026',
    description: 'Walk-in tub prices, installation costs, and what insurance may cover. Includes brand comparisons and buying tips.',
    category: 'walk-in-tubs',
    intro: 'Walk-in tubs typically cost $1,500–$5,000 for the unit, plus $1,000–$3,000 for professional installation — a total investment of $2,500–$8,000. Soaking and hydrotherapy models cost more. Here\'s everything that affects the final price.',
    faqs: [
      { question: 'Does insurance cover walk-in tubs?', answer: 'Private health insurance rarely covers walk-in tubs. Medicaid Home and Community-Based Services (HCBS) waivers may cover them for qualifying seniors. Some VA programs cover bathroom modifications for veterans.' },
      { question: 'How long does walk-in tub installation take?', answer: 'Installation typically takes 1–2 days. The plumber must modify existing water lines and drainage, which adds to the timeline.' },
      { question: 'What is the fill and drain time for a walk-in tub?', answer: 'Most tubs fill in 3–5 minutes and drain in 2–3 minutes with a fast-drain valve. You must wait inside the tub during both fill and drain to keep the door watertight.' },
    ],
    costBreakdown: [
      { item: 'Basic soaking tub', low: 1500, high: 3000 },
      { item: 'Hydrotherapy/air jets', low: 3000, high: 5000 },
      { item: 'Bariatric (wide) model', low: 4000, high: 7000 },
      { item: 'Professional installation', low: 1000, high: 3000 },
      { item: 'Electrical (if required)', low: 200, high: 600 },
    ],
  },
  'grab-bar-installation-guide': {
    title: 'Grab Bar Installation Guide: Where to Put Them and How Much It Costs',
    description: 'ADA-compliant grab bar placement, installation costs, and which bars work best for different needs. Written with occupational therapists.',
    category: 'grab-bars',
    intro: 'Grab bars are one of the most cost-effective home safety investments — a single professionally installed bar costs $75–$200, and they prevent tens of thousands of bathroom falls each year. Correct placement matters as much as the product itself.',
    faqs: [
      { question: 'Can grab bars be installed on any wall?', answer: 'Grab bars must be anchored into wall studs or with toggle bolt anchors rated for 250+ lbs. Drywall alone cannot support a grab bar safely. A professional installer will locate studs or use specialized anchors.' },
      { question: 'Where should grab bars be placed in a shower?', answer: 'ADA guidelines recommend a horizontal bar 33–36 inches from the floor on the long wall, and an angled or vertical bar near the entry point for getting in and out.' },
      { question: 'Are grab bars only for elderly people?', answer: 'Grab bars benefit anyone recovering from surgery, anyone with balance issues, or anyone who wants to reduce fall risk. They are increasingly used in universal design for all ages.' },
    ],
    costBreakdown: [
      { item: 'Basic stainless bar (each)', low: 20, high: 60 },
      { item: 'Designer/decorative bar', low: 60, high: 200 },
      { item: 'Professional installation (per bar)', low: 75, high: 150 },
      { item: 'Full bathroom package (4–6 bars)', low: 400, high: 900 },
    ],
  },
  'does-medicare-cover-stairlifts': {
    title: 'Does Medicare Cover Stairlifts? (2026 Guide)',
    description: 'Medicare Parts A, B, and C coverage for stairlifts explained — plus Medicaid waiver programs, VA benefits, and state grant programs that may help pay.',
    category: 'stairlifts',
    intro: 'The short answer: standard Medicare (Parts A and B) does not cover stairlifts. However, several alternative programs — including some Medicare Advantage plans, Medicaid HCBS waivers, and VA benefits — may cover part or all of the cost. Here\'s how to find out what you qualify for.',
    faqs: [
      { question: 'Does Medicare Part B cover stairlifts?', answer: 'No. Medicare Part B covers durable medical equipment (DME) such as wheelchairs, walkers, and hospital beds. Stairlifts are classified as home modifications — not DME — so they fall outside Part B coverage. This classification has not changed under recent CMS rulemakings.' },
      { question: 'Does Medicare Advantage cover stairlifts?', answer: 'Some Medicare Advantage (Part C) plans include a "Healthy Home" or "Home Safety" supplemental benefit that covers home modifications including stairlifts. Coverage and dollar limits vary by plan. Call your plan\'s member services line and ask specifically about home modification benefits.' },
      { question: 'Does Medicaid cover stairlifts?', answer: 'Medicaid coverage depends on your state. Many states have Home and Community-Based Services (HCBS) waiver programs that fund home modifications to help seniors stay at home. Common program names include "PACE," "CHOICES," and "Community First Choice." Contact your state Medicaid office or Area Agency on Aging.' },
      { question: 'Does the VA cover stairlifts for veterans?', answer: 'Yes. The VA offers two home modification grants: the Specially Adapted Housing (SAH) grant (up to $109,986 in 2024) and the Special Housing Adaptation (SHA) grant (up to $22,036). Veterans with service-connected disabilities may qualify. Apply through your VA regional office.' },
      { question: 'Are there other financial assistance programs for stairlifts?', answer: 'Yes — several. The USDA Section 504 Rural Repair and Rehabilitation Program provides grants up to $10,000 to very low-income homeowners. Many Area Agencies on Aging run local modification programs. Some states have dedicated senior home repair programs. The National Council on Aging\'s BenefitsCheckUp tool can identify programs in your area.' },
      { question: 'Are stairlifts tax deductible?', answer: 'Stairlifts may be partially deductible as a medical expense if your total medical expenses exceed 7.5% of your adjusted gross income. The deductible amount is the cost minus any increase in home value the lift provides (typically $0 for a stairlift). Consult a tax professional.' },
    ],
    costBreakdown: [
      { item: 'Medicare coverage', low: 0, high: 0 },
      { item: 'Medicare Advantage (varies by plan)', low: 0, high: 1500 },
      { item: 'Medicaid HCBS waiver (varies by state)', low: 0, high: 5000 },
      { item: 'VA SAH/SHA grant', low: 0, high: 109986 },
      { item: 'Your out-of-pocket cost', low: 2000, high: 5000 },
    ],
  },
  'does-medicare-cover-walk-in-tubs': {
    title: 'Does Medicare Cover Walk-In Tubs? (2026 Guide)',
    description: 'The truth about Medicare, Medicaid, and VA coverage for walk-in tubs — and which programs actually pay for bathroom modifications.',
    category: 'walk-in-tubs',
    intro: 'Standard Medicare does not cover walk-in tubs. But multiple programs — Medicare Advantage supplemental benefits, Medicaid waivers, and VA grants — may help cover bathroom modifications. Here\'s the complete guide to financial assistance for walk-in tubs.',
    faqs: [
      { question: 'Does Medicare cover walk-in tubs?', answer: 'Standard Medicare (Parts A and B) does not cover walk-in tubs. Like stairlifts, walk-in tubs are classified as home modifications rather than durable medical equipment under CMS guidelines.' },
      { question: 'What about Medicare Advantage?', answer: 'Some Medicare Advantage plans include home modification benefits through "Healthy Home," "Home Safety," or "Supplemental Home Benefit" add-ons. Dollar limits typically range from $500 to $2,500 per year. Call your plan and specifically ask about bathroom modification coverage.' },
      { question: 'Will Medicaid cover a walk-in tub?', answer: 'Medicaid Home and Community-Based Services (HCBS) waivers in many states fund home modifications to prevent nursing home placement. Walk-in tubs are commonly approved under these programs. Income and functional eligibility requirements apply. Contact your local Area Agency on Aging to apply.' },
      { question: 'Can the VA pay for a walk-in tub?', answer: 'Yes. Veterans with service-connected disabilities may qualify for VA Specially Adapted Housing (SAH) or SHA grants that cover bathroom modifications. Additionally, the VA\'s Home Improvements and Structural Alterations (HISA) grant provides up to $6,800 for veterans with service-connected conditions and up to $2,000 for non-service-connected conditions.' },
      { question: 'Are there nonprofit programs that help pay for walk-in tubs?', answer: 'Several national nonprofits fund home modifications: Rebuilding Together (free modifications for low-income homeowners), Habitat for Humanity Home Repair, and local Community Action Agencies. Many states also have specific senior home repair programs — search "[your state] senior home modification grant."' },
    ],
    costBreakdown: [
      { item: 'Medicare Part A/B coverage', low: 0, high: 0 },
      { item: 'Medicare Advantage benefit', low: 0, high: 2500 },
      { item: 'Medicaid HCBS waiver', low: 0, high: 8000 },
      { item: 'VA HISA grant', low: 0, high: 6800 },
      { item: 'Typical out-of-pocket (after assistance)', low: 1500, high: 6000 },
    ],
  },
  'aging-in-place-home-modifications-checklist': {
    title: 'Aging-in-Place Home Modifications: Complete Room-by-Room Checklist',
    description: 'Everything you need to modify in your home to safely age in place — organized by room, priority level, and estimated cost.',
    category: 'grab-bars',
    intro: 'A complete aging-in-place home modification covers six key areas: the bathroom, bedroom, kitchen, entrance, stairways, and outdoor spaces. This checklist prioritizes modifications by fall risk reduction — the leading cause of injury hospitalizations for adults 65+.',
    faqs: [
      { question: 'What are the most important aging-in-place modifications?', answer: 'By frequency of injury prevention: (1) bathroom grab bars, (2) non-slip surfaces in bathroom and entry, (3) improved lighting throughout, (4) stair handrails on both sides, (5) removal of throw rugs and tripping hazards. These five changes address the majority of fall risks.' },
      { question: 'What does a full aging-in-place modification cost?', answer: 'A basic package (grab bars, non-slip mats, improved lighting) costs $500–$2,000. A comprehensive modification including a stairlift, walk-in tub, and contractor work runs $10,000–$30,000. Most families implement in phases over 2–3 years.' },
      { question: 'Do I need a CAPS contractor for modifications?', answer: 'CAPS (Certified Aging-in-Place Specialist) certification means the contractor has NAHB training in aging-in-place design. For complex projects involving structural changes, a CAPS contractor is strongly recommended. For basic modifications like grab bars and ramps, any licensed, insured contractor can handle the work.' },
      { question: 'How do I prioritize modifications on a budget?', answer: 'Start with fall prevention in the bathroom — grab bars, a non-slip mat, and a shower chair cost under $300 total and address the highest-risk area. Then address entry and stair safety. Save major items like stairlifts and walk-in tubs for when they become necessary or when funding is secured.' },
      { question: 'Can modifications hurt my home\'s resale value?', answer: 'Most modifications are either invisible (grab bars) or add value to buyers who need them. Stairlifts and walk-in tubs can be removed if needed. Studies show that accessible homes sell faster and at comparable prices in markets with aging populations.' },
    ],
    costBreakdown: [
      { item: 'Bathroom grab bars (4–6 bars + install)', low: 300, high: 800 },
      { item: 'Non-slip surfaces + lighting', low: 150, high: 400 },
      { item: 'Entry ramp + handrail', low: 500, high: 2000 },
      { item: 'Stairlift (straight)', low: 2000, high: 5000 },
      { item: 'Walk-in tub (installed)', low: 3500, high: 10000 },
      { item: 'Full home CAPS assessment', low: 200, high: 500 },
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = GUIDE_META[slug];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const meta = GUIDE_META[slug];
  if (!meta) notFound();

  const { data: products } = await supabase
    .from('sh_products')
    .select('*')
    .eq('category', meta.category)
    .eq('is_published', true)
    .order('safe_score', { ascending: false })
    .limit(4);

  const schema = faqSchema(meta.faqs);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-gray-600 transition-colors">Products</Link>
        <ChevronRight size={14} />
        <span className="text-gray-600">Guides</span>
      </nav>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} style={{ color: '#1B4332' }} />
            <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>Cost Guide</span>
          </div>

          <h1 className="font-serif text-4xl font-bold mb-4 leading-tight" style={{ color: '#1A1A1A' }}>
            {meta.title}
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed mb-10 border-l-4 pl-4" style={{ borderColor: '#1B4332' }}>
            {meta.intro}
          </p>

          {/* Cost breakdown */}
          {meta.costBreakdown && (
            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#1A1A1A' }}>
                <DollarSign size={20} style={{ color: '#D97706' }} />
                Cost Breakdown
              </h2>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: '#1B4332' }}>
                      <th className="text-left py-3 px-4 text-white font-semibold">Item</th>
                      <th className="text-right py-3 px-4 text-white font-semibold">Low</th>
                      <th className="text-right py-3 px-4 text-white font-semibold">High</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meta.costBreakdown.map((row, i) => (
                      <tr key={row.item} style={{ backgroundColor: i % 2 === 0 ? '#FAFAF7' : '#fff' }}>
                        <td className="py-3 px-4 text-gray-700">{row.item}</td>
                        <td className="py-3 px-4 text-right font-mono" style={{ color: '#1B4332' }}>${row.low.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono" style={{ color: '#1B4332' }}>${row.high.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#f0fdf4' }}>
                      <td className="py-3 px-4 font-semibold text-gray-800">Total (estimated)</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold" style={{ color: '#1B4332' }}>
                        ${meta.costBreakdown.reduce((s, r) => s + r.low, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold" style={{ color: '#1B4332' }}>
                        ${meta.costBreakdown.reduce((s, r) => s + r.high, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {meta.faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#FAFAF7' }}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Top products */}
          {products && products.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
                Top-Rated Products in This Category
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {products.map((p: Parameters<typeof ProductCard>[0]['product']) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href={`/products/${meta.category}`}
                  className="font-semibold hover:underline"
                  style={{ color: '#1B4332' }}
                >
                  See all {meta.category.replace(/-/g, ' ')} →
                </Link>
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <Suspense>
            <LeadForm
              category={meta.category}
              headline="Get Free Installation Quotes"
            />
          </Suspense>

          {/* Related guides */}
          <div className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#FAFAF7' }}>
            <h3 className="font-semibold text-gray-800 mb-3">More Cost Guides</h3>
            <div className="space-y-2">
              {Object.entries(GUIDE_META)
                .filter(([s]) => s !== slug)
                .map(([s, g]) => (
                  <Link
                    key={s}
                    href={`/guides/${s}`}
                    className="block text-sm hover:underline"
                    style={{ color: '#1B4332' }}
                  >
                    {g.title}
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
