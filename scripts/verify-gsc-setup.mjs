#!/usr/bin/env node
/**
 * verify-gsc-setup.mjs
 * Verifies that all GSC Indexing API prerequisites are in place
 * before running the full submission script.
 *
 * Run: node scripts/verify-gsc-setup.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';

const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';

const pass = (msg) => console.log(`${GREEN}  ✅ ${msg}${RESET}`);
const fail = (msg) => console.log(`${RED}  ❌ ${msg}${RESET}`);
const warn = (msg) => console.log(`${YELLOW}  ⚠️  ${msg}${RESET}`);
const info = (msg) => console.log(`     ${msg}`);

// ── Load env ──────────────────────────────────────────────────────────────────
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

async function main() {
  console.log(`\n${BOLD}GSC Indexing API — Setup Verification${RESET}`);
  console.log('══════════════════════════════════════\n');

  let allGood = true;

  // ── Check 1: Service account file or env var ─────────────────────────────
  console.log(`${BOLD}1. Service account credentials${RESET}`);
  const saPath = `${homedir()}/ventures/.gsc-service-account.json`;
  let serviceAccount = null;

  if (process.env.GSC_SERVICE_ACCOUNT_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON);
      pass('GSC_SERVICE_ACCOUNT_JSON env var found and valid JSON');
    } catch(e) {
      fail('GSC_SERVICE_ACCOUNT_JSON env var is not valid JSON');
      info('Fix: paste the full service account JSON on one line in .env.master');
      allGood = false;
    }
  } else if (existsSync(saPath)) {
    try {
      serviceAccount = JSON.parse(readFileSync(saPath, 'utf8'));
      pass(`Service account file found: ${saPath}`);
    } catch(e) {
      fail('Service account file exists but is not valid JSON');
      info(`Fix: re-download the key from Google Cloud Console`);
      allGood = false;
    }
  } else {
    fail('No service account found');
    info('Expected: ~/ventures/.gsc-service-account.json');
    info('See docs/GSC_SETUP.md Steps 2–5 to create one');
    allGood = false;
  }

  // ── Check 2: Service account fields ──────────────────────────────────────
  if (serviceAccount) {
    console.log(`\n${BOLD}2. Service account fields${RESET}`);
    const required = ['type', 'project_id', 'private_key', 'client_email'];
    let fieldsMissing = false;
    for (const field of required) {
      if (serviceAccount[field]) {
        pass(`${field}: present`);
      } else {
        fail(`${field}: MISSING`);
        fieldsMissing = true;
        allGood = false;
      }
    }
    if (!fieldsMissing) {
      info(`Service account email: ${serviceAccount.client_email}`);
      info(`Project: ${serviceAccount.project_id}`);
    }
  }

  // ── Check 3: Can get a Google access token ────────────────────────────────
  if (serviceAccount?.private_key && serviceAccount?.client_email) {
    console.log(`\n${BOLD}3. Google OAuth token${RESET}`);
    try {
      const token = await getGoogleAccessToken(serviceAccount);
      if (token) {
        pass('Successfully obtained Google access token');
        info('The Indexing API is enabled and credentials are valid');

        // ── Check 4: Test a real Indexing API call ──────────────────────────
        console.log(`\n${BOLD}4. Indexing API permissions${RESET}`);
        const testUrl = 'https://www.safeathomeguides.com/';
        const apiRes = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: testUrl, type: 'URL_UPDATED' }),
        });
        const apiData = await apiRes.json();

        if (apiRes.ok) {
          pass(`API call succeeded — homepage submitted as test`);
          info('Service account has correct permissions in GSC');
        } else if (apiData.error?.code === 403) {
          fail('API returned 403 — service account not an Owner in GSC');
          info('Fix: Go to GSC → Settings → Users and permissions');
          info(`     Add ${serviceAccount.client_email} as Owner`);
          info('     See docs/GSC_SETUP.md Step 6');
          allGood = false;
        } else if (apiData.error?.code === 429) {
          warn('Rate limited (429) — but credentials are valid');
          info('This just means you hit the daily quota. Run submit-to-gsc.mjs tomorrow.');
        } else {
          warn(`Unexpected API response: ${JSON.stringify(apiData.error || apiData)}`);
        }
      }
    } catch(e) {
      fail(`Failed to get access token: ${e.message}`);
      info('Check that the Indexing API is enabled in Google Cloud Console');
      info('See docs/GSC_SETUP.md Step 3');
      allGood = false;
    }
  }

  // ── Check 5: Supabase connection + content rows ───────────────────────────
  console.log(`\n${BOLD}5. Supabase content rows${RESET}`);
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    fail('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env.master');
    allGood = false;
  } else {
    try {
      const res = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/sh_content?select=count`,
        {
          headers: {
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            Prefer: 'count=exact',
          },
        }
      );
      const count = res.headers.get('content-range');
      const n = count ? count.split('/')[1] : '?';
      if (parseInt(n) > 0) {
        pass(`sh_content has ${n} rows ready to submit`);
      } else {
        warn('sh_content is empty — no URLs to submit yet');
        info('Run the content population step first');
        allGood = false;
      }
    } catch(e) {
      fail(`Supabase connection failed: ${e.message}`);
      allGood = false;
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  if (allGood) {
    console.log(`${GREEN}${BOLD}✅ All checks passed. Ready to submit.${RESET}`);
    console.log(`\n   Run: ${BOLD}node scripts/submit-to-gsc.mjs${RESET}`);
  } else {
    console.log(`${RED}${BOLD}❌ Some checks failed. Fix the issues above first.${RESET}`);
    console.log(`\n   See: ${BOLD}docs/GSC_SETUP.md${RESET} for step-by-step instructions`);
  }
  console.log('');
}

async function getGoogleAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header  = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const signingInput = `${encode(header)}.${encode(payload)}`;
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
  if (!data.access_token) throw new Error(JSON.stringify(data));
  return data.access_token;
}

main().catch(e => { console.error(RED + '❌ ' + e.message + RESET); process.exit(1); });
