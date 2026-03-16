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

  return NextResponse.json({ success: true });
}
