import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Phone, Globe, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aging-in-Place Resources: Grants, Programs & Support',
  description: 'Free government grants, state programs, nonprofit assistance, and phone hotlines for senior home modifications and aging-in-place support. Updated 2026.',
  openGraph: {
    title: 'Aging-in-Place Resources: Grants, Programs & Support',
    description: 'Comprehensive directory of government grants, state programs, and nonprofit help for senior home safety modifications.',
  },
};

const RESOURCES = [
  {
    category: 'Federal Government Programs',
    items: [
      {
        name: 'Eldercare Locator',
        desc: 'Free government service to connect older adults with local Area Agencies on Aging, home modification programs, transportation, and meal services.',
        url: 'https://eldercare.acl.gov',
        phone: '1-800-677-1116',
        type: 'phone+web',
      },
      {
        name: 'USDA Section 504 Rural Repair Program',
        desc: 'Grants up to $10,000 for very low-income rural homeowners for home repairs and modifications, including accessibility improvements. No repayment required for grants.',
        url: 'https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-repair-loans-grants',
        type: 'web',
      },
      {
        name: 'VA Specially Adapted Housing (SAH) Grant',
        desc: 'For veterans with service-connected disabilities — provides up to $109,986 (2026) for major home modifications or construction of an adapted home.',
        url: 'https://www.va.gov/housing-assistance/disability-housing-grants/',
        phone: '1-800-827-1000',
        type: 'phone+web',
      },
      {
        name: 'VA Special Housing Adaptation (SHA) Grant',
        desc: 'Smaller VA grant (up to $22,036 in 2026) for veterans with specific service-connected disabilities — covers accessibility modifications.',
        url: 'https://www.va.gov/housing-assistance/disability-housing-grants/',
        type: 'web',
      },
      {
        name: 'HUD Housing Counseling',
        desc: 'Free or low-cost housing counseling for homeowners, including reverse mortgage counseling and home modification loan guidance.',
        url: 'https://www.hud.gov/offices/hsg/sfh/hcc/hcs.cfm',
        phone: '1-800-569-4287',
        type: 'phone+web',
      },
    ],
  },
  {
    category: 'Medicaid & Medicare Programs',
    items: [
      {
        name: 'Medicaid HCBS Waiver Programs',
        desc: 'Home and Community-Based Services waivers vary by state and may fund home modifications, ramps, grab bars, and other modifications. Contact your state Medicaid office or local AAA to learn what your state covers.',
        url: 'https://www.medicaid.gov/medicaid/home-community-based-services/index.html',
        type: 'web',
      },
      {
        name: 'Medicare Advantage "Healthy Home" Benefits',
        desc: 'Some Medicare Advantage plans include supplemental benefits covering home safety modifications. Call the number on your Medicare card or visit medicare.gov to compare plans in your area.',
        url: 'https://www.medicare.gov/plan-compare/',
        phone: '1-800-MEDICARE',
        type: 'phone+web',
      },
      {
        name: 'BenefitsCheckUp (NCOA)',
        desc: 'Free online tool from the National Council on Aging to check eligibility for 2,000+ benefit programs including home modification assistance, utility help, and Medicare Savings Programs.',
        url: 'https://www.benefitscheckup.org',
        type: 'web',
      },
    ],
  },
  {
    category: 'Nonprofit & State Programs',
    items: [
      {
        name: 'Rebuilding Together',
        desc: 'National nonprofit that provides free home repairs and modifications to low-income homeowners — including grab bar installation, ramp construction, and accessibility improvements. Find your local affiliate.',
        url: 'https://rebuildingtogether.org',
        type: 'web',
      },
      {
        name: 'AARP HomeFit Guide',
        desc: 'Free guide from AARP with room-by-room recommendations for making a home safer for aging in place. Includes modification checklists and product suggestions.',
        url: 'https://www.aarp.org/livable-communities/housing/info-2020/homefit-guide.html',
        type: 'web',
      },
      {
        name: 'National Aging in Place Council',
        desc: 'Directory of aging-in-place professionals (CAPS contractors, OTs, financial advisors) searchable by ZIP code. Member organizations are vetted for relevant credentials.',
        url: 'https://www.naipc.org',
        type: 'web',
      },
      {
        name: 'Independent Living Centers (CIL Network)',
        desc: 'Over 400 centers nationwide providing home modification consultations, equipment loans, and community resources at low or no cost for seniors and people with disabilities.',
        url: 'https://www.ilru.org/projects/cil-net/cil-center-and-association-directory',
        type: 'web',
      },
    ],
  },
  {
    category: 'Professional Credentialing',
    items: [
      {
        name: 'NAHB CAPS Credential Lookup',
        desc: 'Verify that a contractor holds a current Certified Aging-in-Place Specialist (CAPS) credential issued by the National Association of Home Builders.',
        url: 'https://www.nahb.org/education-and-events/designations/caps',
        type: 'web',
      },
      {
        name: 'AOTA OT Practitioner Finder',
        desc: 'Find a licensed Occupational Therapist near you. An OT can conduct a formal home safety assessment and generate a modification priority list covered by many insurance plans.',
        url: 'https://www.aota.org/practice/practice-essentials/ot-strong/find-ot',
        type: 'web',
      },
      {
        name: 'NARI Certified Aging-in-Place Remodeler',
        desc: 'National Association of the Remodeling Industry certification directory for remodelers with specialized aging-in-place training.',
        url: 'https://www.nari.org',
        type: 'web',
      },
    ],
  },
  {
    category: 'Cost & Financial Planning',
    items: [
      {
        name: 'Genworth Cost of Care Survey',
        desc: 'Annual survey of care costs across all 50 states — including home aide rates, nursing home costs, and assisted living fees. Useful for comparing aging-in-place modification costs against alternatives.',
        url: 'https://www.genworth.com/aging-and-you/finances/cost-of-care.html',
        type: 'web',
      },
      {
        name: 'IRS Publication 502 (Medical Expenses)',
        desc: 'Official IRS guidance on what home modifications qualify as medical expense deductions. Includes specific guidance on ramps, grab bars, and elevators.',
        url: 'https://www.irs.gov/pub/irs-pdf/p502.pdf',
        type: 'web',
      },
      {
        name: 'CFPB Reverse Mortgage Guide',
        desc: 'Consumer Financial Protection Bureau\'s free guide to reverse mortgages as a funding option for home modifications. Balanced overview of pros, cons, and risks.',
        url: 'https://www.consumerfinance.gov/owning-a-home/reverse-mortgages/',
        type: 'web',
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={18} style={{ color: '#1B4332' }} />
          <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>Resource Directory</span>
        </div>
        <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
          Aging-in-Place Resources & Programs
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Free government grants, state programs, nonprofit assistance, and professional directories
          for senior home modifications. All links are to official or authoritative sources.
        </p>
      </div>

      {/* Quick help box */}
      <div className="rounded-xl border-l-4 p-5 mb-10" style={{ backgroundColor: '#f0fdf4', borderColor: '#1B4332' }}>
        <p className="font-semibold text-gray-900 mb-1">Start here if you&apos;re not sure where to begin</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Call the <strong>Eldercare Locator at 1-800-677-1116</strong> (free, weekdays 9am–8pm ET).
          They will connect you with your local Area Agency on Aging, which can tell you what programs exist in your specific area —
          including free modification programs, equipment loans, and income-qualified grant programs not listed anywhere online.
        </p>
      </div>

      {/* Resource sections */}
      {RESOURCES.map((section) => (
        <section key={section.category} className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-5 pb-3 border-b border-gray-100" style={{ color: '#1A1A1A' }}>
            {section.category}
          </h2>
          <div className="space-y-4">
            {section.items.map((item) => (
              <div key={item.name} className="rounded-xl border border-gray-100 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{item.desc}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                        style={{ color: '#1B4332' }}
                      >
                        <Globe size={14} />
                        Visit website
                        <ExternalLink size={12} className="opacity-60" />
                      </a>
                      {item.phone && (
                        <a
                          href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline text-gray-600"
                        >
                          <Phone size={14} />
                          {item.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* On-site resources */}
      <section className="rounded-2xl p-8 mb-12" style={{ backgroundColor: '#F5F5F0' }}>
        <h2 className="font-serif text-2xl font-semibold mb-5" style={{ color: '#1A1A1A' }}>On SafeAtHome Guide</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: '/guides/home-modification-grants-for-seniors', label: 'Home Modification Grants Guide', desc: 'Detailed breakdown of every federal and state grant program' },
            { href: '/guides/does-medicare-cover-stairlifts', label: 'Medicare & Stairlift Coverage', desc: 'Which plans cover what — and how to apply' },
            { href: '/guides/aging-in-place-tax-deductions', label: 'Tax Deduction Guide 2026', desc: 'Which modifications qualify and how to document them' },
            { href: '/assess', label: 'Free Home Assessment', desc: '2-minute quiz → personalized modification priorities' },
            { href: '/contractors', label: 'Find a CAPS Contractor', desc: '150+ certified aging-in-place specialists, all 50 states' },
            { href: '/glossary', label: 'Aging-in-Place Glossary', desc: '36 terms explained in plain English' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block p-4 rounded-xl bg-white border border-gray-100 hover:border-green-700 hover:shadow-sm transition-all group"
            >
              <p className="font-semibold text-sm text-gray-800 group-hover:text-green-800 transition-colors mb-0.5">{link.label}</p>
              <p className="text-xs text-gray-500">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 leading-relaxed">
        Resource links are verified periodically. Government program details change — always confirm current eligibility and benefit
        amounts with the program directly. SafeAtHome Guide is not affiliated with any government agency or nonprofit listed above.
      </p>
    </main>
  );
}
