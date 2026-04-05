import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function scoreColor(score: number) {
  if (score >= 80) return '#1B4332';
  if (score >= 60) return '#D97706';
  return '#DC2626';
}

function scoreLabel(score: number) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Fair';
}

export default async function OGImage({ params }: { params: { slug: string; category: string } }) {
  const { data: product } = await supabase
    .from('sh_products')
    .select('name, brand, safe_score, price_min, price_max, description')
    .eq('slug', params.slug)
    .single();

  const name = product?.name ?? 'Product Review';
  const brand = product?.brand ?? '';
  const score = product?.safe_score ?? 0;
  const color = scoreColor(score);
  const label = scoreLabel(score);
  const priceStr = product?.price_min && product?.price_max
    ? `$${product.price_min.toLocaleString()} – $${product.price_max.toLocaleString()}`
    : product?.price_min ? `From $${product.price_min.toLocaleString()}` : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F5F5F0',
          padding: '64px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#1B4332', fontSize: '20px', fontWeight: 700 }}>SafeAtHome Guide</div>
          <div
            style={{
              backgroundColor: '#1B4332',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              padding: '6px 16px',
              borderRadius: '100px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Product Review
          </div>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '48px' }}>
          {/* SafeScore circle */}
          {score > 0 && (
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                border: `6px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: '48px', fontWeight: 700, color, fontFamily: 'monospace', lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace' }}>/100</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color, marginTop: '2px' }}>{label}</div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <div style={{ color: '#6B7280', fontSize: '20px', fontWeight: 600 }}>{brand}</div>
            <div style={{ color: '#1A1A1A', fontSize: name.length > 50 ? '42px' : '50px', fontWeight: 700, lineHeight: 1.1 }}>
              {name}
            </div>
            {priceStr && (
              <div style={{ color: '#1B4332', fontSize: '26px', fontWeight: 600, fontFamily: 'monospace', marginTop: '8px' }}>
                {priceStr}
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ color: '#9CA3AF', fontSize: '16px' }}>
          safeathomeguides.com · SafeScore™ Rated · Independent Review
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
