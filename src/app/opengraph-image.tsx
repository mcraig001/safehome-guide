import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SafeAtHome Guide — Aging-in-Place Home Safety';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#1B4332',
          padding: '64px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Top: brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>S</div>
          </div>
          <div style={{ color: '#86efac', fontSize: '18px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            SafeAtHome Guide
          </div>
        </div>

        {/* Center: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ color: '#ffffff', fontSize: '60px', fontWeight: 700, lineHeight: 1.1, maxWidth: '900px' }}>
            Independent Home Safety Reviews & Cost Guides
          </div>
          <div style={{ color: '#86efac', fontSize: '26px', maxWidth: '700px', lineHeight: 1.4 }}>
            SafeScore™ ratings for stairlifts, walk-in tubs, grab bars, and more — plus a CAPS contractor directory.
          </div>
        </div>

        {/* Bottom: stats bar */}
        <div style={{ display: 'flex', gap: '48px' }}>
          {[
            { n: '56+', label: 'Products Reviewed' },
            { n: '150+', label: 'CAPS Contractors' },
            { n: '18', label: 'Cost Guides' },
            { n: '50', label: 'States Covered' },
          ].map(({ n, label }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ color: '#D97706', fontSize: '32px', fontWeight: 700, fontFamily: 'monospace' }}>{n}</div>
              <div style={{ color: '#d1fae5', fontSize: '15px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
