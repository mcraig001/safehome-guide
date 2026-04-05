import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const { error } = await supabase.from('sh_subscribers').upsert({
    email: body.email,
    first_name: body.firstName,
    source: body.source || 'website',
    source_page: body.sourcePage,
    interests: body.interests || [],
    is_active: true,
  }, { onConflict: 'email' });

  if (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }

  // Trigger welcome sequence via n8n
  fetch(`${process.env.N8N_WEBHOOK_URL}/webhook/new-subscriber`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: body.email, firstName: body.firstName }),
  }).catch(err => console.warn('n8n not reachable:', err.message));

  // Send welcome email via Resend
  if (process.env.RESEND_API_KEY) {
    const firstName = body.firstName ? ` ${body.firstName}` : '';
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SafeAtHome Guide <hello@safeathomeguides.com>',
        to: [body.email],
        subject: 'Your free aging-in-place checklist',
        html: `
          <p>Hi${firstName},</p>
          <p>Thanks for subscribing to SafeAtHome Guide. Here's your free home safety checklist.</p>
          <h2>Room-by-Room Home Safety Checklist</h2>
          <h3>Bathroom (highest priority)</h3>
          <ul>
            <li>Install grab bars in shower (horizontal bar 33–36" from floor, vertical bar at entry)</li>
            <li>Add grab bar near toilet</li>
            <li>Non-slip bath mat (suction-cup style)</li>
            <li>Handheld showerhead with slide bar</li>
            <li>Raised toilet seat or comfort height toilet (if needed)</li>
          </ul>
          <h3>Stairways</h3>
          <ul>
            <li>Handrails on both sides of every staircase</li>
            <li>Improved stair lighting (motion-activated is best)</li>
            <li>Consider stairlift if stairs are becoming a barrier</li>
          </ul>
          <h3>Entry & Exit</h3>
          <ul>
            <li>Threshold ramps at any step-down entries</li>
            <li>Good lighting at front and back entries</li>
            <li>Keypad or smart lock (eliminates lost-key risk)</li>
          </ul>
          <h3>Throughout the Home</h3>
          <ul>
            <li>Remove all throw rugs (major fall hazard)</li>
            <li>Clear pathways of cords and clutter</li>
            <li>Nightlights in hallways and bathroom</li>
            <li>Medical alert system (if living alone)</li>
          </ul>
          <p>Browse our full product reviews at <a href="https://www.safeathomeguides.com/products">safeathomeguides.com/products</a>.</p>
          <p>– The SafeAtHome Guide Team</p>
          <p style="font-size:12px;color:#888;">You subscribed at safeathomeguides.com. <a href="#">Unsubscribe</a></p>
        `,
      }),
    }).catch(err => console.warn('Resend welcome email failed:', err.message));
  }

  return NextResponse.json({ success: true });
}
