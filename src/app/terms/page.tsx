import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'SafeAtHome Guide terms of use — your rights and responsibilities when using this site.',
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Terms of Use</h1>
      <p className="text-gray-500 mb-8 text-sm">Last updated: April 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Acceptance of Terms</h2>
          <p>By using SafeAtHome Guide (&ldquo;the Site&rdquo;), you agree to these terms of use. If you do not agree, please do not use the Site.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Content and Accuracy</h2>
          <p>SafeAtHome Guide provides information about home safety products and contractors for informational purposes only. Product reviews, SafeScore™ ratings, cost estimates, and contractor listings reflect our independent research and are accurate to the best of our knowledge, but we make no warranty about their completeness or current accuracy.</p>
          <p className="mt-2">Product prices change frequently. Always verify current pricing directly with the manufacturer or retailer before making a purchase decision.</p>
          <p className="mt-2">Medicare, Medicaid, and VA benefit information is provided as general guidance only. Eligibility and coverage vary by individual circumstances. Consult a benefits counselor or your plan directly for advice specific to your situation.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Affiliate Relationships</h2>
          <p>SafeAtHome Guide participates in affiliate marketing programs. We earn a commission when you click certain product links and make a purchase. These commissions fund our research and operations. Our SafeScore™ ratings and editorial recommendations are not influenced by affiliate relationships — products are ranked by score regardless of commission rate.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Contractor Directory</h2>
          <p>Contractor listings in our directory are provided as a convenience. SafeAtHome Guide does not employ contractors and is not responsible for the quality of their work or their business practices. We recommend verifying contractor licenses, insurance, and references independently before hiring.</p>
          <p className="mt-2">CAPS certification status is verified at time of listing but may change. Verify current certification at the <a href="https://www.nahb.org/caps" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#1B4332' }}>NAHB CAPS directory</a>.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Medical Disclaimer</h2>
          <p>Nothing on SafeAtHome Guide constitutes medical advice. Product recommendations are based on safety features and user reviews, not medical assessment of any individual. Consult a physician, occupational therapist, or physical therapist for guidance on which products are appropriate for a specific medical condition.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Intellectual Property</h2>
          <p>The SafeScore™ rating system, site design, and original written content on SafeAtHome Guide are proprietary. You may link to our content but may not reproduce it without written permission.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Limitation of Liability</h2>
          <p>SafeAtHome Guide is provided &ldquo;as is.&rdquo; We are not liable for decisions made based on information on this site, including product purchases or contractor hiring. Our liability is limited to the maximum extent permitted by law.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Contact</h2>
          <p>Questions about these terms: <a href="mailto:hello@safeathomeguides.com" className="underline" style={{ color: '#1B4332' }}>hello@safeathomeguides.com</a>.</p>
        </section>
      </div>
    </main>
  );
}
