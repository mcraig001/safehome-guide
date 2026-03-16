'use client';

import { useState } from 'react';
import Link from 'next/link';

const QUESTIONS = [
  {
    id: 'mobility',
    question: 'Does anyone in your home have difficulty with mobility or balance?',
    options: ['No issues', 'Mild difficulty', 'Significant difficulty', 'Uses mobility aid'],
  },
  {
    id: 'stairs',
    question: 'Are there stairs in your home that must be used daily?',
    options: ['No stairs', 'One flight', 'Multiple flights', 'Stairs are a major barrier'],
  },
  {
    id: 'bathroom',
    question: 'How accessible is your main bathroom?',
    options: ['Fully accessible', 'Some difficulty', 'Difficult to enter/exit tub', 'Unsafe currently'],
  },
  {
    id: 'falls',
    question: 'Have there been any falls in the home in the past year?',
    options: ['No falls', 'One fall', 'Multiple falls', 'Near-falls frequently'],
  },
  {
    id: 'age',
    question: 'Who are you primarily planning for?',
    options: ['Myself (65+)', 'A parent or family member', 'Planning ahead', 'Post-surgery recovery'],
  },
];

const RECOMMENDATIONS: Record<string, { label: string; slug: string }[]> = {
  stairs: [
    { label: 'Stairlifts', slug: 'stairlifts' },
    { label: 'Home Elevators', slug: 'home-elevators' },
  ],
  bathroom: [
    { label: 'Walk-In Tubs', slug: 'walk-in-tubs' },
    { label: 'Grab Bars & Rails', slug: 'grab-bars' },
    { label: 'Bath Safety', slug: 'bath-safety' },
  ],
  mobility: [
    { label: 'Wheelchair Ramps', slug: 'wheelchair-ramps' },
    { label: 'Mobility Aids', slug: 'mobility-aids' },
    { label: 'Door & Access', slug: 'door-access' },
  ],
  falls: [
    { label: 'Medical Alert Systems', slug: 'medical-alerts' },
    { label: 'Smart Home Safety', slug: 'smart-home-safety' },
    { label: 'Grab Bars & Rails', slug: 'grab-bars' },
  ],
};

export default function AssessPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const current = QUESTIONS.findIndex(q => answers[q.id] === undefined);

  const handleAnswer = (questionId: string, index: number) => {
    const next = { ...answers, [questionId]: index };
    setAnswers(next);
    if (Object.keys(next).length === QUESTIONS.length) setDone(true);
  };

  const getRecommendations = () => {
    const recs: { label: string; slug: string }[] = [];
    if ((answers.stairs || 0) >= 1) recs.push(...RECOMMENDATIONS.stairs);
    if ((answers.bathroom || 0) >= 1) recs.push(...RECOMMENDATIONS.bathroom);
    if ((answers.mobility || 0) >= 1) recs.push(...RECOMMENDATIONS.mobility);
    if ((answers.falls || 0) >= 1) recs.push(...RECOMMENDATIONS.falls);
    return [...new Map(recs.map(r => [r.slug, r])).values()].slice(0, 6);
  };

  if (done) {
    const recs = getRecommendations();
    return (
      <main className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: '#1B4332' }}>
          Your Home Safety Plan
        </h1>
        <p className="text-gray-500 mb-8">Based on your answers, here are the categories most relevant for you:</p>
        <div className="grid grid-cols-2 gap-3 mb-10">
          {recs.map(r => (
            <Link
              key={r.slug}
              href={`/products/${r.slug}`}
              className="p-4 rounded-xl border-2 font-medium hover:border-green-700 transition-colors"
              style={{ borderColor: '#1B4332', color: '#1B4332' }}
            >
              {r.label} →
            </Link>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="font-semibold text-amber-900">Want expert guidance?</p>
          <p className="text-sm text-amber-800 mt-1 mb-3">A CAPS-certified contractor can do a free in-home assessment.</p>
          <Link
            href="/contractors"
            className="inline-block px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
            style={{ backgroundColor: '#D97706' }}
          >
            Find a Contractor Near You
          </Link>
        </div>
      </main>
    );
  }

  const q = QUESTIONS[current >= 0 ? current : 0];
  const progress = ((Object.keys(answers).length) / QUESTIONS.length) * 100;

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
        Home Safety Assessment
      </h1>
      <p className="text-gray-500 mb-8">Answer {QUESTIONS.length} quick questions to get personalized recommendations.</p>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Question {Object.keys(answers).length + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: '#1B4332' }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <p className="font-serif text-xl font-semibold mb-5">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(q.id, i)}
              className="w-full text-left p-3.5 rounded-lg border border-gray-200 hover:border-green-700 hover:bg-green-50 transition-colors text-sm font-medium"
              style={{ minHeight: 44 }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
