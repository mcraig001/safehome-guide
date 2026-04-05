import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const GUIDE_META: Record<string, { title: string; category: string }> = {
  'stairlift-cost-guide': { title: 'How Much Does a Stairlift Cost in 2026?', category: 'Stairlifts' },
  'walk-in-tub-cost-guide': { title: 'Walk-In Tub Cost Guide 2026', category: 'Walk-In Tubs' },
  'grab-bar-installation-guide': { title: 'Grab Bar Installation Guide', category: 'Grab Bars' },
  'does-medicare-cover-stairlifts': { title: 'Does Medicare Cover Stairlifts?', category: 'Stairlifts' },
  'does-medicare-cover-walk-in-tubs': { title: 'Does Medicare Cover Walk-In Tubs?', category: 'Walk-In Tubs' },
  'aging-in-place-home-modifications-checklist': { title: 'Aging-in-Place Home Modifications Checklist', category: 'Planning' },
  'medical-alert-cost-guide': { title: 'Medical Alert System Cost Guide 2026', category: 'Medical Alerts' },
  'wheelchair-ramp-cost-guide': { title: 'Wheelchair Ramp Cost Guide 2026', category: 'Wheelchair Ramps' },
  'home-elevator-cost-guide': { title: 'Home Elevator Cost Guide 2026', category: 'Home Elevators' },
  'home-modification-grants-for-seniors': { title: 'Home Modification Grants for Seniors', category: 'Planning' },
  'stairlift-vs-home-elevator': { title: 'Stairlift vs. Home Elevator: Which Is Right for You?', category: 'Stairlifts' },
  'bathroom-safety-modifications-for-seniors': { title: 'Bathroom Safety Modifications for Seniors', category: 'Bath Safety' },
  'how-to-choose-a-stairlift': { title: "How to Choose a Stairlift: Buyer's Guide", category: 'Stairlifts' },
  'aging-in-place-tax-deductions': { title: 'Aging-in-Place Tax Deductions 2026', category: 'Planning' },
  'best-medical-alert-for-seniors-living-alone': { title: 'Best Medical Alert for Seniors Living Alone', category: 'Medical Alerts' },
  'walk-in-shower-conversion-cost': { title: 'Walk-In Shower Conversion Cost Guide', category: 'Bath Safety' },
  'stairlift-for-narrow-stairs': { title: 'Stairlift for Narrow Stairs', category: 'Stairlifts' },
  'outdoor-stairlift-cost': { title: 'Outdoor Stairlift Cost Guide 2026', category: 'Stairlifts' },
  'bruno-vs-acorn-stairlift': { title: 'Bruno vs. Acorn Stairlift: Full Comparison', category: 'Stairlifts' },
  'stairlift-rental-vs-buy': { title: 'Stairlift Rental vs. Buy: Which Makes Sense?', category: 'Stairlifts' },
  'stairlift-weight-limit': { title: 'Stairlift Weight Limits: Heavy-Duty Options', category: 'Stairlifts' },
  'walk-in-tub-vs-walk-in-shower': { title: 'Walk-In Tub vs. Walk-In Shower: Which Is Safer?', category: 'Walk-In Tubs' },
  'stairlift-brands-to-avoid': { title: 'Stairlift Brands to Avoid', category: 'Stairlifts' },
  'home-safety-checklist-for-elderly': { title: 'Home Safety Checklist for Elderly 2026', category: 'Planning' },
  'stairlift-installation-guide': { title: 'Stairlift Installation: What to Expect', category: 'Stairlifts' },
  'medicare-advantage-home-modification-benefits': { title: 'Medicare Advantage Home Modification Benefits', category: 'Insurance' },
  'life-alert-vs-medical-guardian': { title: 'Life Alert vs. Medical Guardian 2026', category: 'Medical Alerts' },
  'free-stairlift-for-seniors': { title: 'How to Get a Free Stairlift for Seniors', category: 'Stairlifts' },
  'best-fall-detection-medical-alert': { title: 'Best Medical Alerts With Fall Detection 2026', category: 'Medical Alerts' },
  'aging-in-place-bathroom-modifications': { title: 'Aging-in-Place Bathroom Modifications', category: 'Bath Safety' },
  'american-standard-vs-safe-step-walk-in-tub': { title: 'American Standard vs. Safe Step Walk-In Tub', category: 'Walk-In Tubs' },
  'senior-bathroom-remodel-cost': { title: 'Senior Bathroom Remodel Cost Guide', category: 'Bath Safety' },
  'aging-in-place-vs-assisted-living-cost': { title: 'Aging in Place vs. Assisted Living Cost 2026', category: 'Planning' },
};

export default function OGImage({ params }: { params: { slug: string } }) {
  const meta = GUIDE_META[params.slug];
  const title = meta?.title ?? 'Home Safety Guide';
  const category = meta?.category ?? 'Guide';

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
        {/* Top: brand + category badge */}
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
            {category}
          </div>
        </div>

        {/* Center: title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              color: '#1A1A1A',
              fontSize: title.length > 60 ? '48px' : '58px',
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          <div style={{ color: '#6B7280', fontSize: '22px' }}>
            safeathomeguides.com
          </div>
        </div>

        {/* Bottom: trust badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px 24px',
            width: 'fit-content',
          }}
        >
          <div style={{ color: '#D97706', fontSize: '22px', fontWeight: 700 }}>★★★★★</div>
          <div style={{ color: '#374151', fontSize: '16px' }}>
            Independent research · No sponsored rankings · SafeScore™ rated
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
