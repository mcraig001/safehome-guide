import { supabase } from '@/lib/supabase';
import { ContractorCard } from '@/components/ContractorCard';
import { LeadForm } from '@/components/LeadForm';
import { faqSchema } from '@/lib/schema';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, CheckCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { Suspense } from 'react';

const CONTRACTOR_FAQS = [
  { question: 'What is a CAPS-certified contractor?', answer: 'CAPS (Certified Aging-in-Place Specialist) is a designation from the National Association of Home Builders (NAHB). Contractors earn it by completing coursework on home modification for seniors, ADA design principles, and fall prevention. It is the gold standard credential for aging-in-place remodeling.' },
  { question: 'How much does a CAPS contractor charge?', answer: 'CAPS contractors typically charge $75–$150/hour for labor, or quote project totals. A grab bar installation runs $75–$200 per bar. A bathroom safety remodel is $3,000–$15,000. A stairlift installation is $200–$500 on top of the stairlift cost. Request itemized quotes from 2–3 contractors before deciding.' },
  { question: 'Does Medicare or insurance pay for CAPS contractor services?', answer: 'Standard Medicare Parts A and B do not pay for aging-in-place home modifications. Some Medicare Advantage plans have home safety benefits ($500–$2,500/year). VA grants (SAH, SHA, HISA) cover modifications for qualifying veterans. Medicaid HCBS waivers may cover modifications for low-income seniors. Contact your insurance or VA office to check eligibility.' },
  { question: 'How do I verify a CAPS certification?', answer: 'You can verify a contractor\'s CAPS certification through the NAHB\'s online directory at nahb.org. Ask the contractor for their CAPS certificate number and the date of certification. Active CAPS professionals are listed in the NAHB database.' },
  { question: 'Do I need a CAPS contractor for grab bar installation?', answer: 'Grab bars can be installed by any licensed handyman or general contractor who understands proper anchoring into studs. For complex bathroom remodels, stairlift installations, or wheelchair ramp construction, a CAPS-certified contractor is strongly recommended due to their specific training in accessibility design.' },
];

const ALL_STATES = [
  { abbr: 'al', name: 'Alabama' }, { abbr: 'ak', name: 'Alaska' }, { abbr: 'az', name: 'Arizona' },
  { abbr: 'ar', name: 'Arkansas' }, { abbr: 'ca', name: 'California' }, { abbr: 'co', name: 'Colorado' },
  { abbr: 'ct', name: 'Connecticut' }, { abbr: 'de', name: 'Delaware' }, { abbr: 'fl', name: 'Florida' },
  { abbr: 'ga', name: 'Georgia' }, { abbr: 'hi', name: 'Hawaii' }, { abbr: 'id', name: 'Idaho' },
  { abbr: 'il', name: 'Illinois' }, { abbr: 'in', name: 'Indiana' }, { abbr: 'ia', name: 'Iowa' },
  { abbr: 'ks', name: 'Kansas' }, { abbr: 'ky', name: 'Kentucky' }, { abbr: 'la', name: 'Louisiana' },
  { abbr: 'me', name: 'Maine' }, { abbr: 'md', name: 'Maryland' }, { abbr: 'ma', name: 'Massachusetts' },
  { abbr: 'mi', name: 'Michigan' }, { abbr: 'mn', name: 'Minnesota' }, { abbr: 'ms', name: 'Mississippi' },
  { abbr: 'mo', name: 'Missouri' }, { abbr: 'mt', name: 'Montana' }, { abbr: 'ne', name: 'Nebraska' },
  { abbr: 'nv', name: 'Nevada' }, { abbr: 'nh', name: 'New Hampshire' }, { abbr: 'nj', name: 'New Jersey' },
  { abbr: 'nm', name: 'New Mexico' }, { abbr: 'ny', name: 'New York' }, { abbr: 'nc', name: 'North Carolina' },
  { abbr: 'nd', name: 'North Dakota' }, { abbr: 'oh', name: 'Ohio' }, { abbr: 'ok', name: 'Oklahoma' },
  { abbr: 'or', name: 'Oregon' }, { abbr: 'pa', name: 'Pennsylvania' }, { abbr: 'ri', name: 'Rhode Island' },
  { abbr: 'sc', name: 'South Carolina' }, { abbr: 'sd', name: 'South Dakota' }, { abbr: 'tn', name: 'Tennessee' },
  { abbr: 'tx', name: 'Texas' }, { abbr: 'ut', name: 'Utah' }, { abbr: 'vt', name: 'Vermont' },
  { abbr: 'va', name: 'Virginia' }, { abbr: 'wa', name: 'Washington' }, { abbr: 'wv', name: 'West Virginia' },
  { abbr: 'wi', name: 'Wisconsin' }, { abbr: 'wy', name: 'Wyoming' },
];

export const metadata: Metadata = {
  title: 'Find CAPS-Certified Aging-in-Place Contractors Near You',
  description: 'Find CAPS-certified aging-in-place contractors in your area. Free quotes for stairlifts, grab bars, walk-in tubs, and home safety modifications. Browse by state or submit a request.',
  openGraph: {
    title: 'Find CAPS-Certified Aging-in-Place Contractors',
    description: 'Free quotes for home safety modifications from CAPS-certified contractors.',
  },
};

export default async function ContractorsPage() {
  // Load featured/premium listings first, then fill with free-tier published contractors
  const { data: featuredContractors } = await supabase
    .from('sh_contractors')
    .select('*')
    .eq('is_published', true)
    .in('listing_tier', ['featured', 'premium'])
    .order('listing_tier', { ascending: false })
    .limit(6);

  const { data: freeContractors } = await supabase
    .from('sh_contractors')
    .select('*')
    .eq('is_published', true)
    .eq('listing_tier', 'free')
    .order('state_abbr', { ascending: true })
    .limit(24);

  const contractorFaqSchema = faqSchema(CONTRACTOR_FAQS);
  const hasFeatured = featuredContractors && featuredContractors.length > 0;
  const hasFree = freeContractors && freeContractors.length > 0;

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contractorFaqSchema) }} />

      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} style={{ color: '#1B4332' }} />
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>CAPS-Certified Contractors</span>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
        Find a CAPS-Certified Contractor
      </h1>
      <p className="text-gray-500 mb-8 text-lg max-w-2xl">
        CAPS (Certified Aging-in-Place Specialist) contractors are trained and certified by the National Association of Home Builders to design and install aging-in-place modifications.
      </p>

      <div className="flex flex-wrap gap-6 mb-10">
        {['Free quotes, no obligation', 'CAPS certification verifiable at nahb.org', 'Covers all 50 states'].map(item => (
          <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle size={15} style={{ color: '#1B4332' }} />
            {item}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">

          {/* NAHB official finder — always prominent */}
          <div className="rounded-xl border-2 p-6 mb-8" style={{ borderColor: '#1B4332', backgroundColor: '#F0F7F4' }}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#1B4332' }}>Official Source</p>
                <h2 className="font-serif text-xl font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                  Search NAHB&apos;s CAPS Directory
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  The National Association of Home Builders maintains a searchable directory of all active, verified CAPS-certified contractors nationwide — searchable by ZIP code, city, or state.
                </p>
                <a
                  href="https://admin.nahb.org/reference_list.aspx?sectionID=1391"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white"
                  style={{ backgroundColor: '#1B4332' }}
                >
                  Search NAHB&apos;s CAPS Directory
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Featured/premium listings if any exist */}
          {hasFeatured && (
            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
                Featured Contractors
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {featuredContractors.map((c: Parameters<typeof ContractorCard>[0]['contractor']) => (
                  <ContractorCard key={c.id} contractor={c} />
                ))}
              </div>
            </section>
          )}

          {/* Verified CAPS contractors from our database */}
          {hasFree && (
            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                Verified CAPS Contractors
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                CAPS-certified contractors verified through NAHB. Sorted by state.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {freeContractors.map((c: Parameters<typeof ContractorCard>[0]['contractor']) => (
                  <ContractorCard key={c.id} contractor={c} />
                ))}
              </div>
            </section>
          )}

          {/* Browse by state — static, always works */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Browse by State
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Submit a quote request for your state, or find a local contractor near you.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {ALL_STATES.map(s => (
                <Link
                  key={s.abbr}
                  href={`/contractors/${s.abbr}`}
                  className="flex items-center px-3 py-2.5 rounded-lg border border-gray-100 hover:border-green-700 text-sm transition-colors group"
                >
                  <span className="font-medium text-gray-700 group-hover:text-green-800 transition-colors">{s.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* What is CAPS */}
          <div className="rounded-xl border border-gray-100 p-6 mb-8" style={{ backgroundColor: '#FAFAF7' }}>
            <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#1A1A1A' }}>
              What is CAPS Certification?
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              CAPS (Certified Aging-in-Place Specialist) is a professional designation from the NAHB.
              Certified contractors have completed coursework on aging-in-place design, universal design principles, and the specific physical needs of older adults.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                'Trained in ADA-compliant bathroom modifications',
                'Understands fall prevention design',
                'Knows Medicare and Medicaid grant programs',
                'Credential verifiable through NAHB',
              ].map(item => (
                <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#1B4332' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Common services */}
          <div className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
              Common Projects
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { label: 'Stairlift installation', href: '/products/stairlifts' },
                { label: 'Walk-in tub installation', href: '/products/walk-in-tubs' },
                { label: 'Grab bar installation', href: '/products/grab-bars' },
                { label: 'Wheelchair ramp construction', href: '/products/wheelchair-ramps' },
                { label: 'Bathroom safety remodel', href: '/products/bath-safety' },
                { label: 'Home elevator installation', href: '/products/home-elevators' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-100 bg-white hover:border-green-700 text-sm font-medium text-gray-700 hover:text-green-800 transition-colors"
                >
                  <ChevronRight size={13} style={{ color: '#1B4332' }} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <Suspense>
            <LeadForm headline="Get Free Quotes from Local Contractors" />
          </Suspense>

          <div className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#F5F5F0' }}>
            <p className="text-sm font-semibold text-gray-800 mb-2">Are you a CAPS contractor?</p>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Get listed in our directory and receive quote requests from seniors and families in your area.
            </p>
            <Link
              href="/advertise"
              className="block text-center py-2.5 px-4 rounded-lg font-semibold text-sm text-white"
              style={{ backgroundColor: '#1B4332' }}
            >
              Get Listed →
            </Link>
          </div>

          <div className="rounded-xl border border-amber-200 p-5" style={{ backgroundColor: '#fffbeb' }}>
            <p className="font-semibold text-amber-900 text-sm mb-2">Not sure what you need?</p>
            <p className="text-amber-800 text-xs mb-3 leading-relaxed">
              Take our free 5-question home assessment for personalized recommendations.
            </p>
            <Link
              href="/assess"
              className="inline-block px-4 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ backgroundColor: '#D97706' }}
            >
              Free Assessment →
            </Link>
          </div>
        </aside>
      </div>

      {/* FAQ section */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
          Common Questions About CAPS Contractors
        </h2>
        <div className="space-y-4">
          {CONTRACTOR_FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#FAFAF7' }}>
              <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
