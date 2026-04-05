import { supabase } from '@/lib/supabase';
import { SafeScore } from '@/components/SafeScore';
import { LeadForm } from '@/components/LeadForm';
import { buildAffiliateUrl } from '@/lib/affiliate';
import { productSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface Props { params: Promise<{ category: string; slug: string }> }

const CATEGORY_FAQS: Record<string, { question: string; answer: string }[]> = {
  stairlifts: [
    { question: 'How long does stairlift installation take?', answer: 'A straight stairlift typically installs in 2–4 hours. Curved stairlifts with custom rails may take a full day. Most manufacturers install through authorized dealers who will provide a firm timeline during the in-home quote.' },
    { question: 'Does a stairlift work during a power outage?', answer: 'Most modern stairlifts run on DC battery power and include battery backup. The lift will continue operating through short power outages. The batteries recharge automatically when the lift parks at either end of the rail.' },
    { question: 'What is the weight limit for a stairlift?', answer: 'Standard stairlifts handle 250–300 lbs. Heavy-duty models (available from most major brands) support 350–500 lbs. Check the specific model\'s rated weight capacity before purchasing.' },
  ],
  'walk-in-tubs': [
    { question: 'How long does it take for a walk-in tub to drain?', answer: 'Standard walk-in tubs drain in 3–5 minutes. Models with fast-drain technology (like the Safe Step 7100) can drain in under 2 minutes. Faster drain time means less time sitting in cooling water.' },
    { question: 'Do I have to sit in the tub while it fills and drains?', answer: 'Yes — the door must be closed for the tub to be watertight, which means you enter before filling and remain until fully drained. This is why fast-drain technology is an important feature.' },
    { question: 'Can a walk-in tub be installed in any bathroom?', answer: 'A standard walk-in tub requires roughly the same floor space as a standard 60-inch tub. Installation involves modifying existing plumbing. Most homes can accommodate a walk-in tub, but an in-home measurement is recommended before purchasing.' },
  ],
  'grab-bars': [
    { question: 'Can I install a grab bar myself?', answer: 'Grab bars can be DIY-installed if you have basic tools and the ability to locate wall studs. The bar must be anchored into studs or with rated wall anchors — drywall alone is not sufficient for safety. For bathrooms with tile walls, professional installation is recommended.' },
    { question: 'How much weight can a grab bar hold?', answer: 'ADA-compliant grab bars are tested to hold 250 lbs minimum. Many quality bars (like the Moen SecureMount) are rated to 500 lbs. The strength of the installation is as important as the bar\'s own rating.' },
    { question: 'Where should grab bars be placed in a bathroom?', answer: 'ADA guidelines recommend a horizontal bar 33–36 inches from the floor on the shower long wall, and a vertical or angled bar near the entry for step-in/step-out support. Beside the toilet, a 42-inch horizontal bar at 33 inches from the floor is standard.' },
  ],
  'medical-alerts': [
    { question: 'Does a medical alert system work without Wi-Fi?', answer: 'Yes — most home medical alert systems use cellular networks (not Wi-Fi) for their monitoring connection. The base station connects via cellular even if your home internet is down. Some systems offer Wi-Fi as a backup, not primary, connection.' },
    { question: 'What happens when you press the medical alert button?', answer: 'Pressing the button connects you to the monitoring center\'s dispatcher via the base station (or through the button itself on mobile systems). The dispatcher will assess the situation and, if needed, contact emergency services and your designated contacts.' },
    { question: 'Can medical alert systems detect falls automatically?', answer: 'Yes — most major providers offer optional fall detection via accelerometers in the wearable button. Detection accuracy varies by brand, typically 70–85%. Fall detection costs approximately $5–$10/month extra on top of the base monitoring fee.' },
  ],
  'wheelchair-ramps': [
    { question: 'What slope should a wheelchair ramp be?', answer: 'ADA guidelines recommend a maximum 1:12 slope — one inch of rise per 12 inches (1 foot) of ramp length. For example, a 6-inch entry step needs a minimum 6-foot ramp. Gentler slopes are always safer but require more space.' },
    { question: 'Do wheelchair ramps require permits?', answer: 'Permanent attached ramps typically require a building permit. Freestanding modular aluminum ramps generally do not. Portable folding ramps never require permits. Requirements vary by municipality — check with your local building department.' },
    { question: 'How much weight can a wheelchair ramp support?', answer: 'Portable aluminum ramps typically support 600–800 lbs. Modular systems and professionally built permanent ramps support 800 lbs or more. Always verify the specific ramp\'s weight rating before use.' },
  ],
  'home-elevators': [
    { question: 'Does a home elevator require a shaft?', answer: 'Traditional cable and hydraulic elevators require a shaft. Pneumatic (vacuum) elevators like the Savaria Vuelift are freestanding and require only a ceiling cutout — no dedicated shaft construction. Vertical platform lifts also require no shaft.' },
    { question: 'What is the difference between a stairlift and a home elevator?', answer: 'A stairlift travels along the staircase on a rail; a home elevator travels vertically in an enclosed cab or on a platform. Elevators are better for wheelchair users or multi-floor travel. Stairlifts are more affordable and easier to install for users who can walk.' },
    { question: 'How much does home elevator maintenance cost?', answer: 'Annual professional maintenance for residential elevators typically costs $200–$500. Most states require licensed elevator inspection. Factor this into your total cost of ownership when evaluating home elevator options.' },
  ],
  'bath-safety': [
    { question: 'What is the difference between a shower chair and a transfer bench?', answer: 'A shower chair sits entirely inside the shower for users who need to sit while bathing. A transfer bench straddles the tub wall with half inside and half outside — designed for users who cannot step over the tub edge at all.' },
    { question: 'Do bath safety products require installation?', answer: 'Most bath safety accessories (shower chairs, transfer benches, bath mats) require no installation — they sit on the floor or hang on the tub edge. Grab bars do require installation into wall studs or with rated anchors.' },
  ],
  'smart-home-safety': [
    { question: 'Can smart home devices help seniors live independently longer?', answer: 'Yes — voice-controlled devices, smart smoke detectors, and monitored security systems each address specific safety needs. Voice control (via Alexa or Google) is particularly valuable for users with limited mobility or vision who can\'t easily use touchscreens.' },
    { question: 'What smart devices are most useful for aging in place?', answer: 'The highest-impact smart devices are: (1) voice assistant with a screen for video calls and reminders, (2) smart smoke/CO detectors with app notifications, (3) medical alert system or monitored security system, and (4) smart lock for keyless access management.' },
  ],
  'mobility-aids': [
    { question: 'What is the difference between a walker and a rollator?', answer: 'A standard walker is a four-legged frame you lift with each step — providing maximum stability. A rollator has four wheels (often with a seat and brakes) and rolls continuously — easier to push but requires more balance control. A two-wheeled walker is a middle ground.' },
    { question: 'What wheel size rollator should I choose?', answer: '6-inch wheels work well for smooth indoor surfaces. 8-inch wheels handle outdoor terrain (sidewalk cracks, gravel, grass) much better. If your loved one will use the rollator outdoors regularly, the larger wheels are worth the slightly bulkier size.' },
  ],
  'door-access': [
    { question: 'Does a smart lock work without internet?', answer: 'Most smart locks work offline for basic keypad entry even without internet. The smartphone app features (remote access, activity log, digital keys) require internet connectivity. Physical keypads always work independently of Wi-Fi or Bluetooth.' },
    { question: 'How secure are keypad locks?', answer: 'ANSI Grade 1 keypad deadbolts (like the Kwikset 991) provide the highest residential security rating. Keypad entry with a numeric PIN is generally as secure as a physical key for everyday use.' },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: p } = await supabase.from('sh_products').select('name, description, brand').eq('slug', slug).single();
  if (!p) return {};
  return {
    title: `${p.name} Review — ${p.brand}`,
    description: p.description?.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug, category } = await params;
  const { data: product } = await supabase
    .from('sh_products')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (!product) notFound();

  const affiliateUrl = product.affiliate_url
    ? buildAffiliateUrl(product.affiliate_url, product.affiliate_network || 'direct', slug)
    : null;

  const categoryFaqs = CATEGORY_FAQS[category] || [];

  // Fetch related products from same category
  const { data: related } = await supabase
    .from('sh_products')
    .select('slug, name, brand, safe_score, price_min, price_max, description')
    .eq('category', category)
    .eq('is_published', true)
    .neq('slug', slug)
    .order('safe_score', { ascending: false })
    .limit(3);

  // Determine compare slug
  const COMPARE_SLUGS: Record<string, string> = {
    stairlifts: 'best-stairlifts',
    'walk-in-tubs': 'best-walk-in-tubs',
    'grab-bars': 'best-grab-bars',
    'medical-alerts': 'best-medical-alerts',
    'mobility-aids': 'best-rollator-walkers',
  };
  const compareSlug = COMPARE_SLUGS[category];

  const schema = productSchema(product);
  const faqSchemaData = categoryFaqs.length > 0 ? faqSchema(categoryFaqs) : null;
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://www.safeathomeguides.com' },
    { name: 'Products', url: 'https://www.safeathomeguides.com/products' },
    { name: category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), url: `https://www.safeathomeguides.com/products/${category}` },
    { name: product.name, url: `https://www.safeathomeguides.com/products/${category}/${slug}` },
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      {faqSchemaData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }} />}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-gray-600 transition-colors">Products</Link>
        <ChevronRight size={14} />
        <Link href={`/products/${category}`} className="hover:text-gray-600 transition-colors capitalize">
          {category.replace(/-/g, ' ')}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <p className="text-sm text-gray-400 mb-1 uppercase tracking-wide">{product.brand}</p>
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>{product.name}</h1>

          <div className="flex items-center gap-6 mb-6">
            {product.safe_score && (
              <SafeScore score={product.safe_score} breakdown={product.safe_score_breakdown} size="lg" />
            )}
            <div>
              {(product.price_min || product.price_max) && (
                <p className="font-mono text-2xl font-semibold" style={{ color: '#1B4332' }}>
                  {product.price_min && product.price_max
                    ? `$${product.price_min.toLocaleString()} – $${product.price_max.toLocaleString()}`
                    : product.price_min
                    ? `From $${product.price_min.toLocaleString()}`
                    : `Up to $${product.price_max!.toLocaleString()}`}
                </p>
              )}
              {affiliateUrl && (
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-2 inline-block px-6 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#D97706' }}
                >
                  Check Current Price →
                </a>
              )}
            </div>
          </div>

          {/* Summary verdict box */}
          {product.description && (
            <div className="rounded-xl border-l-4 p-5 mb-6" style={{ backgroundColor: '#f0fdf4', borderColor: '#1B4332' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#1B4332' }}>SafeAtHome Guide&apos;s Take</p>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.long_description && (
            <div className="prose max-w-none mb-8">
              {product.long_description.split('\n\n').map((para: string, i: number) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>
              ))}
            </div>
          )}

          {(product.pros || product.cons) && (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {product.pros && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold mb-3" style={{ color: '#1B4332' }}>Pros</h3>
                  <ul className="space-y-2">
                    {(product.pros as string[]).map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: '#1B4332' }} />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {product.cons && (
                <div className="bg-red-50 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-red-700">Cons</h3>
                  <ul className="space-y-2">
                    {(product.cons as string[]).map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <XCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {product.specs && (
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-semibold mb-4">Specifications</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {Object.entries(product.specs as Record<string, string>).map(([key, val]) => (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium text-gray-600 w-1/3 capitalize">{key.replace(/_/g, ' ')}</td>
                      <td className="py-2 text-gray-800">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* FAQ section */}
          {categoryFaqs.length > 0 && (
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

          {/* Back to category */}
          <div className="mb-4">
            <Link
              href={`/products/${category}`}
              className="text-sm font-medium hover:underline"
              style={{ color: '#1B4332' }}
            >
              ← See all {category.replace(/-/g, ' ')} reviews
            </Link>
          </div>
        </div>

        <aside className="space-y-6">
          <Suspense>
            <LeadForm category={category} headline="Get Installation Quotes" />
          </Suspense>

          {/* Compare link */}
          {compareSlug && (
            <Link
              href={`/compare/${compareSlug}`}
              className="flex items-center justify-between p-5 rounded-xl border-2 group transition-colors"
              style={{ borderColor: '#1B4332' }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#1B4332' }}>Compare</p>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-green-800 transition-colors leading-tight">
                  Compare top {category.replace(/-/g, ' ')} products side by side →
                </p>
              </div>
            </Link>
          )}

          {/* Find a contractor CTA */}
          <div className="rounded-xl border border-amber-200 p-5" style={{ backgroundColor: '#fffbeb' }}>
            <p className="font-semibold text-amber-900 mb-1">Need professional installation?</p>
            <p className="text-sm text-amber-800 mb-3">A CAPS-certified contractor can assess your home and install safely.</p>
            <Link
              href="/contractors"
              className="inline-block px-4 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#D97706' }}
            >
              Find a Contractor Near You →
            </Link>
          </div>

          {/* Related products */}
          {related && related.length > 0 && (
            <div className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#FAFAF7' }}>
              <h3 className="font-semibold text-gray-800 mb-3">Also Consider</h3>
              <div className="space-y-3">
                {related.map((r: { slug: string; name: string; brand: string; safe_score?: number; price_min?: number; price_max?: number }) => (
                  <Link
                    key={r.slug}
                    href={`/products/${category}/${r.slug}`}
                    className="block p-3 rounded-lg bg-white border border-gray-100 hover:border-green-700 hover:shadow-sm transition-all group"
                  >
                    <p className="text-xs text-gray-400 mb-0.5">{r.brand}</p>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-green-800 leading-tight">{r.name}</p>
                    {r.safe_score && (
                      <p className="text-xs font-mono mt-1" style={{ color: '#1B4332' }}>SafeScore™ {r.safe_score}/100</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
