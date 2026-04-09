import { supabase } from '@/lib/supabase';
import { ContractorCard } from '@/components/ContractorCard';
import { LeadForm } from '@/components/LeadForm';
import { localBusinessSchema, breadcrumbSchema } from '@/lib/schema';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight, Shield, CheckCircle, ExternalLink } from 'lucide-react';

const STATE_NAMES: Record<string, string> = {
  al: 'Alabama', ak: 'Alaska', az: 'Arizona', ar: 'Arkansas', ca: 'California',
  co: 'Colorado', ct: 'Connecticut', de: 'Delaware', fl: 'Florida', ga: 'Georgia',
  hi: 'Hawaii', id: 'Idaho', il: 'Illinois', in: 'Indiana', ia: 'Iowa',
  ks: 'Kansas', ky: 'Kentucky', la: 'Louisiana', me: 'Maine', md: 'Maryland',
  ma: 'Massachusetts', mi: 'Michigan', mn: 'Minnesota', ms: 'Mississippi', mo: 'Missouri',
  mt: 'Montana', ne: 'Nebraska', nv: 'Nevada', nh: 'New Hampshire', nj: 'New Jersey',
  nm: 'New Mexico', ny: 'New York', nc: 'North Carolina', nd: 'North Dakota', oh: 'Ohio',
  ok: 'Oklahoma', or: 'Oregon', pa: 'Pennsylvania', ri: 'Rhode Island', sc: 'South Carolina',
  sd: 'South Dakota', tn: 'Tennessee', tx: 'Texas', ut: 'Utah', vt: 'Vermont',
  va: 'Virginia', wa: 'Washington', wv: 'West Virginia', wi: 'Wisconsin', wy: 'Wyoming',
  dc: 'Washington, D.C.',
};

interface Props { params: Promise<{ state: string; city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params;
  const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const stateUpper = state.toUpperCase();
  const title = `CAPS Contractors in ${cityName}, ${stateUpper}`;
  const description = `Find CAPS-certified aging-in-place contractors in ${cityName}, ${stateUpper}. Get free quotes for stairlifts, grab bars, walk-in tubs, and home safety modifications.`;
  return { title, description, openGraph: { title, description } };
}

export default async function CityContractorPage({ params }: Props) {
  const { state, city } = await params;
  const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const stateUpper = state.toUpperCase();
  const stateName = STATE_NAMES[state.toLowerCase()] ?? stateUpper;

  const { data: contractors } = await supabase
    .from('sh_contractors')
    .select('*')
    .ilike('state_abbr', state)
    .ilike('city', cityName)
    .eq('is_published', true)
    .order('listing_tier', { ascending: false });

  const hasContractors = contractors && contractors.length > 0;
  const schemas = hasContractors ? contractors.map(localBusinessSchema) : [];
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://www.safeathomeguides.com' },
    { name: 'Contractors', url: 'https://www.safeathomeguides.com/contractors' },
    { name: `${stateName} Contractors`, url: `https://www.safeathomeguides.com/contractors/${state}` },
    { name: `${cityName}, ${stateUpper}`, url: `https://www.safeathomeguides.com/contractors/${state}/${city}` },
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/contractors" className="hover:text-gray-600 transition-colors">Contractors</Link>
        <ChevronRight size={14} />
        <Link href={`/contractors/${state}`} className="hover:text-gray-600 transition-colors">{stateName}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-600">{cityName}</span>
      </nav>

      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} style={{ color: '#1B4332' }} />
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>CAPS-Certified Contractors</span>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
        Find a CAPS Contractor in {cityName}, {stateUpper}
      </h1>
      <p className="text-gray-500 mb-8 text-lg max-w-2xl">
        CAPS-certified contractors are trained by the National Association of Home Builders to design and install aging-in-place modifications — stairlifts, grab bars, accessible bathrooms, and more.
      </p>
      <p className="text-xs text-gray-400 mb-6">
        Contractor listings are sourced from the NAHB CAPS public directory. SafeAtHome does not endorse or guarantee the work of any listed contractor. Always verify licensing and insurance before hiring.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">

          {hasContractors ? (
            <div className="space-y-4 mb-10">
              {contractors.map((c: Parameters<typeof ContractorCard>[0]['contractor']) => (
                <ContractorCard key={c.id} contractor={c} />
              ))}
            </div>
          ) : (
            /* No listed contractors — show NAHB referral + lead form CTA */
            <div className="rounded-xl border border-gray-100 p-7 mb-8" style={{ backgroundColor: '#FAFAF7' }}>
              <h2 className="font-serif text-xl font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                No paid listings in {cityName} yet
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                We don&apos;t currently have verified contractor listings for {cityName}. You have two good options:
              </p>
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <p className="font-semibold text-gray-800 mb-1">Option 1 — Submit a quote request</p>
                  <p className="text-sm text-gray-600 mb-3">Fill out the form on this page and we&apos;ll connect you with contractors serving {cityName}.</p>
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#1B4332' }}>
                    <CheckCircle size={14} />
                    Free, no obligation
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <p className="font-semibold text-gray-800 mb-1">Option 2 — Search NAHB&apos;s official CAPS directory</p>
                  <p className="text-sm text-gray-600 mb-3">The National Association of Home Builders maintains a searchable directory of all active CAPS-certified contractors nationwide.</p>
                  <a
                    href="https://www.nahb.org/education-and-events/education/designations/certified-aging-in-place-specialist-caps/find-a-caps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                    style={{ color: '#1B4332' }}
                  >
                    Search NAHB&apos;s CAPS Directory
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* What is CAPS */}
          <div className="rounded-xl border border-gray-100 p-6 mb-8" style={{ backgroundColor: '#FAFAF7' }}>
            <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#1A1A1A' }}>
              What is CAPS Certification?
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              CAPS (Certified Aging-in-Place Specialist) is a designation from the National Association of Home Builders (NAHB).
              Certified contractors have completed training on home modification techniques, universal design, ADA compliance, and the physical needs of older adults.
              Certification is verifiable through NAHB&apos;s public directory.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Trained in ADA-compliant bathroom modifications',
                'Understands fall prevention design',
                'Familiar with Medicare/Medicaid reimbursement',
                'Credential verifiable at nahb.org',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: '#1B4332' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Common projects */}
          <div className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
              Common Projects
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
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
                  className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 bg-white hover:border-green-700 text-sm font-medium text-gray-700 hover:text-green-800 transition-colors"
                >
                  <ChevronRight size={14} style={{ color: '#1B4332' }} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href={`/contractors/${state}`} className="text-sm font-medium hover:underline" style={{ color: '#1B4332' }}>
            ← All {stateName} contractors
          </Link>
        </div>

        <aside>
          <Suspense>
            <LeadForm headline={`Get Free Quotes in ${cityName}`} />
          </Suspense>

          <div className="mt-6 rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#F5F5F0' }}>
            <p className="text-sm font-semibold text-gray-800 mb-2">Are you a contractor in {cityName}?</p>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              List your business here and get quote requests from local seniors and families.
            </p>
            <Link
              href="/advertise"
              className="block text-center py-2 px-4 rounded-lg font-semibold text-sm text-white"
              style={{ backgroundColor: '#1B4332' }}
            >
              Get Listed →
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
