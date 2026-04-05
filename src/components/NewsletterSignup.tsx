'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

interface NewsletterSignupProps {
  headline?: string;
  subtext?: string;
  source?: string;
}

export function NewsletterSignup({
  headline = 'Get Our Free Home Safety Guide',
  subtext = 'Monthly tips on aging-in-place modifications, cost savings, and what\'s worth buying. No spam.',
  source = 'website',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          sourcePage: window.location.pathname,
        }),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <p className="text-xl font-serif font-semibold mb-1" style={{ color: '#1B4332' }}>You&apos;re subscribed!</p>
        <p className="text-gray-500 text-sm">Check your inbox for a confirmation and your free guide.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-8" style={{ backgroundColor: '#1B4332' }}>
      <div className="flex items-center gap-2 mb-3">
        <Mail size={18} className="text-green-300" />
        <span className="text-green-300 text-sm font-medium uppercase tracking-wide">Free Guide</span>
      </div>
      <h3 className="font-serif text-2xl font-bold text-white mb-2">{headline}</h3>
      <p className="text-green-200 text-sm mb-5">{subtext}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg text-base text-gray-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
          style={{ backgroundColor: '#D97706' }}
        >
          {status === 'loading' ? 'Sending...' : 'Get the Free Guide'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-300 text-xs mt-2">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
