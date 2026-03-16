import { supabase } from '@/lib/supabase';
import { ContractorCard } from '@/components/ContractorCard';
import { LeadForm } from '@/components/LeadForm';
import { localBusinessSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';

interface Props { params: Promise<{ state: string; city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params;
  const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `CAPS Contractors in ${cityName}, ${state.toUpperCase()}`,
    description: `Find CAPS-certified aging-in-place contractors in ${cityName}, ${state.toUpperCase()}. Get free quotes for stairlifts, grab bars, and home safety modifications.`,
  };
}

export default async function CityContractorPage({ params }: Props) {
  const { state, city } = await params;
  const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const { data: contractors } = await supabase
    .from('sh_contractors')
    .select('*')
    .ilike('state_abbr', state)
    .ilike('city', cityName)
    .eq('is_published', true)
    .order('listing_tier', { ascending: false });

  if (!contractors || contractors.length === 0) notFound();

  const schemas = contractors.map(localBusinessSchema);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
        CAPS-Certified Contractors in {cityName}, {state.toUpperCase()}
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        {contractors.length} certified aging-in-place specialist{contractors.length !== 1 ? 's' : ''} near you.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {contractors.map((c: Parameters<typeof ContractorCard>[0]['contractor']) => (
            <ContractorCard key={c.id} contractor={c} />
          ))}
        </div>
        <aside>
          <Suspense>
            <LeadForm headline="Get Free Quotes" />
          </Suspense>
        </aside>
      </div>
    </main>
  );
}
