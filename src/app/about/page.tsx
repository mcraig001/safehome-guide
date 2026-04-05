import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Star, Users, CheckCircle, BookOpen, BarChart2, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About SafeAtHome Guide — How We Review & Rate Products',
  description: 'How SafeAtHome Guide researches and rates home safety products for seniors. Our SafeScore™ methodology, editorial standards, and affiliate disclosure.',
  openGraph: {
    title: 'About SafeAtHome Guide — How We Review & Rate Products',
    description: 'Our SafeScore™ methodology, editorial process, and what makes our ratings different from sponsored content.',
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={18} style={{ color: '#1B4332' }} />
          <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>About Us</span>
        </div>
        <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
          About SafeAtHome Guide
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          We help families make confident, informed decisions about home safety products and modifications
          for aging in place — without the sponsored rankings and marketing spin that dominate this category.
        </p>
      </div>

      {/* Mission */}
      <section className="rounded-2xl p-8 mb-12" style={{ backgroundColor: '#F5F5F0' }}>
        <h2 className="font-serif text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Why We Exist</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Every day, families face urgent decisions about stairlifts, walk-in tubs, grab bars, and home modifications
          — often under time pressure after a fall or hospitalization. The information they find online is overwhelmingly
          written by companies trying to sell products, SEO firms publishing hollow content, or affiliate sites that rank
          whatever pays the highest commission.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          SafeAtHome Guide exists to change that. We research products thoroughly, score them on the factors that
          actually matter for safety, and tell you the truth about costs, limitations, and which products are
          worth buying for your specific situation.
        </p>
        <p className="text-gray-700 leading-relaxed">
          We consult occupational therapists and CAPS-certified specialists on our product recommendations.
          Our ratings are based on a consistent methodology — not on who pays us more.
        </p>
      </section>

      {/* SafeScore Methodology */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={20} style={{ color: '#1B4332' }} />
          <h2 className="font-serif text-2xl font-semibold" style={{ color: '#1A1A1A' }}>The SafeScore™ Methodology</h2>
        </div>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Every product in our directory receives a SafeScore from 0–100. The score is the sum of four equally-weighted
          dimensions, each scored 0–25. Here&apos;s exactly how we evaluate each dimension:
        </p>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {[
            {
              dimension: 'Safety',
              points: '0–25',
              color: '#1B4332',
              desc: 'Does the product actively reduce fall and injury risk? We evaluate weight ratings, material quality, stability testing, safety certifications (UL, ANSI, ADA compliance), and known failure modes reported in consumer data.',
              criteria: ['Weight/load rating and safety margin', 'ADA/ANSI compliance', 'Materials (corrosion, wear resistance)', 'Known safety incidents or recalls'],
            },
            {
              dimension: 'Ease of Use',
              points: '0–25',
              color: '#1B4332',
              desc: 'Can an older adult with limited mobility or dexterity use this independently? We consider controls, grip requirements, cognitive load, and how the product performs for users with arthritis, limited vision, or reduced strength.',
              criteria: ['Control simplicity and labeling clarity', 'Physical demands (grip, reach, force)', 'Cognitive complexity', 'User reviews from seniors (not general population)'],
            },
            {
              dimension: 'Installation',
              points: '0–25',
              color: '#D97706',
              desc: 'How disruptive, complex, and costly is professional installation? Can it be done without structural modification? We factor in typical install time, contractor availability, and whether the installation is reversible.',
              criteria: ['Structural modification required', 'Install time and complexity', 'Reversibility (for renters/temporary needs)', 'Typical labor cost as % of product cost'],
            },
            {
              dimension: 'Value',
              points: '0–25',
              color: '#D97706',
              desc: 'Does the product deliver meaningful safety benefit relative to its price? We compare within-category alternatives and weigh features, warranty length, ongoing costs (monitoring fees, maintenance), and long-term reliability.',
              criteria: ['Price vs. category average', 'Warranty length and coverage', 'Ongoing costs (subscriptions, maintenance)', 'Reported durability over 3–5 years'],
            },
          ].map((dim) => (
            <div key={dim.dimension} className="rounded-xl border border-gray-100 p-6 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-900">{dim.dimension}</h3>
                <span className="font-mono text-sm font-semibold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: dim.color }}>
                  {dim.points} pts
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{dim.desc}</p>
              <ul className="space-y-1">
                {dim.criteria.map(c => (
                  <li key={c} className="flex items-start gap-2 text-xs text-gray-500">
                    <CheckCircle size={13} className="shrink-0 mt-0.5" style={{ color: dim.color }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Score legend */}
        <div className="rounded-xl border border-gray-100 p-5" style={{ backgroundColor: '#F5F5F0' }}>
          <h3 className="font-semibold text-gray-800 mb-3">Score Interpretation</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { range: '80–100', label: 'Excellent', color: '#1B4332', desc: 'Best-in-class across most dimensions. Strong recommendation for most buyers.' },
              { range: '60–79', label: 'Good', color: '#D97706', desc: 'Solid choice with meaningful trade-offs. Read the breakdown before deciding.' },
              { range: '0–59', label: 'Fair', color: '#DC2626', desc: 'Notable limitations in safety, ease of use, or value. Proceed carefully.' },
            ].map(s => (
              <div key={s.range} className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-lg" style={{ color: s.color }}>{s.range}</span>
                  <span className="font-semibold text-sm" style={{ color: s.color }}>{s.label}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial standards */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={20} style={{ color: '#1B4332' }} />
          <h2 className="font-serif text-2xl font-semibold" style={{ color: '#1A1A1A' }}>Editorial Standards</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: <Shield size={20} style={{ color: '#1B4332' }} />,
              title: 'No Pay-to-Play Rankings',
              desc: 'Products are ranked by SafeScore — not by commission rate. A product we earn no affiliate commission on can rank #1 if it has the highest score. Our editorial team and business team are separated.'
            },
            {
              icon: <Star size={20} style={{ color: '#D97706' }} />,
              title: 'Independent Research Process',
              desc: 'We research manufacturer specifications, clinical studies, CPSC safety data, and thousands of verified consumer reviews. Where possible, we consult certified occupational therapists and CAPS specialists.'
            },
            {
              icon: <Award size={20} style={{ color: '#1B4332' }} />,
              title: 'CAPS-Certified Contractor Directory',
              desc: 'Our contractor directory lists CAPS-certified professionals who have completed NAHB\'s Certified Aging-in-Place Specialist training. We verify certifications before listing. Basic listing is free for qualifying contractors.'
            },
            {
              icon: <Users size={20} style={{ color: '#1B4332' }} />,
              title: 'Regular Review Updates',
              desc: 'Products are re-evaluated annually or when a manufacturer releases a significant model update. Guides are updated when cost data, insurance coverage rules, or best practices change. The "Last Updated" date on each page reflects the most recent review.'
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
      <section className="rounded-2xl border border-amber-100 p-6 mb-12" style={{ backgroundColor: '#FFFBF0' }}>
        <h2 className="font-semibold text-gray-900 mb-2">Affiliate & Advertising Disclosure</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          SafeAtHome Guide earns affiliate commissions when you click links to products and make a purchase.
          This is how we fund our research and keep the site free. Our affiliate relationships <strong>do not influence
          our ratings or rankings</strong> — products are ranked by SafeScore regardless of commission rate.
          We are a participant in the Amazon Services LLC Associates Program and work with other affiliate
          networks including Impact.com.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Contractors may pay for premium placement in our directory, but placement tier does not affect
          our editorial content or SafeScore ratings. Paid placements are clearly labeled.
          For more, see our full <Link href="/privacy" className="underline" style={{ color: '#1B4332' }}>Privacy Policy</Link> and <Link href="/terms" className="underline" style={{ color: '#1B4332' }}>Terms of Use</Link>.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>Contact & Corrections</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Found a factual error? Have a correction to suggest? We take accuracy seriously and will investigate
          and update content when warranted. Reach us at{' '}
          <a href="mailto:hello@safeathomeguides.com" className="font-medium underline" style={{ color: '#1B4332' }}>
            hello@safeathomeguides.com
          </a>.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Contractors wishing to list their practice in our directory, or manufacturers who believe a product
          rating contains an error, may use the same address. All correction requests are reviewed by our
          editorial team, not the business team.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center py-10 rounded-2xl" style={{ backgroundColor: '#1B4332' }}>
        <h2 className="font-serif text-2xl font-semibold mb-2 text-white">
          Ready to find the right product?
        </h2>
        <p className="text-green-200 mb-6">Take our 2-minute home assessment for a personalized recommendation.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/assess"
            className="px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#D97706' }}
          >
            Take the Free Home Assessment
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 rounded-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-green-900 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </section>
    </main>
  );
}
