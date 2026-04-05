#!/usr/bin/env node
/**
 * submit-to-gsc.mjs
 * Fetches all published URLs from sh_content and submits each one
 * to the Google Indexing API (fastest path to Google crawling new pages).
 *
 * Prerequisites:
 *   1. A Google Cloud service account with the Indexing API enabled
 *   2. The site verified in Google Search Console
 *   3. The service account added as a verified owner in GSC
 *   4. Service account JSON key saved to ~/ventures/.gsc-service-account.json
 *      OR set GSC_SERVICE_ACCOUNT_JSON env var with the JSON string
 *
 * Run: node scripts/submit-to-gsc.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';

// ── Load env ─────────────────────────────────────────────────────────────────
const envPath = `${homedir()}/ventures/.env.master`;
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const [key, ...val] = line.split('=');
    if (key && val.length && !process.env[key]) {
      process.env[key] = val.join('=').trim().replace(/^"|"$/g, '');
    }
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.master');
  process.exit(1);
}

// ── Load GSC service account ──────────────────────────────────────────────────
const SA_PATH = `${homedir()}/ventures/.gsc-service-account.json`;
let serviceAccount = null;

if (process.env.GSC_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON);
} else if (existsSync(SA_PATH)) {
  serviceAccount = JSON.parse(readFileSync(SA_PATH, 'utf8'));
} else {
  console.warn('⚠️  No GSC service account found.');
  console.warn('   Create one at: https://console.cloud.google.com/iam-admin/serviceaccounts');
  console.warn('   Save the JSON key to: ~/ventures/.gsc-service-account.json');
  console.warn('   Then re-run this script.');
  console.warn('');
  console.warn('   Printing URLs that WOULD be submitted:');
}

// ── JWT for Google OAuth ──────────────────────────────────────────────────────
async function getGoogleAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const signingInput = `${encode(header)}.${encode(payload)}`;

  // Use Node.js crypto to sign with the private key
  const { createSign } = await import('crypto');
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(sa.private_key, 'base64url');
  const jwt = `${signingInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Failed to get access token: ' + JSON.stringify(data));
  return data.access_token;
}

// ── Fetch URLs from Supabase ──────────────────────────────────────────────────
async function fetchUrls() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/sh_content?select=published_url,slug,title&order=created_at.desc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const rows = await res.json();
  return rows.filter(r => r.published_url).map(r => r.published_url);
}

// ── Submit to Google Indexing API ─────────────────────────────────────────────
async function submitUrl(url, token) {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  });
  const data = await res.json();
  if (res.ok) {
    return { ok: true, url };
  } else {
    return { ok: false, url, error: data.error?.message || JSON.stringify(data) };
  }
}

// ── Update sh_content with submission timestamp ───────────────────────────────
async function markSubmitted(urls) {
  // Update all submitted URLs in one query
  const slugs = urls.map(u => u.split('/').pop());
  await fetch(
    `${SUPABASE_URL}/rest/v1/sh_content?slug=in.(${slugs.map(s => `"${s}"`).join(',')})`,
    {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ last_refreshed_at: new Date().toISOString() }),
    }
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Fetching published URLs from Supabase...');
  const urls = await fetchUrls();
  console.log(`Found ${urls.length} URLs to submit.`);

  if (!serviceAccount) {
    urls.forEach(u => console.log(' ', u));
    console.log('\nSet up GSC service account to actually submit these.');
    return;
  }

  console.log('Getting Google access token...');
  const token = await getGoogleAccessToken(serviceAccount);
  console.log('Token acquired. Submitting URLs (200/day limit)...');

  const batchSize = 200; // Google Indexing API daily limit
  const batch = urls.slice(0, batchSize);
  const results = { ok: [], failed: [] };

  for (const url of batch) {
    const result = await submitUrl(url, token);
    if (result.ok) {
      results.ok.push(url);
      process.stdout.write('.');
    } else {
      results.failed.push(result);
      process.stdout.write('x');
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n');
  console.log(`✅ Submitted: ${results.ok.length}`);
  if (results.failed.length) {
    console.log(`❌ Failed: ${results.failed.length}`);
    results.failed.forEach(f => console.log(`   ${f.url}: ${f.error}`));
  }

  if (results.ok.length > 0) {
    await markSubmitted(results.ok);
    console.log('Supabase sh_content updated with submission timestamps.');
  }

  if (urls.length > batchSize) {
    console.log(`\n⚠️  ${urls.length - batchSize} URLs not submitted (daily limit).`);
    console.log('   Run again tomorrow to submit the remainder.');
  }
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
