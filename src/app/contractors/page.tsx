import { supabase } from '@/lib/supabase';
import { ContractorCard } from '@/components/ContractorCard';
import { LeadForm } from '@/components/LeadForm';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, CheckCircle, ChevronRight, Search } from 'lucide-react';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Find CAPS-Certified Aging-in-Place Contractors Near You',
  description: 'Search our national directory of CAPS-certified aging-in-place contractors. Free quotes for stairlifts, grab bars, walk-in tubs, and home safety modifications.',
  openGraph: {
    title: 'Find CAPS-Certified Aging-in-Place Contractors',
    description: 'National directory of CAPS-certified contractors. Free quotes for home safety modifications.',
  },
};

interface Props { searchParams: Promise<{ state?: string; city?: string }> }

export default async function ContractorsPage({ searchParams }: Props) {
  const { state, city } = await searchParams;

  let query = supabase
    .from('sh_contractors')
    .select('*')
    .eq('is_published', true)
    .order('listing_tier', { ascending: false })
    .order('business_name')
    .limit(40);

  if (state) query = query.ilike('state_abbr', state);
  if (city) query = query.ilike('city', `%${city}%`);

  const { data: contractors } = await query;

  const { data: stateData } = await supabase
    .from('sh_contractors')
    .select('state, state_abbr')
    .eq('is_published', true)
    .order('state');

  const uniqueStates = Array.from(new Map((stateData || []).map(s => [s.state_abbr, s])).values());

  // Count per state for the browse grid
  const { data: stateCounts } = await supabase
    .from('sh_contractors')
    .select('state_abbr')
    .eq('is_published', true);

  const countByState: Record<string, number> = {};
  (stateCounts || []).forEach(c => {
    countByState[c.state_abbr] = (countByState[c.state_abbr] || 0) + 1;
  });

  const isFiltered = !!(state || city);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} style={{ color: '#1B4332' }} />
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>CAPS-Certified Directory</span>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
        Find a CAPS-Certified Contractor
      </h1>
      <p className="text-gray-500 mb-8 text-lg max-w-2xl">
        CAPS (Certified Aging-in-Place Specialist) contractors are trained and certified by the National Association of Home Builders.
        Every contractor in this directory holds active CAPS certification.
      </p>

      {/* Trust signals */}
      <div className="flex flex-wrap gap-6 mb-10">
        {[
          'CAPS certification verified',
          'Free quotes, no obligation',
          'Covers all 50 states',
        ].map(item => (
          <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle size={15} style={{ color: '#1B4332' }} />
            {item}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          {/* Search form */}
          <form method="GET" className="flex flex-wrap gap-3 mb-8 p-5 rounded-xl border border-gray-100" style={{ backgroundColor: '#FAFAF7' }}>
            <div className="flex items-center gap-2 flex-1 min-w-[180px]">
              <Search size={16} className="text-gray-400 shrink-0" />
              <select
                name="state"
                defaultValue={state || ''}
                className="flex-1 bg-transparent border-none outline-none text-base text-gray-700 py-1"
              >
                <option value="">All States</option>
                {uniqueStates.map(s => (
                  <option key={s.state_abbr} value={s.state_abbr}>{s.state}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              name="city"
              defaultValue={city || ''}
              placeholder="City name (optional)"
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-base flex-1 min-w-[160px] bg-white"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-white font-semibold text-sm whitespace-nowrap"
              style={{ backgroundColor: '#1B4332' }}
            >
              Search
            </button>
          </form>

          {/* Results */}
          {contractors && contractors.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {contractors.length} contractor{contractors.length !== 1 ? 's' : ''} found
                {state ? ` in ${state.toUpperCase()}` : ''}
                {city ? ` near ${city}` : ''}
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {contractors.map((c: Parameters<typeof ContractorCard>[0]['contractor']) => (
                  <ContractorCard key={c.id} contractor={c} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl mb-8">
              <p className="text-lg mb-2">No contractors found</p>
              <p className="text-sm">Try a different state or leave the city blank to see all contractors in that state.</p>
            </div>
          )}

          {/* Browse by state */}
          {!isFiltered && (
            <div>
              <h2 className="font-serif text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
                Browse by State
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {uniqueStates.map(s => (
                  <Link
                    key={s.state_abbr}
                    href={`/contractors/${s.state_abbr.toLowerCase()}`}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-green-700 text-sm transition-colors group"
                  >
                    <span className="font-medium text-gray-700 group-hover:text-green-800 transition-colors">{s.state}</span>
                    <span className="text-xs text-gray-400">
                      {countByState[s.state_abbr] || 0}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* What CAPS means */}
          <div className="mt-10 rounded-xl border border-gray-100 p-6" style={{ backgroundColor: '#FAFAF7' }}>
            <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#1A1A1A' }}>
              What is CAPS Certification?
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              CAPS (Certified Aging-in-Place Specialist) is a professional designation from the National Association of Home Builders (NAHB).
              Certified contractors have completed coursework on aging-in-place design, universal design principles, and the specific physical needs of older adults.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                'Trained in ADA-compliant bathroom modifications',
                'Understands fall prevention design',
                'Knows Medicare and Medicaid reimbursement',
                'Credential is verifiable through NAHB',
              ].map(item => (
                <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#1B4332' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Common services */}
          <div className="mt-8">
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

          <div className="rounded-xl p-5 border border-amber-200" style={{ backgroundColor: '#fffbeb' }}>
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
    </main>
  );
}
