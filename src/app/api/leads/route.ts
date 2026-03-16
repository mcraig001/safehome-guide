import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.email || !body.zip || !body.productInterest) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data: lead, error } = await supabase
    .from('sh_leads')
    .insert({
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,
      zip: body.zip,
      product_interest: body.productInterest,
      urgency: body.urgency,
      home_owner: body.homeOwner,
      source_page: body.sourcePage,
      source_keyword: body.sourceKeyword,
      utm_source: body.utmSource,
      utm_medium: body.utmMedium,
      utm_campaign: body.utmCampaign,
    })
    .select()
    .single();

  if (error) {
    console.error('Lead insert error:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }

  // Trigger Lead Router via n8n (fire-and-forget)
  fetch(`${process.env.N8N_WEBHOOK_URL}/webhook/new-lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId: lead.id, ...body }),
  }).catch(err => console.warn('n8n not reachable:', err.message));

  return NextResponse.json({ success: true, leadId: lead.id });
}
