'use client';

import Link from 'next/link';
import { SafeScore } from './SafeScore';
import { buildAffiliateUrl } from '@/lib/affiliate';
import { CheckCircle, XCircle, Minus } from 'lucide-react';

interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price_min?: number;
  price_max?: number;
  safe_score?: number;
  safe_score_breakdown?: Record<string, number>;
  pros?: string[];
  cons?: string[];
  specs?: Record<string, string>;
  affiliate_url?: string;
  affiliate_network?: string;
  diy_installable?: boolean;
  warranty_years?: number;
}

interface ComparisonTableProps {
  products: Product[];
}

const COMPARE_ROWS: { key: string; label: string; type: 'price' | 'score' | 'spec' | 'bool' }[] = [
  { key: 'safe_score', label: 'SafeScore™', type: 'score' },
  { key: 'price', label: 'Price Range', type: 'price' },
  { key: 'diy_installable', label: 'DIY Install', type: 'bool' },
  { key: 'warranty_years', label: 'Warranty', type: 'spec' },
];

function priceStr(p: Product) {
  if (p.price_min && p.price_max) return `$${p.price_min.toLocaleString()} – $${p.price_max.toLocaleString()}`;
  if (p.price_min) return `From $${p.price_min.toLocaleString()}`;
  if (p.price_max) return `Up to $${p.price_max.toLocaleString()}`;
  return '—';
}

function BoolCell({ val }: { val: boolean | undefined | null }) {
  if (val === true) return <CheckCircle size={18} style={{ color: '#1B4332' }} className="mx-auto" />;
  if (val === false) return <XCircle size={18} className="mx-auto text-red-400" />;
  return <Minus size={18} className="mx-auto text-gray-300" />;
}

export function ComparisonTable({ products }: ComparisonTableProps) {
  if (!products.length) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm border-collapse min-w-[600px]">
        <thead>
          <tr style={{ backgroundColor: '#1B4332' }}>
            <th className="text-left py-3 px-4 text-white font-semibold w-32">Feature</th>
            {products.map(p => (
              <th key={p.slug} className="py-3 px-4 text-center text-white font-semibold">
                <div className="text-xs font-normal opacity-75 mb-0.5">{p.brand}</div>
                <div className="font-semibold leading-tight">{p.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row, i) => (
            <tr key={row.key} style={{ backgroundColor: i % 2 === 0 ? '#FAFAF7' : '#fff' }}>
              <td className="py-3 px-4 font-medium text-gray-600">{row.label}</td>
              {products.map(p => (
                <td key={p.slug} className="py-3 px-4 text-center font-mono text-gray-800">
                  {row.type === 'score' && p.safe_score ? (
                    <SafeScore score={p.safe_score} size="sm" />
                  ) : row.type === 'price' ? (
                    <span className="font-mono" style={{ color: '#1B4332' }}>{priceStr(p)}</span>
                  ) : row.type === 'bool' ? (
                    <BoolCell val={(p as unknown as Record<string, boolean | undefined | null>)[row.key] as boolean | undefined | null} />
                  ) : (
                    <span>{(p as unknown as Record<string, string | number | undefined>)[row.key] != null
                      ? `${(p as unknown as Record<string, string | number | undefined>)[row.key]}${row.key === 'warranty_years' ? ' yr' : ''}`
                      : '—'}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}

          {/* Pros */}
          <tr style={{ backgroundColor: '#f0fdf4' }}>
            <td className="py-3 px-4 font-medium text-gray-600 align-top">Top Pros</td>
            {products.map(p => (
              <td key={p.slug} className="py-3 px-4 align-top">
                {p.pros?.slice(0, 3).map((pro, i) => (
                  <div key={i} className="flex items-start gap-1.5 mb-1 text-xs text-gray-700">
                    <CheckCircle size={13} className="shrink-0 mt-0.5" style={{ color: '#1B4332' }} />
                    {pro}
                  </div>
                ))}
              </td>
            ))}
          </tr>

          {/* Cons */}
          <tr style={{ backgroundColor: '#fff5f5' }}>
            <td className="py-3 px-4 font-medium text-gray-600 align-top">Main Cons</td>
            {products.map(p => (
              <td key={p.slug} className="py-3 px-4 align-top">
                {p.cons?.slice(0, 2).map((con, i) => (
                  <div key={i} className="flex items-start gap-1.5 mb-1 text-xs text-gray-700">
                    <XCircle size={13} className="shrink-0 mt-0.5 text-red-400" />
                    {con}
                  </div>
                ))}
              </td>
            ))}
          </tr>

          {/* Spec rows if any products have specs */}
          {products.some(p => p.specs) &&
            [...new Set(products.flatMap(p => Object.keys(p.specs || {})))].slice(0, 5).map((specKey, i) => (
              <tr key={specKey} style={{ backgroundColor: i % 2 === 0 ? '#FAFAF7' : '#fff' }}>
                <td className="py-3 px-4 font-medium text-gray-600 capitalize">{specKey.replace(/_/g, ' ')}</td>
                {products.map(p => (
                  <td key={p.slug} className="py-3 px-4 text-center text-gray-700">
                    {p.specs?.[specKey] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          }

          {/* CTA row */}
          <tr style={{ backgroundColor: '#fff' }}>
            <td className="py-4 px-4" />
            {products.map(p => {
              const affiliateUrl = p.affiliate_url
                ? buildAffiliateUrl(p.affiliate_url, p.affiliate_network || 'direct', p.slug)
                : null;
              return (
                <td key={p.slug} className="py-4 px-4 text-center">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/products/${p.category}/${p.slug}`}
                      className="block py-2 px-3 rounded-lg text-xs font-semibold border-2 transition-colors text-center"
                      style={{ borderColor: '#1B4332', color: '#1B4332' }}
                    >
                      Full Review
                    </Link>
                    {affiliateUrl && (
                      <a
                        href={affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="block py-2 px-3 rounded-lg text-xs font-semibold text-white text-center transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#D97706' }}
                      >
                        See Price
                      </a>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
