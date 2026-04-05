'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ClipboardList, CheckCircle } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'mobility',
    question: 'Does anyone in your home have difficulty with mobility or balance?',
    options: [
      { label: 'No issues currently', value: 0 },
      { label: 'Mild difficulty — slower, extra caution', value: 1 },
      { label: 'Significant difficulty — uses furniture for support', value: 2 },
      { label: 'Uses a walker, cane, or wheelchair', value: 3 },
    ],
  },
  {
    id: 'stairs',
    question: 'Are there stairs in your home that must be used daily?',
    options: [
      { label: 'No stairs', value: 0 },
      { label: 'One flight — manageable but tiring', value: 1 },
      { label: 'One flight — stairs are becoming a real problem', value: 2 },
      { label: 'Multiple flights or stairs are a major barrier', value: 3 },
    ],
  },
  {
    id: 'bathroom',
    question: 'How accessible is your main bathroom?',
    options: [
      { label: 'Fully accessible — no issues', value: 0 },
      { label: 'Some difficulty getting in/out of tub or shower', value: 1 },
      { label: 'Tub is very difficult — shower preferred', value: 2 },
      { label: 'Bathroom feels unsafe or requires assistance', value: 3 },
    ],
  },
  {
    id: 'falls',
    question: 'Have there been any falls or near-falls in the home in the past year?',
    options: [
      { label: 'No falls', value: 0 },
      { label: 'One fall — no injury', value: 1 },
      { label: 'One or more falls with an injury', value: 2 },
      { label: 'Near-falls happen frequently', value: 3 },
    ],
  },
  {
    id: 'who',
    question: 'Who are you primarily planning for?',
    options: [
      { label: 'Myself — I\'m 65+', value: 'self' },
      { label: 'A parent or older family member', value: 'family' },
      { label: 'Post-surgery recovery', value: 'surgery' },
      { label: 'Planning ahead — no urgent needs yet', value: 'ahead' },
    ],
  },
];

type Rec = { label: string; description: string; href: string; icon: string };

function getRecommendations(answers: Record<string, number | string>): Rec[] {
  const recs: Rec[] = [];

  if ((answers.stairs as number) >= 2) {
    recs.push({ label: 'Stairlift Guide', description: 'Costs, brands, and what to look for before buying.', href: '/guides/how-to-choose-a-stairlift', icon: '🪜' });
    recs.push({ label: 'Browse Stairlifts', description: 'Top-rated straight and curved stairlift models.', href: '/products/stairlifts', icon: '⭐' });
  } else if ((answers.stairs as number) === 1) {
    recs.push({ label: 'Stairlift Cost Guide', description: 'Is a stairlift right for your situation?', href: '/guides/stairlift-cost-guide', icon: '🪜' });
  }

  if ((answers.bathroom as number) >= 2) {
    recs.push({ label: 'Bathroom Safety Guide', description: 'The most important bathroom modifications, in priority order.', href: '/guides/bathroom-safety-modifications-for-seniors', icon: '🚿' });
    recs.push({ label: 'Walk-In Tubs', description: 'Compare top walk-in tub models and costs.', href: '/products/walk-in-tubs', icon: '🛁' });
    recs.push({ label: 'Grab Bars', description: 'Essential for shower and toilet safety.', href: '/products/grab-bars', icon: '🔩' });
  } else if ((answers.bathroom as number) === 1) {
    recs.push({ label: 'Bath Safety Products', description: 'Shower chairs, grab bars, and tub transfer benches.', href: '/products/bath-safety', icon: '🚿' });
    recs.push({ label: 'Grab Bar Guide', description: 'Where to place grab bars and installation costs.', href: '/guides/grab-bar-installation-guide', icon: '🔩' });
  }

  if ((answers.falls as number) >= 2) {
    recs.push({ label: 'Medical Alert Systems', description: 'Get help automatically if a fall happens.', href: '/products/medical-alerts', icon: '🚨' });
    recs.push({ label: 'Medical Alert Guide', description: 'Choosing the right system for a senior living alone.', href: '/guides/best-medical-alert-for-seniors-living-alone', icon: '📋' });
  } else if ((answers.falls as number) === 1) {
    recs.push({ label: 'Medical Alert Systems', description: 'Compare fall detection and GPS monitoring options.', href: '/products/medical-alerts', icon: '🚨' });
  }

  if ((answers.mobility as number) >= 3) {
    recs.push({ label: 'Wheelchair Ramps', description: 'Portable and permanent ramp options for access.', href: '/products/wheelchair-ramps', icon: '♿' });
    recs.push({ label: 'Ramp Cost Guide', description: 'Portable vs. permanent — costs and installation.', href: '/guides/wheelchair-ramp-cost-guide', icon: '💲' });
  }

  if (answers.who === 'ahead' || recs.length < 2) {
    recs.push({ label: 'Home Modifications Checklist', description: 'Complete room-by-room aging-in-place planning guide.', href: '/guides/aging-in-place-home-modifications-checklist', icon: '📋' });
    recs.push({ label: 'Grants & Financial Assistance', description: 'Every program that helps pay for modifications.', href: '/guides/home-modification-grants-for-seniors', icon: '💰' });
  }

  if (answers.who === 'surgery') {
    recs.unshift({ label: 'Bath Safety for Recovery', description: 'Shower chairs, transfer benches, and grab bars.', href: '/products/bath-safety', icon: '🏥' });
  }

  // Deduplicate by href, take top 5
  return [...new Map(recs.map(r => [r.href, r])).values()].slice(0, 5);
}

export default function AssessPage() {
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [done, setDone] = useState(false);

  const current = QUESTIONS.findIndex(q => answers[q.id] === undefined);

  function handleAnswer(questionId: string, value: number | string) {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    if (Object.keys(next).length === QUESTIONS.length) {
      setTimeout(() => setDone(true), 200);
    }
  }

  if (done) {
    const recs = getRecommendations(answers);
    return (
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#1B4332' }} />
          <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
            Your Personalized Plan
          </h1>
          <p className="text-gray-500 text-lg">
            Based on your answers, these are the highest-priority resources for your situation.
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {recs.map(rec => (
            <Link
              key={rec.href}
              href={rec.href}
              className="flex items-center gap-4 p-5 rounded-xl border border-gray-100 hover:border-green-700 hover:shadow-sm transition-all group bg-white"
            >
              <span className="text-3xl shrink-0">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 group-hover:text-green-800 transition-colors">{rec.label}</div>
                <div className="text-sm text-gray-500 mt-0.5">{rec.description}</div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-green-700 shrink-0 transition-colors" />
            </Link>
          ))}
        </div>

        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#1B4332' }}>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Get a Free In-Home Assessment
          </h2>
          <p className="text-white opacity-80 mb-6 max-w-md mx-auto text-sm">
            A CAPS-certified contractor can assess your home in person and give you an exact modification plan with quotes.
          </p>
          <Link
            href="/contractors"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#D97706', color: '#fff' }}
          >
            Find a Contractor Near You
          </Link>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => { setAnswers({}); setDone(false); }}
            className="text-sm text-gray-400 hover:text-gray-600 hover:underline transition-colors"
          >
            ← Start over
          </button>
        </div>
      </main>
    );
  }

  const q = QUESTIONS[current >= 0 ? current : 0];
  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <ClipboardList size={36} className="mx-auto mb-3" style={{ color: '#1B4332' }} />
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
          Free Home Safety Assessment
        </h1>
        <p className="text-gray-500">
          {QUESTIONS.length} quick questions — personalized recommendations in under 2 minutes.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Question {Object.keys(answers).length + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: '#1B4332' }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <p className="font-serif text-xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>{q.question}</p>
        <div className="space-y-2.5">
          {q.options.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => handleAnswer(q.id, opt.value)}
              className="w-full text-left px-4 py-3.5 rounded-lg border border-gray-200 hover:border-green-700 hover:bg-green-50 transition-colors text-sm font-medium text-gray-800"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
