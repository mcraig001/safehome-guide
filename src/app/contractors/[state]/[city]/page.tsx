import { supabase } from '@/lib/supabase';
import { ContractorCard } from '@/components/ContractorCard';
import { LeadForm } from '@/components/LeadForm';
import { localBusinessSchema, breadcrumbSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight, Shield, CheckCircle } from 'lucide-react';

interface Props { params: Promise<{ state: string; city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params;
  const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const stateUpper = state.toUpperCase();
  const title = `CAPS Contractors in ${cityName}, ${stateUpper}`;
  const description = `Find CAPS-certified aging-in-place contractors in ${cityName}, ${stateUpper}. Get free quotes for stairlifts, grab bars, walk-in tubs, and home safety modifications.`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function CityContractorPage({ params }: Props) {
  const { state, city } = await params;
  const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const stateUpper = state.toUpperCase();

  const { data: contractors } = await supabase
    .from('sh_contractors')
    .select('*')
    .ilike('state_abbr', state)
    .ilike('city', cityName)
    .eq('is_published', true)
    .order('listing_tier', { ascending: false });

  if (!contractors || contractors.length === 0) notFound();

  const stateName = contractors[0]?.state || stateUpper;
  const schemas = contractors.map(localBusinessSchema);
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://www.safeathomeguides.com' },
    { name: 'Contractors', url: 'https://www.safeathomeguides.com/contractors' },
    { name: `${stateUpper} Contractors`, url: `https://www.safeathomeguides.com/contractors?state=${state}` },
    { name: `${cityName}, ${stateUpper}`, url: `https://www.safeathomeguides.com/contractors/${state}/${city}` },
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/contractors" className="hover:text-gray-600 transition-colors">Contractors</Link>
        <ChevronRight size={14} />
        <Link href={`/contractors?state=${state}`} className="hover:text-gray-600 transition-colors">{stateName}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-600">{cityName}</span>
      </nav>

      <div className="flex items-center gap-2 mb-3">
        <Shield size={16} style={{ color: '#1B4332' }} />
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>CAPS-Certified Directory</span>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
        CAPS-Certified Contractors in {cityName}, {stateUpper}
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        {contractors.length} certified aging-in-place specialist{contractors.length !== 1 ? 's' : ''} serving {cityName} and surrounding areas.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-4 mb-10">
            {contractors.map((c: Parameters<typeof ContractorCard>[0]['contractor']) => (
              <ContractorCard key={c.id} contractor={c} />
            ))}
          </div>

          {/* What is CAPS explainer */}
          <div className="rounded-xl border border-gray-100 p-6 mb-8" style={{ backgroundColor: '#FAFAF7' }}>
            <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#1A1A1A' }}>
              What is CAPS Certification?
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              CAPS (Certified Aging-in-Place Specialist) is a designation earned through the National Association of Home Builders (NAHB).
              CAPS-certified contractors have completed training on home modification techniques, universal design, and the specific needs of older adults and people with disabilities.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Trained in ADA-compliant bathroom modifications',
                'Understands fall prevention design principles',
                'Familiar with Medicare and Medicaid reimbursement',
                'Certified by NAHB — verifiable credential',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: '#1B4332' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* What they can help with */}
          <div className="mb-8">
            <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
              Common Projects in {cityName}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: 'Stairlift installation', href: '/products/stairlifts' },
                { label: 'Walk-in tub installation', href: '/products/walk-in-tubs' },
                { label: 'Grab bar installation', href: '/products/grab-bars' },
                { label: 'Wheelchair ramp construction', href: '/products/wheelchair-ramps' },
                { label: 'Bathroom safety modifications', href: '/products/bath-safety' },
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

          {/* Back to full directory */}
          <Link href="/contractors" className="text-sm font-medium hover:underline" style={{ color: '#1B4332' }}>
            ← Search all {stateUpper} contractors
          </Link>
        </div>

        <aside>
          <Suspense>
            <LeadForm headline={`Get Free Quotes in ${cityName}`} />
          </Suspense>
        </aside>
      </div>
    </main>
  );
}
