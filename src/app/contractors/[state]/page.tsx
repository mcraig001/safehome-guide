import { supabase } from '@/lib/supabase';
import { LeadForm } from '@/components/LeadForm';
import { breadcrumbSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight, Shield, MapPin, CheckCircle, ExternalLink } from 'lucide-react';

interface Props { params: Promise<{ state: string }> }

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const stateName = STATE_NAMES[state.toLowerCase()] ?? state.toUpperCase();
  const title = `CAPS Contractors in ${stateName} — Aging-in-Place Specialists`;
  const description = `Find CAPS-certified aging-in-place contractors in ${stateName}. Get free quotes for stairlifts, grab bars, walk-in tubs, and home safety modifications.`;
  return { title, description, openGraph: { title, description } };
}

export default async function StateContractorPage({ params }: Props) {
  const { state } = await params;
  const stateName = STATE_NAMES[state.toLowerCase()];
  if (!stateName) notFound();

  const stateUpper = state.toUpperCase();

  // Fetch any published contractors in this state (may be empty)
  const { data: contractors } = await supabase
    .from('sh_contractors')
    .select('business_name, city, state_abbr, caps_certified, specialties, listing_tier')
    .ilike('state_abbr', state)
    .eq('is_published', true)
    .order('listing_tier', { ascending: false });

  // Group by city if there are any listings
  const cityMap = new Map<string, { count: number; slug: string }>();
  (contractors || []).forEach(c => {
    const citySlug = c.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const existing = cityMap.get(c.city);
    if (existing) { existing.count++; } else { cityMap.set(c.city, { count: 1, slug: citySlug }); }
  });
  const cities = Array.from(cityMap.entries())
    .map(([city, { count, slug }]) => ({ city, count, slug }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://www.safeathomeguides.com' },
    { name: 'Contractors', url: 'https://www.safeathomeguides.com/contractors' },
    { name: stateName, url: `https://www.safeathomeguides.com/contractors/${state}` },
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/contractors" className="hover:text-gray-600 transition-colors">Contractors</Link>
        <ChevronRight size={14} />
        <span className="text-gray-600">{stateName}</span>
      </nav>

      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} style={{ color: '#1B4332' }} />
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>CAPS-Certified Contractors</span>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
        Find a CAPS Contractor in {stateName}
      </h1>
      <p className="text-gray-500 mb-8 text-lg max-w-2xl">
        CAPS-certified contractors are trained by the National Association of Home Builders to plan and install aging-in-place modifications — stairlifts, grab bars, accessible bathrooms, ramps, and more.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">

          {cities.length > 0 ? (
            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold mb-5" style={{ color: '#1A1A1A' }}>
                Browse by City
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {cities.map(({ city, count, slug }) => (
                  <Link
                    key={city}
                    href={`/contractors/${state}/${slug}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-green-700 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={15} style={{ color: '#1B4332' }} className="shrink-0" />
                      <span className="font-semibold text-gray-800 group-hover:text-green-800 transition-colors">{city}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {count} listing{count !== 1 ? 's' : ''}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            /* No listings yet — show NAHB referral prominently */
            <div className="rounded-xl border border-gray-100 p-7 mb-8" style={{ backgroundColor: '#FAFAF7' }}>
              <h2 className="font-serif text-xl font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                No paid listings in {stateName} yet
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                We don&apos;t currently have verified contractor listings for {stateName}. Here&apos;s how to find a qualified contractor:
              </p>
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <p className="font-semibold text-gray-800 mb-1">Submit a quote request</p>
                  <p className="text-sm text-gray-600 mb-0">Use the form on this page and we&apos;ll work to connect you with contractors serving your area.</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <p className="font-semibold text-gray-800 mb-1">Search NAHB&apos;s official CAPS directory</p>
                  <p className="text-sm text-gray-600 mb-3">
                    The National Association of Home Builders maintains a searchable database of all active CAPS-certified contractors, searchable by state and city.
                  </p>
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
          <section className="rounded-xl p-6 mb-8" style={{ backgroundColor: '#F5F5F0' }}>
            <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#1A1A1A' }}>
              About CAPS Certification
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              CAPS (Certified Aging-in-Place Specialist) is a credential from the National Association of Home Builders (NAHB).
              Contractors earn it by completing a multi-day training program covering ADA design, fall prevention, and the specific physical needs of older adults and people with disabilities.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mb-4">
              {[
                'Trained in ADA-compliant modifications',
                'Understands fall prevention design',
                'Familiar with grants and insurance programs',
                'Credential verifiable at nahb.org',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} style={{ color: '#1B4332' }} className="shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <a
              href="https://www.nahb.org/education-and-events/education/designations/certified-aging-in-place-specialist-caps/find-a-caps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
              style={{ color: '#1B4332' }}
            >
              Find a CAPS contractor at nahb.org
              <ExternalLink size={13} />
            </a>
          </section>

          {/* Planning resources */}
          <section>
            <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
              Planning Resources
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { href: '/guides/aging-in-place-planning-guide', label: 'How to Plan for Aging in Place' },
                { href: '/guides/home-modification-grants-for-seniors', label: 'Grants for Home Modifications' },
                { href: '/guides/fall-prevention-for-seniors', label: 'Fall Prevention Guide' },
                { href: '/guides/aging-in-place-budget-guide', label: 'How Much Does Aging in Place Cost?' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="p-4 rounded-xl border border-gray-100 bg-white text-sm font-medium hover:border-green-700 hover:text-green-800 transition-all text-gray-700"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <Suspense>
            <LeadForm headline={`Get Quotes in ${stateName}`} />
          </Suspense>

          <div className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#F5F5F0' }}>
            <p className="text-sm font-semibold text-gray-800 mb-2">Are you a contractor in {stateName}?</p>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Get listed and receive quote requests from seniors and families in your area.
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
            <p className="text-sm font-semibold text-amber-900 mb-2">Not sure what you need?</p>
            <p className="text-xs text-amber-800 mb-3 leading-relaxed">
              Take our free home assessment to get personalized recommendations before contacting a contractor.
            </p>
            <Link
              href="/assess"
              className="block text-center py-2 px-4 rounded-lg font-semibold text-sm text-white"
              style={{ backgroundColor: '#D97706' }}
            >
              Free Assessment →
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
