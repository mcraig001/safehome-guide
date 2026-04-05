import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, BarChart2, Users, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Advertise on SafeAtHome Guide',
  description: 'Reach families actively researching stairlifts, walk-in tubs, and aging-in-place home safety products. Advertising and listing options for manufacturers, retailers, and contractors.',
};

const stats = [
  { label: 'Monthly visitors', value: 'Growing' },
  { label: 'Avg. time on site', value: '4+ min' },
  { label: 'Primary audience', value: 'Families 45–75' },
  { label: 'Purchase intent', value: 'High' },
];

const options = [
  {
    icon: <Star size={22} style={{ color: '#D97706' }} />,
    title: 'Featured Product Listing',
    desc: 'Get your product featured on the homepage and relevant category pages with a SafeScore™ badge. Includes a full product review page with affiliate link.',
    cta: 'Inquire about listing',
  },
  {
    icon: <BarChart2 size={22} style={{ color: '#1B4332' }} />,
    title: 'Comparison Placement',
    desc: 'Appear in our comparison pages alongside independently rated competitors. Products are still scored by SafeScore™ — we don\'t sell rankings.',
    cta: 'Learn more',
  },
  {
    icon: <Users size={22} style={{ color: '#1B4332' }} />,
    title: 'CAPS Contractor Premium Listing',
    desc: 'Contractors can upgrade to a premium listing with phone number, website link, service area highlights, and priority placement in city search results.',
    cta: 'Upgrade your listing',
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
          Reach families actively researching aging-in-place safety products — typically within 30–90 days of making a purchase decision.
        </p>
      </div>

      {/* Audience stats */}
      <section className="rounded-2xl p-8 mb-12" style={{ backgroundColor: '#F5F5F0' }}>
        <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>Our Audience</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-xl p-5 text-center border border-gray-100">
              <p className="font-mono text-2xl font-bold mb-1" style={{ color: '#1B4332' }}>{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Visitors arrive via organic search — searching for product comparisons, cost guides, and Medicare coverage information.
          Intent is high and commercial.
        </p>
      </section>

      {/* Advertising options */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>Advertising Options</h2>
        <div className="space-y-4">
          {options.map(opt => (
            <div key={opt.title} className="flex gap-5 p-6 rounded-xl border border-gray-100 bg-white">
              <div className="shrink-0 mt-0.5">{opt.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{opt.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{opt.desc}</p>
                <a
                  href="mailto:hello@safeathomeguides.com"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: '#1B4332' }}
                >
                  {opt.cta} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial policy */}
      <section className="rounded-2xl border border-amber-100 p-6 mb-10" style={{ backgroundColor: '#FFFBF0' }}>
        <h2 className="font-semibold text-gray-900 mb-2">Editorial Independence Policy</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          SafeAtHome Guide maintains strict editorial independence. Advertising and affiliate relationships do not influence
          SafeScore™ ratings or ranking positions. Products are ranked by score regardless of any commercial relationship.
          We will not publish a positive review of a product that scores poorly, nor will we suppress a negative finding for an advertiser.
          Sponsored content, where it exists, is clearly labeled.
        </p>
      </section>

      {/* Contact CTA */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Mail size={20} style={{ color: '#1B4332' }} />
          <span className="font-semibold text-gray-800">Get in touch</span>
        </div>
        <p className="text-gray-500 mb-6">
          For rates, audience data, and partnership details, email us directly.
        </p>
        <a
          href="mailto:hello@safeathomeguides.com"
          className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#1B4332' }}
        >
          hello@safeathomeguides.com
        </a>
        <p className="text-xs text-gray-400 mt-3">We respond within 1–2 business days.</p>
      </section>
    </main>
  );
}
