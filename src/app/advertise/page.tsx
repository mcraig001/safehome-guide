import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, BarChart2, Users, Star, CheckCircle, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Advertise on SafeAtHome Guide — Reach Senior Caregiving Families',
  description: 'Reach families actively researching stairlifts, walk-in tubs, and aging-in-place products. Advertising and CAPS contractor listing options with transparent pricing.',
  openGraph: {
    title: 'Advertise on SafeAtHome Guide',
    description: 'Reach high-intent families researching aging-in-place home safety products. Transparent pricing for contractor listings and product placements.',
  },
};

const CONTRACTOR_TIERS = [
  {
    name: 'Free Listing',
    price: '$0',
    period: '/month',
    color: '#6B7280',
    features: [
      'Business name and location',
      'Service categories listed',
      'CAPS certification badge',
      'Appears in city/state search results',
    ],
    cta: 'Already listed? Claim it',
    ctaHref: 'mailto:hello@safeathomeguides.com?subject=Claim my free listing',
    highlight: false,
  },
  {
    name: 'Premium Listing',
    price: '$49',
    period: '/month',
    color: '#D97706',
    features: [
      'Everything in Free, plus:',
      'Clickable phone number',
      'Website link',
      'Business description (250 words)',
      'Priority placement in search results',
      'Service area radius shown',
      'Response time badge',
    ],
    cta: 'Start 30-day free trial',
    ctaHref: 'mailto:hello@safeathomeguides.com?subject=Premium listing inquiry',
    highlight: true,
  },
  {
    name: 'Featured Contractor',
    price: '$149',
    period: '/month',
    color: '#1B4332',
    features: [
      'Everything in Premium, plus:',
      'Featured placement on category pages',
      'Homepage "Featured Contractor" section',
      'Lead form integration (leads sent to you directly)',
      'Monthly performance report',
      'Customer review collection widget',
    ],
    cta: 'Inquire about Featured',
    ctaHref: 'mailto:hello@safeathomeguides.com?subject=Featured contractor inquiry',
    highlight: false,
  },
];

const PRODUCT_OPTIONS = [
  {
    icon: <Star size={22} style={{ color: '#D97706' }} />,
    title: 'Product Review & Listing',
    desc: 'Get your product reviewed and listed with a full SafeScore™ breakdown. Includes a dedicated product page, pros/cons, and affiliate link. Products are scored independently — we publish the score regardless of commercial relationship.',
    price: 'Contact for pricing',
  },
  {
    icon: <BarChart2 size={22} style={{ color: '#1B4332' }} />,
    title: 'Comparison Page Inclusion',
    desc: 'Appear in relevant "Best [Category]" comparison pages. Your product is scored alongside competitors. We will not fabricate a positive score — products rank by SafeScore™ only.',
    price: 'Contact for pricing',
  },
  {
    icon: <Shield size={22} style={{ color: '#1B4332' }} />,
    title: 'Sponsored Guide',
    desc: 'Fund a category guide (e.g., "Walk-In Shower Conversion Guide") that includes your product category. Sponsor label is clearly disclosed. Editorial content is not influenced by sponsorship.',
    price: 'Starting at $500/month',
  },
];

export default function AdvertisePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
          Advertise with SafeAtHome Guide
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
          Reach families actively researching aging-in-place safety products — typically within 30–90 days of a purchase decision.
          High-intent organic search traffic, no paid ads.
        </p>
      </div>

      {/* Audience stats */}
      <section className="rounded-2xl p-8 mb-12" style={{ backgroundColor: '#F5F5F0' }}>
        <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>Our Audience</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Primary audience', value: 'Ages 45–75' },
            { label: 'Avg. session', value: '4+ min' },
            { label: 'Purchase intent', value: 'Very High' },
            { label: 'Traffic source', value: 'Organic Search' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-5 text-center border border-gray-100">
              <p className="font-mono text-xl font-bold mb-1" style={{ color: '#1B4332' }}>{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          Visitors arrive via organic search — looking for product comparisons, cost guides, Medicare coverage details, and grant programs.
          This is a high-intent, research-mode audience actively planning a purchase or modification.
        </p>
      </section>

      {/* Contractor tiers */}
      <section className="mb-14">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-semibold mb-1" style={{ color: '#1A1A1A' }}>CAPS Contractor Listings</h2>
          <p className="text-gray-500">Connect with families searching for certified contractors in your area. All listing tiers require active CAPS certification.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {CONTRACTOR_TIERS.map(tier => (
            <div
              key={tier.name}
              className={`rounded-xl p-6 border-2 ${tier.highlight ? 'shadow-lg' : ''}`}
              style={{ borderColor: tier.highlight ? tier.color : '#e5e7eb', backgroundColor: tier.highlight ? '#fffbf0' : '#fff' }}
            >
              {tier.highlight && (
                <div
                  className="text-xs font-bold uppercase tracking-wide text-white px-2 py-0.5 rounded-full inline-block mb-3"
                  style={{ backgroundColor: tier.color }}
                >
                  Most Popular
                </div>
              )}
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-0.5 mb-4">
                <span className="font-mono text-3xl font-bold" style={{ color: tier.color }}>{tier.price}</span>
                <span className="text-sm text-gray-500">{tier.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="shrink-0 mt-0.5" style={{ color: tier.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={tier.ctaHref}
                className="block text-center py-2.5 px-4 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: tier.highlight ? tier.color : 'transparent', color: tier.highlight ? '#fff' : tier.color, border: tier.highlight ? 'none' : `2px solid ${tier.color}` }}
              >
                {tier.cta} →
              </a>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">All plans are month-to-month. Cancel anytime. 30-day free trial available for Premium.</p>
      </section>

      {/* Product/manufacturer options */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-5" style={{ color: '#1A1A1A' }}>Manufacturer & Retailer Options</h2>
        <div className="space-y-4">
          {PRODUCT_OPTIONS.map(opt => (
            <div key={opt.title} className="flex gap-5 p-6 rounded-xl border border-gray-100 bg-white">
              <div className="shrink-0 mt-0.5">{opt.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <h3 className="font-semibold text-gray-900">{opt.title}</h3>
                  <span className="text-sm font-mono font-semibold" style={{ color: '#1B4332' }}>{opt.price}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial independence */}
      <section className="rounded-2xl border border-amber-100 p-6 mb-10" style={{ backgroundColor: '#FFFBF0' }}>
        <h2 className="font-semibold text-gray-900 mb-2">Editorial Independence Policy</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Advertising and affiliate relationships <strong>do not influence SafeScore™ ratings or ranking positions</strong>.
          Products are ranked by score regardless of commercial relationship.
          We will not publish a favorable review of a poorly-scored product, nor suppress a critical finding for an advertiser.
          Sponsored content is clearly labeled per FTC guidelines.
          For more, see our <Link href="/about" className="underline" style={{ color: '#1B4332' }}>full editorial standards</Link>.
        </p>
      </section>

      {/* Contact CTA */}
      <section className="text-center rounded-2xl p-10" style={{ backgroundColor: '#1B4332' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Mail size={22} className="text-white" />
          <span className="font-semibold text-white text-lg">Let&apos;s talk</span>
        </div>
        <p className="text-green-200 mb-6 max-w-md mx-auto">
          For custom rates, audience data, or partnership details — email us directly. We respond within 1–2 business days.
        </p>
        <a
          href="mailto:hello@safeathomeguides.com?subject=Advertising inquiry"
          className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#D97706' }}
        >
          hello@safeathomeguides.com
        </a>
      </section>
    </main>
  );
}
