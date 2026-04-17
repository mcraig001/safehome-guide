/**
 * Writer Agent — Internal Link Injection (Task 4)
 * Appends natural internal link sentences to products missing them.
 * Efficient: no Haiku calls — uses deterministic related product lookup.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CATEGORY_GUIDE = {
  'stairlifts': { slug: 'stairlift-cost-guide', title: 'Stairlift Cost Guide' },
  'walk-in-tubs': { slug: 'walk-in-tub-cost-guide', title: 'Walk-In Tub Cost Guide' },
  'grab-bars': { slug: 'grab-bar-installation-guide', title: 'Grab Bar Installation Guide' },
  'medical-alerts': { slug: 'medical-alert-cost-guide', title: 'Medical Alert System Cost Guide' },
  'wheelchair-ramps': { slug: 'wheelchair-ramp-cost-guide', title: 'Wheelchair Ramp Cost Guide' },
  'home-elevators': { slug: 'home-elevator-cost-guide', title: 'Home Elevator Cost Guide' },
  'bath-safety': { slug: 'best-shower-chair-for-seniors', title: 'Best Shower Chair for Seniors' },
  'smart-home-safety': { slug: 'best-smart-home-devices-seniors-2026', title: 'Best Smart Home Devices for Seniors' },
  'mobility-aids': { slug: 'rollator-walker-guide', title: 'Rollator Walker Guide' },
  'door-access': { slug: 'aging-in-place-planning-guide', title: 'Aging-in-Place Planning Guide' },
};

// Linking sentence templates by category
const LINK_TEMPLATES = {
  'stairlifts': (p1, p2, guide) =>
    ` If you\'re comparing options, see also the [${p1.name}](/products/stairlifts/${p1.slug}) and [${p2.name}](/products/stairlifts/${p2.slug}). For a complete cost breakdown and financing options, read our [${guide.title}](/guides/${guide.slug}).`,
  'walk-in-tubs': (p1, p2, guide) =>
    ` Comparing models? The [${p1.name}](/products/walk-in-tubs/${p1.slug}) and [${p2.name}](/products/walk-in-tubs/${p2.slug}) are worth considering side-by-side. See our [${guide.title}](/guides/${guide.slug}) for what to look for before buying.`,
  'grab-bars': (p1, p2, guide) =>
    ` For other highly-rated options, see the [${p1.name}](/products/grab-bars/${p1.slug}) and [${p2.name}](/products/grab-bars/${p2.slug}). Before purchasing, read our [${guide.title}](/guides/${guide.slug}) for ADA placement guidelines.`,
  'medical-alerts': (p1, p2, guide) =>
    ` Worth comparing: the [${p1.name}](/products/medical-alerts/${p1.slug}) and [${p2.name}](/products/medical-alerts/${p2.slug}). Our [${guide.title}](/guides/${guide.slug}) breaks down what to look for and current pricing.`,
  'wheelchair-ramps': (p1, p2, guide) =>
    ` Also consider the [${p1.name}](/products/wheelchair-ramps/${p1.slug}) and [${p2.name}](/products/wheelchair-ramps/${p2.slug}). Our [${guide.title}](/guides/${guide.slug}) covers the ADA slope ratios and installation process.`,
  'home-elevators': (p1, p2, guide) =>
    ` For comparison, see the [${p1.name}](/products/home-elevators/${p1.slug}) and [${p2.name}](/products/home-elevators/${p2.slug}). Our [${guide.title}](/guides/${guide.slug}) breaks down every elevator type and total installed cost.`,
  'bath-safety': (p1, p2, guide) =>
    ` Also rated highly: the [${p1.name}](/products/bath-safety/${p1.slug}) and [${p2.name}](/products/bath-safety/${p2.slug}). Read our [${guide.title}](/guides/${guide.slug}) for sizing and safety tips before buying.`,
  'smart-home-safety': (p1, p2, guide) =>
    ` Compare with the [${p1.name}](/products/smart-home-safety/${p1.slug}) and [${p2.name}](/products/smart-home-safety/${p2.slug}). See our [${guide.title}](/guides/${guide.slug}) for a full overview of smart home devices for seniors.`,
  'mobility-aids': (p1, p2, guide) =>
    ` Also see the [${p1.name}](/products/mobility-aids/${p1.slug}) and [${p2.name}](/products/mobility-aids/${p2.slug}). Our [${guide.title}](/guides/${guide.slug}) covers choosing between walkers, rollators, and canes.`,
  'door-access': (p1, p2, guide) =>
    ` For other top-rated locks and openers, see the [${p1.name}](/products/door-access/${p1.slug}) and [${p2.name}](/products/door-access/${p2.slug}). Our [${guide.title}](/guides/${guide.slug}) covers accessibility priorities for every entry point.`,
};

function hasInternalLinks(desc) {
  const links = (desc || '').match(/\[([^\]]+)\]\(\/[^)]+\)/g) || [];
  const guideLinks = links.filter(l => l.includes('/guides/'));
  const productLinks = links.filter(l => l.includes('/products/'));
  return productLinks.length >= 2 && guideLinks.length >= 1;
}

async function main() {
  console.log('=== Writer Agent — Internal Link Injection ===');
  console.log(`Started: ${new Date().toISOString()}`);

  const { data: allProducts, error } = await supabase
    .from('sh_products')
    .select('id, name, slug, category, long_description, safe_score')
    .order('category');

  if (error) { console.error('Fetch error:', error); process.exit(1); }

  const needsLinks = allProducts.filter(p => !hasInternalLinks(p.long_description));
  const byCategory = {};
  for (const p of allProducts) {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  }

  console.log(`Products needing internal links: ${needsLinks.length}`);

  let linked = 0;
  let failed = 0;

  for (const product of needsLinks) {
    const guide = CATEGORY_GUIDE[product.category];
    if (!guide) {
      console.log(`  ⚠️  No guide mapping for category: ${product.category}`);
      failed++;
      continue;
    }

    // Pick 2 related products from same category (excluding self, prefer higher safe_score)
    const related = (byCategory[product.category] || [])
      .filter(p => p.id !== product.id && p.slug)
      .sort((a, b) => (b.safe_score || 0) - (a.safe_score || 0))
      .slice(0, 2);

    if (related.length < 2) {
      // Fallback to any 2 products with slugs
      const fallback = allProducts
        .filter(p => p.id !== product.id && p.slug && p.category !== product.category)
        .sort((a, b) => (b.safe_score || 0) - (a.safe_score || 0))
        .slice(0, 2 - related.length);
      related.push(...fallback);
    }

    if (related.length < 2) {
      console.log(`  ⚠️  Not enough related products for: ${product.name}`);
      failed++;
      continue;
    }

    const [p1, p2] = related;
    const templateFn = LINK_TEMPLATES[product.category] || LINK_TEMPLATES['bath-safety'];
    const linkSentence = templateFn(p1, p2, guide);

    const updatedDesc = (product.long_description || '') + linkSentence;

    const { error: upErr } = await supabase
      .from('sh_products')
      .update({ long_description: updatedDesc })
      .eq('id', product.id);

    if (upErr) {
      console.error(`  ❌ ${product.name}: ${upErr.message}`);
      failed++;
    } else {
      linked++;
      if (linked % 10 === 0) console.log(`  Progress: ${linked} updated...`);
    }
  }

  console.log(`\n=== Task 4 Complete ===`);
  console.log(`Products with links added: ${linked} | Failed: ${failed}`);

  return { linked, failed };
}

main().catch(console.error);
