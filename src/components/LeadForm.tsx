'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface LeadFormProps {
  category?: string;
  headline?: string;
}

export function LeadForm({ category, headline = 'Get Free Contractor Quotes' }: LeadFormProps) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    zip: '', urgency: '', homeOwner: '',
    productInterest: category || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          homeOwner: form.homeOwner === 'yes',
          sourcePage: window.location.pathname,
          sourceKeyword: searchParams.get('kw') || '',
          utmSource: searchParams.get('utm_source') || '',
          utmMedium: searchParams.get('utm_medium') || '',
          utmCampaign: searchParams.get('utm_campaign') || '',
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
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-xl font-serif font-semibold" style={{ color: '#1B4332' }}>We're on it!</p>
        <p className="mt-2 text-gray-600">A local CAPS-certified contractor will reach out within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-serif text-xl font-semibold mb-4" style={{ color: '#1B4332' }}>{headline}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text" required minLength={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-green-700"
              value={form.firstName}
              onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text" required minLength={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-green-700"
              value={form.lastName}
              onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-green-700"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-green-700"
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input
              type="text" required pattern="[0-9]{5}" maxLength={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-green-700"
              value={form.zip}
              onChange={e => setForm(p => ({ ...p, zip: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Do you own your home?</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-green-700"
              value={form.homeOwner}
              onChange={e => setForm(p => ({ ...p, homeOwner: e.target.value }))}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No / Renting</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What are you looking for?</label>
          <select
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-green-700"
            value={form.productInterest}
            onChange={e => setForm(p => ({ ...p, productInterest: e.target.value }))}
          >
            <option value="">Select a category</option>
            <option value="stairlifts">Stairlifts</option>
            <option value="walk-in-tubs">Walk-In Tubs</option>
            <option value="grab-bars">Grab Bars & Rails</option>
            <option value="wheelchair-ramps">Wheelchair Ramps</option>
            <option value="home-elevators">Home Elevators</option>
            <option value="bath-safety">Bath Safety</option>
            <option value="smart-home-safety">Smart Home Safety</option>
            <option value="mobility-aids">Mobility Aids</option>
            <option value="medical-alerts">Medical Alert Systems</option>
            <option value="door-access">Door & Access</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">How soon do you need this?</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-green-700"
            value={form.urgency}
            onChange={e => setForm(p => ({ ...p, urgency: e.target.value }))}
          >
            <option value="">Select</option>
            <option value="immediate">As soon as possible</option>
            <option value="within_month">Within the next month</option>
            <option value="planning">Just planning ahead</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 px-6 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: '#D97706', minHeight: 44 }}
        >
          {status === 'loading' ? 'Sending...' : 'Get Free Quotes →'}
        </button>
        <p className="text-xs text-gray-400 text-center">No spam. No obligation. CAPS-certified contractors only.</p>
      </form>
    </div>
  );
}
