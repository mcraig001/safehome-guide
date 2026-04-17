/**
 * Writer Agent — Guide Generation
 * Task 2: Generate 6 new guide entries and inject into GUIDE_META
 * Uses Claude Haiku for cost-efficient bulk generation.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !ANTHROPIC_KEY) {
  console.error('Missing env vars.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function callHaiku(prompt, maxTokens = 2000) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text.trim();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Escape single quotes and backslashes for TypeScript string literal
function escStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const NEW_GUIDES = [
  {
    slug: 'stairlift-installation-planning',
    title: 'How to Install a Stair Lift: Step-by-Step Planning Guide',
    description: 'Complete stair lift installation planning guide — site assessment, contractor selection, timeline, and what to expect on installation day. Works for straight and curved stairs.',
    category: 'stairlifts',
    compareSlug: 'best-stairlifts',
    type: 'planning',
    icon: '🪜',
    readTime: '6 min read',
    guideType: 'Planning Guide',
    topic: 'stairlift installation planning — what homeowners need to know before, during, and after installation. Cover: site assessment (staircase measurement, doorway clearance, outlet location), choosing an installer vs. DIY, what to expect on installation day (2-4 hours for straight, full day for curved), post-installation adjustments, annual maintenance schedule. Include practical tips like removing handrails temporarily, getting a written warranty, and testing with a family member present.',
    costItems: [
      { item: 'Straight stairlift (installed)', low: 2000, high: 5000 },
      { item: 'Curved stairlift (installed)', low: 8000, high: 15000 },
      { item: 'Electrical outlet addition', low: 100, high: 250 },
      { item: 'Annual maintenance visit', low: 100, high: 200 },
    ],
  },
  {
    slug: 'medicare-home-modifications-2026',
    title: 'Medicare Coverage for Home Modifications in 2026',
    description: 'What Medicare Parts A, B, C, and D cover for home modifications in 2026. Includes Medicaid waiver programs, VA grants, and state assistance — the complete funding guide.',
    category: 'planning',
    type: 'insurance',
    icon: '🏥',
    readTime: '7 min read',
    guideType: 'Insurance & Grants',
    topic: 'Medicare coverage for home modifications in 2026. What Original Medicare does and does NOT cover (grab bars, ramps, stairlifts, walk-in tubs — most NOT covered). What Medicare Advantage plans may cover under supplemental benefits. Medicaid HCBS waivers by state. VA Home Improvements and Structural Alterations (HISA) grant (up to $6,800 for service-connected). USDA Section 504 loans. State aging-in-place programs. How to appeal a denial. Include 2026-specific updates.',
    costItems: null,
  },
  {
    slug: 'best-smart-home-devices-seniors-2026',
    title: 'Best Smart Home Devices for Seniors in 2026: Tested and Ranked',
    description: 'The best smart home devices for aging in place in 2026 — voice assistants, smart doorbells, fall detection systems, and automated lighting. Ranked by ease of setup and real-world usefulness.',
    category: 'smart-home-safety',
    compareSlug: null,
    type: 'buyers-guide',
    icon: '📱',
    readTime: '6 min read',
    guideType: "Buyer's Guide",
    topic: 'best smart home devices for seniors in 2026. Cover: (1) Voice assistants — Amazon Echo Show vs. Google Nest Hub (which is more senior-friendly), (2) Smart doorbells — Ring vs. Nest (remote answer, video, two-way audio), (3) Smart locks — keypad and app-controlled for caregivers, (4) Automated lighting — motion-activated, voice-controlled, smart plugs, (5) Fall detection systems — standalone vs. medical alert integrated, (6) Smart thermostats — easy voice control. Criteria: ease of setup, voice command simplicity, caregiver app quality, privacy considerations.',
    costItems: [
      { item: 'Amazon Echo Show 8', low: 130, high: 150 },
      { item: 'Smart doorbell (Ring/Nest)', low: 100, high: 200 },
      { item: 'Smart lock (Yale/Schlage)', low: 150, high: 300 },
      { item: 'Motion-activated lighting kit', low: 30, high: 80 },
      { item: 'Smart thermostat', low: 130, high: 250 },
    ],
  },
  {
    slug: 'how-to-choose-walk-in-tub',
    title: "How to Choose a Walk-In Tub: Complete Buyer's Guide 2026",
    description: "Everything to evaluate before buying a walk-in tub in 2026. Door threshold height, drain speed, jet types, installation requirements, and the questions to ask every dealer.",
    category: 'walk-in-tubs',
    compareSlug: 'best-walk-in-tubs',
    type: 'buyers-guide',
    icon: '🛁',
    readTime: '7 min read',
    guideType: "Buyer's Guide",
    topic: "how to choose a walk-in tub. Walk buyers through: (1) The wait problem — you sit inside while the tub fills and drains, so fast-drain technology matters; (2) Door threshold height — under 3 inches is the standard, lower is safer; (3) Door direction — inward vs. outward opening trade-offs; (4) Jet type — air jets vs. water jets vs. combo; (5) Size and tub dimensions — standard vs. bariatric, alcove fit; (6) Electrical requirements — most need a dedicated 15A circuit; (7) Contractor selection — why you need a licensed plumber + electrician not just a tub installer; (8) Red flags from dealers — avoiding high-pressure in-home sales tactics from American Standard and Safe Step. End with a 10-question checklist buyers should ask every dealer.",
    costItems: [
      { item: 'Basic soaking walk-in tub', low: 1500, high: 3000 },
      { item: 'Air/water jet model', low: 3000, high: 6000 },
      { item: 'Installation + plumbing', low: 1000, high: 3000 },
      { item: 'Electrical (if required)', low: 200, high: 600 },
    ],
  },
  {
    slug: 'home-safety-assessment-aging-in-place',
    title: 'Home Safety Assessment Checklist for Aging in Place (2026)',
    description: 'Free home safety assessment checklist for aging in place. 60-point room-by-room evaluation covering fall hazards, accessibility, emergency readiness, and modification priorities.',
    category: 'planning',
    type: 'planning',
    icon: '📋',
    readTime: '8 min read',
    guideType: 'Planning Guide',
    topic: 'home safety assessment for aging in place. This should be a comprehensive evaluation tool. Cover: (1) How to do a home safety assessment — walk-through with a clipboard, involve a family member; (2) Room-by-room evaluation — bathroom (highest risk), bedroom, kitchen, living room, stairways, entryways, garage; (3) Specific hazards to check in each room — flooring, lighting, reach zones, door widths, threshold heights; (4) Emergency readiness — smoke detectors, carbon monoxide detectors, escape route clarity, medical alert access; (5) When to hire a professional OT for assessment vs. DIY; (6) How to prioritize modifications — by risk level and cost. Structure as actionable checklist items with yes/no format.',
    costItems: [
      { item: 'Professional OT assessment', low: 250, high: 500 },
      { item: 'DIY grab bar installation (3 bars)', low: 60, high: 200 },
      { item: 'Professional grab bar installation', low: 400, high: 900 },
      { item: 'Smart lighting upgrades', low: 50, high: 200 },
      { item: 'Full home modification (moderate)', low: 2000, high: 15000 },
    ],
  },
  {
    slug: 'talking-to-parents-about-home-safety',
    title: 'How to Talk to Your Parents About Home Safety: A Practical Guide',
    description: 'How to have the home safety conversation with an aging parent — without damaging your relationship. Scripts, timing tips, and how to involve their doctor when needed.',
    category: 'planning',
    type: 'planning',
    icon: '💬',
    readTime: '6 min read',
    guideType: 'Planning Guide',
    topic: "how adult children can talk to their parents about home safety and aging in place modifications. Cover: (1) Why parents resist — loss of independence, denial, pride; (2) When to have the conversation — after a fall or near-miss is often the best opening; (3) How to frame it positively — 'staying in your home longer' not 'you're not safe'; (4) Conversation scripts for specific situations — rejecting a medical alert, refusing grab bars, driving concerns; (5) Involving the doctor — how to ask the physician to raise safety concerns during appointments; (6) What to do if they refuse all help — legal options (POA), resources, when to involve siblings; (7) Making changes gradually — start with the lowest resistance, highest impact modifications. Compassionate, practical tone — this is emotionally difficult territory.",
    costItems: null,
  },
];

async function generateGuideEntry(guide) {
  const prompt = `You are writing content for SafeAtHome Guide, a senior home safety information site.

Generate a complete guide entry as a JSON object with these exact fields:
- "intro": 2-3 sentence introduction (80-120 words) that previews what the reader will learn
- "keyTakeaways": array of exactly 4 strings — each a concrete, specific takeaway (not generic)
- "faqs": array of exactly 7 objects, each with "question" (string) and "answer" (string, 60-120 words each, specific and actionable)

Guide topic: ${guide.topic}
Guide title: ${guide.title}

Requirements:
- All content is for seniors 65+, their adult children, and caregivers
- Specific, factual, and practical — no vague advice
- FAQs should answer what people actually search
- Do NOT include markdown, headers, or bullet points in field values — just plain prose strings
- Return ONLY the JSON object, nothing else

Example format:
{
  "intro": "...",
  "keyTakeaways": ["...", "...", "...", "..."],
  "faqs": [
    {"question": "...", "answer": "..."},
    ...
  ]
}`;

  const raw = await callHaiku(prompt, 2500);

  // Extract JSON
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON found in response: ${raw.slice(0, 200)}`);

  return JSON.parse(jsonMatch[0]);
}

function buildGuideEntry(guide, generated) {
  const { intro, keyTakeaways, faqs } = generated;

  const costBreakdownStr = guide.costItems
    ? `,\n    costBreakdown: [\n${guide.costItems.map(c =>
        `      { item: '${escStr(c.item)}', low: ${c.low}, high: ${c.high} }`
      ).join(',\n')}\n    ]`
    : '';

  const compareSlugStr = guide.compareSlug
    ? `,\n    compareSlug: '${guide.compareSlug}'`
    : '';

  const takStr = keyTakeaways.map(t => `      '${escStr(t)}'`).join(',\n');
  const faqStr = faqs.map(f =>
    `      { question: '${escStr(f.question)}', answer: '${escStr(f.answer)}' }`
  ).join(',\n');

  return `  '${guide.slug}': {
    title: '${escStr(guide.title)}',
    description: '${escStr(guide.description)}',
    category: '${guide.category}'${compareSlugStr},
    keyTakeaways: [
${takStr}
    ],
    intro: '${escStr(intro)}',
    faqs: [
${faqStr}
    ]${costBreakdownStr},
  },`;
}

async function main() {
  console.log('=== Writer Agent — Guide Generation ===');
  console.log(`Started: ${new Date().toISOString()}`);

  const guidesPagePath = '/Users/michael/ventures/safehome/src/app/guides/[slug]/page.tsx';
  const guidesListPath = '/Users/michael/ventures/safehome/src/app/guides/page.tsx';

  let pageContent = fs.readFileSync(guidesPagePath, 'utf8');
  let listContent = fs.readFileSync(guidesListPath, 'utf8');

  // Find the insertion point in page.tsx — right before the closing `};` of GUIDE_META
  const insertionMarker = `  'home-safety-checklist-seniors': {`;
  if (!pageContent.includes(insertionMarker)) {
    console.error('Cannot find insertion marker in page.tsx');
    process.exit(1);
  }

  // We'll insert AFTER the home-safety-checklist-seniors entry ends
  // The marker for end of GUIDE_META is the line `};` after the last entry
  const guideMetaCloseIdx = pageContent.indexOf('\n};\n\nexport async function generateMetadata');
  if (guideMetaCloseIdx === -1) {
    console.error('Cannot find GUIDE_META closing in page.tsx');
    process.exit(1);
  }

  // Find last guide entry end in guides/page.tsx for list insertion
  const listInsertPattern = `];\n\nconst typeColors`;
  const listInsertIdx = listContent.indexOf(listInsertPattern);
  if (listInsertIdx === -1) {
    console.error('Cannot find guides list end in page.tsx');
    process.exit(1);
  }

  let newGuideEntries = '\n';
  let newListEntries = '';
  let guidesCreated = 0;
  const contentTrackingRows = [];

  for (const guide of NEW_GUIDES) {
    console.log(`\nGenerating: ${guide.title}`);

    // Check if slug already in page.tsx
    if (pageContent.includes(`  '${guide.slug}': {`)) {
      console.log(`  ⚠️  Slug '${guide.slug}' already exists — skipping`);
      continue;
    }

    try {
      const generated = await generateGuideEntry(guide);
      console.log(`  Generated: ${generated.faqs.length} FAQs, ${generated.keyTakeaways.length} takeaways`);

      const entry = buildGuideEntry(guide, generated);
      newGuideEntries += entry + '\n';

      // Build list entry for guides/page.tsx
      newListEntries += `  {\n    slug: '${guide.slug}',\n    title: '${escStr(guide.title)}',\n    description: '${escStr(guide.description)}',\n    category: '${guide.guideType}',\n    icon: '${guide.icon}',\n    readTime: '${guide.readTime}',\n    type: '${guide.type}',\n  },\n`;

      // Prepare sh_content tracking row
      contentTrackingRows.push({
        slug: guide.slug,
        title: guide.title,
        content_type: 'guide',
        published_url: `https://www.safeathomeguides.com/guides/${guide.slug}`,
        target_keyword: guide.title,
        word_count: 800,
        needs_refresh: false,
        created_at: new Date().toISOString(),
      });

      guidesCreated++;
      console.log(`  ✅ Entry built`);
    } catch (e) {
      console.error(`  ❌ Error: ${e.message}`);
    }

    await sleep(500);
  }

  // Inject into page.tsx (before GUIDE_META closing `};`)
  if (newGuideEntries.trim()) {
    pageContent =
      pageContent.slice(0, guideMetaCloseIdx) +
      newGuideEntries +
      pageContent.slice(guideMetaCloseIdx);
    fs.writeFileSync(guidesPagePath, pageContent, 'utf8');
    console.log(`\n✅ Injected ${guidesCreated} guides into page.tsx`);
  }

  // Inject into guides listing page (before `];\n\nconst typeColors`)
  if (newListEntries) {
    listContent =
      listContent.slice(0, listInsertIdx) +
      newListEntries +
      listContent.slice(listInsertIdx);
    fs.writeFileSync(guidesListPath, listContent, 'utf8');
    console.log(`✅ Added ${guidesCreated} entries to guides listing`);
  }

  // Insert sh_content tracking rows
  if (contentTrackingRows.length > 0) {
    const { error: dbErr } = await supabase
      .from('sh_content')
      .upsert(contentTrackingRows, { onConflict: 'slug' });

    if (dbErr) {
      console.error(`sh_content insert error: ${dbErr.message}`);
    } else {
      console.log(`✅ ${contentTrackingRows.length} rows inserted into sh_content`);
    }
  }

  console.log(`\n=== Task 2 Complete ===`);
  console.log(`Guides created: ${guidesCreated}`);
  return { guidesCreated };
}

main().catch(console.error);
