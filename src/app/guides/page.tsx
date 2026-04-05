import Link from 'next/link';
import type { Metadata } from 'next';
import { BookOpen, DollarSign, HelpCircle, ChevronRight } from 'lucide-react';
import { NewsletterSignup } from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Home Safety Cost Guides & Buyer\'s Guides',
  description: 'Free cost guides for stairlifts, walk-in tubs, grab bars, and aging-in-place home modifications. What things cost, what insurance covers, and how to choose.',
};

const guides = [
  {
    slug: 'stairlift-cost-guide',
    title: 'How Much Does a Stairlift Cost in 2026?',
    description: 'New vs. refurbished, straight vs. curved, installation fees, and financing options. Every cost factor explained.',
    category: 'Stairlifts',
    icon: '🪜',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'walk-in-tub-cost-guide',
    title: 'Walk-In Tub Cost Guide: What to Expect in 2026',
    description: 'Unit prices, installation costs, what insurance may cover, and brand comparisons.',
    category: 'Walk-In Tubs',
    icon: '🛁',
    readTime: '4 min read',
    type: 'cost',
  },
  {
    slug: 'grab-bar-installation-guide',
    title: 'Grab Bar Installation Guide: Where to Put Them and How Much It Costs',
    description: 'ADA-compliant placement, installation costs, and which bars work best — written with occupational therapists.',
    category: 'Grab Bars',
    icon: '🔩',
    readTime: '4 min read',
    type: 'cost',
  },
  {
    slug: 'does-medicare-cover-stairlifts',
    title: 'Does Medicare Cover Stairlifts? What You Need to Know',
    description: 'Medicare Parts A, B, and Advantage coverage explained. Plus Medicaid waiver programs and VA benefits that may help.',
    category: 'Stairlifts',
    icon: '🏥',
    readTime: '5 min read',
    type: 'insurance',
  },
  {
    slug: 'does-medicare-cover-walk-in-tubs',
    title: 'Does Medicare Cover Walk-In Tubs?',
    description: 'Medicare, Medicaid, and VA coverage for walk-in tubs — and how to apply for home modification benefits.',
    category: 'Walk-In Tubs',
    icon: '🏥',
    readTime: '4 min read',
    type: 'insurance',
  },
  {
    slug: 'aging-in-place-home-modifications-checklist',
    title: 'Complete Aging-in-Place Home Modifications Checklist',
    description: 'Room-by-room checklist: what to modify, in what order, and rough costs for a full home assessment.',
    category: 'Planning',
    icon: '📋',
    readTime: '8 min read',
    type: 'planning',
  },
  {
    slug: 'medical-alert-cost-guide',
    title: 'Medical Alert System Cost Guide 2026',
    description: 'Monthly fees, GPS upgrades, fall detection add-ons, and how to compare brands without overpaying.',
    category: 'Medical Alerts',
    icon: '🚨',
    readTime: '4 min read',
    type: 'cost',
  },
  {
    slug: 'wheelchair-ramp-cost-guide',
    title: 'Wheelchair Ramp Cost Guide: Portable vs. Permanent',
    description: 'Portable ramps start at $100. Permanent modular systems cost $1,200–$3,500 installed. Everything that drives the price.',
    category: 'Wheelchair Ramps',
    icon: '♿',
    readTime: '4 min read',
    type: 'cost',
  },
  {
    slug: 'home-elevator-cost-guide',
    title: 'Home Elevator Cost Guide: Every Option Compared',
    description: 'Vertical platform lifts vs. pneumatic elevators vs. traditional hydraulic — costs, construction requirements, and which is right for your home.',
    category: 'Home Elevators',
    icon: '🛗',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'home-modification-grants-for-seniors',
    title: 'Home Modification Grants for Seniors: Every Program',
    description: 'USDA Section 504, VA grants, Medicaid HCBS waivers, Area Agency on Aging programs, and nonprofits — every funding source for aging-in-place modifications.',
    category: 'Planning',
    icon: '💰',
    readTime: '6 min read',
    type: 'insurance',
  },
  {
    slug: 'stairlift-vs-home-elevator',
    title: 'Stairlift vs. Home Elevator: Which Is Right for You?',
    description: 'Cost comparison, installation requirements, and who each option is best for. Expert guide to choosing between a stairlift and a home elevator.',
    category: 'Stairlifts',
    icon: '🪜',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'bathroom-safety-modifications-for-seniors',
    title: 'Bathroom Safety Modifications for Seniors: Complete Guide',
    description: 'The most important bathroom modifications — grab bars, walk-in tubs, shower seats, non-slip surfaces — with costs and installation tips.',
    category: 'Grab Bars',
    icon: '🚿',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'how-to-choose-a-stairlift',
    title: 'How to Choose a Stairlift: Complete Buyer\'s Guide',
    description: 'Straight vs. curved, weight limits, key features, top brands compared. Everything to know before you buy.',
    category: 'Stairlifts',
    icon: '🪜',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'aging-in-place-tax-deductions',
    title: 'Aging-in-Place Tax Deductions: What Qualifies in 2026',
    description: 'Which home modifications are tax deductible, how to calculate your deduction, and what documentation the IRS requires.',
    category: 'Planning',
    icon: '🧾',
    readTime: '5 min read',
    type: 'insurance',
  },
  {
    slug: 'best-medical-alert-for-seniors-living-alone',
    title: 'Best Medical Alert Systems for Seniors Living Alone',
    description: 'Fall detection accuracy, GPS range, response time, and battery life — the features that matter most for solo-living seniors.',
    category: 'Medical Alerts',
    icon: '🚨',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'walk-in-shower-conversion-cost',
    title: 'Walk-In Shower Conversion Cost: Tub to Shower',
    description: 'How much does it cost to convert a tub to a walk-in shower? From $1,500 for a basic kit to $15,000 for a zero-threshold roll-in shower.',
    category: 'Bath Safety',
    icon: '🚿',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'stairlift-for-narrow-stairs',
    title: 'Stairlift for Narrow Stairs: What You Need to Know',
    description: 'Minimum clearance requirements, which brands fit best in narrow staircases, and alternatives when stairs are too narrow.',
    category: 'Stairlifts',
    icon: '🪜',
    readTime: '4 min read',
    type: 'planning',
  },
  {
    slug: 'outdoor-stairlift-cost',
    title: 'Outdoor Stairlift Cost: What to Expect in 2026',
    description: 'Outdoor stairlifts cost $3,000–$7,000 installed. What makes them different from indoor models and which brands are most reliable.',
    category: 'Stairlifts',
    icon: '🪜',
    readTime: '4 min read',
    type: 'cost',
  },
  {
    slug: 'bruno-vs-acorn-stairlift',
    title: 'Bruno vs. Acorn Stairlift: Full Comparison (2026)',
    description: 'Bruno or Acorn? Head-to-head comparison of price, weight capacity, warranty, and service network to help you choose.',
    category: 'Stairlifts',
    icon: '🪜',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'stairlift-rental-vs-buy',
    title: 'Stairlift Rental vs. Buy: Which Makes Sense?',
    description: 'Rentals cost $150–$400/month but buying is cheaper after 12 months. When each option makes financial sense.',
    category: 'Stairlifts',
    icon: '🪜',
    readTime: '4 min read',
    type: 'cost',
  },
  {
    slug: 'stairlift-weight-limit',
    title: 'Stairlift Weight Limits: Heavy-Duty Options Explained',
    description: 'Standard stairlifts support 250–300 lbs. Heavy-duty models go up to 600 lbs. Brand-by-brand weight limit breakdown.',
    category: 'Stairlifts',
    icon: '🪜',
    readTime: '4 min read',
    type: 'planning',
  },
  {
    slug: 'senior-bathroom-remodel-cost',
    title: 'Senior Bathroom Remodel Cost: Accessible Bathroom Guide',
    description: 'From $500 for grab bars to $20,000 for a full roll-in shower remodel. What each level costs and what to prioritize.',
    category: 'Bath Safety',
    icon: '🚿',
    readTime: '6 min read',
    type: 'cost',
  },
  {
    slug: 'aging-in-place-vs-assisted-living-cost',
    title: 'Aging in Place vs. Assisted Living: Cost Comparison 2026',
    description: 'Median assisted living costs $54,000/year. Aging in place with moderate care needs runs $20,000–$35,000. Full financial comparison.',
    category: 'Planning',
    icon: '🏠',
    readTime: '6 min read',
    type: 'cost',
  },
  {
    slug: 'american-standard-vs-safe-step-walk-in-tub',
    title: 'American Standard vs. Safe Step Walk-In Tub (2026)',
    description: 'Two of the biggest brands compared on price, drain speed, warranty, and customer reviews. Unbiased guide.',
    category: 'Walk-In Tubs',
    icon: '🛁',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'aging-in-place-planning-guide',
    title: 'How to Plan for Aging in Place: Complete Beginner\'s Guide (2026)',
    description: 'What aging in place costs, which modifications matter most, how to find a CAPS contractor, and how to fund the work with grants and benefits.',
    category: 'Planning',
    icon: '🏠',
    readTime: '7 min read',
    type: 'planning',
  },
  {
    slug: 'walk-in-tub-vs-walk-in-shower',
    title: 'Walk-In Tub vs. Walk-In Shower: Which Is Safer?',
    description: 'Which is better for seniors — a walk-in tub or walk-in shower? OT recommendations, cost comparison, and when each option is the right choice.',
    category: 'Walk-In Tubs',
    icon: '🛁',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'stairlift-brands-to-avoid',
    title: 'Stairlift Brands to Avoid — And What to Buy Instead',
    description: 'Warning signs of bad stairlift companies, brands with high complaint volumes, and how to find a trustworthy dealer near you.',
    category: 'Stairlifts',
    icon: '⚠️',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'home-safety-checklist-for-elderly',
    title: 'Home Safety Checklist for Elderly: Room-by-Room Guide (2026)',
    description: 'Printable home safety checklist for elderly adults. Bathroom, stairs, bedroom, and entry — what to check and what modifications to prioritize.',
    category: 'Planning',
    icon: '📋',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'stairlift-installation-guide',
    title: 'Stairlift Installation: What to Expect (Step-by-Step)',
    description: 'What happens during stairlift installation? How long it takes, what the installer does, and how to prepare your home.',
    category: 'Stairlifts',
    icon: '🪜',
    readTime: '4 min read',
    type: 'planning',
  },
  {
    slug: 'medicare-advantage-home-modification-benefits',
    title: 'Medicare Advantage Home Modification Benefits: What\'s Covered in 2026',
    description: 'Which Medicare Advantage plans cover stairlifts, grab bars, and home safety modifications? Dollar limits, covered items, and how to find eligible plans.',
    category: 'Planning',
    icon: '🏥',
    readTime: '5 min read',
    type: 'insurance',
  },
  {
    slug: 'life-alert-vs-medical-guardian',
    title: 'Life Alert vs. Medical Guardian: Which Is Better in 2026?',
    description: 'Monthly cost, fall detection, contract terms, and response time — head-to-head comparison of the two most-searched medical alert brands.',
    category: 'Medical Alerts',
    icon: '🚨',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'free-stairlift-for-seniors',
    title: 'How to Get a Free Stairlift: Every Program That Can Help',
    description: 'VA grants, Medicaid waivers, USDA programs, and nonprofits that can cover the full cost of a stairlift for qualifying seniors.',
    category: 'Stairlifts',
    icon: '💰',
    readTime: '5 min read',
    type: 'insurance',
  },
  {
    slug: 'best-fall-detection-medical-alert',
    title: 'Best Medical Alert Systems With Fall Detection (2026)',
    description: 'Fall detection accuracy rates, response times, and monthly costs for the top systems — so you can choose the one that actually works.',
    category: 'Medical Alerts',
    icon: '🚨',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'aging-in-place-bathroom-modifications',
    title: 'Aging-in-Place Bathroom Modifications: What to Do First',
    description: 'The 6 bathroom modifications that prevent the most falls — in priority order. What each costs and where to start.',
    category: 'Bath Safety',
    icon: '🚿',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'fall-prevention-for-seniors',
    title: 'Fall Prevention for Seniors: A Complete Home Safety Guide (2026)',
    description: 'Room-by-room checklist, fall risk factors, home modification costs, and when to call an occupational therapist. Evidence-based guidance.',
    category: 'Planning',
    icon: '🛡️',
    readTime: '7 min read',
    type: 'planning',
  },
  {
    slug: 'best-shower-chair-for-seniors',
    title: 'Best Shower Chairs and Benches for Seniors (2026)',
    description: 'Freestanding vs. wall-mounted, transfer benches, weight limits, and what occupational therapists recommend.',
    category: 'Bath Safety',
    icon: '🪑',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'rollator-walker-guide',
    title: 'Rollator Walker Guide: How to Choose the Best Rollator (2026)',
    description: 'Wheel size, height adjustment, weight capacity, and the difference between rollators and standard walkers — from physical therapists.',
    category: 'Mobility Aids',
    icon: '🦽',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'stairlift-repair-cost',
    title: 'Stairlift Repair Cost Guide: What to Expect in 2026',
    description: 'Common stairlift repairs, diagnostic fees, motor replacement costs, and whether to repair or replace an aging stairlift.',
    category: 'Stairlifts',
    icon: '🔧',
    readTime: '4 min read',
    type: 'cost',
  },
  {
    slug: 'vertical-platform-lift-cost',
    title: 'Vertical Platform Lift Cost Guide: Prices & What to Expect (2026)',
    description: 'VPL purchase price, installation costs, permit requirements, and how platform lifts compare to stairlifts and home elevators.',
    category: 'Home Elevators',
    icon: '⬆️',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'home-health-aide-cost',
    title: 'Home Health Aide Cost Guide: What to Expect in 2026',
    description: 'Hourly rates by state, agency vs. private hire, what Medicare covers, and how to find a vetted aide.',
    category: 'Planning',
    icon: '🤝',
    readTime: '6 min read',
    type: 'cost',
  },
  {
    slug: 'grab-bar-types-guide',
    title: 'Types of Grab Bars: A Complete Buyer\'s Guide (2026)',
    description: 'Every type of grab bar explained: permanent, suction cup, folding, floor-mounted, and decorative. How to choose the right one.',
    category: 'Grab Bars',
    icon: '🔩',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'stairlift-financing',
    title: 'How to Finance a Stairlift in 2026: Every Option Explained',
    description: 'Rental, lease, VA grants, Medicaid, home equity, manufacturer financing, and nonprofit programs. All stairlift funding options explained.',
    category: 'Stairlifts',
    icon: '💳',
    readTime: '5 min read',
    type: 'insurance',
  },
  {
    slug: 'helping-aging-parents-at-home',
    title: 'How to Help Aging Parents Stay at Home Safely (2026 Guide)',
    description: 'A complete guide for adult children: home safety assessments, having the conversation, which modifications to prioritize, and when to get professional help.',
    category: 'Planning',
    icon: '👨‍👩‍👧',
    readTime: '7 min read',
    type: 'planning',
  },
  {
    slug: 'does-medicaid-cover-home-modifications',
    title: 'Does Medicaid Cover Home Modifications for Seniors?',
    description: 'How Medicaid HCBS waiver programs pay for grab bars, ramps, and bathroom modifications. Eligibility, how to apply, and what each state covers.',
    category: 'Planning',
    icon: '🏥',
    readTime: '5 min read',
    type: 'insurance',
  },
  {
    slug: 'smart-home-for-aging-in-place',
    title: 'Smart Home Devices for Aging in Place: A Complete Setup Guide (2026)',
    description: 'The best smart home devices for seniors — voice assistants, smart smoke detectors, video doorbells, and caregiver monitoring systems.',
    category: 'Smart Home Safety',
    icon: '🏠',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'no-monthly-fee-medical-alert',
    title: 'Medical Alert Systems Without Monthly Fees: Are They Worth It?',
    description: 'No-fee medical alert options vs. monitored systems compared. What you lose without monitoring, and when going fee-free actually makes sense.',
    category: 'Medical Alerts',
    icon: '🚨',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'bath-lift-cost-guide',
    title: 'Bath Lift Cost Guide: What to Expect in 2026',
    description: 'Powered and manual bath lifts compared. What they cost, whether Medicare covers them, and how to choose the right one for your tub.',
    category: 'Bath Safety',
    icon: '🛁',
    readTime: '4 min read',
    type: 'cost',
  },
  {
    slug: 'lift-chair-cost-guide',
    title: 'Lift Chair Cost Guide: Power Recliner Prices & What to Expect (2026)',
    description: 'Two-position, three-position, and infinite-position lift recliner prices. What Medicare covers, bariatric options, and how to choose the right size.',
    category: 'Mobility Aids',
    icon: '🪑',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'aging-in-place-bathroom-checklist',
    title: 'Aging-in-Place Bathroom Safety Checklist (2026)',
    description: 'Printable bathroom safety checklist for seniors. What to check, what to add, and cost estimates — in order of fall-prevention impact.',
    category: 'Bath Safety',
    icon: '🚿',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'raised-toilet-seat-guide',
    title: 'Raised Toilet Seat Guide: How to Choose & Install One (2026)',
    description: 'Raised toilet seat height options, arms vs. no arms, Medicare coverage, and installation. The easiest bathroom safety upgrade for seniors.',
    category: 'Bath Safety',
    icon: '🚽',
    readTime: '4 min read',
    type: 'planning',
  },
  {
    slug: 'va-home-modification-grants',
    title: 'VA Home Modification Grants: SAH, SHA, and HISA Explained (2026)',
    description: 'Complete guide to VA home modification grants for veterans. SAH up to $109,986, SHA up to $22,036, and HISA up to $6,800 — eligibility and how to apply.',
    category: 'Planning',
    icon: '🎖️',
    readTime: '6 min read',
    type: 'insurance',
  },
  {
    slug: 'aging-in-place-after-stroke',
    title: 'Aging in Place After Stroke: Home Modifications & Recovery Guide (2026)',
    description: 'Home modifications for stroke survivors: one-sided weakness adaptations, grab bar placement, lever handles, and returning home safely.',
    category: 'Planning',
    icon: '🏥',
    readTime: '7 min read',
    type: 'planning',
  },
  {
    slug: 'bedside-commode-guide',
    title: 'Bedside Commode Guide: Types, Costs & When to Use One (2026)',
    description: 'What is a bedside commode? Types, Medicare coverage, 3-in-1 options, weight limits, and how to choose the right one.',
    category: 'Bath Safety',
    icon: '🚽',
    readTime: '4 min read',
    type: 'cost',
  },
  {
    slug: 'non-slip-flooring-for-seniors',
    title: 'Non-Slip Flooring for Seniors: Best Options & Installation Cost (2026)',
    description: 'Best flooring for fall prevention: slip resistance ratings, LVP vs. tile vs. carpet, anti-slip coatings, and what each costs to install.',
    category: 'Planning',
    icon: '🏠',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'accessible-kitchen-modifications',
    title: 'Accessible Kitchen Modifications for Seniors (2026)',
    description: 'Kitchen modifications for aging in place: cabinet pulls, counter heights, non-slip flooring, pull-out shelves, and appliance choices.',
    category: 'Planning',
    icon: '🍳',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'hip-replacement-home-modifications',
    title: 'Home Modifications After Hip Replacement: Recovery Guide (2026)',
    description: 'What you need in place before hip replacement surgery. Raised toilet seats, shower chairs, grab bars, and a room-by-room recovery checklist.',
    category: 'Bath Safety',
    icon: '🏥',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'aging-in-place-parkinsons',
    title: 'Aging in Place with Parkinson\'s Disease: Home Safety Guide (2026)',
    description: 'Home modifications for Parkinson\'s disease: freezing of gait, mobility aids, bathroom safety, and how to adapt as the disease progresses.',
    category: 'Planning',
    icon: '🏠',
    readTime: '7 min read',
    type: 'planning',
  },
  {
    slug: 'home-safety-for-dementia',
    title: 'Home Safety for Dementia: Modifications & Monitoring Guide (2026)',
    description: 'How to make a home safe for dementia patients. Wandering prevention, stove safety, smart monitoring, and medication management.',
    category: 'Smart Home Safety',
    icon: '🔒',
    readTime: '7 min read',
    type: 'planning',
  },
  {
    slug: 'doorway-widening-cost-guide',
    title: 'Doorway Widening Cost Guide: Wheelchair Access Modifications (2026)',
    description: 'How much does doorway widening cost? Offset hinges vs. full widening, ADA requirements, and what insurance programs cover the work.',
    category: 'Planning',
    icon: '🚪',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'stair-handrail-cost-guide',
    title: 'Stair Handrail Cost Guide: Installation & What to Expect (2026)',
    description: 'Stair handrail installation costs, ADA height requirements, DIY vs. professional, and how to get funding through grants.',
    category: 'Grab Bars',
    icon: '🪜',
    readTime: '4 min read',
    type: 'cost',
  },
  {
    slug: 'cane-vs-walker-guide',
    title: 'Cane vs. Walker: How to Choose the Right Mobility Aid (2026)',
    description: 'When a cane is enough — and when you need a walker. Physical therapist guidance on fit, correct use, and what Medicare covers.',
    category: 'Mobility Aids',
    icon: '🦯',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'family-caregiver-guide',
    title: 'Family Caregiver Guide: How to Help Aging Parents at Home (2026)',
    description: 'Practical guide for family caregivers: home safety assessment, conversation starters, caregiver burnout prevention, respite resources, and financial considerations.',
    category: 'Planning',
    icon: '👨‍👩‍👧',
    readTime: '7 min read',
    type: 'planning',
  },
  {
    slug: 'arthritis-home-modifications',
    title: 'Home Modifications for Arthritis: Reducing Joint Strain in Daily Life (2026)',
    description: 'Home modifications for arthritis: lever handles, raised seats, adaptive kitchen tools, bathroom safety, and reducing the joint strain of daily tasks.',
    category: 'Planning',
    icon: '🤲',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'fall-prevention-exercises-seniors',
    title: 'Fall Prevention Exercises for Seniors: The Most Effective Routines (2026)',
    description: 'Exercise programs that reduce falls: Tai Chi (29–50% fall reduction), Otago program, balance training, strength exercises, and how to start safely.',
    category: 'Planning',
    icon: '🤸',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'hearing-loss-home-modifications',
    title: 'Home Modifications for Hearing Loss: Safety Adaptations for Seniors (2026)',
    description: 'Home adaptations for hearing loss: visual smoke alarms, bed shakers, captioned telephones, video doorbells, and smart alert systems.',
    category: 'Smart Home Safety',
    icon: '🔔',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'vision-loss-home-modifications',
    title: 'Home Modifications for Vision Loss: Guide for Seniors with Low Vision (2026)',
    description: 'Home safety for low vision seniors: lighting upgrades, stair contrast markings, smart home voice control, kitchen adaptations, and vision resources.',
    category: 'Smart Home Safety',
    icon: '👁️',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'medication-management-at-home',
    title: 'Medication Management at Home for Seniors: Safety, Reminders & Tools (2026)',
    description: 'Managing medications safely at home: automatic dispensers, reminder apps, medication lists for emergencies, and preventing the most common errors.',
    category: 'Smart Home Safety',
    icon: '💊',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'tub-cut-out-conversion',
    title: 'Bathtub Cut-Out Conversion: Cost, Process & Safety (2026)',
    description: 'Tub cut-out conversion cost ($250–$1,200), how it\'s done, safety concerns, and when a walk-in tub or full shower conversion is the better choice.',
    category: 'Bath Safety',
    icon: '🛁',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'senior-home-grants-non-veteran',
    title: 'Home Modification Grants for Seniors (Not VA): What\'s Available in 2026',
    description: 'Funding for non-veteran seniors: Medicaid HCBS, USDA Section 504, Area Agency on Aging, CDBG, and state-level programs.',
    category: 'Planning',
    icon: '🏛️',
    readTime: '6 min read',
    type: 'insurance',
  },
  {
    slug: 'aging-in-place-multiple-sclerosis',
    title: 'Aging in Place with Multiple Sclerosis: Home Safety & Modifications (2026)',
    description: 'Home modifications for MS: fatigue management, heat sensitivity, balance aids, bathroom safety, and adapting as the disease progresses.',
    category: 'Planning',
    icon: '🏥',
    readTime: '7 min read',
    type: 'planning',
  },
  {
    slug: 'home-care-agency-vs-private-caregiver',
    title: 'Home Care Agency vs. Private/Independent Caregiver: Which Is Better? (2026)',
    description: 'Agency vs. private caregiver: cost difference, employer responsibilities, liability, reliability, and how to decide which is right for your situation.',
    category: 'Planning',
    icon: '👥',
    readTime: '7 min read',
    type: 'planning',
  },
  {
    slug: 'outdoor-home-safety-guide',
    title: 'Outdoor Home Safety for Seniors: Entry, Pathways & Lighting Guide (2026)',
    description: 'Outdoor safety for seniors: entry steps, pathway lighting, outdoor grab bars, seasonal ice hazards, and landscaping changes that reduce fall risk.',
    category: 'Planning',
    icon: '🌿',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'walk-in-tub-jets-vs-soaker',
    title: 'Walk-In Tub with Jets vs. Soaker: Which Is Better for Seniors? (2026)',
    description: 'Walk-in tub hydrotherapy jets vs. soaker models: therapeutic benefits, maintenance requirements, cost difference, and who actually benefits from jets.',
    category: 'Walk-In Tubs',
    icon: '🛁',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'manual-vs-power-wheelchair',
    title: 'Manual vs. Power Wheelchair: How to Choose (2026)',
    description: 'Manual vs. power wheelchair: strength requirements, Medicare coverage differences, transport chair option, and key decision factors.',
    category: 'Mobility Aids',
    icon: '♿',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'senior-bedroom-safety-guide',
    title: 'Senior Bedroom Safety Guide: Falls, Getting In and Out of Bed, and More (2026)',
    description: 'Bedroom safety for seniors: bed height, bed rails, nighttime fall prevention, path lighting, and the highest-risk bedroom scenarios.',
    category: 'Planning',
    icon: '🛏️',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'portable-vs-permanent-ramp',
    title: 'Portable vs. Permanent Wheelchair Ramp: Which Is Right for You? (2026)',
    description: 'Comparing portable, modular, and permanent wheelchair ramps: cost, installation, resale value, permits, and when each type makes sense.',
    category: 'Wheelchair Ramps',
    icon: '♿',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'aging-in-place-budget-guide',
    title: 'How Much Does Aging in Place Cost? Complete Budget Guide for 2026',
    description: 'What aging in place really costs: essential modifications, accessibility upgrades, smart home add-ons, care costs, and available funding.',
    category: 'Planning',
    icon: '💰',
    readTime: '7 min read',
    type: 'cost',
  },
  {
    slug: 'home-modification-contractor-scams',
    title: 'Home Modification Contractor Scams: Red Flags & How to Protect Yourself (2026)',
    description: 'Common contractor scams targeting seniors: upfront cash demands, unlicensed work, door-to-door pressure, and how to vet contractors safely.',
    category: 'Planning',
    icon: '⚠️',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'shower-safety-checklist',
    title: 'Senior Shower Safety Checklist: 15 Things to Check in Your Bathroom (2026)',
    description: 'Complete shower safety checklist for seniors. Grab bars, non-slip mat, shower chair, temperature limits, lighting — a complete safety setup guide.',
    category: 'Bath Safety',
    icon: '✅',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'wheelchair-ramp-slope-guide',
    title: 'Wheelchair Ramp Slope Requirements: ADA Standards & What Works at Home (2026)',
    description: 'ADA 1:12 slope requirement, ramp length calculations, width requirements, materials comparison, and permit requirements.',
    category: 'Wheelchair Ramps',
    icon: '📐',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'voice-assistant-for-seniors',
    title: 'Voice Assistants for Seniors: Alexa vs. Google Home for Aging in Place (2026)',
    description: 'How smart speakers help seniors age in place: medication reminders, fall alerts, drop-in calls, smart home control, and which platform is easiest.',
    category: 'Smart Home Safety',
    icon: '🔊',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'apple-watch-vs-medical-alert',
    title: 'Apple Watch vs. Medical Alert System: Which Is Better for Seniors? (2026)',
    description: 'Apple Watch vs. dedicated medical alert systems: fall detection comparison, response time, cost, battery life, and who each is right for.',
    category: 'Medical Alerts',
    icon: '⌚',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'grab-bar-weight-capacity-guide',
    title: 'Grab Bar Weight Capacity: What the Ratings Mean & How to Install Correctly (2026)',
    description: 'How much weight can a grab bar hold? ADA standards, stud mounting vs. drywall anchors, and the difference between rated and installed strength.',
    category: 'Grab Bars',
    icon: '🔩',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'walk-in-tub-installation-guide',
    title: 'Walk-In Tub Installation Guide: What the Process Looks Like (2026)',
    description: 'Walk-in tub installation process, timeline, plumbing requirements, door swing options, and what goes wrong during installation.',
    category: 'Walk-In Tubs',
    icon: '🛁',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'stairlift-troubleshooting-guide',
    title: 'Stairlift Troubleshooting Guide: Common Problems & Fixes (2026)',
    description: 'Common stairlift problems: beeping codes, won\'t move, stops mid-stair, remote not working. When to DIY and when to call a technician.',
    category: 'Stairlifts',
    icon: '🪜',
    readTime: '5 min read',
    type: 'planning',
  },
  {
    slug: 'ot-home-assessment-guide',
    title: 'Occupational Therapy Home Assessment: What to Expect & How to Get One (2026)',
    description: 'What is an OT home assessment? What they evaluate, how to get a referral, Medicare coverage, and how recommendations translate into modifications.',
    category: 'Planning',
    icon: '📋',
    readTime: '6 min read',
    type: 'planning',
  },
  {
    slug: 'one-floor-living-guide',
    title: 'One-Floor Living: How to Set Up Your Home for Aging in Place (2026)',
    description: 'Complete guide to one-floor living. Converting a dining room, adding a bathroom, stair avoidance strategies, and cost.',
    category: 'Planning',
    icon: '🏠',
    readTime: '6 min read',
    type: 'cost',
  },
  {
    slug: 'long-term-care-insurance-home-modifications',
    title: 'Does Long-Term Care Insurance Cover Home Modifications? (2026)',
    description: 'Does LTCI pay for home modifications? What LTCI covers, how to file a claim, and alternative funding sources.',
    category: 'Planning',
    icon: '📄',
    readTime: '5 min read',
    type: 'insurance',
  },
  {
    slug: 'transfer-belt-guide',
    title: 'Gait Belt & Transfer Belt Guide: How to Use One Safely (2026)',
    description: 'What is a gait belt? How to use a transfer belt safely, when you need one, sizing guide, and Medicare coverage rules.',
    category: 'Mobility Aids',
    icon: '🔄',
    readTime: '4 min read',
    type: 'planning',
  },
  {
    slug: 'accessible-bathroom-design',
    title: 'Accessible Bathroom Design Guide: Full Renovation Cost & What Matters (2026)',
    description: 'Full accessible bathroom design: roll-in shower dimensions, turning radius, grab bar placement, zero-threshold entry, and full renovation cost.',
    category: 'Bath Safety',
    icon: '🚿',
    readTime: '7 min read',
    type: 'cost',
  },
  {
    slug: 'power-wheelchair-cost-guide',
    title: 'Power Wheelchair Cost Guide: What to Budget in 2026',
    description: 'Power wheelchair cost breakdown, Medicare coverage (Group 1–5), complex rehab vs. standard, and the funding process from evaluation to delivery.',
    category: 'Mobility Aids',
    icon: '♿',
    readTime: '6 min read',
    type: 'cost',
  },
  {
    slug: 'hoyer-lift-cost-guide',
    title: 'Hoyer Lift Cost Guide: Patient Lift Prices & Medicare Coverage (2026)',
    description: 'Hoyer lift and patient lift costs, Medicare coverage rules, portable vs. ceiling lifts, and sling types. Everything caregivers need to know.',
    category: 'Mobility Aids',
    icon: '🏋️',
    readTime: '6 min read',
    type: 'cost',
  },
  {
    slug: 'knee-scooter-guide',
    title: 'Knee Scooter Guide: Cost, Medicare Coverage & How to Choose (2026)',
    description: 'Knee scooter vs. crutches, what to look for, rental vs. buying, Medicare coverage, and tips for using a knee walker safely.',
    category: 'Mobility Aids',
    icon: '🛴',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'usda-section-504-grants',
    title: 'USDA Section 504 Home Repair Grants for Seniors: Complete Guide (2026)',
    description: 'USDA Section 504 grants provide up to $10,000 for very low-income rural homeowners over 62. Eligibility, covered repairs, and how to apply.',
    category: 'Planning',
    icon: '🌾',
    readTime: '6 min read',
    type: 'insurance',
  },
  {
    slug: 'hospital-bed-rental-cost',
    title: 'Hospital Bed Rental Cost for Home: What to Expect in 2026',
    description: 'Home hospital bed rental cost, Medicare coverage, semi-electric vs full-electric, and rental vs purchase comparison.',
    category: 'Mobility Aids',
    icon: '🛏️',
    readTime: '5 min read',
    type: 'cost',
  },
  {
    slug: 'handheld-showerhead-guide',
    title: 'Handheld Showerhead Guide for Seniors: What to Look For (2026)',
    description: 'Best handheld showerhead for aging in place. Hose length, slide bars, pause function, and DIY installation guide.',
    category: 'Bath Safety',
    icon: '🚿',
    readTime: '4 min read',
    type: 'planning',
  },
];

const typeColors: Record<string, string> = {
  cost: '#D97706',
  insurance: '#1B4332',
  planning: '#6B7280',
};

const typeLabels: Record<string, string> = {
  cost: 'Cost Guide',
  insurance: 'Insurance Guide',
  planning: 'Planning Guide',
};

export default function GuidesPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={18} style={{ color: '#1B4332' }} />
          <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>Buyer&apos;s Guides</span>
        </div>
        <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
          Cost Guides & Buyer&apos;s Guides
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Honest, independent guides to help you make confident decisions about home safety.
          No fluff, no sponsored rankings — just what things cost and how to choose.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-green-200 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{guide.icon}</span>
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                style={{ backgroundColor: typeColors[guide.type] }}
              >
                {typeLabels[guide.type]}
              </span>
            </div>
            <h2 className="font-serif text-lg font-semibold mb-2 leading-tight group-hover:text-green-800 transition-colors" style={{ color: '#1A1A1A' }}>
              {guide.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{guide.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{guide.category}</span>
              <div className="flex items-center gap-1 font-medium" style={{ color: '#1B4332' }}>
                Read guide <ChevronRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick answers section */}
      <section className="rounded-2xl p-8 mb-12" style={{ backgroundColor: '#F5F5F0' }}>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle size={20} style={{ color: '#1B4332' }} />
          <h2 className="font-serif text-2xl font-semibold" style={{ color: '#1A1A1A' }}>
            Quick Cost Reference
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Straight stairlift (installed)', range: '$2,000 – $5,000' },
            { label: 'Curved stairlift (installed)', range: '$8,000 – $15,000' },
            { label: 'Walk-in tub (installed)', range: '$3,500 – $10,000' },
            { label: 'Grab bar (per bar, installed)', range: '$75 – $200' },
            { label: 'Wheelchair ramp (portable)', range: '$150 – $400' },
            { label: 'Medical alert system', range: '$20 – $55/month' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">{item.label}</p>
              <p className="font-mono font-semibold text-lg" style={{ color: '#1B4332' }}>{item.range}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mb-12">
        <NewsletterSignup
          headline="Free: Complete Home Safety Checklist"
          subtext="Room-by-room guide to the most impactful modifications, in priority order. Get it free."
          source="guides-page"
        />
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: '#1A1A1A' }}>
          Not sure where to start?
        </h2>
        <p className="text-gray-500 mb-6">Take our 2-minute home assessment and get a personalized recommendation.</p>
        <Link
          href="/assess"
          className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#1B4332' }}
        >
          Take the Free Assessment →
        </Link>
      </section>
    </main>
  );
}
