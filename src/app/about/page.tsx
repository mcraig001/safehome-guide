import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Star, Users, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About SafeAtHome Guide',
  description: 'We provide independent, honest reviews of aging-in-place home safety products — no paid rankings, no sponsored content.',
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
          About SafeAtHome Guide
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          We help families make confident, informed decisions about home safety products and modifications
          for aging in place — without the sponsored rankings and marketing spin that dominate this category.
        </p>
      </div>

      {/* Mission */}
      <section className="rounded-2xl p-8 mb-10" style={{ backgroundColor: '#F5F5F0' }}>
        <h2 className="font-serif text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Every day, families face urgent decisions about stairlifts, walk-in tubs, grab bars, and home modifications
          — often under time pressure after a fall or hospitalization. The information they find online is often
          written by companies trying to sell products, not by people trying to help families.
        </p>
        <p className="text-gray-700 leading-relaxed">
          SafeAtHome Guide was built to change that. We research products thoroughly, score them on safety and
          ease of use, and tell you the truth about costs, limitations, and which products are actually worth buying.
        </p>
      </section>

      {/* How we review */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>How We Review Products</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: <Shield size={20} style={{ color: '#1B4332' }} />,
              title: 'SafeScore™ Rating',
              desc: 'Every product gets a 0–100 SafeScore based on safety features, ease of use, installation quality, and value. We publish the full breakdown so you can see exactly how we scored it.'
            },
            {
              icon: <Star size={20} style={{ color: '#D97706' }} />,
              title: 'Independent Research',
              desc: 'We research manufacturer specs, clinical studies, and thousands of verified user reviews. We consult occupational therapists and certified aging-in-place specialists on product recommendations.'
            },
            {
              icon: <CheckCircle size={20} style={{ color: '#1B4332' }} />,
              title: 'No Pay-to-Play Rankings',
              desc: 'Products are ranked by SafeScore — not by who pays us more. Our affiliate relationships never influence our ratings. A product we earn no commission on can rank #1 if it\'s the best.'
            },
            {
              icon: <Users size={20} style={{ color: '#1B4332' }} />,
              title: 'CAPS-Certified Contractor Directory',
              desc: 'Our contractor directory lists only CAPS-certified professionals — contractors who have completed NAHB\'s Certified Aging-in-Place Specialist training. Listing is free for qualifying contractors.'
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-white">
              <div className="shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate disclosure */}
      <section className="rounded-2xl border border-amber-100 p-6 mb-10" style={{ backgroundColor: '#FFFBF0' }}>
        <h2 className="font-semibold text-gray-900 mb-2">Affiliate Disclosure</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          SafeAtHome Guide earns affiliate commissions when you click links to products and make a purchase.
          This is how we fund our research and keep the site free. Our affiliate relationships do not influence
          our ratings or recommendations — products are ranked by SafeScore regardless of commission rate.
          We are a participant in the Amazon Services LLC Associates Program, and we work with other affiliate
          networks including Impact.com.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="font-serif text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
          Ready to get started?
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/assess"
            className="px-6 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: '#1B4332' }}
          >
            Take the Free Home Assessment
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 rounded-lg font-semibold border-2"
            style={{ borderColor: '#1B4332', color: '#1B4332' }}
          >
            Browse Products
          </Link>
        </div>
      </section>
    </main>
  );
}
