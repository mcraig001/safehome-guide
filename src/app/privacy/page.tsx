import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'SafeAtHome Guide privacy policy — how we collect, use, and protect your information.',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Privacy Policy</h1>
      <p className="text-gray-500 mb-8 text-sm">Last updated: April 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Information We Collect</h2>
          <p>When you submit a lead form or newsletter signup on SafeAtHome Guide, we collect the information you provide — including name, email address, phone number, ZIP code, and your home safety product interests.</p>
          <p className="mt-2">We also collect standard web analytics data through our analytics provider, including pages visited, time on site, and general geographic location (city/region level). We do not use Google Analytics.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Lead information</strong> is used to connect you with CAPS-certified contractors in your area. We may share your contact information with contractors relevant to your stated interests.</li>
            <li><strong>Email addresses</strong> collected via newsletter signup are used to send the requested content and occasional relevant updates about home safety. You can unsubscribe at any time.</li>
            <li><strong>Analytics data</strong> is used to improve the site and understand which content is most helpful to visitors.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Affiliate Links and Third Parties</h2>
          <p>SafeAtHome Guide participates in affiliate programs including the Amazon Services LLC Associates Program and Impact.com. When you click a product link and make a purchase, we may receive a commission at no additional cost to you.</p>
          <p className="mt-2">Affiliate links are identified with <code>rel="sponsored"</code> attributes in our HTML. We are not responsible for the privacy practices of third-party websites you may visit through our affiliate links.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Cookies</h2>
          <p>SafeAtHome Guide uses minimal cookies for site functionality (such as remembering your preferences). We do not use advertising cookies or sell your data to advertisers.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Data Retention and Security</h2>
          <p>Lead and subscriber information is stored in our secure database hosted on Supabase (AWS infrastructure in the United States). We retain this data for up to 3 years or until you request deletion.</p>
          <p className="mt-2">To request deletion of your data, email us at <a href="mailto:hello@safeathomeguides.com" className="underline" style={{ color: '#1B4332' }}>hello@safeathomeguides.com</a>.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Children&apos;s Privacy</h2>
          <p>SafeAtHome Guide is not directed at children under 13. We do not knowingly collect personal information from children.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. We will note the date of the last update at the top of this page. Continued use of the site constitutes acceptance of any changes.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3 text-gray-900">Contact</h2>
          <p>For privacy-related questions, email <a href="mailto:hello@safeathomeguides.com" className="underline" style={{ color: '#1B4332' }}>hello@safeathomeguides.com</a>.</p>
        </section>
      </div>
    </main>
  );
}
