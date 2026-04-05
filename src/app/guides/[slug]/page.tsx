import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { LeadForm } from '@/components/LeadForm';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { BookOpen, DollarSign, ChevronRight } from 'lucide-react';

interface Props { params: Promise<{ slug: string }> }

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

  const schema = faqSchema(meta.faqs);
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://www.safeathomeguides.com' },
    { name: 'Guides', url: 'https://www.safeathomeguides.com/guides' },
    { name: meta.title, url: `https://www.safeathomeguides.com/guides/${slug}` },
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

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
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} style={{ color: '#1B4332' }} />
            <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>Cost Guide</span>
          </div>

          <h1 className="font-serif text-4xl font-bold mb-4 leading-tight" style={{ color: '#1A1A1A' }}>
            {meta.title}
          </h1>

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
