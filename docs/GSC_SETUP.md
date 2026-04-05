# Google Search Console + Indexing API Setup
## SafeAtHome Guide — One-Time Setup

This gets all 56 product pages submitted to Google directly via the
Indexing API. Do this once. Estimated time: 20 minutes.

---

## Why this matters

Without this, Google finds your pages only when it randomly crawls your
site — which can take weeks or months for new pages. The Indexing API
tells Google about each page directly and gets most pages crawled within
hours. 56 pages × faster indexing = faster rankings = faster affiliate revenue.

---

## STEP 1 — Verify your site in Google Search Console

1. Go to https://search.google.com/search-console
2. Click **Add property**
3. Choose **URL prefix** and enter: `https://www.safeathomeguides.com`
4. Google will offer several verification methods — choose **HTML tag**
5. Copy the meta tag it gives you. It looks like:
   ```
   <meta name="google-site-verification" content="XXXXXXXXXXXXXX" />
   ```
6. Open `src/app/layout.tsx` in the repo
7. Find the `metadata` export and add the verification string:
   ```typescript
   export const metadata: Metadata = {
     // ... existing fields ...
     verification: {
       google: 'XXXXXXXXXXXXXX', // paste just the content value here
     },
   };
   ```
8. Commit and push — Vercel will deploy in ~90 seconds
9. Back in GSC, click **Verify** — it should pass immediately

> **Already verified?** Skip to Step 2.

---

## STEP 2 — Create a Google Cloud project

1. Go to https://console.cloud.google.com
2. Click the project dropdown (top left) → **New Project**
3. Name it: `safeathome-platform`
4. Click **Create** and wait ~30 seconds
5. Make sure the new project is selected in the dropdown

---

## STEP 3 — Enable the Indexing API

1. In Google Cloud Console, go to:
   **APIs & Services → Library**
2. Search for `Web Search Indexing API`
3. Click it → click **Enable**
4. Wait for it to activate (green checkmark)

---

## STEP 4 — Create a service account

1. Go to: **IAM & Admin → Service Accounts**
2. Click **+ Create Service Account**
3. Fill in:
   - **Name:** `safehome-indexing`
   - **ID:** auto-fills as `safehome-indexing`
   - **Description:** `GSC Indexing API for SafeAtHome Guide`
4. Click **Create and Continue**
5. Skip the role assignment (click **Continue**)
6. Skip the user access (click **Done**)

---

## STEP 5 — Download the service account key

1. In the Service Accounts list, click on `safehome-indexing`
2. Go to the **Keys** tab
3. Click **Add Key → Create new key**
4. Choose **JSON** → click **Create**
5. A JSON file downloads automatically
6. **Move it to:**
   ```
   ~/ventures/.gsc-service-account.json
   ```
   ```bash
   mv ~/Downloads/safeathome-platform-*.json ~/ventures/.gsc-service-account.json
   ```
7. Confirm the service account email — it looks like:
   ```
   safehome-indexing@safeathome-platform.iam.gserviceaccount.com
   ```
   You'll need this in the next step.

---

## STEP 6 — Add service account as GSC owner

This is the step most people miss. The service account must be a
**verified owner** in Search Console — not just a user.

1. Go to https://search.google.com/search-console
2. Select your property (`https://www.safeathomeguides.com`)
3. Go to **Settings** (gear icon, bottom left)
4. Click **Users and permissions**
5. Click **Add user**
6. Enter the service account email:
   ```
   safehome-indexing@safeathome-platform.iam.gserviceaccount.com
   ```
7. Set permission to **Owner**
8. Click **Add**

> ⚠️ Must be **Owner**, not Editor or Viewer. The Indexing API requires Owner.

---

## STEP 7 — Verify setup and submit URLs

Run the verification script first:
```bash
cd ~/ventures/safehome
node scripts/verify-gsc-setup.mjs
```

If everything passes, submit all 56 pages:
```bash
node scripts/submit-to-gsc.mjs
```

Expected output:
```
Fetching published URLs from Supabase...
Found 56 URLs to submit.
Getting Google access token...
Token acquired. Submitting URLs (200/day limit)...
........................................................

✅ Submitted: 56
Supabase sh_content updated with submission timestamps.
```

---

## What happens next

- Most pages appear in Google's index within **4–24 hours**
- Check indexing status in GSC: **Indexing → Pages**
- After ~48 hours, start seeing impressions in **Performance → Search results**
- The `submit-to-gsc.mjs` script can be re-run whenever new content is published

---

## Troubleshooting

**"Permission denied" or 403 error:**
The service account isn't added as an Owner in GSC. Re-do Step 6.

**"API not enabled" error:**
The Web Search Indexing API isn't enabled. Re-do Step 3.

**"Invalid JWT" error:**
The service account JSON file is malformed or in the wrong location.
Confirm it's at `~/ventures/.gsc-service-account.json`.

**"Quota exceeded" error:**
Google Indexing API limit is 200 submissions/day. Run the script on
consecutive days if you have more than 200 URLs.

---

## Optional — Add to .env.master instead of file

If you prefer not to store the JSON file on disk, you can add it as
an env var:

```bash
# In ~/ventures/.env.master
GSC_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}  # full JSON on one line
```

The `submit-to-gsc.mjs` script checks for `GSC_SERVICE_ACCOUNT_JSON`
env var first, then falls back to the file.
