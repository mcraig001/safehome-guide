import { supabase } from '@/lib/supabase';
import { SafeScore } from '@/components/SafeScore';
import { LeadForm } from '@/components/LeadForm';
import { buildAffiliateUrl } from '@/lib/affiliate';
import { productSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface Props { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: p } = await supabase.from('sh_products').select('name, description, brand').eq('slug', slug).single();
  if (!p) return {};
  return {
    title: `${p.name} Review — ${p.brand}`,
    description: p.description?.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug, category } = await params;
  const { data: product } = await supabase
    .from('sh_products')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (!product) notFound();

  const affiliateUrl = product.affiliate_url
    ? buildAffiliateUrl(product.affiliate_url, product.affiliate_network || 'direct', slug)
    : null;

  const schema = productSchema(product);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-gray-600 transition-colors">Products</Link>
        <ChevronRight size={14} />
        <Link href={`/products/${category}`} className="hover:text-gray-600 transition-colors capitalize">
          {category.replace(/-/g, ' ')}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <p className="text-sm text-gray-400 mb-1 uppercase tracking-wide">{product.brand}</p>
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>{product.name}</h1>

          <div className="flex items-center gap-6 mb-6">
            {product.safe_score && (
              <SafeScore score={product.safe_score} breakdown={product.safe_score_breakdown} size="lg" />
            )}
            <div>
              {(product.price_min || product.price_max) && (
                <p className="font-mono text-2xl font-semibold" style={{ color: '#1B4332' }}>
                  {product.price_min && product.price_max
                    ? `$${product.price_min.toLocaleString()} – $${product.price_max.toLocaleString()}`
                    : product.price_min
                    ? `From $${product.price_min.toLocaleString()}`
                    : `Up to $${product.price_max!.toLocaleString()}`}
                </p>
              )}
              {affiliateUrl && (
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-2 inline-block px-6 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#D97706' }}
                >
                  Check Current Price →
                </a>
              )}
            </div>
          </div>

          {product.long_description && (
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">{product.long_description}</p>
            </div>
          )}

          {(product.pros || product.cons) && (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {product.pros && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold mb-3" style={{ color: '#1B4332' }}>Pros</h3>
                  <ul className="space-y-2">
                    {(product.pros as string[]).map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: '#1B4332' }} />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {product.cons && (
                <div className="bg-red-50 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-red-700">Cons</h3>
                  <ul className="space-y-2">
                    {(product.cons as string[]).map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <XCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {product.specs && (
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-semibold mb-4">Specifications</h2>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {Object.entries(product.specs as Record<string, string>).map(([key, val]) => (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium text-gray-600 w-1/3 capitalize">{key.replace(/_/g, ' ')}</td>
                      <td className="py-2 text-gray-800">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Compare link */}
          <div className="mb-4">
            <Link
              href={`/products/${category}`}
              className="text-sm font-medium hover:underline"
              style={{ color: '#1B4332' }}
            >
              ← See all {category.replace(/-/g, ' ')} reviews
            </Link>
          </div>
        </div>

        <aside className="space-y-6">
          <Suspense>
            <LeadForm category={category} headline="Get Installation Quotes" />
          </Suspense>
        </aside>
      </div>
    </main>
  );
}
