import { supabase } from '@/lib/supabase';
import { ComparisonTable } from '@/components/ComparisonTable';
import { LeadForm } from '@/components/LeadForm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight, BarChart2 } from 'lucide-react';
import { ShareButtons } from '@/components/ShareButtons';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';

interface Props { params: Promise<{ slug: string }> }

// Map comparison slugs to database queries + page content
const COMPARISON_META: Record<string, {
  title: string;
  description: string;
  category: string;
  intro: string;
  verdict: string;
  guideSlug?: string;
  faqs?: { question: string; answer: string }[];
}> = {
  'best-stairlifts': {
    title: 'Best Stairlifts of 2026: Compared and Ranked',
    description: 'Side-by-side stairlift comparison: prices, safety scores, weight limits, and warranty. Find the best model for your home.',
    category: 'stairlifts',
    guideSlug: 'stairlift-cost-guide',
    intro: 'We tested and scored every major stairlift brand on safety, ease of use, installation quality, and value. Here\'s how they stack up.',
    verdict: 'For most straight staircases, a mid-range model in the $3,000–$4,500 range offers the best balance of reliability and features. Curved staircases require custom rails — get at least two quotes before deciding.',
    faqs: [
      { question: 'What is the best stairlift brand?', answer: 'Bruno is consistently rated highest for build quality and service network in North America. Acorn is strong in the UK market. For value, Harmar and AmeriGlide offer competitive pricing with solid warranties. The best brand depends on your specific staircase shape and local service coverage.' },
      { question: 'How much does the best stairlift cost?', answer: 'Top-rated straight stairlifts typically cost $3,000–$5,000 installed. Curved stairlifts (for staircases with turns or landings) cost $8,000–$15,000 due to custom rail fabrication. Refurbished models from reputable dealers start at $1,500.' },
      { question: 'What warranty should a good stairlift have?', answer: 'Look for a minimum 2-year parts warranty with available service contracts. Bruno offers a lifetime warranty on the track. Acorn offers 1–2 years standard with extended service plans available. Warranties covering the motor, battery, and electronics for at least 2 years are the baseline for quality models.' },
    ],
  },
  'best-walk-in-tubs': {
    title: 'Best Walk-In Tubs of 2026: Compared',
    description: 'Top walk-in tubs compared side by side. Prices, features, drain times, and expert ratings to help you choose.',
    category: 'walk-in-tubs',
    guideSlug: 'walk-in-tub-cost-guide',
    intro: 'Walk-in tubs vary widely in quality, drain speed, and features. We scored the top brands on safety, ease of entry, hydrotherapy options, and value.',
    verdict: 'Prioritize fast-drain technology (under 2 minutes) and a low step-over threshold (under 3 inches). Hydrotherapy jets add cost but are worth it if joint pain is a factor.',
    faqs: [
      { question: 'What is the best walk-in tub?', answer: 'American Standard and Safe Step are consistently top-rated for build quality and service network. For hydrotherapy, Kohler and Ella offer strong jet systems. The best tub depends on whether you want soaking, air jets, or water jets, and your bathroom\'s plumbing setup.' },
      { question: 'How long do you have to sit in a walk-in tub while it drains?', answer: 'Standard walk-in tubs drain in 3–6 minutes after you\'re done bathing. Fast-drain models drain in under 90 seconds. Because you must stay inside while water drains, fast-drain technology is one of the most important features to look for — it prevents chilling.' },
      { question: 'Is a walk-in tub worth the money?', answer: 'Walk-in tubs are worth it for seniors with significant mobility limitations, arthritis, or fall risk from traditional tub entry. They\'re less valuable if the primary concern is fall risk in the shower — a roll-in shower conversion is often cheaper and more accessible than a walk-in tub.' },
    ],
  },
  'best-grab-bars': {
    title: 'Best Grab Bars of 2026: Safety, Style, and Installation',
    description: 'Top grab bars compared — weight ratings, finishes, and which ones are easiest to install correctly.',
    category: 'grab-bars',
    guideSlug: 'grab-bar-installation-guide',
    intro: 'Not all grab bars are equal. Weight rating, surface texture, and mounting hardware all affect safety. We compared the top models for home use.',
    verdict: 'For most bathrooms, a 32-inch stainless steel bar with a textured grip surface is the right choice. Match the finish to your fixtures for a cleaner look.',
    faqs: [
      { question: 'What grab bar weight rating do I need?', answer: 'ADA requires a minimum 250 lb rating. Quality bars are rated 500 lbs. The installation anchor matters as much as the bar itself — bars must be anchored to wall studs or with specialty toggle anchors, never into drywall alone.' },
      { question: 'How many grab bars does a bathroom need?', answer: 'A minimum safe bathroom setup includes: one horizontal bar on the shower/tub long wall (33–36 inches high), one vertical bar at the shower entry, and one 42-inch bar next to the toilet. An occupational therapist can provide a personalized placement assessment.' },
    ],
  },
  'best-medical-alerts': {
    title: 'Best Medical Alert Systems of 2026',
    description: 'Medical alert systems compared on response time, monthly cost, GPS coverage, and fall detection accuracy.',
    category: 'medical-alerts',
    guideSlug: 'medical-alert-cost-guide',
    intro: 'Medical alert systems can call for help when a fall or emergency happens. We evaluated response time, false alarm rate, GPS range, and monthly subscription cost.',
    verdict: 'If your loved one goes outdoors, choose a GPS-enabled system. For primarily home use, a base station + pendant combination is more affordable and reliable.',
    faqs: [
      { question: 'What is the best medical alert system for seniors?', answer: 'The best system depends on lifestyle. For seniors who go out regularly, Bay Alarm Medical and Medical Guardian offer strong GPS + fall detection options. For primarily home-based seniors, a base station + pendant combination (like those from Philips Lifeline or LifeStation) is more affordable and reliable. Avoid long-term contracts.' },
      { question: 'How much does a medical alert system cost per month?', answer: 'Basic home-only systems run $19–$30/month. GPS mobile systems run $30–$50/month. Fall detection add-ons are typically $5–$10/month extra. Most providers offer month-to-month billing — avoid any provider requiring a 12-month upfront commitment.' },
    ],
  },
  'best-rollator-walkers': {
    title: 'Best Rollator Walkers of 2026: Compared and Ranked',
    description: 'Top rollator walkers compared on weight, wheel size, seat comfort, and ease of folding. Find the best rollator for indoor or outdoor use.',
    category: 'mobility-aids',
    intro: 'Rollator walkers vary significantly in weight, wheel size, and stability. We scored the top models on safety, maneuverability, comfort, and value — whether you need it mostly indoors or for outdoor use.',
    verdict: 'For outdoor use, choose a rollator with 8-inch wheels for better terrain handling. For indoor use, a compact lightweight model under 15 lbs is easier to maneuver in tight spaces. Always check weight capacity and seat height before buying.',
    faqs: [
      { question: 'What is the difference between a rollator and a walker?', answer: 'A standard walker has no wheels and requires lifting with each step — best for maximum stability. A rollator has 3 or 4 wheels, hand brakes, and a seat, making it easier to use continuously but slightly less stable than a standard walker. Rollators are better for longer distances and outdoor use.' },
      { question: 'What size rollator do I need?', answer: 'Handle height should allow a 15–20° elbow bend when standing upright. Most rollators are adjustable from 32–38 inches handle height. Heavy-duty rollators (for users over 300 lbs) have wider frames and reinforced seats. Measure doorway widths if you\'ll use it indoors — standard models are 22–25 inches wide.' },
      { question: 'Can a rollator walker be used outdoors?', answer: 'Yes, but look for models with 7–8 inch wheels (vs. standard 5–6 inch) for better outdoor terrain handling. All-terrain rollators with larger wheels handle grass, gravel, and uneven sidewalks more safely. Ensure the brake cable is weather-resistant if used frequently outdoors.' },
    ],
  },
  'best-bath-safety-products': {
    title: 'Best Bath Safety Products of 2026: Shower Chairs, Benches & More',
    description: 'Top bath safety products compared — shower chairs, transfer benches, grab bars, and handheld showerheads. Rated for safety, stability, and ease of use.',
    category: 'bath-safety',
    intro: 'Bath safety products range from simple non-slip mats to wall-mounted shower benches and fully equipped transfer systems. We compared the top options on safety, stability, installation complexity, and value.',
    verdict: 'For most seniors, start with a handheld showerhead ($30–$50) and non-slip mat — then add a shower chair or bench if seated bathing is needed. Wall-mounted benches are more stable but require installation.',
    faqs: [
      { question: 'What bath safety products are most important for seniors?', answer: 'The highest-impact items in order: (1) grab bars — most falls happen at the point of entry/exit; (2) non-slip mat or adhesive strips on the shower floor; (3) handheld showerhead to bathe seated; (4) shower chair or bench for fatigue or balance issues. A transfer bench is needed if stepping over a tub wall is unsafe.' },
      { question: 'What is the difference between a shower chair and a transfer bench?', answer: 'A shower chair sits inside the shower/tub for seated bathing. A transfer bench straddles the tub wall — you slide across from outside the tub, eliminating the need to step over the ledge. Transfer benches are essential for seniors who cannot safely step over a tub edge.' },
      { question: 'Do shower chairs need to be installed?', answer: 'Most shower chairs and benches are freestanding — no installation required. Wall-mounted fold-down seats require screwing into wall studs and offer more floor space when folded up. Freestanding chairs are the fastest safety upgrade, while wall-mounted seats are more permanent and stable.' },
    ],
  },
  'best-wheelchair-ramps': {
    title: 'Best Wheelchair Ramps of 2026: Portable vs. Permanent',
    description: 'Top wheelchair ramps compared — portable folding, modular aluminum, and threshold ramps. Rated on weight capacity, portability, and value.',
    category: 'wheelchair-ramps',
    guideSlug: 'wheelchair-ramp-cost-guide',
    intro: 'Wheelchair ramp options range from $50 threshold ramps to $4,000 permanent modular systems. The right choice depends on rise height, whether the need is temporary or permanent, and whether the ramp needs to be portable. We compared the top options.',
    verdict: 'For small threshold rises (under 3 inches), a rubber threshold ramp is sufficient. For step entries up to 24 inches, a suitcase-style portable ramp works. For permanent step entries of any height, a modular aluminum system is the most durable solution.',
    faqs: [
      { question: 'What length wheelchair ramp do I need?', answer: 'ADA recommends a 1:12 slope — 1 inch of rise requires 12 inches of ramp length. A 6-inch door step needs a 6-foot ramp; a 24-inch porch needs a 24-foot ramp (or switchback design). For portable folding ramps, a 1:8 slope is often acceptable for manual wheelchairs and scooters.' },
      { question: 'Are portable wheelchair ramps as safe as permanent ramps?', answer: 'Quality portable ramps with raised edges and non-slip surfaces are safe for most users. For heavy power wheelchairs (over 300 lbs combined user + chair weight), a permanently anchored modular or wooden ramp provides more stability and peace of mind.' },
      { question: 'How much does a wheelchair ramp cost?', answer: 'Threshold ramps (under 3 inches): $30–$90. Portable folding ramps (1–8 ft): $100–$400. Modular aluminum systems (professional install): $1,500–$4,000. Permanent wooden ramps (contractor-built): $1,200–$3,000 depending on length and complexity.' },
    ],
  },
  'best-smart-home-safety-devices': {
    title: 'Best Smart Home Safety Devices for Seniors (2026)',
    description: 'Top smart home safety products compared — video doorbells, smart smoke detectors, voice assistants, and security systems for aging in place.',
    category: 'smart-home-safety',
    intro: 'Smart home safety devices help seniors live independently longer by adding automated alerts, remote monitoring, and voice-controlled access to help. We compared the top devices on reliability, ease of use, and safety impact.',
    verdict: 'For most homes, start with a Wi-Fi smoke and CO detector and a video doorbell — these two devices address the most common safety gaps at under $200 combined. A voice assistant (Alexa/Echo Show) is the next most impactful addition for daily safety.',
    faqs: [
      { question: 'What smart home devices are most useful for seniors?', answer: 'The highest-impact devices: (1) smart smoke/CO detector with remote alerts for caregivers; (2) video doorbell so seniors can see visitors without getting up; (3) voice assistant (Amazon Echo Show) for hands-free calls, reminders, and media; (4) smart door lock for keyless entry. All four together cost under $500.' },
      { question: 'Can smart home devices help seniors live independently longer?', answer: 'Yes — smart home devices reduce fall risk (motion sensor night lights, automated lighting) and enable remote monitoring by family. Studies show that activity monitoring systems can detect health changes 2–3 weeks before a crisis event. Voice assistants also reduce isolation, which is associated with faster cognitive decline.' },
      { question: 'Do smart home devices work without wifi?', answer: 'Most smart home safety devices require Wi-Fi. If reliable internet is unavailable, consider cellular-connected options: cellular medical alert systems, 4G video doorbells, and cellular smoke detectors work without broadband. Wi-Fi extenders can expand coverage in larger homes.' },
    ],
  },
  'best-smart-door-locks': {
    title: 'Best Smart Door Locks for Seniors & Aging in Place (2026)',
    description: 'Top smart locks and keypad deadbolts compared — keyless entry, auto-lock, and caregiver access features. Ideal for seniors and aging-in-place homes.',
    category: 'door-access',
    intro: 'Smart locks and keypad deadbolts eliminate the need to fumble with keys — particularly valuable for seniors with arthritis or cognitive decline. We compared the top models on ease of use, security, and caregiver-friendly features.',
    verdict: 'For most seniors, a Grade 1 keypad deadbolt with auto-lock is the right choice — it eliminates keys while maintaining security. Add a smart lock with an app if a family caregiver needs remote monitoring or access management.',
    faqs: [
      { question: 'Are smart locks safe for seniors with dementia?', answer: 'With proper setup, yes. Choose a lock with auto-lock (automatically locks after a set time) to prevent wandering. Caregiver apps allow remote monitoring and locking. PIN codes can be set as simple as needed. Some systems also alert caregivers when the door opens — useful for memory care situations.' },
      { question: 'Can I install a smart lock myself?', answer: 'Most smart locks replace your existing deadbolt using standard door prep (2-1/8 inch bore hole). Installation takes 15–30 minutes with a screwdriver. Schlage, Kwikset, and Yale all offer DIY-friendly installs with detailed instructions. If your door frame is damaged or non-standard, a locksmith can assist.' },
      { question: 'What is the most secure smart lock for a front door?', answer: 'Look for ANSI/BHMA Grade 1 certification — the highest residential security rating. Schlage Encode and Schlage Connect are Grade 1 and among the most pick-resistant locks on the market. Avoid Grade 3 locks (often found in budget models) for main entry doors.' },
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = COMPARISON_META[slug];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
    twitter: { title: meta.title, description: meta.description },
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

  const faqSchemaData = meta.faqs && meta.faqs.length > 0 ? faqSchema(meta.faqs) : null;
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://www.safeathomeguides.com' },
    { name: 'Compare', url: 'https://www.safeathomeguides.com/compare' },
    { name: meta.title, url: `https://www.safeathomeguides.com/compare/${slug}` },
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      {faqSchemaData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }} />}

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

      <div className="mb-6">
        <ShareButtons title={meta.title} url={`https://www.safeathomeguides.com/compare/${slug}`} />
      </div>

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

      {/* FAQ section */}
      {meta.faqs && meta.faqs.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-semibold mb-5" style={{ color: '#1A1A1A' }}>
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

        <aside className="space-y-5">
          <Suspense>
            <LeadForm category={meta.category} headline="Get Free Quotes" />
          </Suspense>

          {meta.guideSlug && (
            <Link
              href={`/guides/${meta.guideSlug}`}
              className="flex items-center justify-between p-5 rounded-xl border border-gray-100 group transition-colors hover:border-green-300"
              style={{ backgroundColor: '#FAFAF7' }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-gray-400">Cost Guide</p>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-green-800 transition-colors leading-tight">
                  {meta.category.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Cost Guide →
                </p>
              </div>
            </Link>
          )}
        </aside>
      </div>
    </main>
  );
}
