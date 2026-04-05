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

  // Email notification via Resend (backup to n8n)
  if (process.env.RESEND_API_KEY) {
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SafeAtHome Lead Alerts <leads@safeathomeguides.com>',
        to: ['hello@safeathomeguides.com'],
        subject: `New Lead: ${body.firstName} ${body.lastName} — ${body.productInterest} (${body.zip})`,
        html: `
          <h2>New Lead from SafeAtHome Guide</h2>
          <table>
            <tr><td><strong>Name:</strong></td><td>${body.firstName} ${body.lastName}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${body.email}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${body.phone || 'not provided'}</td></tr>
            <tr><td><strong>ZIP:</strong></td><td>${body.zip}</td></tr>
            <tr><td><strong>Interest:</strong></td><td>${body.productInterest}</td></tr>
            <tr><td><strong>Urgency:</strong></td><td>${body.urgency || 'not specified'}</td></tr>
            <tr><td><strong>Homeowner:</strong></td><td>${body.homeOwner ? 'Yes' : 'No'}</td></tr>
            <tr><td><strong>Source:</strong></td><td>${body.sourcePage}</td></tr>
          </table>
          <p>Lead ID: ${lead.id}</p>
        `,
      }),
    }).catch(err => console.warn('Resend not reachable:', err.message));
  }

  return NextResponse.json({ success: true, leadId: lead.id });
}
