import { supabase } from '@/lib/supabase';
import { ContractorCard } from '@/components/ContractorCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find CAPS-Certified Contractors Near You',
  description: 'Search our directory of CAPS (Certified Aging-in-Place Specialist) contractors in your area.',
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

  const { data: states } = await supabase
    .from('sh_contractors')
    .select('state, state_abbr')
    .eq('is_published', true)
    .order('state');

  const uniqueStates = Array.from(new Map((states || []).map(s => [s.state_abbr, s])).values());

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
        Find a CAPS-Certified Contractor
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        CAPS (Certified Aging-in-Place Specialist) contractors are trained by the National Association of Home Builders.
      </p>

      <form method="GET" className="flex flex-wrap gap-3 mb-10">
        <select
          name="state"
          defaultValue={state || ''}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base"
        >
          <option value="">All States</option>
          {uniqueStates.map(s => (
            <option key={s.state_abbr} value={s.state_abbr}>{s.state}</option>
          ))}
        </select>
        <input
          type="text"
          name="city"
          defaultValue={city || ''}
          placeholder="City name"
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg text-white font-semibold"
          style={{ backgroundColor: '#1B4332' }}
        >
          Search
        </button>
      </form>

      {contractors && contractors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractors.map((c: Parameters<typeof ContractorCard>[0]['contractor']) => (
            <ContractorCard key={c.id} contractor={c} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-12">
          No contractors found. Try a different state or city.
        </p>
      )}
    </main>
  );
}
