import { supabase } from '@/lib/supabase';
import { LeadForm } from '@/components/LeadForm';
import { breadcrumbSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight, Shield, MapPin, CheckCircle } from 'lucide-react';

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
  const description = `Find CAPS-certified aging-in-place contractors across ${stateName}. Browse by city to get free quotes for stairlifts, grab bars, walk-in tubs, and home safety modifications.`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function StateContractorPage({ params }: Props) {
  const { state } = await params;
  const stateName = STATE_NAMES[state.toLowerCase()];
  if (!stateName) notFound();

  const stateUpper = state.toUpperCase();

  // Fetch all published contractors in this state
  const { data: contractors } = await supabase
    .from('sh_contractors')
    .select('business_name, city, state_abbr, caps_certified, specialties, listing_tier')
    .ilike('state_abbr', state)
    .eq('is_published', true)
    .order('listing_tier', { ascending: false });

  if (!contractors || contractors.length === 0) notFound();

  // Group by city with counts
  const cityMap = new Map<string, { count: number; slug: string }>();
  contractors.forEach(c => {
    const citySlug = c.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const existing = cityMap.get(c.city);
    if (existing) {
      existing.count++;
    } else {
      cityMap.set(c.city, { count: 1, slug: citySlug });
    }
  });

  const cities = Array.from(cityMap.entries())
    .map(([city, { count, slug }]) => ({ city, count, slug }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://www.safeathomeguides.com' },
    { name: 'Contractors', url: 'https://www.safeathomeguides.com/contractors' },
    { name: stateName, url: `https://www.safeathomeguides.com/contractors/${state}` },
  ]);

  // Get specialties across state for intro content
  const specialtySet = new Set<string>();
  contractors.forEach(c => (c.specialties as string[] | null)?.forEach(s => specialtySet.add(s)));
  const topSpecialties = Array.from(specialtySet).slice(0, 5);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/contractors" className="hover:text-gray-600 transition-colors">Contractors</Link>
        <ChevronRight size={14} />
        <span className="text-gray-600">{stateName}</span>
      </nav>

      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} style={{ color: '#1B4332' }} />
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>CAPS-Certified Directory</span>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
        CAPS Contractors in {stateName}
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        {contractors.length} certified aging-in-place specialist{contractors.length !== 1 ? 's' : ''} across {cities.length} {cities.length === 1 ? 'city' : 'cities'} in {stateName}.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* City grid */}
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
                    {count} contractor{count !== 1 ? 's' : ''}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* About CAPS in this state */}
          <section className="rounded-xl p-6 mb-8" style={{ backgroundColor: '#F5F5F0' }}>
            <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#1A1A1A' }}>
              About CAPS Certification in {stateName}
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              CAPS (Certified Aging-in-Place Specialist) is a credential from the National Association
              of Home Builders (NAHB). Contractors earn it by completing a multi-day training program
              covering ADA design principles, fall prevention, and the specific physical needs of older adults.
            </p>
            {topSpecialties.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Common specialties among {stateName} contractors:</p>
                <div className="flex flex-wrap gap-2">
                  {topSpecialties.map(s => (
                    <span key={s} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-full capitalize">
                      {s.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Trust signals */}
          <section className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <CheckCircle size={18} style={{ color: '#1B4332' }} />, text: 'CAPS certification verified' },
              { icon: <CheckCircle size={18} style={{ color: '#1B4332' }} />, text: 'Free quotes, no obligation' },
              { icon: <CheckCircle size={18} style={{ color: '#1B4332' }} />, text: 'Aging-in-place trained' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 p-4 text-sm text-gray-700">
                {icon}
                {text}
              </div>
            ))}
          </section>

          {/* Related links */}
          <section>
            <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
              Planning Resources
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { href: '/guides/how-to-choose-a-stairlift', label: 'How to Choose a Stairlift' },
                { href: '/guides/grab-bar-installation-guide', label: 'Grab Bar Installation Guide' },
                { href: '/guides/bathroom-safety-modifications-for-seniors', label: 'Bathroom Safety Modifications' },
                { href: '/guides/home-modification-grants-for-seniors', label: 'Grants for Home Modifications' },
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
            <LeadForm
              headline={`Get Quotes in ${stateName}`}
            />
          </Suspense>

          <div className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#F5F5F0' }}>
            <p className="text-sm font-semibold text-gray-800 mb-3">Not sure what you need?</p>
            <p className="text-xs text-gray-600 mb-3">
              Take our free 5-question home assessment to get a personalized recommendation before contacting a contractor.
            </p>
            <Link
              href="/assess"
              className="block text-center py-2.5 px-4 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1B4332' }}
            >
              Free Home Assessment →
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
