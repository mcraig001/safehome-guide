import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { LeadForm } from '@/components/LeadForm';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { faqSchema, breadcrumbSchema, articleSchema, howToSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { BookOpen, DollarSign, ChevronRight, CheckCircle } from 'lucide-react';
import { ShareButtons } from '@/components/ShareButtons';

const WHAT_TO_LOOK_FOR: Record<string, { tip: string; detail: string }[]> = {
  stairlifts: [
    { tip: 'Straight vs. curved rail', detail: 'Straight rails fit standard staircases and cost $2,000–$5,000. Any bend or landing requires a custom curved rail, adding $6,000–$10,000.' },
    { tip: 'Weight capacity', detail: 'Standard models handle 250–300 lbs. Confirm the rated capacity before ordering — heavy-duty models exist at a 20–40% premium.' },
    { tip: 'Battery backup', detail: 'Ensure the model runs on rechargeable batteries so it works during power outages. Most quality models do; confirm before buying.' },
    { tip: 'Folded width', detail: 'When folded, the seat and arms should leave 22+ inches of clear stair width for other household members.' },
    { tip: 'Warranty and service network', detail: 'Look for 2+ year parts warranty and a local authorized service technician. National brands (Bruno, Acorn, Harmar) have wider service networks.' },
  ],
  'walk-in-tubs': [
    { tip: 'Fast-drain technology', detail: 'Standard tubs drain in 3–5 minutes; you must sit inside during the entire drain. Fast-drain models complete in under 2 minutes — a meaningful quality-of-life difference.' },
    { tip: 'Step-over threshold height', detail: 'Lower is safer. Look for thresholds under 3 inches. The best models have a 1.5–2 inch threshold.' },
    { tip: 'Door seal and hinge direction', detail: 'Inward-opening doors are more watertight but require you to sit inside while filling. Outward-opening doors allow entry before filling — safer for some users.' },
    { tip: 'Hydrotherapy options', detail: 'Air jets are gentler and more hygienic (no standing water in the pipes). Water jets provide more pressure for joint pain relief. Combination systems cost more but offer both.' },
    { tip: 'Installation requirements', detail: 'Confirm whether your electrical panel can handle the amperage requirements (often 20A or 30A dedicated circuit). Factor in the electrical cost.' },
  ],
  'grab-bars': [
    { tip: 'Weight rating', detail: 'ADA minimum is 250 lbs. Better-quality bars are rated 500 lbs. The installation anchoring matters as much as the bar itself.' },
    { tip: 'Grip texture', detail: 'Look for knurled or textured gripping surfaces — smooth bars are slippery when wet. Avoid decorative bars with purely smooth finishes for safety-critical locations.' },
    { tip: 'Finish matching', detail: 'Bars are available in chrome, brushed nickel, oil-rubbed bronze, and white. Matching your existing fixtures improves aesthetics and resale value.' },
    { tip: 'Angled vs. horizontal vs. vertical', detail: 'Horizontal bars support lateral movement. Vertical bars assist with standing up. Angled (diagonal) bars serve both functions. Placement determines which orientation is most useful.' },
    { tip: 'Flange cover vs. exposed screws', detail: 'Bars with flip-down flange covers allow studs to be located after positioning, then hide the screws — easier installation and cleaner look.' },
  ],
  'medical-alerts': [
    { tip: 'Home-only vs. GPS mobile', detail: 'Home-only systems use a base station + cellular. GPS mobile systems go everywhere. If your loved one drives or goes out regularly, GPS is essential.' },
    { tip: 'Fall detection accuracy', detail: 'Ask providers for their fall detection accuracy rate. Clinical-grade algorithms detect 75–85% of falls. Avoid any provider that cannot give you this number.' },
    { tip: 'Response time', detail: 'Top providers connect to a live operator in 30–45 seconds. Ask specifically for average response time and whether operators are US-based.' },
    { tip: 'Battery life', detail: 'Home pendants typically last 2–5 years. GPS mobile devices need daily or every-other-day charging — factor this into daily routine before committing.' },
    { tip: 'Contract terms', detail: 'Choose month-to-month plans. Avoid any provider requiring a 12-month commitment upfront. Ask about equipment return policy before canceling.' },
  ],
  'wheelchair-ramps': [
    { tip: 'Slope ratio (rise:run)', detail: 'ADA standard is 1:12 (1 inch of rise per foot of length). A 6-inch step needs a 6-foot ramp minimum. Gentler slopes (1:16 or 1:20) are safer and easier to self-propel.' },
    { tip: 'Portable vs. modular vs. permanent', detail: 'Portable for occasional use ($100–$400). Modular aluminum for semi-permanent installation without permits ($1,200–$3,500). Permanent wood/concrete for long-term ($2,000–$10,000).' },
    { tip: 'Weight capacity', detail: 'Combine the user\'s weight, wheelchair weight, and caregiver weight if applicable. Most residential ramps are rated 800 lbs; power wheelchairs can weigh 200+ lbs.' },
    { tip: 'Edge protection', detail: 'Raised edges (2+ inch curbs) on both sides of the ramp prevent wheels from rolling off. This is a non-negotiable safety feature for wheelchair users.' },
    { tip: 'Surface traction', detail: 'Look for non-slip surfaces — aluminum tread plate, rubber coating, or grit tape. Smooth aluminum becomes dangerously slippery when wet.' },
  ],
  'home-elevators': [
    { tip: 'Shaft vs. no shaft', detail: 'Pneumatic/vacuum elevators require no shaft — just a ceiling cutout. Traditional cable and hydraulic elevators need a dedicated shaft, adding construction cost.' },
    { tip: 'Cab size and wheelchair access', detail: 'Standard residential cabs (36×48 inches) fit most power wheelchairs. Confirm the interior dimensions against your specific wheelchair before specifying.' },
    { tip: 'Drive system', detail: 'Hydraulic: quiet, smooth, proven reliability. Cable/traction: faster, better for 3+ floors. Pneumatic: no shaft, stylish, but more expensive per floor traveled.' },
    { tip: 'Annual maintenance requirements', detail: 'Budget $200–$500/year for mandatory professional service. Many states require licensed elevator inspectors regardless of residential use.' },
    { tip: 'Home resale value impact', detail: 'A residential elevator typically adds $15,000–$25,000 to a home\'s appraised value — partially offsetting installation costs for homes where it is a logical fit.' },
  ],
  'bath-safety': [
    { tip: 'Shower chair vs. transfer bench', detail: 'Shower chair sits entirely inside — for users who can step into the shower. Transfer bench straddles the tub wall — for users who cannot step over at all.' },
    { tip: 'Weight capacity', detail: 'Most standard bath benches support 250–300 lbs. Bariatric models support 400–600 lbs. Check the rating before purchasing.' },
    { tip: 'Non-slip feet', detail: 'Rubber-tipped feet prevent sliding on wet tile. Suction-cup feet add security on smooth surfaces. Look for both on any product placed in a wet zone.' },
    { tip: 'Seat height adjustability', detail: 'Adjustable legs (typically 14–19 inches) accommodate different user heights and tub/shower configurations. Fixed-height seats may not work for all users.' },
    { tip: 'Drainage holes in seat', detail: 'Perforated or slatted seat surfaces drain quickly, reducing sitting in standing water. Solid seats are easier to clean but stay wet longer.' },
  ],
  'smart-home-safety': [
    { tip: 'Voice assistant compatibility', detail: 'Look for devices that work with both Alexa and Google Assistant, not just one ecosystem. Older adults may switch devices; broad compatibility future-proofs the setup.' },
    { tip: 'App simplicity', detail: 'The family caregiver will use the app daily. Look for clean, clearly labeled interfaces — avoid products with complex multi-tab apps designed for tech enthusiasts.' },
    { tip: 'Offline fallback', detail: 'Smart smoke detectors and locks should function without internet. Wi-Fi outages are common; safety devices cannot depend on connectivity.' },
    { tip: 'Privacy and data', detail: 'Indoor cameras and voice assistants record audio/video. Understand the privacy policy and whether data is stored in the cloud. Some families use local-only setups.' },
    { tip: 'Professional monitoring option', detail: 'For seniors living alone, systems with professional monitoring (someone calls when an alarm triggers) are significantly safer than self-monitored-only setups.' },
  ],
  'mobility-aids': [
    { tip: 'Walker vs. rollator', detail: 'Standard walker = maximum stability (you lift it), ideal post-surgery. Rollator = wheels + seat + brakes, easier long-distance but requires more balance. Match to the user\'s balance level.' },
    { tip: 'Wheel size', detail: '6-inch wheels work well indoors. 8-inch wheels handle outdoor terrain (cracks, grass, gravel) much better. If outdoor use is needed, size up.' },
    { tip: 'Seat and backrest', detail: 'If the user will rest during walks, the seat height, cushioning, and back support matter. Measure comfortable seated height before buying — adjustable height seats are best.' },
    { tip: 'Folded size and weight', detail: 'Rollators need to fit in a car trunk or be light enough to lift. Most fold to ~12 inches wide. Lightweight models (under 15 lbs) are much easier for seniors to self-manage.' },
    { tip: 'Brake type', detail: 'Loop brakes (squeeze to roll, release to lock) are safest — the brakes engage if the user loses their grip, preventing runaway. Push-down brakes require deliberate action to lock.' },
  ],
  'door-access': [
    { tip: 'Keypad vs. smart lock', detail: 'A basic keypad deadbolt eliminates keys at low cost ($80–$150). Smart locks add Bluetooth/Wi-Fi for app access, remote unlocking, and activity logs — worth it if a caregiver needs remote access.' },
    { tip: 'ANSI security grade', detail: 'Grade 1 = commercial-grade security (strongest). Grade 2 = residential high-security. Grade 3 = basic. For exterior doors, specify Grade 1 only.' },
    { tip: 'Auto-lock feature', detail: 'Auto-lock re-locks the door after a set time (30 sec to 5 min). Critical for users with cognitive decline who may forget to lock up.' },
    { tip: 'Lever vs. knob', detail: 'ADA-compliant lever handles are dramatically easier for people with arthritis or limited grip strength. Replace any remaining knob-style handles when upgrading to keypad locks.' },
    { tip: 'Battery life and low-battery alert', detail: 'Most smart locks run 6–12 months on AA batteries. Confirm the lock sends a low-battery notification via app before it dies — a dead lock that\'s also a deadbolt is a problem.' },
  ],
};

interface Props { params: Promise<{ slug: string }> }

function getGuideTypeLabel(slug: string): string {
  if (slug.includes('cost-guide')) return 'Cost Guide';
  if (slug.includes('medicare') || slug.includes('grants') || slug.includes('tax-deduction')) return 'Insurance & Grants';
  if (slug.includes('how-to-choose') || slug.includes('vs-') || slug.includes('best-')) return "Buyer's Guide";
  if (slug.includes('checklist') || slug.includes('modifications') || slug.includes('safety')) return 'Planning Guide';
  return 'Guide';
}

// Map guide slugs → product categories + static guide content
const GUIDE_META: Record<string, {
  title: string;
  description: string;
  category: string;
  intro: string;
  faqs: { question: string; answer: string }[];
  costBreakdown?: { item: string; low: number; high: number }[];
  compareSlug?: string;
}> = {
  'stairlift-cost-guide': {
    title: 'How Much Does a Stairlift Cost in 2026?',
    description: 'Complete stairlift cost guide: new vs refurbished, straight vs curved, installation fees, and financing options. Updated March 2026.',
    category: 'stairlifts',
    compareSlug: 'best-stairlifts',
    intro: 'Stairlifts range from $2,000 for a basic straight-rail model to over $15,000 for a custom curved installation. The biggest cost drivers are the staircase shape, weight capacity, and brand. This guide breaks down every cost factor so you know exactly what to budget.',
    faqs: [
      { question: 'Does Medicare cover stairlifts?', answer: 'Standard Medicare (Parts A and B) does not cover stairlifts because they are not classified as durable medical equipment. Some Medicare Advantage plans and Medicaid programs may offer partial coverage — check with your specific plan.' },
      { question: 'How long does stairlift installation take?', answer: 'A straight stairlift takes 2–4 hours to install. Curved stairlifts, which require custom-bent rails, typically take a full day.' },
      { question: 'Can I install a stairlift myself?', answer: 'Most manufacturers strongly advise against DIY installation for safety and warranty reasons. Some basic straight models have DIY kits, but professional installation is standard and often required for warranty coverage.' },
      { question: 'What is the weight limit for most stairlifts?', answer: 'Standard stairlifts handle 250–300 lbs. Heavy-duty models (available from most major brands) support 350–500 lbs, at a 20–40% price premium.' },
    ],
    costBreakdown: [
      { item: 'Straight stairlift (new)', low: 2000, high: 5000 },
      { item: 'Curved stairlift (new)', low: 8000, high: 15000 },
      { item: 'Refurbished straight', low: 1000, high: 2500 },
      { item: 'Professional installation', low: 200, high: 500 },
      { item: 'Extended warranty (3 yr)', low: 300, high: 700 },
    ],
  },
  'walk-in-tub-cost-guide': {
    title: 'Walk-In Tub Cost Guide: What to Expect in 2026',
    description: 'Walk-in tub prices, installation costs, and what insurance may cover. Includes brand comparisons and buying tips.',
    category: 'walk-in-tubs',
    compareSlug: 'best-walk-in-tubs',
    intro: 'Walk-in tubs typically cost $1,500–$5,000 for the unit, plus $1,000–$3,000 for professional installation — a total investment of $2,500–$8,000. Soaking and hydrotherapy models cost more. Here\'s everything that affects the final price.',
    faqs: [
      { question: 'Does insurance cover walk-in tubs?', answer: 'Private health insurance rarely covers walk-in tubs. Medicaid Home and Community-Based Services (HCBS) waivers may cover them for qualifying seniors. Some VA programs cover bathroom modifications for veterans.' },
      { question: 'How long does walk-in tub installation take?', answer: 'Installation typically takes 1–2 days. The plumber must modify existing water lines and drainage, which adds to the timeline.' },
      { question: 'What is the fill and drain time for a walk-in tub?', answer: 'Most tubs fill in 3–5 minutes and drain in 2–3 minutes with a fast-drain valve. You must wait inside the tub during both fill and drain to keep the door watertight.' },
    ],
    costBreakdown: [
      { item: 'Basic soaking tub', low: 1500, high: 3000 },
      { item: 'Hydrotherapy/air jets', low: 3000, high: 5000 },
      { item: 'Bariatric (wide) model', low: 4000, high: 7000 },
      { item: 'Professional installation', low: 1000, high: 3000 },
      { item: 'Electrical (if required)', low: 200, high: 600 },
    ],
  },
  'grab-bar-installation-guide': {
    title: 'Grab Bar Installation Guide: Where to Put Them and How Much It Costs',
    description: 'ADA-compliant grab bar placement, installation costs, and which bars work best for different needs. Written with occupational therapists.',
    category: 'grab-bars',
    compareSlug: 'best-grab-bars',
    intro: 'Grab bars are one of the most cost-effective home safety investments — a single professionally installed bar costs $75–$200, and they prevent tens of thousands of bathroom falls each year. Correct placement matters as much as the product itself.',
    faqs: [
      { question: 'Can grab bars be installed on any wall?', answer: 'Grab bars must be anchored into wall studs or with toggle bolt anchors rated for 250+ lbs. Drywall alone cannot support a grab bar safely. A professional installer will locate studs or use specialized anchors.' },
      { question: 'Where should grab bars be placed in a shower?', answer: 'ADA guidelines recommend a horizontal bar 33–36 inches from the floor on the long wall, and an angled or vertical bar near the entry point for getting in and out.' },
      { question: 'Are grab bars only for elderly people?', answer: 'Grab bars benefit anyone recovering from surgery, anyone with balance issues, or anyone who wants to reduce fall risk. They are increasingly used in universal design for all ages.' },
    ],
    costBreakdown: [
      { item: 'Basic stainless bar (each)', low: 20, high: 60 },
      { item: 'Designer/decorative bar', low: 60, high: 200 },
      { item: 'Professional installation (per bar)', low: 75, high: 150 },
      { item: 'Full bathroom package (4–6 bars)', low: 400, high: 900 },
    ],
  },
  'does-medicare-cover-stairlifts': {
    title: 'Does Medicare Cover Stairlifts? (2026 Guide)',
    description: 'Medicare Parts A, B, and C coverage for stairlifts explained — plus Medicaid waiver programs, VA benefits, and state grant programs that may help pay.',
    category: 'stairlifts',
    compareSlug: 'best-stairlifts',
    intro: 'The short answer: standard Medicare (Parts A and B) does not cover stairlifts. However, several alternative programs — including some Medicare Advantage plans, Medicaid HCBS waivers, and VA benefits — may cover part or all of the cost. Here\'s how to find out what you qualify for.',
    faqs: [
      { question: 'Does Medicare Part B cover stairlifts?', answer: 'No. Medicare Part B covers durable medical equipment (DME) such as wheelchairs, walkers, and hospital beds. Stairlifts are classified as home modifications — not DME — so they fall outside Part B coverage. This classification has not changed under recent CMS rulemakings.' },
      { question: 'Does Medicare Advantage cover stairlifts?', answer: 'Some Medicare Advantage (Part C) plans include a "Healthy Home" or "Home Safety" supplemental benefit that covers home modifications including stairlifts. Coverage and dollar limits vary by plan. Call your plan\'s member services line and ask specifically about home modification benefits.' },
      { question: 'Does Medicaid cover stairlifts?', answer: 'Medicaid coverage depends on your state. Many states have Home and Community-Based Services (HCBS) waiver programs that fund home modifications to help seniors stay at home. Common program names include "PACE," "CHOICES," and "Community First Choice." Contact your state Medicaid office or Area Agency on Aging.' },
      { question: 'Does the VA cover stairlifts for veterans?', answer: 'Yes. The VA offers two home modification grants: the Specially Adapted Housing (SAH) grant (up to $109,986 in 2024) and the Special Housing Adaptation (SHA) grant (up to $22,036). Veterans with service-connected disabilities may qualify. Apply through your VA regional office.' },
      { question: 'Are there other financial assistance programs for stairlifts?', answer: 'Yes — several. The USDA Section 504 Rural Repair and Rehabilitation Program provides grants up to $10,000 to very low-income homeowners. Many Area Agencies on Aging run local modification programs. Some states have dedicated senior home repair programs. The National Council on Aging\'s BenefitsCheckUp tool can identify programs in your area.' },
      { question: 'Are stairlifts tax deductible?', answer: 'Stairlifts may be partially deductible as a medical expense if your total medical expenses exceed 7.5% of your adjusted gross income. The deductible amount is the cost minus any increase in home value the lift provides (typically $0 for a stairlift). Consult a tax professional.' },
    ],
    costBreakdown: [
      { item: 'Medicare coverage', low: 0, high: 0 },
      { item: 'Medicare Advantage (varies by plan)', low: 0, high: 1500 },
      { item: 'Medicaid HCBS waiver (varies by state)', low: 0, high: 5000 },
      { item: 'VA SAH/SHA grant', low: 0, high: 109986 },
      { item: 'Your out-of-pocket cost', low: 2000, high: 5000 },
    ],
  },
  'does-medicare-cover-walk-in-tubs': {
    title: 'Does Medicare Cover Walk-In Tubs? (2026 Guide)',
    description: 'The truth about Medicare, Medicaid, and VA coverage for walk-in tubs — and which programs actually pay for bathroom modifications.',
    category: 'walk-in-tubs',
    compareSlug: 'best-walk-in-tubs',
    intro: 'Standard Medicare does not cover walk-in tubs. But multiple programs — Medicare Advantage supplemental benefits, Medicaid waivers, and VA grants — may help cover bathroom modifications. Here\'s the complete guide to financial assistance for walk-in tubs.',
    faqs: [
      { question: 'Does Medicare cover walk-in tubs?', answer: 'Standard Medicare (Parts A and B) does not cover walk-in tubs. Like stairlifts, walk-in tubs are classified as home modifications rather than durable medical equipment under CMS guidelines.' },
      { question: 'What about Medicare Advantage?', answer: 'Some Medicare Advantage plans include home modification benefits through "Healthy Home," "Home Safety," or "Supplemental Home Benefit" add-ons. Dollar limits typically range from $500 to $2,500 per year. Call your plan and specifically ask about bathroom modification coverage.' },
      { question: 'Will Medicaid cover a walk-in tub?', answer: 'Medicaid Home and Community-Based Services (HCBS) waivers in many states fund home modifications to prevent nursing home placement. Walk-in tubs are commonly approved under these programs. Income and functional eligibility requirements apply. Contact your local Area Agency on Aging to apply.' },
      { question: 'Can the VA pay for a walk-in tub?', answer: 'Yes. Veterans with service-connected disabilities may qualify for VA Specially Adapted Housing (SAH) or SHA grants that cover bathroom modifications. Additionally, the VA\'s Home Improvements and Structural Alterations (HISA) grant provides up to $6,800 for veterans with service-connected conditions and up to $2,000 for non-service-connected conditions.' },
      { question: 'Are there nonprofit programs that help pay for walk-in tubs?', answer: 'Several national nonprofits fund home modifications: Rebuilding Together (free modifications for low-income homeowners), Habitat for Humanity Home Repair, and local Community Action Agencies. Many states also have specific senior home repair programs — search "[your state] senior home modification grant."' },
    ],
    costBreakdown: [
      { item: 'Medicare Part A/B coverage', low: 0, high: 0 },
      { item: 'Medicare Advantage benefit', low: 0, high: 2500 },
      { item: 'Medicaid HCBS waiver', low: 0, high: 8000 },
      { item: 'VA HISA grant', low: 0, high: 6800 },
      { item: 'Typical out-of-pocket (after assistance)', low: 1500, high: 6000 },
    ],
  },
  'aging-in-place-home-modifications-checklist': {
    title: 'Aging-in-Place Home Modifications: Complete Room-by-Room Checklist',
    description: 'Everything you need to modify in your home to safely age in place — organized by room, priority level, and estimated cost.',
    category: 'grab-bars',
    intro: 'A complete aging-in-place home modification covers six key areas: the bathroom, bedroom, kitchen, entrance, stairways, and outdoor spaces. This checklist prioritizes modifications by fall risk reduction — the leading cause of injury hospitalizations for adults 65+.',
    faqs: [
      { question: 'What are the most important aging-in-place modifications?', answer: 'By frequency of injury prevention: (1) bathroom grab bars, (2) non-slip surfaces in bathroom and entry, (3) improved lighting throughout, (4) stair handrails on both sides, (5) removal of throw rugs and tripping hazards. These five changes address the majority of fall risks.' },
      { question: 'What does a full aging-in-place modification cost?', answer: 'A basic package (grab bars, non-slip mats, improved lighting) costs $500–$2,000. A comprehensive modification including a stairlift, walk-in tub, and contractor work runs $10,000–$30,000. Most families implement in phases over 2–3 years.' },
      { question: 'Do I need a CAPS contractor for modifications?', answer: 'CAPS (Certified Aging-in-Place Specialist) certification means the contractor has NAHB training in aging-in-place design. For complex projects involving structural changes, a CAPS contractor is strongly recommended. For basic modifications like grab bars and ramps, any licensed, insured contractor can handle the work.' },
      { question: 'How do I prioritize modifications on a budget?', answer: 'Start with fall prevention in the bathroom — grab bars, a non-slip mat, and a shower chair cost under $300 total and address the highest-risk area. Then address entry and stair safety. Save major items like stairlifts and walk-in tubs for when they become necessary or when funding is secured.' },
      { question: 'Can modifications hurt my home\'s resale value?', answer: 'Most modifications are either invisible (grab bars) or add value to buyers who need them. Stairlifts and walk-in tubs can be removed if needed. Studies show that accessible homes sell faster and at comparable prices in markets with aging populations.' },
    ],
    costBreakdown: [
      { item: 'Bathroom grab bars (4–6 bars + install)', low: 300, high: 800 },
      { item: 'Non-slip surfaces + lighting', low: 150, high: 400 },
      { item: 'Entry ramp + handrail', low: 500, high: 2000 },
      { item: 'Stairlift (straight)', low: 2000, high: 5000 },
      { item: 'Walk-in tub (installed)', low: 3500, high: 10000 },
      { item: 'Full home CAPS assessment', low: 200, high: 500 },
    ],
  },
  'medical-alert-cost-guide': {
    title: 'Medical Alert System Cost Guide: What to Expect in 2026',
    description: 'Medical alert system costs explained: monthly fees, equipment costs, GPS upgrades, and fall detection. Compare top brands.',
    category: 'medical-alerts',
    compareSlug: 'best-medical-alerts',
    intro: 'Medical alert systems cost $0–$200 upfront for equipment and $20–$55 per month for monitoring. The right system depends on how active your loved one is, whether they leave the home, and whether fall detection is a priority. Here\'s everything that affects the price.',
    faqs: [
      { question: 'Is there a long-term contract for medical alert systems?', answer: 'Most top providers (Medical Guardian, Bay Alarm, Philips Lifeline) are month-to-month with no long-term contract required. A few offer slight discounts for annual prepayment. Avoid any provider requiring a 2+ year commitment.' },
      { question: 'What is fall detection and how accurate is it?', answer: 'Fall detection uses accelerometers and algorithms to automatically call for help if a fall is detected — without the user pressing a button. Accuracy varies by brand: most detect 70–85% of falls with some false positives. Fall detection typically adds $5–$10/month to the base subscription.' },
      { question: 'Does Medicare pay for medical alert systems?', answer: 'Standard Medicare does not cover personal emergency response systems (PERS). Some Medicare Advantage plans include PERS as a supplemental benefit — call your plan\'s member services and ask specifically about "personal emergency response" or "PERS" coverage.' },
      { question: 'What is GPS medical alert and why does it cost more?', answer: 'GPS-enabled systems work outside the home using cellular networks — the user can call for help from anywhere. These cost $10–$20/month more than home-only systems. GPS is essential for users who are still active and leave the house regularly.' },
      { question: 'How do I choose between home-only and mobile systems?', answer: 'Home-only systems (base station + button) are more affordable and reliable for users who primarily stay home. Mobile/GPS systems are right for anyone who drives, shops, or visits grandchildren. Consider: if a fall happened outdoors or away from home, would they have a way to call for help?' },
    ],
    costBreakdown: [
      { item: 'Equipment (purchase or free with plan)', low: 0, high: 200 },
      { item: 'Home system (monthly)', low: 20, high: 35 },
      { item: 'GPS mobile system (monthly)', low: 35, high: 55 },
      { item: 'Fall detection add-on (monthly)', low: 5, high: 10 },
      { item: 'Annual cost (typical home system)', low: 240, high: 420 },
    ],
  },
  'wheelchair-ramp-cost-guide': {
    title: 'Wheelchair Ramp Cost Guide: Portable vs. Permanent (2026)',
    description: 'How much does a wheelchair ramp cost? Portable ramps start at $100. Permanent modular ramps cost $1,200–$4,000 installed. Everything affecting the price explained.',
    category: 'wheelchair-ramps',
    intro: 'Wheelchair ramp costs range from $100 for a small threshold ramp to $4,000+ for a permanent modular system. The biggest cost factors are the rise height (how many inches or steps must be spanned), material, and whether the ramp is portable or permanent. ADA guidelines recommend a 1:12 slope (one inch of rise per foot of ramp).',
    faqs: [
      { question: 'How long does a wheelchair ramp need to be?', answer: 'ADA guidelines recommend a 1:12 slope: for every 1 inch of rise, you need 12 inches (1 foot) of ramp. A 6-inch threshold needs a 6-foot ramp. A 3-step entry (approximately 21 inches of rise) needs a 21-foot ramp — which is why multi-step entries often use switchback ramp designs.' },
      { question: 'Do I need a permit for a wheelchair ramp?', answer: 'Permanent attached ramps typically require a building permit. Requirements vary by municipality — some exempt ramps under a certain length or size. Portable and freestanding modular ramps generally do not require permits. Always check with your local building department before starting construction.' },
      { question: 'Can a wheelchair ramp be removed or moved?', answer: 'Portable folding ramps are designed for relocation. Modular aluminum ramp systems are also generally removable and can be reconfigured or reinstalled at a new home. Concrete ramps are permanent. Modularity is a key advantage for renters or families who may move.' },
      { question: 'What is the best ramp material for outdoor use?', answer: 'Aluminum is the most popular material for outdoor wheelchair ramps: it\'s lightweight, non-corrosive, and low-maintenance. Pressure-treated wood is less expensive but requires periodic staining and maintenance. Concrete is the most durable but also the most permanent and expensive.' },
      { question: 'Are wheelchair ramps covered by insurance or programs?', answer: 'Medicaid HCBS waivers in many states cover wheelchair ramps as home modifications. The VA HISA grant (up to $6,800) covers access ramps for qualifying veterans. Some area agencies on aging offer free ramp installation for income-qualified seniors. Contact your local Area Agency on Aging.' },
    ],
    costBreakdown: [
      { item: 'Threshold ramp (1–4 inch rise)', low: 50, high: 150 },
      { item: 'Portable folding ramp (4–8 ft)', low: 150, high: 400 },
      { item: 'Modular aluminum system (installed)', low: 1200, high: 3500 },
      { item: 'Wood ramp (contractor-built)', low: 800, high: 2500 },
      { item: 'Concrete ramp (contractor-built)', low: 1500, high: 4000 },
    ],
  },
  'home-modification-grants-for-seniors': {
    title: 'Home Modification Grants for Seniors: Every Program Explained (2026)',
    description: 'Complete guide to grants, loans, and benefits for senior home modifications — USDA, Area Agency on Aging, Medicaid waivers, VA grants, and state programs.',
    category: 'grab-bars',
    intro: 'Multiple government and nonprofit programs offer free or low-cost funding for aging-in-place home modifications. Most families don\'t know these programs exist. This guide covers every major program — federal, state, and nonprofit — and explains how to apply.',
    faqs: [
      { question: 'What is the USDA Section 504 program?', answer: 'The USDA Section 504 Rural Repair and Rehabilitation Program provides grants up to $10,000 (or loans up to $40,000) to very-low-income homeowners in rural areas to repair, improve, or modernize their homes. Income must be below 50% of area median income. Apply through your local USDA Rural Development office.' },
      { question: 'What home modifications does the VA pay for?', answer: 'The VA offers three programs: (1) Specially Adapted Housing (SAH) grant — up to $109,986 for veterans with severe service-connected disabilities, (2) Special Housing Adaptation (SHA) grant — up to $22,036, and (3) Home Improvements and Structural Alterations (HISA) grant — up to $6,800 for service-connected conditions or $2,000 for non-service-connected conditions. Apply through your VA regional office.' },
      { question: 'Do Medicaid programs pay for home modifications?', answer: 'Many states have Home and Community-Based Services (HCBS) Medicaid waiver programs that fund home modifications to prevent nursing home placement. Common covered modifications include grab bars, ramps, stairlifts, and widened doorways. Eligibility requires Medicaid enrollment and functional need. Contact your local Area Agency on Aging to apply.' },
      { question: 'What is the Area Agency on Aging?', answer: 'The Area Agency on Aging (AAA) is a federally funded local agency that coordinates services for older adults. Many AAAs operate home modification programs — some provide free modifications for income-qualified seniors, others connect homeowners with discounted contractors. Find your local AAA at eldercare.acl.gov or call 800-677-1116.' },
      { question: 'Are home modification grants taxable income?', answer: 'Generally, home modification grants from government programs are not taxable income. However, if the modification increases your home\'s value, a portion of a grant might theoretically be taxable — but in practice, ramps, grab bars, and stairlifts typically do not increase appraised home value. Consult a tax professional for your specific situation.' },
      { question: 'What nonprofits provide free home modifications?', answer: 'Rebuilding Together (rebuildingtogether.org) is the largest national nonprofit providing free home repairs and modifications for low-income homeowners. Habitat for Humanity Home Repair programs exist in many communities. Many local Community Action Agencies also have home modification programs. Search "[your city] free home modification program" or contact your local AAA.' },
    ],
    costBreakdown: [
      { item: 'USDA Section 504 grant (max)', low: 0, high: 10000 },
      { item: 'VA HISA grant (service-connected)', low: 0, high: 6800 },
      { item: 'VA SAH grant (max)', low: 0, high: 109986 },
      { item: 'Medicaid HCBS waiver (varies by state)', low: 0, high: 20000 },
      { item: 'Rebuilding Together (income-qualified)', low: 0, high: 5000 },
    ],
  },
  'stairlift-vs-home-elevator': {
    title: 'Stairlift vs. Home Elevator: Which Is Right for You? (2026 Guide)',
    description: 'Stairlift or home elevator? Compare costs, installation requirements, and who each option is best suited for. Expert guidance to help you decide.',
    category: 'stairlifts',
    compareSlug: 'best-stairlifts',
    intro: 'Stairlifts and home elevators both solve the same core problem — moving safely between floors — but they do it differently and at very different price points. A stairlift ($2,000–$5,000 installed) travels along the staircase. A home elevator ($8,000–$35,000+) travels vertically in its own space. This guide explains when each solution is the right choice.',
    faqs: [
      { question: 'When is a stairlift better than an elevator?', answer: 'A stairlift is usually the better choice when: the user can walk but struggles with stairs, cost is a primary concern, the staircase is straight (much cheaper), and the user does not use a wheelchair. Stairlifts can be installed in most homes in a single day without construction.' },
      { question: 'When is a home elevator better than a stairlift?', answer: 'A home elevator is better when: the user is a full-time wheelchair user (most stairlifts require the user to transfer from the chair), the family needs to transport large items between floors regularly, the home has 3+ floors to connect, or aesthetics and long-term home value are priorities.' },
      { question: 'Can a stairlift accommodate a wheelchair user?', answer: 'Most standard stairlifts require the user to transfer from the wheelchair to the lift seat, travel to the other floor, and transfer back. This is not feasible for users who cannot independently transfer. For wheelchair users, a vertical platform lift or residential elevator is the appropriate solution.' },
      { question: 'What is the installation difference between a stairlift and an elevator?', answer: 'A straight stairlift installs in 2–4 hours with no construction — the rail attaches directly to the stair treads. A residential elevator requires either an existing shaft or construction of one. Pneumatic (vacuum) elevators are the exception: they\'re freestanding and require only a ceiling cutout, installing in 1–2 days.' },
      { question: 'Which option is better for home resale value?', answer: 'Neither stairlifts nor elevators typically increase appraised home value significantly, though both can make a home more attractive to buyers who need them. Stairlifts are easily removed if a future buyer doesn\'t want one. Elevators are permanent modifications — consult a real estate professional if resale value is a key concern.' },
    ],
    costBreakdown: [
      { item: 'Straight stairlift (installed)', low: 2000, high: 5000 },
      { item: 'Curved stairlift (installed)', low: 8000, high: 15000 },
      { item: 'Vertical platform lift (installed)', low: 3000, high: 8000 },
      { item: 'Pneumatic elevator (no shaft)', low: 18000, high: 35000 },
      { item: 'Traditional hydraulic elevator', low: 20000, high: 40000 },
    ],
  },
  'bathroom-safety-modifications-for-seniors': {
    title: 'Bathroom Safety Modifications for Seniors: Complete Guide (2026)',
    description: 'The most important bathroom safety modifications for seniors — grab bars, walk-in tubs, shower seats, non-slip surfaces, and costs. Written with occupational therapists.',
    category: 'grab-bars',
    compareSlug: 'best-grab-bars',
    intro: 'The bathroom is the most dangerous room in the home for seniors: 80% of senior falls happen there. A properly modified bathroom can prevent most of these injuries at a cost of $300–$3,000 — far less than a single emergency room visit. This guide covers every modification, in priority order.',
    faqs: [
      { question: 'What are the most important bathroom safety modifications?', answer: 'In priority order by fall risk reduction: (1) grab bars near the toilet and in the shower, (2) a non-slip mat inside and outside the shower, (3) a shower bench or chair, (4) a raised toilet seat or comfort-height toilet, (5) improved lighting. These five changes address the vast majority of bathroom fall risks.' },
      { question: 'Where should grab bars be installed in a bathroom?', answer: 'ADA guidelines recommend: in the shower, a horizontal bar at 33–36 inches high on the back wall and an angled/vertical bar near the entry point; next to the toilet, a 42-inch grab bar on the side wall at 33–36 inches high. A hinged swing-up bar is useful when space is limited beside the toilet.' },
      { question: 'Can I install grab bars myself?', answer: 'You can install grab bars yourself if they are anchored into wall studs. Stud-mounted grab bars can support 500+ lbs. Never anchor grab bars in drywall alone — toggle bolt anchors rated for 250+ lbs are acceptable where studs are unavailable, but professional installation is recommended for maximum safety.' },
      { question: 'Is a walk-in shower safer than a tub for seniors?', answer: 'Yes, in general. A curbless (zero-threshold) walk-in shower eliminates the step-over required by a tub, reducing fall risk significantly. If a tub is preferred for soaking, a walk-in tub eliminates the climb-over. A tub transfer bench allows safe entry into a standard tub.' },
      { question: 'What is the cost of a full bathroom safety modification?', answer: 'A basic package (4–6 grab bars + non-slip mat + shower chair) costs $300–$900 installed. A more comprehensive renovation (roll-in shower conversion, comfort-height toilet, barrier-free design) costs $3,000–$12,000. A walk-in tub installation runs $3,500–$10,000.' },
      { question: 'Does insurance cover bathroom modifications?', answer: 'Some Medicare Advantage plans cover bathroom modifications through "home safety" supplemental benefits. Medicaid HCBS waivers fund modifications in many states. The VA HISA grant (up to $6,800) covers bathroom modifications for veterans. Grab bars installed on a physician\'s recommendation may count as a tax-deductible medical expense.' },
    ],
    costBreakdown: [
      { item: 'Grab bars (4–6, professionally installed)', low: 300, high: 900 },
      { item: 'Non-slip mat + tub strips', low: 25, high: 80 },
      { item: 'Shower bench or chair', low: 50, high: 300 },
      { item: 'Raised toilet seat or safety rail', low: 30, high: 150 },
      { item: 'Walk-in tub (installed)', low: 3500, high: 10000 },
      { item: 'Roll-in shower conversion', low: 2000, high: 8000 },
    ],
  },
  'how-to-choose-a-stairlift': {
    title: 'How to Choose a Stairlift: Complete Buyer\'s Guide (2026)',
    description: 'Everything you need to know before buying a stairlift: straight vs. curved, weight limits, key features, top brands compared, and how to get quotes.',
    category: 'stairlifts',
    compareSlug: 'best-stairlifts',
    intro: 'Choosing the right stairlift comes down to four factors: the shape of your staircase (straight vs. curved), the user\'s weight and mobility, the features that matter most (folding rail, remote, swivel seat), and your budget. This guide walks through every decision so you can buy with confidence.',
    faqs: [
      { question: 'What is the difference between a straight and curved stairlift?', answer: 'A straight stairlift uses a standard rail that fits most straight staircases and costs $2,000–$5,000 installed. A curved stairlift requires a custom-bent rail built specifically for your staircase — costs run $8,000–$15,000 or more. If your staircase has any turns, landings, or spiral sections, you need a curved model. Get at least two quotes for curved stairlifts.' },
      { question: 'What weight limit should I look for in a stairlift?', answer: 'Standard stairlifts accommodate 250–300 lbs. If the user weighs 300+ lbs, look specifically for "heavy-duty" or "bariatric" models — brands like Bruno and Harmar offer options rated to 400–500 lbs. Always check the weight capacity before purchasing; using an undersized model is a serious safety risk.' },
      { question: 'What features are worth paying for on a stairlift?', answer: 'Key features to prioritize: (1) a swivel seat that rotates to face away from the stairs at the top — makes dismounting much safer; (2) a fold-flat rail that allows others to use the stairs; (3) battery backup so it works during power outages; (4) remote controls (one for each floor). Heated seats, retractable seatbelts, and luggage carriers are nice extras.' },
      { question: 'How do I measure my staircase for a stairlift?', answer: 'For a straight stairlift quote, you need: total stair height (floor to floor), staircase width, and whether there are any obstructions (radiators, doors that open onto the stairs, very narrow widths under 28 inches). Most manufacturers offer free in-home assessments — schedule 2–3 to compare quotes and make sure the salesperson measures correctly.' },
      { question: 'Should I buy new or refurbished?', answer: 'Refurbished stairlifts from reputable dealers can save 30–50% and still come with warranties. The risk: a used curved rail is rarely reusable (it was built for a different staircase), so refurbished only makes sense for straight rails. Ask about the manufacturer of the refurbished unit, age of the chair, and warranty terms before buying.' },
      { question: 'What brands are most reliable?', answer: 'Bruno, Stannah, and Harmar are consistently rated highest for reliability and after-sales service. AmeriGlide and Acorn offer lower prices but with more variable service experiences. Bruno and Stannah have the most extensive dealer networks for service and maintenance. Check that dealers have local technicians — not just a 1-800 number.' },
    ],
    costBreakdown: [
      { item: 'Straight stairlift (new, installed)', low: 2000, high: 5000 },
      { item: 'Curved stairlift (new, installed)', low: 8000, high: 15000 },
      { item: 'Refurbished straight stairlift', low: 1200, high: 2800 },
      { item: 'Outdoor stairlift (new)', low: 3500, high: 7000 },
      { item: 'Annual service contract', low: 150, high: 400 },
    ],
  },
  'aging-in-place-tax-deductions': {
    title: 'Aging-in-Place Tax Deductions: What Qualifies in 2026',
    description: 'Which aging-in-place home modifications are tax deductible? Medical expense deductions, capital improvements, and how to document your claim correctly.',
    category: 'grab-bars',
    intro: 'Home modifications for aging in place can qualify as tax-deductible medical expenses under IRS rules — but only under specific conditions. This guide explains what qualifies, how to calculate your deduction, and what documentation to keep.',
    faqs: [
      { question: 'Are home modifications tax deductible?', answer: 'Home modifications may be deductible as medical expenses if: (1) they are prescribed or recommended by a physician for a diagnosed condition, (2) they do not increase your home\'s fair market value, and (3) your total medical expenses exceed 7.5% of your adjusted gross income (the threshold for itemizing). Modifications that add home value — like building a new bathroom — are only partially deductible.' },
      { question: 'What home modifications typically qualify?', answer: 'Modifications that generally do not increase home value (and thus are fully deductible if other criteria are met): grab bars and handrails, stairlifts and wheelchair ramps, widened doorways, entrance ramps, lowered countertops for wheelchair access, and pool lifts for therapy. Modifications that increase home value (only partially deductible): adding a new bathroom, elevator installation, swimming pool additions.' },
      { question: 'How do I calculate the deductible amount?', answer: 'For modifications that increase home value: deductible amount = cost of modification minus the increase in home value. Get an appraisal before and after if the modification could increase home value. For modifications that don\'t increase value (most grab bars, ramps, stairlifts): the full cost is deductible as a medical expense, subject to the 7.5% AGI threshold.' },
      { question: 'Do I need a doctor\'s prescription?', answer: 'A formal prescription is not required by IRS rules, but having a written recommendation from a physician or occupational therapist strengthens your documentation significantly. If the IRS questions the deduction, a doctor\'s letter explaining the medical necessity is the strongest evidence you can provide.' },
      { question: 'What records should I keep?', answer: 'Keep: receipts and invoices for all modifications, a written statement from your doctor or OT recommending the modification, photos of the modification before and after, any home appraisals if applicable. Store these records for at least 3 years after filing the return they relate to.' },
      { question: 'Can I deduct modifications made for a family member?', answer: 'Yes. Medical expense deductions can include expenses paid for yourself, your spouse, and your dependents. If a parent qualifies as your dependent under IRS rules, modifications made to their home (or a portion of your home they live in) may also qualify.' },
    ],
    costBreakdown: [
      { item: 'Grab bars (fully deductible if prescribed)', low: 300, high: 900 },
      { item: 'Stairlift (typically fully deductible)', low: 2000, high: 5000 },
      { item: 'Wheelchair ramp (fully deductible)', low: 500, high: 3500 },
      { item: 'Walk-in tub (typically fully deductible)', low: 3500, high: 10000 },
      { item: 'Home elevator (partially deductible)', low: 5000, high: 25000 },
    ],
  },
  'best-medical-alert-for-seniors-living-alone': {
    title: 'Best Medical Alert Systems for Seniors Living Alone (2026)',
    description: 'Choosing a medical alert system for a senior who lives alone: what features matter most, fall detection accuracy, GPS range, and which systems have the fastest response times.',
    category: 'medical-alerts',
    compareSlug: 'best-medical-alerts',
    intro: 'For seniors living alone, a medical alert system is one of the most important safety investments available — it closes the gap between a fall happening and help arriving. But not all systems are equal. This guide focuses on what matters most for solo-living seniors: response time, fall detection reliability, battery life, and ease of use.',
    faqs: [
      { question: 'What is the most important feature for a senior living alone?', answer: 'Fall detection is the single most important feature for seniors living alone. It automatically calls for help if a fall is detected — even if the person is unconscious or cannot press the button. Not all fall detection is equal: Medical Guardian and Bay Alarm Medical both use clinical-grade algorithms with accuracy rates above 80%. Test the system regularly to make sure it is working.' },
      { question: 'What response time should I expect?', answer: 'Top-rated medical alert providers connect to a live operator within 30–45 seconds. When comparing providers, ask for their average response time and whether operators are US-based. Some budget providers route to overseas call centers with longer response times — this matters enormously in a real emergency.' },
      { question: 'Should I choose a home system or a GPS mobile system?', answer: 'For seniors living alone who leave the house regularly (driving, shopping, visiting family), a GPS-enabled mobile system is strongly recommended. For seniors who primarily stay home, a home base station with a waterproof pendant is more reliable and less expensive. Consider: if a fall happened in the backyard, parking lot, or at a friend\'s house, how would they get help?' },
      { question: 'How long does the battery last on medical alert pendants?', answer: 'Home-only pendants with a base station typically have batteries lasting 2–5 years (the base station plugs in; only the pendant uses a battery). GPS mobile systems require daily or every-other-day charging — the same as a smartphone. Build charging into the daily routine (e.g., charge every night) to ensure the device is always ready.' },
      { question: 'Are there medical alert systems for people with dementia?', answer: 'GPS-enabled systems are especially important for those with cognitive decline, as they allow family members to locate their loved one via an app. Look for systems with two-way communication (the device can call family members, not just the monitoring center) and geofencing alerts that notify you if your loved one leaves a defined area.' },
      { question: 'What is the typical contract and cancellation policy?', answer: 'Most top providers (Medical Guardian, Bay Alarm, Philips Lifeline) are month-to-month. Read the fine print: some require 30–60 days notice to cancel and charge for unused periods. Avoid any provider requiring a 12+ month commitment upfront. Ask about equipment return policies when you cancel.' },
    ],
    costBreakdown: [
      { item: 'Home system (monthly)', low: 20, high: 35 },
      { item: 'GPS mobile system (monthly)', low: 35, high: 55 },
      { item: 'Fall detection add-on (monthly)', low: 5, high: 10 },
      { item: 'Equipment fee (one-time, some providers)', low: 0, high: 200 },
      { item: 'Annual cost estimate (home + fall detection)', low: 300, high: 540 },
    ],
  },
  'walk-in-shower-conversion-cost': {
    title: 'Walk-In Shower Conversion Cost: Tub to Shower (2026)',
    description: 'How much does it cost to convert a bathtub to a walk-in shower? Costs, timeline, and whether you need a CAPS contractor.',
    category: 'bath-safety',
    intro: 'Converting a standard bathtub to a walk-in or roll-in shower eliminates the step-over that causes most bathroom falls. Costs range from $1,500 for a basic tub-to-shower conversion to $8,000+ for a fully custom zero-threshold (roll-in) shower. Here\'s what determines the price and whether it\'s the right choice vs. a walk-in tub.',
    faqs: [
      { question: 'What is the difference between a walk-in shower and a roll-in shower?', answer: 'A walk-in shower typically has a small curb or low threshold (1–2 inches). A roll-in shower is completely curbless (zero threshold) — a wheelchair can roll directly in. Roll-in showers are required under ADA guidelines for accessible bathrooms. For aging in place, a zero-threshold shower is the safest option.' },
      { question: 'How much does a tub-to-shower conversion cost?', answer: 'A basic conversion with a prefabricated shower unit costs $1,500–$3,000. A custom-tiled walk-in shower with glass doors costs $4,000–$8,000. A fully custom ADA-compliant roll-in shower with built-in bench and grab bars costs $6,000–$15,000. Plumbing relocation (if needed) adds $500–$2,000.' },
      { question: 'Is a walk-in shower safer than a walk-in tub for seniors?', answer: 'For most seniors, a zero-threshold walk-in shower is safer than a walk-in tub because there is nothing to step over or sit inside while waiting to drain. Walk-in tubs require sitting inside during fill and drain. The safest bathroom configuration for seniors is a roll-in shower with a fold-down bench and grab bars.' },
      { question: 'How long does a tub-to-shower conversion take?', answer: 'A basic conversion using a prefab shower unit takes 1–2 days. A custom-tiled walk-in shower typically takes 3–5 days. A complete bathroom remodel with a roll-in shower may take 1–2 weeks. Most work requires no permit, but adding a new wall or moving plumbing may require one.' },
      { question: 'Can the conversion be done in a small bathroom?', answer: 'Yes. Standard bathtub space (60 x 30 inches) can be converted to a walk-in shower of the same footprint. For a zero-threshold (roll-in) shower with turning radius for a wheelchair, ADA recommends at least 60 x 30 inches of shower space plus a 60-inch turning radius in the bathroom — which requires more space.' },
    ],
    costBreakdown: [
      { item: 'Prefab tub-to-shower conversion kit', low: 1000, high: 2500 },
      { item: 'Custom-tiled walk-in shower (basic)', low: 3000, high: 7000 },
      { item: 'Zero-threshold roll-in shower (full)', low: 6000, high: 15000 },
      { item: 'Built-in bench + grab bars (installed)', low: 500, high: 1500 },
      { item: 'Plumbing relocation (if needed)', low: 500, high: 2000 },
    ],
  },
  'stairlift-for-narrow-stairs': {
    title: 'Stairlift for Narrow Stairs: What You Need to Know (2026)',
    description: 'Can you install a stairlift on narrow stairs? Minimum clearance requirements, which brands fit best, and alternatives for very narrow staircases.',
    category: 'stairlifts',
    compareSlug: 'best-stairlifts',
    intro: 'Most stairlifts require a minimum staircase width of 28–30 inches to install safely. Narrow Victorian staircases, older homes, and townhouses sometimes have staircases as narrow as 24–26 inches. This guide covers your options when your stairs are at or below the typical minimum.',
    faqs: [
      { question: 'What is the minimum staircase width for a stairlift?', answer: 'Most standard stairlift models require 28–30 inches of clear width. The Bruno Elan (28 inches minimum), Acorn 130 (25 inches minimum), and Harmar Pinnacle (28 inches minimum) are among the models with narrower clearance requirements. Some specialty narrow-stair models, including the Stannah 260, can fit in 25-inch staircases.' },
      { question: 'What happens if my stairs are only 24 inches wide?', answer: 'Below 25 inches, standard stairlifts generally cannot be installed. At this width, your options are: (1) a specialty slim-rail stairlift (available from some European brands), (2) widening the staircase (possible in some configurations but typically expensive), or (3) a vertical platform lift if there is space for a shaft elsewhere in the home.' },
      { question: 'Does the rail take up much space on the stairs?', answer: 'The rail typically protrudes 10–15 inches from the wall. When the stairlift is folded up and parked, the seat and arms fold away, leaving approximately 20–24 inches of clearance for other household members to use the stairs. Many installers recommend maintaining 27–28 inches of clear usable stair width after installation.' },
      { question: 'Can I get a narrower rail for a narrow staircase?', answer: 'Yes. Many manufacturers offer slim-rail or narrow-track options specifically for constrained staircases. The rail profile on these models is typically 3–4 inches wide versus 5–6 inches for standard models. Request a slim-rail quote specifically when your staircase is between 25 and 30 inches wide.' },
      { question: 'What should I do if I\'m not sure if my stairs are wide enough?', answer: 'Request an in-home assessment from 2–3 stairlift dealers. Dealers have experience with borderline-width staircases and can measure the actual usable width (accounting for any obstructions like newel posts, doors that open onto the staircase, or radiators). Never pay a deposit before an in-home measurement confirms the installation is feasible.' },
    ],
    costBreakdown: [
      { item: 'Standard straight stairlift (28+ inch stairs)', low: 2000, high: 5000 },
      { item: 'Slim-rail narrow stair stairlift', low: 2800, high: 6000 },
      { item: 'Staircase widening (if feasible)', low: 3000, high: 10000 },
      { item: 'Vertical platform lift alternative', low: 3500, high: 8500 },
    ],
  },
  'outdoor-stairlift-cost': {
    title: 'Outdoor Stairlift Cost: What to Expect in 2026',
    description: 'How much does an outdoor stairlift cost? Prices, weatherproofing requirements, installation differences vs. indoor stairlifts, and best brands.',
    category: 'stairlifts',
    compareSlug: 'best-stairlifts',
    intro: 'Outdoor stairlifts are designed specifically for exterior steps — front porch, deck access, or entry stairs. They require weather-resistant construction and specific maintenance that indoor models don\'t need. Expect to pay a 20–40% premium over comparable indoor models. Here\'s everything you need to know.',
    faqs: [
      { question: 'How much does an outdoor stairlift cost?', answer: 'Outdoor straight stairlifts typically cost $3,000–$7,000 installed, compared to $2,000–$5,000 for indoor straight models. The premium reflects weatherproof construction, rust-resistant materials, weather covers, and more robust motor sealing. Outdoor curved stairlifts start at $10,000.' },
      { question: 'What makes an outdoor stairlift different from an indoor one?', answer: 'Outdoor stairlifts have: (1) weatherproof covers for the seat and controls when not in use, (2) marine-grade or powder-coated aluminum to prevent rust, (3) sealed motor and drive mechanisms, (4) non-slip seat surfaces, and (5) UV-resistant materials. Standard indoor stairlifts cannot withstand rain, humidity, and temperature extremes.' },
      { question: 'Can I cover an indoor stairlift for outdoor use?', answer: 'No. Indoor stairlifts are not weatherproof and will fail rapidly when exposed to outdoor conditions. The electrical components, motor, and upholstery are not designed for moisture exposure. Always specify an outdoor-rated model for any exterior installation.' },
      { question: 'Which brands make the best outdoor stairlifts?', answer: 'Bruno (CRE-2110 model), Harmar, and Stannah make outdoor-rated models with strong reliability records. The Bruno CRE-2110 has a 400 lb outdoor capacity and covers most US climate zones. Stannah\'s 260 outdoor version includes a weather cover and is popular in humid climates.' },
      { question: 'Do outdoor stairlifts need extra maintenance?', answer: 'Yes. Outdoor stairlifts should be lubricated more frequently than indoor models (typically every 6–12 months vs. annually). The weather cover should be checked seasonally. In snowy climates, the track should be kept clear of ice and debris. Annual service by a certified technician is recommended.' },
    ],
    costBreakdown: [
      { item: 'Outdoor straight stairlift (installed)', low: 3000, high: 7000 },
      { item: 'Outdoor curved stairlift (installed)', low: 10000, high: 18000 },
      { item: 'Annual maintenance (outdoor)', low: 200, high: 500 },
      { item: 'vs. indoor straight stairlift', low: 2000, high: 5000 },
    ],
  },
  'bruno-vs-acorn-stairlift': {
    title: 'Bruno vs. Acorn Stairlift: Full Comparison (2026)',
    description: 'Bruno vs Acorn stairlift — side-by-side comparison of price, reliability, warranty, weight capacity, and service network. Which brand is right for you?',
    category: 'stairlifts',
    compareSlug: 'best-stairlifts',
    intro: 'Bruno and Acorn are two of the most popular stairlift brands in North America. Bruno is American-made with a strong dealer service network. Acorn is a UK brand with aggressive marketing and competitive pricing. This guide compares them head-to-head on every factor that matters for a safe, long-term installation.',
    faqs: [
      { question: 'Which is better: Bruno or Acorn?', answer: 'Both are legitimate brands, but they serve different priorities. Bruno (Bruno Independent Living Aids) is American-made with a strong local dealer/service network — better for long-term support and heavy-duty needs. Acorn tends to price more competitively and is widely available, but service is more variable. For most buyers, Bruno\'s warranty and service network edge out Acorn slightly, especially for heavy-duty weight requirements.' },
      { question: 'How do Bruno and Acorn prices compare?', answer: 'Bruno straight stairlifts typically run $2,800–$4,500 installed. Acorn straight stairlifts run $2,500–$4,000 installed. Both offer curved models at $8,000–$15,000. Acorn sometimes runs promotional pricing that brings the initial price lower — always compare the full-life cost including service contracts.' },
      { question: 'Which brand has better customer service?', answer: 'Bruno sells and services through local authorized dealers — service response times are typically faster because the dealer has local stock and technicians. Acorn primarily uses a centralized service model. Bruno gets higher marks in Consumer Affairs reviews for service response time.' },
      { question: 'What is the weight limit for Bruno vs. Acorn?', answer: 'Bruno\'s standard Elan model supports 300 lbs; the heavy-duty Electra-Ride Elite supports 400 lbs. Acorn\'s standard 130 model supports 265 lbs; the Acorn Superglide handles 285 lbs. For users above 265 lbs, Bruno\'s heavier-duty options are the safer choice.' },
      { question: 'Which has a better warranty?', answer: 'Bruno offers a limited lifetime warranty on the drive system plus a 2-year parts warranty. Acorn typically offers a 1-year parts warranty with extended options available at additional cost. Bruno\'s lifetime drive warranty is a meaningful differentiator for long-term reliability.' },
      { question: 'Are there other brands to consider besides Bruno and Acorn?', answer: 'Yes. Stannah (UK brand, known for quality), Harmar (US-made, competitive pricing), and Handicare (now merged with Prism Medical) are all worth considering. For curved stairlifts specifically, Stannah and Handicare have strong track records. Get at least 2–3 quotes from different brands before deciding.' },
    ],
    costBreakdown: [
      { item: 'Bruno Elan straight (installed)', low: 2800, high: 4500 },
      { item: 'Acorn 130 straight (installed)', low: 2500, high: 4000 },
      { item: 'Bruno Electra-Ride Elite (heavy-duty)', low: 4000, high: 6000 },
      { item: 'Bruno curved stairlift', low: 9000, high: 15000 },
      { item: 'Acorn Curved stairlift', low: 8000, high: 14000 },
    ],
  },
  'stairlift-rental-vs-buy': {
    title: 'Stairlift Rental vs. Buy: Which Is Right for Your Situation? (2026)',
    description: 'Should you rent or buy a stairlift? Cost comparison, when renting makes sense, and what to watch out for in rental agreements.',
    category: 'stairlifts',
    compareSlug: 'best-stairlifts',
    intro: 'Stairlift rental is an option for short-term needs — post-surgery recovery, temporary mobility limitations, or situations where you\'re not sure if a permanent installation is right. Rentals typically cost $150–$400/month. Here\'s when rental makes sense and when buying is the smarter long-term choice.',
    faqs: [
      { question: 'How much does it cost to rent a stairlift?', answer: 'Straight stairlift rentals typically cost $150–$400 per month, often including installation and removal. Some providers charge a one-time installation fee ($200–$400) on top of monthly rental. Most rental agreements are monthly or quarterly with no long-term commitment required.' },
      { question: 'When does renting make more financial sense than buying?', answer: 'Rental makes sense if you need a stairlift for under 6–12 months (post-surgery recovery, short-term rehab). Beyond 12 months, buying almost always costs less. At $300/month rental vs. $3,500 to buy, you break even in about 12 months. For any long-term need, buy.' },
      { question: 'Can you rent a curved stairlift?', answer: 'Curved stairlift rental is rare because curved rails are custom-made for a specific staircase and cannot easily be reused. Most stairlift rental programs are limited to straight stairlifts. If you have a curved staircase and need a temporary solution, a portable vertical platform lift may be a better option.' },
      { question: 'What should I watch out for in a stairlift rental agreement?', answer: 'Key things to check: (1) Is removal included when you\'re done, or does it cost extra? (2) What happens if the lift needs service — who pays? (3) Is there a damage liability clause? (4) What is the minimum rental period? (5) Can you convert a rental to a purchase? Some rental programs apply your rental payments toward a purchase — this is a good deal.' },
      { question: 'Are refurbished stairlifts a better option than renting?', answer: 'For needs over 6 months, yes. A refurbished straight stairlift costs $1,500–$2,500 installed — often cheaper than 12 months of rental. Refurbished models come from replenished rental fleets and previously-used units, typically with a 1-year warranty. Ask your dealer specifically about refurbished options.' },
    ],
    costBreakdown: [
      { item: 'Rental (per month, straight stairlift)', low: 150, high: 400 },
      { item: 'Rental (12-month total)', low: 1800, high: 4800 },
      { item: 'Refurbished stairlift (installed)', low: 1500, high: 2500 },
      { item: 'New stairlift (installed)', low: 2000, high: 5000 },
      { item: 'Break-even point (rent vs. new buy)', low: 8, high: 14 },
    ],
  },
  'senior-bathroom-remodel-cost': {
    title: 'Senior Bathroom Remodel Cost: Accessible Bathroom Guide (2026)',
    description: 'How much does an accessible senior bathroom remodel cost? From $500 for grab bars to $15,000+ for a full roll-in shower conversion. Every option explained.',
    category: 'bath-safety',
    intro: 'A senior-focused bathroom remodel can cost as little as $500 for grab bars and a new showerhead, or as much as $20,000 for a complete accessible bathroom conversion with a roll-in shower, comfort-height toilet, and widened doorway. This guide breaks down costs by scope — from quick wins to full remodels — and helps you prioritize based on your specific needs.',
    faqs: [
      { question: 'What is the most important bathroom modification for fall prevention?', answer: 'Grab bars. The CDC reports that over 235,000 Americans visit emergency rooms annually due to bathroom fall injuries, and most happen in the shower or when using the toilet. A professionally installed grab bar package ($400–$900 total) is the single highest-ROI modification you can make for fall prevention.' },
      { question: 'How much does a full accessible bathroom remodel cost?', answer: 'A comprehensive accessible bathroom remodel costs $5,000–$20,000. The range depends heavily on whether you\'re replacing the tub with a roll-in shower ($3,000–$15,000), widening doorways ($700–$2,500), or doing a complete reconfiguration. Grab bars, new fixtures, and flooring can be done for $1,500–$4,000.' },
      { question: 'What are the most impactful accessible bathroom features?', answer: 'In order of impact: (1) Grab bars in shower and near toilet, (2) Handheld showerhead, (3) Non-slip flooring, (4) Walk-in or roll-in shower (eliminates step-over), (5) Comfort-height toilet (17–19 inches), (6) Wider doorway for walker or wheelchair access (32–36 inches clear).' },
      { question: 'Does Medicare cover accessible bathroom remodeling?', answer: 'Standard Medicare does not cover bathroom modifications. Some Medicare Advantage plans include home safety benefits (up to $500–$2,500/year). Medicaid HCBS waivers fund bathroom modifications for qualifying seniors in most states. VA HISA grants (up to $6,800) cover accessible bathroom modifications for veterans. Contact your Area Agency on Aging to explore local programs.' },
      { question: 'What is a comfort-height toilet and why does it matter?', answer: 'A comfort-height (or ADA-height) toilet has a seat 17–19 inches from the floor — approximately the same height as a chair. Standard toilets are 14–16 inches, which requires significant knee flexion to sit and stand. For seniors with arthritis, hip replacements, or weak legs, comfort-height toilets dramatically reduce fall risk and effort when using the bathroom.' },
      { question: 'Is a walk-in shower better than a walk-in tub for seniors?', answer: 'For most seniors, a zero-threshold walk-in shower is safer than a walk-in tub. Walk-in tubs require sitting inside while the tub fills and drains (increasing fall risk from sitting in a cooling tub). A roll-in shower with a fold-down bench and grab bars eliminates all step-overs and allows safe seated bathing. Walk-in tubs are better for users who specifically want soaking or hydrotherapy benefits.' },
    ],
    costBreakdown: [
      { item: 'Grab bars + handheld showerhead (installed)', low: 400, high: 900 },
      { item: 'Non-slip flooring (bathroom)', low: 300, high: 1200 },
      { item: 'Comfort-height toilet replacement', low: 200, high: 600 },
      { item: 'Tub-to-walk-in shower conversion', low: 1500, high: 8000 },
      { item: 'Full accessible bathroom remodel', low: 5000, high: 20000 },
    ],
  },
  'aging-in-place-vs-assisted-living-cost': {
    title: 'Aging in Place vs. Assisted Living: Full Cost Comparison (2026)',
    description: 'How much does aging in place cost compared to assisted living? Home modifications, in-home care, and senior living costs compared side by side.',
    category: 'grab-bars',
    intro: 'Assisted living costs $4,500–$7,000 per month nationally. Aging in place — with home modifications and some in-home care — often costs significantly less, especially in the early years. This guide compares the full costs of each option and helps families make a financially informed decision.',
    faqs: [
      { question: 'Is aging in place cheaper than assisted living?', answer: 'For most seniors in the early stages of care needs, aging in place is significantly less expensive than assisted living. The national median assisted living cost is $4,500/month ($54,000/year). Basic aging-in-place modifications ($2,000–$10,000 one-time) plus part-time in-home aide costs ($15–$25/hour) can run $15,000–$25,000/year for moderate care needs — roughly half the cost of assisted living.' },
      { question: 'What does assisted living cost in 2026?', answer: 'National median assisted living costs: $4,500/month ($54,000/year) for a studio unit with basic services. Memory care units run $5,500–$8,000/month. Prices vary significantly by region — urban markets like California and New York often run $7,000–$9,000+/month. Costs generally increase 3–5% annually.' },
      { question: 'What are the full costs of aging in place?', answer: 'Aging-in-place costs have three components: (1) One-time home modifications ($2,000–$30,000 depending on scope), (2) Ongoing in-home care ($20–$35/hour; varies from 0 to 40+ hours/week), and (3) Medical alert or monitoring ($25–$55/month). A senior with moderate care needs (10 hours/week of aide) might spend $25,000–$35,000/year — far less than assisted living.' },
      { question: 'At what point does assisted living become more cost-effective?', answer: 'When in-home care needs exceed 30–40 hours per week (around $60,000–$80,000/year), assisted living often becomes cost-competitive or even less expensive — especially if it includes meals, transportation, and activities. The break-even point varies by region and care level. A geriatric care manager can help families evaluate when the transition makes sense.' },
      { question: 'How do I fund aging-in-place modifications?', answer: 'Options include: (1) Out-of-pocket (most common), (2) USDA Section 504 grants (up to $10,000 for rural homeowners), (3) VA SAH/SHA grants for veterans, (4) Medicaid HCBS waiver programs, (5) Reverse mortgage proceeds, (6) Home equity loan/HELOC. See our complete grants guide for details on each program.' },
      { question: 'What is a geriatric care manager?', answer: 'A geriatric care manager (GCM) is a licensed professional (typically a social worker or nurse) who assesses an older adult\'s needs and coordinates care services. They can evaluate whether aging in place or a care facility is appropriate, identify available benefits and grants, and build a care plan. Most charge $150–$250 per hour; an initial assessment runs $300–$500 and can save thousands in misallocated spending.' },
    ],
    costBreakdown: [
      { item: 'Assisted living (national median/month)', low: 4000, high: 7000 },
      { item: 'Assisted living (annual total)', low: 48000, high: 84000 },
      { item: 'Home modifications (one-time)', low: 2000, high: 15000 },
      { item: 'In-home aide (10 hrs/week, annual)', low: 15000, high: 25000 },
      { item: 'Total aging-in-place (yr 1, moderate needs)', low: 20000, high: 35000 },
    ],
  },
  'american-standard-vs-safe-step-walk-in-tub': {
    title: 'American Standard vs. Safe Step Walk-In Tub: Comparison (2026)',
    description: 'American Standard vs. Safe Step walk-in tubs compared side by side: price, drain speed, warranty, features, and customer service. Which is right for you?',
    category: 'walk-in-tubs',
    compareSlug: 'best-walk-in-tubs',
    intro: 'American Standard and Safe Step are the two most-marketed walk-in tub brands in North America. Both run TV commercials targeting seniors, and both use aggressive sales tactics. This guide cuts through the marketing to give you an honest, side-by-side comparison of price, drain technology, warranty, and what real customers report after purchase.',
    faqs: [
      { question: 'Which is more expensive: American Standard or Safe Step?', answer: 'Both brands are in the premium segment. American Standard walk-in tubs typically run $4,000–$8,000 for the unit plus $1,000–$2,000 installation. Safe Step tubs are comparable in price. Both brands are known for high-pressure in-home sales tactics — always get at least 2 competing quotes before signing.' },
      { question: 'Which brand has better drain speed?', answer: 'Safe Step markets its "Fast Drain" system as draining in 2 minutes or less. American Standard\'s standard drain is 3–5 minutes with an optional fast-drain upgrade. Drain speed matters because you must stay inside the tub during draining — verify the specific model\'s drain time before purchasing.' },
      { question: 'Do American Standard or Safe Step tubs have lifetime warranties?', answer: 'Both brands advertise "lifetime" warranties, but the fine print matters. American Standard\'s lifetime warranty covers the door seal and structural components. Safe Step covers the tub shell. Both have shorter warranty periods (1–5 years) for mechanical components like jets, heaters, and motors. Read the full warranty document before purchase.' },
      { question: 'What do real customers say about each brand?', answer: 'Both brands have mixed reviews. Common complaints: high-pressure sales tactics, variable installation quality by contractor, difficulty reaching customer service. Common praise: improved daily independence, reduced fall risk, hydrotherapy benefits for arthritis. Neither brand has a clearly dominant satisfaction rating — local installation quality may matter more than the brand itself.' },
      { question: 'Are there better alternatives to American Standard and Safe Step?', answer: "Yes. Ella's Bubbles and Kohler walk-in tubs offer strong build quality with less aggressive sales practices. Ella's Bubbles is sold through plumbers and dealers (not direct TV sales), often at lower prices. Consider getting quotes from 3–4 brands before deciding." },
    ],
    costBreakdown: [
      { item: 'American Standard tub (unit only)', low: 4000, high: 8000 },
      { item: 'Safe Step tub (unit only)', low: 4000, high: 8500 },
      { item: "Ella's Bubbles alternative", low: 2000, high: 5000 },
      { item: 'Professional installation', low: 1000, high: 3000 },
      { item: 'Electrical upgrade (if needed)', low: 200, high: 600 },
    ],
  },
  'stairlift-weight-limit': {
    title: 'Stairlift Weight Limits: What You Need to Know (2026)',
    description: 'Stairlift weight limits by brand and model. How to find a heavy-duty stairlift for users over 300 lbs — and what to ask before you buy.',
    category: 'stairlifts',
    compareSlug: 'best-stairlifts',
    intro: 'Standard stairlifts handle 250–300 lbs. If the user weighs more, you need a heavy-duty model — and not all brands offer them. Choosing a stairlift with insufficient weight capacity is a serious safety risk. This guide covers weight limits by brand, what heavy-duty models are available, and what to ask dealers.',
    faqs: [
      { question: 'What is the typical weight limit for a stairlift?', answer: 'Most standard stairlifts are rated for 250–300 lbs. This is total user weight including clothing and any items being carried. Heavy-duty stairlift models are available from most major brands and typically support 350–500 lbs. Exceeding the rated weight limit is a serious safety hazard.' },
      { question: 'Which stairlift brands offer heavy-duty models?', answer: 'Bruno (Electra-Ride Elite: 400 lbs), Harmar (Summit SL600: 400 lbs; Pinnacle SL700: 600 lbs), and Savaria (Sara Plus: 350 lbs) all offer heavy-duty models. The Harmar Pinnacle at 600 lbs is the highest-capacity widely-available residential model. Stannah and Acorn\'s standard models max at 265–285 lbs.' },
      { question: 'How much extra does a heavy-duty stairlift cost?', answer: 'Heavy-duty models (300–400 lbs capacity) typically cost 20–40% more than standard models. A standard Bruno Elan costs $2,800–$4,500 installed; the Bruno Electra-Ride Elite (400 lbs) costs $4,000–$6,000. Very high-capacity models (500–600 lbs) can run $6,000–$9,000 installed.' },
      { question: 'Can a standard stairlift be modified for a heavier user?', answer: 'No. Weight ratings are determined by the motor, rail, drive mechanism, and seat assembly. A standard stairlift cannot be modified to safely carry a user above its rated capacity. Always specify the user\'s weight before ordering so the dealer can recommend the appropriate model.' },
      { question: 'Does the rail size change for heavy-duty stairlifts?', answer: 'Often yes. Heavy-duty stairlifts may use wider or reinforced track profiles and heavier mounting brackets. This means the installation may require slightly more clearance on the staircase. Ask your dealer to confirm that the heavy-duty model will fit your specific stair width before ordering.' },
    ],
    costBreakdown: [
      { item: 'Standard stairlift (250–300 lbs)', low: 2000, high: 5000 },
      { item: 'Heavy-duty stairlift (300–400 lbs)', low: 4000, high: 6500 },
      { item: 'Very heavy-duty (400–600 lbs capacity)', low: 6000, high: 9500 },
      { item: 'Heavy-duty curved stairlift', low: 10000, high: 18000 },
    ],
  },
  'free-stairlift-for-seniors': {
    title: 'How to Get a Free Stairlift: Every Program That Can Help',
    description: 'Can you get a free stairlift? Yes — through VA grants, Medicaid waivers, state programs, and nonprofits. Complete guide to every financial assistance program.',
    category: 'stairlifts',
    compareSlug: 'best-stairlifts',
    intro: 'Stairlifts are not "free" through Medicare, but multiple programs can cover the full cost for qualifying seniors and veterans. The key is knowing which programs exist and how to apply. This guide covers every option — federal grants, Medicaid, VA programs, state programs, and nonprofits.',
    faqs: [
      { question: 'Can you get a free stairlift from the government?', answer: 'Yes, in some circumstances. Veterans with service-connected disabilities can receive stairlifts at no cost through VA Specially Adapted Housing (SAH) grants. Low-income seniors in rural areas may qualify for full coverage under the USDA Section 504 grant program (up to $10,000). Medicaid HCBS waivers in many states cover stairlifts for income-qualifying seniors who would otherwise need nursing home placement.' },
      { question: 'Does the VA pay for stairlifts?', answer: 'Yes. The VA offers several programs: The Specially Adapted Housing (SAH) grant provides up to $109,986 (2024) for veterans with specific service-connected disabilities affecting mobility. The Home Improvements and Structural Alterations (HISA) grant provides up to $6,800 for veterans with service-connected conditions. Apply through your VA regional office or VA.gov.' },
      { question: 'How do Medicaid HCBS waivers cover stairlifts?', answer: 'Most states have Medicaid Home and Community-Based Services (HCBS) waiver programs that fund home modifications to prevent nursing home placement. Stairlifts are commonly covered if a care coordinator determines they are medically necessary. Income limits, functional eligibility, and program names vary by state. Contact your state Medicaid office or local Area Agency on Aging (1-800-677-1116) to apply.' },
      { question: 'Are there nonprofit programs that provide free stairlifts?', answer: 'Rebuilding Together is the largest nonprofit providing free home modifications, including stairlifts, for low-income homeowners. Habitat for Humanity Home Repair programs also serve some markets. Local chapters vary in what they cover — contact your local chapter directly. Some faith-based organizations (Catholic Charities, Lutheran Social Services) also run home modification programs.' },
      { question: 'What income limits apply to free stairlift programs?', answer: 'Income limits vary by program. The USDA Section 504 grant requires income at or below 50% of the area median income. Medicaid requires income below state-specific limits (typically 100–138% of the federal poverty level). VA grants have no income limits — only service-connected disability requirements. Rebuilding Together typically serves homeowners at or below 80% of area median income.' },
    ],
    costBreakdown: [
      { item: 'VA SAH grant (up to)', low: 0, high: 109986 },
      { item: 'VA HISA grant (up to)', low: 0, high: 6800 },
      { item: 'USDA Section 504 grant (up to)', low: 0, high: 10000 },
      { item: 'Medicaid HCBS waiver (varies by state)', low: 0, high: 5000 },
      { item: 'Out-of-pocket if you don\'t qualify', low: 2000, high: 5000 },
    ],
  },
  'best-fall-detection-medical-alert': {
    title: 'Best Medical Alert Systems With Fall Detection (2026)',
    description: 'Which medical alert systems have the most accurate fall detection? Bay Alarm, Medical Guardian, and Life Alert compared on detection accuracy, response time, and monthly cost.',
    category: 'medical-alerts',
    compareSlug: 'best-medical-alerts',
    intro: 'Fall detection is the most important feature in a medical alert system for seniors living alone. But not all fall detection is equal — accuracy rates vary from 65% to 85%, and a missed fall can be life-threatening. This guide covers the systems with the most accurate fall detection, tested and reviewed.',
    faqs: [
      { question: 'How accurate is automatic fall detection?', answer: 'Current consumer-grade fall detection algorithms detect 65–85% of falls. The best systems on the market (Bay Alarm Medical, Medical Guardian) achieve around 80–85% in clinical-style testing. No system detects 100% of falls — they work best as a supplement to the manual help button, not a replacement. Users should still press the button when possible.' },
      { question: 'Which medical alert systems have the best fall detection?', answer: 'Based on response time and detection testing: Bay Alarm Medical SOS Mobile (fast detection, <30 sec response), Medical Guardian MGMove (accurate GPS + fall detection), and Lively Mobile Plus (strong fall detection, AARP pricing). All use wrist-based or pendant-based accelerometers. Wrist-worn devices generally detect falls more reliably than pendant-only models.' },
      { question: 'Is fall detection included or does it cost extra?', answer: 'Fall detection is almost always an add-on, typically $5–$10/month on top of the base monitoring fee. A few systems (like some Bay Alarm tiers) include it. Expect to pay $25–$45/month total for base monitoring plus fall detection.' },
      { question: 'What is the difference between GPS and home-only fall detection?', answer: 'Home-only medical alert systems use a base station that must be in range (typically 600–1,000 feet). GPS mobile systems work anywhere with cellular coverage. For seniors who go out regularly, GPS is essential — falls are just as likely outside the home. GPS systems cost $5–$15/month more than home-only systems.' },
      { question: 'Can fall detection replace a caregiver check-in?', answer: 'No. Fall detection supplements caregiving but does not replace it. Studies show 15–25% of falls go undetected by wearable devices (user out of range, device not worn, or atypical fall mechanics). Regular phone check-ins and caregiver contact remain essential for seniors living alone.' },
    ],
    costBreakdown: [
      { item: 'Home-only monitoring (per month)', low: 20, high: 35 },
      { item: 'GPS mobile monitoring (per month)', low: 30, high: 50 },
      { item: 'Fall detection add-on (per month)', low: 5, high: 10 },
      { item: 'Equipment fee (one-time or waived)', low: 0, high: 100 },
      { item: 'Total first-year cost (typical)', low: 300, high: 700 },
    ],
  },
  'aging-in-place-bathroom-modifications': {
    title: 'Aging-in-Place Bathroom Modifications: What to Do First',
    description: 'The 6 bathroom modifications that prevent the most falls: grab bars, walk-in shower, non-slip flooring, raised toilet, hand-held showerhead, and night lighting.',
    category: 'bath-safety',
    compareSlug: 'best-bath-safety-products',
    intro: 'The bathroom is where most in-home falls occur, and bathroom falls cause more serious injuries than falls elsewhere in the home. This guide prioritizes the 6 modifications that deliver the highest fall-prevention benefit per dollar spent — in the order you should do them.',
    faqs: [
      { question: 'What is the most important bathroom modification for fall prevention?', answer: 'Grab bars provide the most fall-prevention benefit per dollar. A professionally installed set of bars near the toilet and in the shower/tub costs $400–$900 and addresses the two highest-risk moments: transferring to/from the toilet and stepping in/out of the shower. Occupational therapists consistently rank grab bar installation as the first priority for aging-in-place bathroom modification.' },
      { question: 'Should I convert my tub to a walk-in shower?', answer: 'For most seniors, yes — a walk-in shower eliminates the step-over that causes most tub-related falls. A basic tub-to-shower conversion using a prefab kit costs $1,500–$3,500. A custom zero-threshold roll-in shower costs $5,000–$15,000. If the budget allows only one major modification, a walk-in shower typically reduces fall risk more than a walk-in tub.' },
      { question: 'Is a raised toilet seat worth it?', answer: 'Yes — for seniors with limited lower-body strength, a raised toilet seat (or comfort-height toilet) dramatically reduces the effort required to stand up. Standalone raised seats cost $30–$80 and require no installation. A comfort-height toilet (2–4 inches taller than standard) costs $200–$600 installed. This is one of the lowest-cost, highest-impact modifications.' },
      { question: 'What is a zero-threshold shower?', answer: 'A zero-threshold (also called curbless or roll-in) shower has no step or lip — the floor is level from the bathroom floor into the shower. This is the gold standard for wheelchair users and seniors with severe mobility limitations. The floor must slope gently toward the drain. Cost is $5,000–$15,000 for a full curbless conversion, depending on the size and materials.' },
      { question: 'How much do aging-in-place bathroom modifications cost in total?', answer: 'A basic bathroom safety package (grab bars, non-slip mat, hand-held showerhead, raised toilet seat) costs $500–$1,500. A mid-level renovation (walk-in shower, grab bars, comfort-height toilet) costs $5,000–$12,000. A complete accessible bathroom remodel costs $15,000–$25,000 for a full roll-in shower, widened door, and all ADA features.' },
    ],
    costBreakdown: [
      { item: 'Grab bars (set of 3–4, installed)', low: 400, high: 900 },
      { item: 'Non-slip flooring/mat', low: 50, high: 300 },
      { item: 'Hand-held showerhead', low: 30, high: 150 },
      { item: 'Raised toilet seat or comfort-height toilet', low: 40, high: 600 },
      { item: 'Walk-in shower conversion (basic)', low: 1500, high: 5000 },
      { item: 'Zero-threshold roll-in shower (full)', low: 5000, high: 15000 },
    ],
  },
  'home-elevator-cost-guide': {
    title: 'Home Elevator Cost Guide: What to Expect in 2026',
    description: 'How much does a home elevator cost? Vertical platform lifts start at $3,000. Full residential elevators cost $15,000–$35,000 installed. Cost breakdown for every option.',
    category: 'home-elevators',
    intro: 'Home mobility solutions range from $3,000 for a residential vertical platform lift to $35,000+ for a pneumatic or hydraulic home elevator. The right choice depends on the height you need to travel, the size of the user (including wheelchair use), aesthetics, and whether existing construction can accommodate a shaft. This guide covers every option.',
    faqs: [
      { question: 'What is the difference between a home elevator and a vertical platform lift?', answer: 'A residential elevator is an enclosed cab that travels in a shaft — it resembles a commercial elevator and is typically ADA-compliant for wheelchair users. A vertical platform lift (VPL) is an open or semi-enclosed platform that travels vertically — less expensive, requires less construction, but not enclosed. VPLs are common for 1–2 floor rises; full elevators for multi-story homes.' },
      { question: 'Does a home elevator require a shaft?', answer: 'Traditional elevators require a shaft, which means construction or a room sacrifice. Pneumatic vacuum elevators (like the Savaria Vuelift) are freestanding and do not require a traditional shaft — they anchor to floor and ceiling with a ceiling cutout. These are the most practical for retrofits.' },
      { question: 'Can I get a tax deduction for a home elevator?', answer: 'If a home elevator is installed for medical reasons (doctor documentation recommended), the cost may be partially deductible as a medical expense. The deductible amount is the installation cost minus any increase in home value. Consult a tax professional.' },
      { question: 'How long does home elevator installation take?', answer: 'A vertical platform lift takes 1–2 days. A pneumatic elevator takes 2–3 days. A traditional cable-driven or hydraulic elevator in an existing shaft takes 3–5 days. New shaft construction (if required) adds weeks to the timeline.' },
      { question: 'What ongoing maintenance does a home elevator require?', answer: 'Most residential elevators require annual professional maintenance ($200–$500/year) to inspect cables, hydraulics, safety systems, and door mechanisms. Some states require licensed elevator inspectors. Factor annual service costs into your total cost of ownership.' },
    ],
    costBreakdown: [
      { item: 'Vertical platform lift (VPL)', low: 3000, high: 8000 },
      { item: 'Pneumatic elevator (no shaft required)', low: 18000, high: 35000 },
      { item: 'Traditional hydraulic elevator', low: 15000, high: 30000 },
      { item: 'Shaft construction (if required)', low: 5000, high: 20000 },
      { item: 'Annual maintenance', low: 200, high: 500 },
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = GUIDE_META[slug];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
    twitter: { title: meta.title, description: meta.description },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const meta = GUIDE_META[slug];
  if (!meta) notFound();

  const { data: products } = await supabase
    .from('sh_products')
    .select('*')
    .eq('category', meta.category)
    .eq('is_published', true)
    .order('safe_score', { ascending: false })
    .limit(4);

  const faqSchemaData = faqSchema(meta.faqs);

  // HowTo schema for installation/checklist guides
  const HOW_TO_STEPS: Record<string, { name: string; text: string }[]> = {
    'grab-bar-installation-guide': [
      { name: 'Choose grab bar locations', text: 'Identify the three key bathroom locations: inside shower (horizontal bar 33–36 inches from floor), shower entry (vertical bar for stepping in/out), and beside toilet (horizontal bar 33 inches from floor).' },
      { name: 'Locate wall studs', text: 'Use a stud finder to locate studs behind the wall. Mark stud locations with tape. Grab bars must anchor into studs or use rated toggle anchors — drywall alone will not hold.' },
      { name: 'Mark hole positions', text: 'Position the grab bar mounting flange over a stud location. Mark the screw holes with a pencil. Verify the bar height matches ADA guidelines before drilling.' },
      { name: 'Pre-drill holes and anchor', text: 'Drill pilot holes at marked positions. For stud anchoring, drive screws directly. For tile walls, use a tile drill bit and appropriate wall anchors rated for 250+ lbs.' },
      { name: 'Attach mounting flanges', text: 'Secure the mounting flanges to the wall. Ensure each flange is level before tightening. Test each flange individually before attaching the bar.' },
      { name: 'Install and test the bar', text: 'Attach the grab bar to the mounted flanges. Tighten all screws completely. Apply 300 lbs of force to verify the installation — the bar should not flex or move.' },
    ],
    'wheelchair-ramp-cost-guide': [
      { name: 'Measure the rise height', text: 'Measure the vertical height from the bottom landing to the top of the threshold or step. This measurement determines the minimum ramp length.' },
      { name: 'Calculate required ramp length', text: 'Using the ADA 1:12 slope ratio, multiply the rise height (in inches) by 12 to get the minimum ramp length in inches. Example: 6-inch rise requires 72 inches (6 feet) minimum.' },
      { name: 'Select ramp type', text: 'For rises under 3 inches: threshold ramp ($50–$150). For 4–24 inch rises with portability need: suitcase-style aluminum ramp ($150–$400). For permanent entry steps: modular aluminum system ($1,200–$3,500).' },
      { name: 'Check permit requirements', text: 'Permanent attached ramps typically require a building permit. Freestanding modular ramps generally do not. Contact your local building department before beginning permanent construction.' },
      { name: 'Install or hire contractor', text: 'Portable ramps require no installation. Modular systems come with detailed instructions and can be DIY assembled. Permanent ramps should be built by a licensed contractor, ideally CAPS-certified.' },
    ],
  };

  const howToSchemaData = HOW_TO_STEPS[slug] ? howToSchema({
    name: meta.title,
    description: meta.intro,
    steps: HOW_TO_STEPS[slug],
  }) : null;

  const articleSchemaData = articleSchema({
    headline: meta.title,
    description: meta.description,
    datePublished: '2026-01-01',
    dateModified: '2026-03-01',
    url: `https://www.safeathomeguides.com/guides/${slug}`,
  });
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://www.safeathomeguides.com' },
    { name: 'Guides', url: 'https://www.safeathomeguides.com/guides' },
    { name: meta.title, url: `https://www.safeathomeguides.com/guides/${slug}` },
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchemaData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      {howToSchemaData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchemaData) }} />}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/guides" className="hover:text-gray-600 transition-colors">Guides</Link>
        <ChevronRight size={14} />
        <span className="text-gray-600 truncate max-w-xs">{meta.title.slice(0, 50)}{meta.title.length > 50 ? '…' : ''}</span>
      </nav>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <BookOpen size={16} style={{ color: '#1B4332' }} />
              <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>{getGuideTypeLabel(slug)}</span>
            </div>
            <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">Updated March 2026</span>
          </div>

          <h1 className="font-serif text-4xl font-bold mb-4 leading-tight" style={{ color: '#1A1A1A' }}>
            {meta.title}
          </h1>

          <div className="mb-6">
            <ShareButtons title={meta.title} url={`https://www.safeathomeguides.com/guides/${slug}`} />
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-10 border-l-4 pl-4" style={{ borderColor: '#1B4332' }}>
            {meta.intro}
          </p>

          {/* Cost breakdown */}
          {meta.costBreakdown && (
            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#1A1A1A' }}>
                <DollarSign size={20} style={{ color: '#D97706' }} />
                Cost Breakdown
              </h2>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: '#1B4332' }}>
                      <th className="text-left py-3 px-4 text-white font-semibold">Item</th>
                      <th className="text-right py-3 px-4 text-white font-semibold">Low</th>
                      <th className="text-right py-3 px-4 text-white font-semibold">High</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meta.costBreakdown.map((row, i) => (
                      <tr key={row.item} style={{ backgroundColor: i % 2 === 0 ? '#FAFAF7' : '#fff' }}>
                        <td className="py-3 px-4 text-gray-700">{row.item}</td>
                        <td className="py-3 px-4 text-right font-mono" style={{ color: '#1B4332' }}>${row.low.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-mono" style={{ color: '#1B4332' }}>${row.high.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#f0fdf4' }}>
                      <td className="py-3 px-4 font-semibold text-gray-800">Total (estimated)</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold" style={{ color: '#1B4332' }}>
                        ${meta.costBreakdown.reduce((s, r) => s + r.low, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold" style={{ color: '#1B4332' }}>
                        ${meta.costBreakdown.reduce((s, r) => s + r.high, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* What to Look For */}
          {WHAT_TO_LOOK_FOR[meta.category] && (
            <section className="mb-10">
              <h2 className="font-serif text-2xl font-semibold mb-5" style={{ color: '#1A1A1A' }}>
                What to Look For
              </h2>
              <div className="space-y-3">
                {WHAT_TO_LOOK_FOR[meta.category].map((item) => (
                  <div key={item.tip} className="flex gap-3 p-4 rounded-xl border border-gray-100 bg-white">
                    <CheckCircle size={18} className="shrink-0 mt-0.5" style={{ color: '#1B4332' }} />
                    <div>
                      <span className="font-semibold text-gray-900">{item.tip}: </span>
                      <span className="text-gray-700 text-sm leading-relaxed">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Newsletter mid-guide */}
          <div className="mb-10">
            <NewsletterSignup
              headline="Free: Complete Aging-in-Place Checklist"
              subtext="Room-by-room priorities, cost estimates, and what to do first. Get it free."
              source={`guide-${slug}`}
            />
          </div>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {meta.faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#FAFAF7' }}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Top products */}
          {products && products.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
                Top-Rated Products in This Category
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {products.map((p: Parameters<typeof ProductCard>[0]['product']) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href={`/products/${meta.category}`}
                  className="font-semibold hover:underline"
                  style={{ color: '#1B4332' }}
                >
                  See all {meta.category.replace(/-/g, ' ')} →
                </Link>
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <Suspense>
            <LeadForm
              category={meta.category}
              headline="Get Free Installation Quotes"
            />
          </Suspense>

          {/* Compare link if available */}
          {meta.compareSlug && (
            <Link
              href={`/compare/${meta.compareSlug}`}
              className="flex items-center justify-between p-5 rounded-xl border-2 group transition-colors"
              style={{ borderColor: '#1B4332' }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#1B4332' }}>Side-by-Side Comparison</p>
                <p className="font-semibold text-gray-800 group-hover:text-green-800 text-sm leading-tight">
                  Compare top {meta.category.replace(/-/g, ' ')} products →
                </p>
              </div>
            </Link>
          )}

          {/* Related guides */}
          <div className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#FAFAF7' }}>
            <h3 className="font-semibold text-gray-800 mb-3">More Cost Guides</h3>
            <div className="space-y-2">
              {Object.entries(GUIDE_META)
                .filter(([s]) => s !== slug)
                .map(([s, g]) => (
                  <Link
                    key={s}
                    href={`/guides/${s}`}
                    className="block text-sm hover:underline"
                    style={{ color: '#1B4332' }}
                  >
                    {g.title}
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
