import { supabase } from '@/lib/supabase';
import type { MetadataRoute } from 'next';

const BASE = 'https://www.safeathomeguides.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/contractors`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/assess`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/advertise`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/glossary`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/resources`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    // Category pages
    ...['stairlifts','walk-in-tubs','grab-bars','wheelchair-ramps','medical-alerts',
        'home-elevators','bath-safety','smart-home-safety','mobility-aids','door-access'].map(slug => ({
      url: `${BASE}/products/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    // Guide pages
    ...['stairlift-cost-guide','walk-in-tub-cost-guide','grab-bar-installation-guide',
        'does-medicare-cover-stairlifts','does-medicare-cover-walk-in-tubs',
        'aging-in-place-home-modifications-checklist',
        'medical-alert-cost-guide','wheelchair-ramp-cost-guide','home-elevator-cost-guide',
        'home-modification-grants-for-seniors','stairlift-vs-home-elevator',
        'bathroom-safety-modifications-for-seniors','how-to-choose-a-stairlift',
        'aging-in-place-tax-deductions','best-medical-alert-for-seniors-living-alone',
        'walk-in-shower-conversion-cost','stairlift-for-narrow-stairs',
        'outdoor-stairlift-cost',
        'bruno-vs-acorn-stairlift',
        'stairlift-rental-vs-buy',
        'stairlift-weight-limit',
        'american-standard-vs-safe-step-walk-in-tub',
        'senior-bathroom-remodel-cost',
        'aging-in-place-vs-assisted-living-cost',
        'aging-in-place-planning-guide',
        'walk-in-tub-vs-walk-in-shower',
        'stairlift-brands-to-avoid',
        'home-safety-checklist-for-elderly',
        'stairlift-installation-guide',
        'medicare-advantage-home-modification-benefits',
        'life-alert-vs-medical-guardian',
        'free-stairlift-for-seniors',
        'best-fall-detection-medical-alert',
        'aging-in-place-bathroom-modifications',
        'fall-prevention-for-seniors',
        'best-shower-chair-for-seniors',
        'rollator-walker-guide',
        'stairlift-repair-cost',
        'vertical-platform-lift-cost',
        'home-health-aide-cost',
        'grab-bar-types-guide',
        'stairlift-financing',
        'helping-aging-parents-at-home',
        'does-medicaid-cover-home-modifications',
        'smart-home-for-aging-in-place',
        'no-monthly-fee-medical-alert',
        'lift-chair-cost-guide',
        'aging-in-place-bathroom-checklist',
        'bath-lift-cost-guide',
        'cane-vs-walker-guide',
        'stair-handrail-cost-guide',
        'doorway-widening-cost-guide',
        'aging-in-place-parkinsons',
        'home-safety-for-dementia',
        'accessible-kitchen-modifications',
        'hip-replacement-home-modifications'].map(slug => ({
      url: `${BASE}/guides/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    // Compare pages
    ...['best-stairlifts','best-walk-in-tubs','best-grab-bars','best-medical-alerts',
        'best-rollator-walkers','best-bath-safety-products','best-wheelchair-ramps',
        'best-smart-home-safety-devices','best-smart-door-locks'].map(slug => ({
      url: `${BASE}/compare/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ];

  // Dynamic product pages
  const { data: products } = await supabase
    .from('sh_products')
    .select('slug, category, updated_at')
    .eq('is_published', true);

  const productPages: MetadataRoute.Sitemap = (products || []).map(p => ({
    url: `${BASE}/products/${p.category}/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Dynamic contractor city pages
  const { data: contractors } = await supabase
    .from('sh_contractors')
    .select('city, state_abbr')
    .eq('is_published', true);

  const cityMap = new Map<string, string>();
  const stateSet = new Set<string>();
  (contractors || []).forEach(c => {
    const stateSlug = c.state_abbr.toLowerCase();
    const key = `${stateSlug}/${c.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    cityMap.set(key, key);
    stateSet.add(stateSlug);
  });

  const cityPages: MetadataRoute.Sitemap = Array.from(cityMap.keys()).map(key => ({
    url: `${BASE}/contractors/${key}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  const statePages: MetadataRoute.Sitemap = Array.from(stateSet).map(state => ({
    url: `${BASE}/contractors/${state}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...statePages, ...cityPages];
}
