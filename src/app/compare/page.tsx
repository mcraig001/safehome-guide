import Link from 'next/link';
import type { Metadata } from 'next';
import { BarChart2, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product Comparisons — Stairlifts, Walk-In Tubs & More',
  description: 'Side-by-side comparisons of the top home safety products. SafeScore™ rankings, price ranges, and expert verdicts.',
};

const comparisons = [
  {
    slug: 'best-stairlifts',
    title: 'Best Stairlifts of 2026: Compared and Ranked',
    description: 'Bruno vs Acorn vs Stannah vs AmeriGlide — side-by-side on price, safety, and warranty.',
    category: 'Stairlifts',
    icon: '🪜',
    productCount: 5,
  },
  {
    slug: 'best-walk-in-tubs',
    title: 'Best Walk-In Tubs of 2026: Compared',
    description: 'Safe Step vs American Standard vs Kohler — drain times, jet counts, and value.',
    category: 'Walk-In Tubs',
    icon: '🛁',
    productCount: 3,
  },
  {
    slug: 'best-grab-bars',
    title: 'Best Grab Bars of 2026',
    description: 'Moen SecureMount vs Delta vs Drive Medical — installation ease, weight ratings, and style.',
    category: 'Grab Bars',
    icon: '🔩',
    productCount: 3,
  },
  {
    slug: 'best-medical-alerts',
    title: 'Best Medical Alert Systems of 2026',
    description: 'Medical Guardian vs Bay Alarm vs Philips Lifeline — monthly cost, range, and monitoring quality.',
    category: 'Medical Alerts',
    icon: '🚨',
    productCount: 3,
  },
  {
    slug: 'best-rollator-walkers',
    title: 'Best Rollator Walkers of 2026',
    description: 'Drive Nitro vs Hugo Explore — weight, wheel size, and who each is best for.',
    category: 'Mobility Aids',
    icon: '🦽',
    productCount: 5,
  },
  {
    slug: 'best-bath-safety-products',
    title: 'Best Bath Safety Products of 2026',
    description: 'Shower chairs, transfer benches, and handheld showerheads — rated for safety, stability, and value.',
    category: 'Bath Safety',
    icon: '🚿',
    productCount: 5,
  },
  {
    slug: 'best-wheelchair-ramps',
    title: 'Best Wheelchair Ramps of 2026',
    description: 'Portable folding vs. modular aluminum vs. threshold ramps — all rated and compared.',
    category: 'Wheelchair Ramps',
    icon: '♿',
    productCount: 5,
  },
  {
    slug: 'best-smart-home-safety-devices',
    title: 'Best Smart Home Safety Devices for Seniors',
    description: 'Video doorbells, smart smoke detectors, and voice assistants — for aging in place.',
    category: 'Smart Home Safety',
    icon: '🏠',
    productCount: 5,
  },
  {
    slug: 'best-smart-door-locks',
    title: 'Best Smart Door Locks for Aging in Place',
    description: 'Keypad deadbolts, touchscreen locks, and garage door openers for seniors and caregivers.',
    category: 'Door Access',
    icon: '🔐',
    productCount: 5,
  },
];

export default function ComparePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={18} style={{ color: '#1B4332' }} />
          <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#1B4332' }}>Comparisons</span>
        </div>
        <h1 className="font-serif text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
          Product Comparisons
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Side-by-side comparisons of the top home safety products, ranked by SafeScore™.
          We do the research so you don&apos;t have to.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparisons.map((comp) => (
          <Link
            key={comp.slug}
            href={`/compare/${comp.slug}`}
            className="group bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-green-200 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{comp.icon}</span>
              <span className="text-xs text-gray-400 font-medium">{comp.productCount} products</span>
            </div>
            <h2 className="font-serif text-lg font-semibold mb-2 leading-tight group-hover:text-green-800 transition-colors" style={{ color: '#1A1A1A' }}>
              {comp.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4">{comp.description}</p>
            <div className="flex items-center gap-1 text-sm font-medium" style={{ color: '#1B4332' }}>
              Compare now <ChevronRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
