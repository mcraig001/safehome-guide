import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Home Safety Assessment — Get Personalized Recommendations',
  description: '5-question home safety assessment for aging-in-place. Get personalized recommendations for stairlifts, grab bars, walk-in tubs, and other modifications in under 2 minutes.',
  openGraph: {
    title: 'Free Home Safety Assessment',
    description: '5 questions to identify your highest-priority home safety modifications. Free, no signup required.',
  },
};

export default function AssessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
