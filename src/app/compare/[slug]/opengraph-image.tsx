import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TITLES: Record<string, string> = {
  'best-stairlifts': 'Best Stairlifts of 2026',
  'best-walk-in-tubs': 'Best Walk-In Tubs of 2026',
  'best-grab-bars': 'Best Grab Bars of 2026',
  'best-medical-alerts': 'Best Medical Alert Systems 2026',
  'best-rollator-walkers': 'Best Rollator Walkers of 2026',
  'best-bath-safety-products': 'Best Bath Safety Products 2026',
  'best-wheelchair-ramps': 'Best Wheelchair Ramps of 2026',
  'best-smart-home-safety-devices': 'Best Smart Home Safety Devices 2026',
  'best-smart-door-locks': 'Best Smart Door Locks for Seniors 2026',
};

export default function OGImage({ params }: { params: { slug: string } }) {
  const title = TITLES[params.slug] ?? 'Home Safety Product Comparison';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#86efac', fontSize: '18px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            SafeAtHome Guide · Comparison
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ color: '#ffffff', fontSize: '62px', fontWeight: 700, lineHeight: 1.1, maxWidth: '900px' }}>
            {title}
          </div>
          <div style={{ color: '#86efac', fontSize: '24px', maxWidth: '700px' }}>
            Ranked by SafeScore™ · Pros, cons, specs, and prices compared side by side
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#D97706',
            borderRadius: '12px',
            padding: '16px 24px',
            width: 'fit-content',
          }}
        >
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>
            Independent · No pay-to-play · Updated March 2026
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
