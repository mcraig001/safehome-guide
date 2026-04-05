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
