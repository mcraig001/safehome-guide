/**
 * Writer Agent — Product Enrichment
 * Task 1: Expand long_description for products under 400 chars
 * Task 4: Inject internal links to 2 related products + 1 guide per product
 * Uses Claude Haiku for cost-efficient bulk generation.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !ANTHROPIC_KEY) {
  console.error('Missing env vars. Source .env.master first.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Map category → canonical guide slug for internal linking
const CATEGORY_GUIDE = {
  'stairlifts': 'stairlift-cost-guide',
  'walk-in-tubs': 'walk-in-tub-cost-guide',
  'grab-bars': 'grab-bar-installation-guide',
  'medical-alerts': 'medical-alert-cost-guide',
  'wheelchair-ramps': 'wheelchair-ramp-cost-guide',
  'home-elevators': 'home-elevator-cost-guide',
  'bath-safety': 'best-shower-chair-for-seniors',
  'smart-home-safety': 'fall-prevention-for-seniors',
  'mobility-aids': 'rollator-walker-guide',
  'door-access': 'aging-in-place-planning-guide',
};

// Map category → product category path
const CATEGORY_PATH = {
  'stairlifts': 'stairlifts',
  'walk-in-tubs': 'walk-in-tubs',
  'grab-bars': 'grab-bars',
  'medical-alerts': 'medical-alerts',
  'wheelchair-ramps': 'wheelchair-ramps',
  'home-elevators': 'home-elevators',
  'bath-safety': 'bath-safety',
  'smart-home-safety': 'smart-home-safety',
  'mobility-aids': 'mobility-aids',
  'door-access': 'door-access',
};

async function callHaiku(prompt) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text.trim();
}

async function generateProductContent(product, relatedProducts) {
  const relatedLinks = relatedProducts
    .slice(0, 2)
    .map(r => `[${r.name}](/products/${CATEGORY_PATH[r.category]}/${r.slug})`)
    .join(' and ');

  const guideSlug = CATEGORY_GUIDE[product.category] || 'aging-in-place-planning-guide';
  const guideLink = `/guides/${guideSlug}`;

  const prompt = `You are writing product copy for SafeAtHome Guide, a senior home safety product review site.

Write a long_description for this product. Requirements:
- 420-520 words (count carefully — this is the most important requirement)
- Plain prose paragraphs, NO bullet points, NO markdown headers
- SEO optimized for seniors, caregivers, and aging-in-place searches
- Cover: what the product does, who it's for, key benefits, installation/setup notes if relevant, what to look for when buying
- Natural, trustworthy tone — not salesy
- Include exactly these two internal product links naturally in the text: ${relatedLinks}
- Include exactly this internal guide link naturally in the text: [our complete guide](${guideLink})
- Amazon affiliate tag on all external Amazon links should be safehome00c-20 (but don't add any — just write prose)

Product details:
Name: ${product.name}
Category: ${product.category}
Existing description (short, expand this): ${product.long_description || 'None'}
SafeScore: ${product.safe_score}/100
Pros: ${JSON.stringify(product.pros)}
Specs: ${JSON.stringify(product.specs)}

Write ONLY the long_description text. Start directly with the first sentence. No intro, no title, no "Here is", no JSON.`;

  const text = await callHaiku(prompt);
  return text;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('=== Writer Agent — Product Enrichment ===');
  console.log(`Started: ${new Date().toISOString()}`);

  // 1. Fetch all products
  const { data: allProducts, error: fetchErr } = await supabase
    .from('sh_products')
    .select('id, name, slug, category, long_description, pros, cons, safe_score, specs')
    .order('category');

  if (fetchErr) { console.error('Fetch error:', fetchErr); process.exit(1); }
  console.log(`\nTotal products: ${allProducts.length}`);

  // 2. Find products needing enrichment (< 400 chars)
  const needsWork = allProducts.filter(p =>
    !p.long_description || p.long_description.length < 400
  );
  console.log(`Products needing enrichment: ${needsWork.length}`);

  // 3. Build category lookup for related product links
  const byCategory = {};
  for (const p of allProducts) {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  }

  // 4. Enrich each product
  let enriched = 0;
  let failed = 0;

  for (const product of needsWork) {
    console.log(`\n[${enriched + failed + 1}/${needsWork.length}] ${product.name}`);

    // Get related products from same category (excluding self)
    const related = (byCategory[product.category] || [])
      .filter(p => p.id !== product.id && p.long_description && p.long_description.length > 400)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    // Fallback: if not enough same-category products with good descriptions,
    // grab any 2 with good descriptions
    if (related.length < 2) {
      const fallback = allProducts
        .filter(p => p.id !== product.id && p.long_description && p.long_description.length > 400)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2 - related.length);
      related.push(...fallback);
    }

    try {
      const newDesc = await generateProductContent(product, related);
      console.log(`  Generated: ${newDesc.length} chars (~${Math.round(newDesc.split(/\s+/).length)} words)`);

      const { error: upErr } = await supabase
        .from('sh_products')
        .update({ long_description: newDesc })
        .eq('id', product.id);

      if (upErr) {
        console.error(`  Upsert error: ${upErr.message}`);
        failed++;
      } else {
        console.log(`  ✅ Updated`);
        enriched++;
      }
    } catch (e) {
      console.error(`  ❌ Generation error: ${e.message}`);
      failed++;
    }

    // Rate limit: 3 req/sec max for Haiku, add 400ms gap
    await sleep(400);
  }

  console.log(`\n=== Task 1 Complete ===`);
  console.log(`Enriched: ${enriched} | Failed: ${failed}`);

  return { enriched, failed };
}

main().catch(console.error);
