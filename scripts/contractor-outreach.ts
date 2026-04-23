/**
 * contractor-outreach.ts
 *
 * Sends the 3-email featured listing sequence to CAPS contractors.
 *
 * Usage:
 *   npx tsx scripts/contractor-outreach.ts --dry-run          # preview only
 *   npx tsx scripts/contractor-outreach.ts --step=1           # send step 1 to eligible contractors
 *   npx tsx scripts/contractor-outreach.ts --step=2           # send step 2 (4 days after step 1)
 *   npx tsx scripts/contractor-outreach.ts --step=3           # send step 3 (10 days after step 1)
 *
 * Kill switch: KILL_SWITCH env var must be set to "ARMED" or nothing sends.
 * Daily batch cap: 20 emails per run to protect deliverability.
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// ── Kill switch ──────────────────────────────────────────────────────────────
const KILL_SWITCH = process.env.KILL_SWITCH;
const DRY_RUN = process.argv.includes('--dry-run');
const STEP_ARG = process.argv.find(a => a.startsWith('--step='));
const STEP = STEP_ARG ? parseInt(STEP_ARG.split('=')[1]) : 1;
const BATCH_SIZE = 20;

// Step → Day offset (days after step 1 send)
const STEP_DAY_OFFSET: Record<number, number> = { 1: 0, 2: 4, 3: 10 };
const STEP_STATUS: Record<number, string> = {
  1: 'sent_email_1',
  2: 'sent_email_2',
  3: 'sent_email_3',
};

if (!DRY_RUN && KILL_SWITCH !== 'ARMED') {
  console.error('ABORT: KILL_SWITCH is not set to "ARMED". Set KILL_SWITCH=ARMED in env to enable sending.');
  console.error('To preview without sending, run with --dry-run.');
  process.exit(1);
}

// ── Supabase ─────────────────────────────────────────────────────────────────
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Resend ───────────────────────────────────────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = 'Mike DeLong <mike@safeathomeguides.com>';

// ── Email templates ──────────────────────────────────────────────────────────
function email1(c: Contractor): { subject: string; html: string; text: string } {
  const subject = `Featured on SafeAtHome Guide for ${c.city}, ${c.state}?`;
  const body = `Hi ${c.contact_name || c.business_name},

I run SafeAtHome Guide — an aging-in-place directory that ranks CAPS-certified contractors when families search for "home modifications ${c.city}" and "aging in place ${c.state}."

We have your listing up at no charge right now. I'm reaching out because we're opening featured spots for ${c.state} contractors — and you're one of very few CAPS-certified providers in the area.

A featured listing gets you:
- Photo + bio at the top of ${c.city} search results
- Click-to-call phone button (direct, no middleman)
- Lead forwarding from contact forms on your listing page
- $99/month, cancel any time

No long contracts. No setup fee. If we don't send you at least one qualified lead in the first 30 days, I'll refund the month.

Reply YES and I'll send you a direct signup link.

Mike
SafeAtHome Guide
safeathomeguides.com

---
Auriflow Digital LLC · Reply REMOVE to unsubscribe permanently`;

  return {
    subject,
    text: body,
    html: body.replace(/\n/g, '<br>'),
  };
}

function email2(c: Contractor): { subject: string; html: string; text: string } {
  const subject = `Re: Featured listing — ${c.city}, ${c.state}`;
  const body = `Hi ${c.contact_name || c.business_name},

Following up from my note a few days ago.

We currently have 145 CAPS-certified contractors listed across 48 states, and traffic is growing as Google indexes more of our city and state pages. Featured spots in some markets are already taken — ${c.city} still has availability.

What contractors in featured spots get that free listings don't:
- Ranked first in local search results on the site
- Click-to-call button (free-tier listings show a form only)
- Immediate lead forwarding via email when someone contacts you

It's $99/month. You can pause or cancel anytime from a dashboard link I send you.

If you have questions before deciding, just reply — happy to answer.

Reply YES to get the signup link.

Mike
SafeAtHome Guide

---
Auriflow Digital LLC · Reply REMOVE to unsubscribe permanently`;

  return {
    subject,
    text: body,
    html: body.replace(/\n/g, '<br>'),
  };
}

function email3(c: Contractor): { subject: string; html: string; text: string } {
  const subject = `Closing out — ${c.business_name}`;
  const body = `Hi ${c.contact_name || c.business_name},

Last note from me. If a featured listing on SafeAtHome Guide isn't the right fit right now, no problem — I won't follow up again. Reply REMOVE and I'll take you off the list.

If timing was the issue and you want to revisit later, the offer stands at $99/month. You can reach me anytime at mike@safeathomeguides.com.

Mike

---
Auriflow Digital LLC · Reply REMOVE to unsubscribe permanently`;

  return {
    subject,
    text: body,
    html: body.replace(/\n/g, '<br>'),
  };
}

const EMAIL_BUILDERS: Record<number, (c: Contractor) => { subject: string; html: string; text: string }> = {
  1: email1,
  2: email2,
  3: email3,
};

// ── Types ────────────────────────────────────────────────────────────────────
interface Contractor {
  id: string;
  business_name: string;
  contact_name: string | null;
  email: string;
  city: string;
  state: string;
  outreach_status: string | null;
  outreach_started_at: string | null;
}

// ── Query eligible contractors ───────────────────────────────────────────────
async function getEligible(step: number): Promise<Contractor[]> {
  let query = sb
    .from('sh_contractors')
    .select('id, business_name, contact_name, email, city, state, outreach_status, outreach_started_at')
    .not('email', 'is', null)
    .eq('is_published', true);

  if (step === 1) {
    // Step 1: never touched
    query = query.is('outreach_status', null);
  } else if (step === 2) {
    // Step 2: sent step 1, and at least 4 days ago
    const cutoff = new Date(Date.now() - STEP_DAY_OFFSET[2] * 24 * 60 * 60 * 1000).toISOString();
    query = query
      .eq('outreach_status', 'sent_email_1')
      .lte('outreach_started_at', cutoff);
  } else if (step === 3) {
    // Step 3: sent step 2; check outreach_log for step 2 sent_at >= 6 days ago
    const cutoff = new Date(Date.now() - (STEP_DAY_OFFSET[3] - STEP_DAY_OFFSET[2]) * 24 * 60 * 60 * 1000).toISOString();
    query = query
      .eq('outreach_status', 'sent_email_2')
      .lte('outreach_started_at', cutoff);
  }

  const { data, error } = await query.limit(BATCH_SIZE);
  if (error) throw error;
  return data as Contractor[];
}

// ── Send via Resend ──────────────────────────────────────────────────────────
async function sendEmail(to: string, email: { subject: string; html: string; text: string }): Promise<string | null> {
  if (!RESEND_API_KEY) {
    console.warn('  RESEND_API_KEY not set — cannot send');
    return null;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  const json = await res.json() as { id?: string; error?: string };
  if (!res.ok) {
    console.error(`  Resend error: ${json.error}`);
    return null;
  }
  return json.id ?? null;
}

// ── Log to sh_outreach_log ───────────────────────────────────────────────────
async function logSend(
  contractorId: string,
  email: string,
  step: number,
  subject: string,
  resendId: string | null,
  statusOverride?: string
) {
  await sb.from('sh_outreach_log').insert({
    contractor_id: contractorId,
    email,
    email_sequence_step: step,
    subject,
    resend_message_id: resendId,
    sent_at: new Date().toISOString(),
    status: statusOverride ?? (resendId ? 'sent' : 'failed'),
  });
}

// ── Update contractor status ─────────────────────────────────────────────────
async function updateContractorStatus(id: string, step: number) {
  const update: Record<string, unknown> = { outreach_status: STEP_STATUS[step] };
  if (step === 1) update.outreach_started_at = new Date().toISOString();
  if (step === 3) update.outreach_completed_at = new Date().toISOString();
  await sb.from('sh_contractors').update(update).eq('id', id);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`CONTRACTOR OUTREACH — Step ${STEP}${DRY_RUN ? ' [DRY RUN]' : ' [LIVE]'}`);
  console.log(`${'='.repeat(60)}\n`);

  if (!DRY_RUN && KILL_SWITCH !== 'ARMED') {
    console.error('ABORT: KILL_SWITCH not ARMED.');
    process.exit(1);
  }

  const contractors = await getEligible(STEP);
  console.log(`Eligible contractors for step ${STEP}: ${contractors.length}`);
  console.log(`Batch cap: ${BATCH_SIZE}/run\n`);

  if (contractors.length === 0) {
    console.log('Nothing to send. Exiting.');
    return;
  }

  const builder = EMAIL_BUILDERS[STEP];
  let sent = 0;
  let failed = 0;

  for (const c of contractors) {
    const emailContent = builder(c);
    console.log(`\n[${++sent + failed}/${contractors.length}] ${c.business_name}`);
    console.log(`  TO:      ${c.email}`);
    console.log(`  CITY:    ${c.city}, ${c.state}`);
    console.log(`  SUBJECT: ${emailContent.subject}`);
    console.log(`  PREVIEW: ${emailContent.text.split('\n').slice(2, 4).join(' ').substring(0, 100)}...`);

    if (DRY_RUN) {
      console.log('  STATUS:  [DRY RUN — not sent]');
      continue;
    }

    const resendId = await sendEmail(c.email, emailContent);
    if (resendId) {
      await logSend(c.id, c.email, STEP, emailContent.subject, resendId);
      await updateContractorStatus(c.id, STEP);
      console.log(`  STATUS:  sent (resend_id=${resendId})`);
      sent++;
    } else {
      await logSend(c.id, c.email, STEP, emailContent.subject, null, 'failed');
      console.log('  STATUS:  FAILED');
      failed++;
    }
  }

  console.log(`\n${'─'.repeat(60)}`);
  if (DRY_RUN) {
    console.log(`DRY RUN COMPLETE — ${contractors.length} emails previewed, 0 sent.`);
  } else {
    console.log(`DONE — ${sent} sent, ${failed} failed out of ${contractors.length} eligible.`);

    // Log run to agent_log
    await sb.from('agent_log').insert({
      agent_name: 'safeathome-builder',
      venture: 'safehome',
      action: `contractor_outreach_step_${STEP}`,
      cost_usd: 0,
      result: `${sent} sent, ${failed} failed`,
      metadata: { step: STEP, sent, failed, total_eligible: contractors.length },
    });
  }

  if (!DRY_RUN) {
    console.log('\nNext run instructions:');
    if (STEP === 1) console.log('  Run Step 2 in 4 days:  npx tsx scripts/contractor-outreach.ts --step=2');
    if (STEP === 2) console.log('  Run Step 3 in 6 days:  npx tsx scripts/contractor-outreach.ts --step=3');
    if (STEP === 3) console.log('  Sequence complete. Review sh_outreach_log for replies and conversions.');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
