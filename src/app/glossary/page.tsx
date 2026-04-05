import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aging-in-Place Glossary: Terms & Definitions',
  description: 'Plain-English definitions of aging-in-place, home modification, and home safety terms. CAPS, ADA, HCBS, SafeScore, and more.',
  openGraph: {
    title: 'Aging-in-Place Glossary: Terms & Definitions',
    description: 'Plain-English definitions of aging-in-place and home modification terms.',
  },
};

const TERMS = [
  {
    term: 'ADA (Americans with Disabilities Act)',
    definition: 'Federal law enacted in 1990 that prohibits discrimination against people with disabilities. In the context of home modifications, "ADA-compliant" typically refers to design standards for accessibility — such as grab bar placement heights (33–36 inches), ramp slopes (1:12 minimum), and doorway widths (32–36 inches). ADA standards are developed for public accommodations and commercial buildings but are widely adopted as best-practice guidelines for residential accessibility modifications.',
    related: ['CAPS', 'Universal Design'],
  },
  {
    term: 'Aging in Place',
    definition: 'The ability to live in your own home and community safely, independently, and comfortably regardless of age, income, or ability level. Aging in place typically involves a combination of home modifications, assistive technology, and community support services that allow older adults to remain at home rather than move to assisted living or a nursing facility.',
    related: ['CAPS', 'Universal Design', 'Home Modification'],
  },
  {
    term: 'Area Agency on Aging (AAA)',
    definition: 'A federally funded local agency that plans and coordinates home and community-based services for older adults (typically 60+). AAAs provide or coordinate services including home modification assistance, transportation, meal delivery, and caregiver support. To find your local AAA, call the Eldercare Locator at 1-800-677-1116 or visit eldercare.acl.gov. Many AAAs offer free or subsidized grab bar installation and other modifications for income-qualified seniors.',
    related: ['HCBS', 'Medicaid Waiver'],
  },
  {
    term: 'AutoAlert / Fall Detection',
    definition: 'A feature available on many medical alert systems that automatically detects a fall using accelerometers and algorithms, then initiates a call to the monitoring center without the user needing to press a button. Accuracy varies by brand, typically detecting 70–85% of falls. Fall detection usually adds $5–$10/month to a medical alert subscription. Particularly important for users who may be unconscious, disoriented, or unable to press the button after a fall.',
    related: ['Medical Alert System', 'PERS'],
  },
  {
    term: 'CAPS (Certified Aging-in-Place Specialist)',
    definition: 'A professional designation from the National Association of Home Builders (NAHB) earned through a multi-day training program covering aging-in-place design, universal design principles, and the specific physical needs of older adults and people with disabilities. CAPS-certified contractors, architects, and designers have demonstrated knowledge of home modification techniques, ADA guidelines, and working with older clients. The designation is verifiable through NAHB.',
    related: ['NAHB', 'Universal Design', 'Home Modification'],
  },
  {
    term: 'Curved Stairlift',
    definition: 'A stairlift designed for staircases that have bends, curves, landings, or irregular shapes. Curved stairlifts require a custom-fabricated rail built specifically to the dimensions of your staircase. Because of the custom manufacturing, curved stairlifts cost $8,000–$15,000 installed — significantly more than straight stairlifts ($2,000–$5,000). Curved rails cannot be reused on a different staircase.',
    related: ['Stairlift', 'Straight Stairlift'],
  },
  {
    term: 'DIY Install',
    definition: 'A product that can be safely installed by a homeowner without professional assistance. In home safety products, grab bars are typically professional-install (they must be anchored into studs or with rated anchors), while transfer benches, shower chairs, and non-slip mats are DIY-install. Stairlifts, walk-in tubs, and home elevators always require professional installation. Our product ratings include a DIY Install indicator for each product.',
    related: ['CAPS'],
  },
  {
    term: 'Durable Medical Equipment (DME)',
    definition: 'Medical equipment that can withstand repeated use, is primarily and customarily used for a medical purpose, and is generally not useful to a person in the absence of illness or injury. Under Medicare, DME includes wheelchairs, walkers, hospital beds, and nebulizers. Stairlifts and home modifications are NOT classified as DME and are therefore not covered by standard Medicare Parts A and B. Some Medicare Advantage plans include home modification benefits separately.',
    related: ['Medicare', 'Medicare Advantage'],
  },
  {
    term: 'Fall Detection',
    definition: 'See AutoAlert / Fall Detection.',
    related: ['Medical Alert System', 'AutoAlert'],
  },
  {
    term: 'Fast-Drain Technology',
    definition: 'A feature in walk-in tubs that speeds up drainage. Because walk-in tubs require the user to remain inside while the tub drains (to keep the watertight door closed), fast drain is an important comfort and safety feature. Standard drains take 5–8 minutes. Fast-drain systems (using gravity-assisted or larger drain valves) can drain in 2–3 minutes. Premium fast-drain systems (like the Safe Step 7100) drain in under 2 minutes.',
    related: ['Walk-In Tub', 'Step-Over Height'],
  },
  {
    term: 'Grab Bar',
    definition: 'A wall-mounted bar designed to provide support for standing, sitting, or balancing — most commonly installed in bathrooms near the toilet and in the shower. ADA-compliant grab bars are rated to support at least 250 lbs when properly installed into wall studs or with approved anchors. Grab bars must never be anchored in drywall alone. The most impactful and cost-effective home safety modification for fall prevention.',
    related: ['ADA', 'CAPS', 'SecureMount'],
  },
  {
    term: 'HCBS (Home and Community-Based Services)',
    definition: 'A category of Medicaid-funded services that help people with disabilities and older adults remain in their homes and communities rather than moving to institutional care. Many states have HCBS Medicaid waiver programs that fund home modifications (grab bars, ramps, stairlifts, walk-in tubs) for income-eligible individuals. Eligibility and covered services vary significantly by state. Contact your state Medicaid office or Area Agency on Aging to apply.',
    related: ['Medicaid Waiver', 'Area Agency on Aging'],
  },
  {
    term: 'HISA Grant (Home Improvements and Structural Alterations)',
    definition: 'A VA-funded grant available to veterans to pay for permanent structural improvements to their primary residence. Veterans with service-connected disabilities may receive up to $6,800; veterans with non-service-connected disabilities may receive up to $2,000. Eligible modifications include ramps, roll-in showers, widened doorways, and other accessibility improvements. Apply through your VA regional office or VA social worker.',
    related: ['SAH Grant', 'SHA Grant', 'VA Benefits'],
  },
  {
    term: 'Home Elevator',
    definition: 'A fully enclosed vertical transportation device installed in a home to move between floors. Unlike stairlifts (which travel along a rail on the stairs), home elevators move vertically in a dedicated cab. Traditional residential elevators require a shaft (either existing space or new construction). Pneumatic or vacuum elevators (like the Savaria Vuelift) are freestanding and do not require a dedicated shaft. Home elevators cost $15,000–$40,000+ installed and are the preferred solution for wheelchair users.',
    related: ['Vertical Platform Lift', 'Stairlift', 'Pneumatic Elevator'],
  },
  {
    term: 'Home Modification',
    definition: 'Any physical change to a home designed to improve safety, accessibility, or adaptability for people with disabilities or older adults. Common modifications include grab bar installation, ramp construction, stairlift installation, walk-in tub installation, widened doorways, lowered countertops, and improved lighting. Major modifications typically require a licensed contractor; some modifications (shower chairs, non-slip mats) can be self-installed.',
    related: ['CAPS', 'Aging in Place', 'Universal Design'],
  },
  {
    term: 'Medicaid Waiver',
    definition: 'A Medicaid-funded program that allows states to provide services and supports to people who would otherwise require institutional care (nursing homes). Many states operate Home and Community-Based Services (HCBS) waiver programs that fund home modifications. Coverage, eligibility requirements, and application processes vary by state. Common names for these programs include PACE, CHOICES, and Community First Choice. Contact your local Area Agency on Aging for the programs available in your state.',
    related: ['HCBS', 'Area Agency on Aging'],
  },
  {
    term: 'Medicare Advantage (Part C)',
    definition: 'Private health insurance plans that provide Medicare benefits, often with additional supplemental coverage. Some Medicare Advantage plans include "healthy home," "home safety," or "home modification" supplemental benefits that cover items like grab bars, stairlifts, and bath safety equipment — coverage that standard Medicare Parts A and B do not provide. Dollar limits and covered items vary significantly by plan. Call your plan\'s member services line and ask specifically about home modification or home safety benefits.',
    related: ['Medicare', 'DME'],
  },
  {
    term: 'NAHB (National Association of Home Builders)',
    definition: 'The US trade association for the home building industry. NAHB administers the CAPS (Certified Aging-in-Place Specialist) certification program and develops educational resources for residential construction professionals on aging-in-place design.',
    related: ['CAPS'],
  },
  {
    term: 'PERS (Personal Emergency Response System)',
    definition: 'A wearable device (typically a pendant or wristband) connected to a monitoring center that allows a user to call for help by pressing a button. Also commonly called a "medical alert system." Home-based PERS use a base station connected by cellular or landline; GPS-enabled PERS work anywhere with cellular coverage. Standard Medicare does not cover PERS, but some Medicare Advantage plans do.',
    related: ['Medical Alert System', 'AutoAlert'],
  },
  {
    term: 'Roll-In Shower',
    definition: 'A curbless (zero-threshold) shower designed to accommodate wheelchairs — the user can roll directly in without stepping over any barrier. ADA guidelines for roll-in showers require a minimum 60 x 30 inch shower space and a 60-inch turning radius in the bathroom. Roll-in showers are the safest bathroom configuration for wheelchair users and for fall prevention in general. A roll-in shower conversion typically costs $6,000–$15,000.',
    related: ['Walk-In Shower', 'ADA', 'Universal Design'],
  },
  {
    term: 'SAH Grant (Specially Adapted Housing)',
    definition: 'A VA grant for veterans with specific service-connected disabilities (such as loss of limb, blindness, or certain spinal cord injuries) to purchase or adapt a home. Maximum grant amount in 2024 is $109,986. This is the largest home modification benefit available to veterans and can fund comprehensive accessibility modifications including elevators, ramps, and full bathroom remodels. Apply through your VA regional office.',
    related: ['SHA Grant', 'HISA Grant', 'VA Benefits'],
  },
  {
    term: 'SafeScore™',
    definition: 'SafeAtHome Guide\'s proprietary independent product rating system. Each product receives a 0–100 SafeScore based on four equally weighted dimensions: safety features (fall prevention, stability, failure modes), ease of use (user interface, adjustability, independence), installation quality (installation difficulty, anchor strength, longevity), and value (cost vs. performance). Products are never paid to receive higher scores.',
    related: [],
  },
  {
    term: 'SHA Grant (Special Housing Adaptation)',
    definition: 'A VA grant for veterans with service-connected disabilities that affect the hands or arms. Maximum grant amount in 2024 is $22,036. Can be used to purchase an adapted home or modify an existing home. Apply through your VA regional office.',
    related: ['SAH Grant', 'HISA Grant', 'VA Benefits'],
  },
  {
    term: 'Stairlift',
    definition: 'A motorized chair that travels along a rail mounted to a staircase to transport a user between floors. Stairlifts are available for straight staircases ($2,000–$5,000 installed) and curved or irregular staircases (custom rail, $8,000–$15,000). Standard features include a swivel seat, footrest, and remote controls. Key options include battery backup, foldable rails, and heavier-duty models for users over 300 lbs.',
    related: ['Curved Stairlift', 'Straight Stairlift', 'CAPS'],
  },
  {
    term: 'Step-Over Height',
    definition: 'The height of the door threshold in a walk-in tub — the amount the user must step over to enter the tub. Lower is safer. Standard walk-in tubs have a 6–7 inch threshold. Better models reduce this to 3–4 inches. ADA guidelines suggest step-over heights under 4 inches for bathing facilities. Step-over height is one of the most important safety specifications when selecting a walk-in tub.',
    related: ['Walk-In Tub', 'Fast-Drain Technology'],
  },
  {
    term: 'Transfer Bench',
    definition: 'A bath safety device that straddles the bathtub wall — half inside and half outside the tub. The user sits on the outside portion and slides across the bench into the tub without stepping over the rim. Transfer benches eliminate the most dangerous part of tub bathing for seniors. They are a lower-cost alternative to a walk-in tub for users whose primary issue is stepping over the tub edge. Most transfer benches are freestanding and require no installation.',
    related: ['Walk-In Tub', 'Bath Safety'],
  },
  {
    term: 'Universal Design',
    definition: 'An approach to designing buildings, products, and environments to be usable by all people, regardless of age, disability, or other factors — without the need for adaptation or specialized design. In residential settings, universal design principles include: zero-threshold entries, lever handles (vs. knobs), 36-inch wide doorways, single-floor living layouts, and accessible bathrooms. CAPS-certified contractors are trained in universal design principles.',
    related: ['CAPS', 'ADA', 'Aging in Place'],
  },
  {
    term: 'Vertical Platform Lift (VPL)',
    definition: 'A motorized platform that moves vertically between two floor levels. VPLs are less expensive ($3,500–$8,500) than full residential elevators and do not require a dedicated shaft. They are open or semi-enclosed (not a fully enclosed cab like an elevator) and have a lower weight capacity (typically 750 lbs). VPLs are a practical solution for wheelchair users who need to navigate a single floor-to-floor rise, especially in retrofits.',
    related: ['Home Elevator', 'Stairlift'],
  },
  {
    term: 'Walk-In Shower',
    definition: 'A shower enclosure with a low or zero threshold that can be entered by walking in (as opposed to stepping over a tub rim). Walk-in showers differ from roll-in showers in that they may have a small curb (up to 2 inches). Walk-in shower conversions (replacing a standard tub) typically cost $1,500–$8,000 depending on whether a prefab unit or custom tile is used.',
    related: ['Roll-In Shower', 'Walk-In Tub'],
  },
  {
    term: 'Walk-In Tub',
    definition: 'A bathtub with a watertight door built into the side, allowing entry without stepping over the tub rim. The door must remain closed while the tub is filled, which means the user enters before filling and waits inside until the tub drains. Key specifications to compare: step-over height (lower is better), drain speed, jet type (air vs. water), and tub size. Walk-in tubs typically cost $2,500–$8,000 installed.',
    related: ['Step-Over Height', 'Fast-Drain Technology', 'Transfer Bench'],
  },
  {
    term: 'Wheelchair Ramp',
    definition: 'An inclined surface connecting different levels to provide access for wheelchair users, scooter users, or people who have difficulty with steps. ADA guidelines recommend a maximum slope of 1:12 (one inch of rise per foot of ramp length). Portable folding ramps are available for temporary needs and travel. Modular aluminum ramp systems provide durable, removable solutions. Permanent concrete or wood ramps offer maximum durability but require permits in most jurisdictions.',
    related: ['ADA', 'CAPS'],
  },
];

// Group alphabetically
const GROUPED: Record<string, typeof TERMS> = {};
TERMS.forEach(t => {
  const letter = t.term[0].toUpperCase();
  if (!GROUPED[letter]) GROUPED[letter] = [];
  GROUPED[letter].push(t);
});

export default function GlossaryPage() {
  const letters = Object.keys(GROUPED).sort();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} style={{ color: '#1B4332' }} />
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>Reference</span>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
        Aging-in-Place Glossary
      </h1>
      <p className="text-gray-500 text-lg mb-10 max-w-2xl">
        Plain-English definitions of the terms you&apos;ll encounter when researching home safety modifications, contractors, and financial assistance programs.
      </p>

      {/* Alpha jump nav */}
      <div className="flex flex-wrap gap-2 mb-10">
        {letters.map(l => (
          <a
            key={l}
            href={`#letter-${l}`}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold border border-gray-200 hover:border-green-700 hover:text-green-800 transition-colors"
          >
            {l}
          </a>
        ))}
      </div>

      {/* Terms */}
      <div className="space-y-10">
        {letters.map(letter => (
          <section key={letter} id={`letter-${letter}`}>
            <h2
              className="font-serif text-2xl font-bold mb-5 pb-2 border-b"
              style={{ color: '#1B4332', borderColor: '#1B4332' }}
            >
              {letter}
            </h2>
            <div className="space-y-6">
              {GROUPED[letter].map(term => (
                <div key={term.term} className="scroll-mt-20">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{term.term}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">{term.definition}</p>
                  {term.related.length > 0 && (
                    <p className="text-xs text-gray-400">
                      See also:{' '}
                      {term.related.map((r, i) => (
                        <span key={r}>
                          <a
                            href={`#letter-${r[0].toUpperCase()}`}
                            className="hover:underline"
                            style={{ color: '#1B4332' }}
                          >
                            {r}
                          </a>
                          {i < term.related.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-xl p-6 border border-gray-100 text-center" style={{ backgroundColor: '#F5F5F0' }}>
        <p className="font-semibold text-gray-800 mb-2">Ready to get started?</p>
        <p className="text-sm text-gray-500 mb-4">Browse products, find a CAPS contractor, or take our free home assessment.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/products" className="px-5 py-2.5 rounded-lg font-semibold text-sm border-2" style={{ borderColor: '#1B4332', color: '#1B4332' }}>Browse Products</Link>
          <Link href="/contractors" className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white" style={{ backgroundColor: '#D97706' }}>Find a Contractor</Link>
        </div>
      </div>
    </main>
  );
}
