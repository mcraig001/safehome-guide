# VENTURE #2 BUILD SPEC
## Medicare Home Health Agency Data Product
**Score:** 88/100 — PRIORITY APPROVED
**Created:** 2026-04-04 | **Status:** Spec complete, build not started
**Target:** First revenue in 2–3 weeks from build-start

---

## WHAT IT IS

A searchable, enriched database of every Medicare-certified home health agency in the United States (11,000+ agencies). The raw data is public via CMS CASPER, but it is unusable in its raw form — it’s a flat file with agency IDs and survey data, missing contact information, key staff, service area details, and operational context.

We ingest the raw CMS data, enrich it with contact info (phone, email, website, key staff), cross-reference deficiency history and star ratings, map service areas by ZIP code, and serve it as:
1. A **searchable web directory** (consumer/B2B hybrid)
2. A **REST API** (for software vendors and data consumers)
3. **Downloadable exports** (for analysts and PE firms)

The enriched database is the moat. Competitors must rebuild it from scratch to compete.

---

## TARGET CUSTOMERS

| Customer Type | Use Case | Willingness to Pay |
|---|---|---|
| Home health agencies | Competitive intelligence on competitors, survey history | $500–$1,500/month |
| Medicare consultants & advisors | Market intelligence, client recommendations | $500–$1,000/month |
| Private equity / M&A firms | Acquisition target identification, due diligence | $1,500–$2,500/month |
| Placement agents & care coordinators | Finding and vetting agencies for clients | $299–$500/month |
| Healthcare investors & analysts | Market sizing, geographic analysis | $1,000–$2,500/month |
| Health IT vendors | Embedding agency data in their software | API tier: $299–$999/month |

---

## PRICING

| Tier | Price | What’s Included |
|---|---|---|
| **Starter** | $500/month | Search + filter interface (web app), 10 agency profiles/day, basic fields |
| **Pro** | $1,500/month | Full database access, all fields, bulk search, CSV export (1,000 records/month) |
| **Enterprise** | $2,500/month | Full API access, unlimited exports, custom filters, ownership + staff data, priority data refresh |
| **API Only** | $299–$999/month | REST API access by call volume; for software vendors embedding the data |

---

## DATA SOURCES

| Source | What It Provides | Update Frequency |
|---|---|---|
| CMS CASPER Database | Agency certification, survey history, deficiencies, ownership type | Monthly |
| Medicare Compare API | Star ratings, quality measures, patient outcome scores | Quarterly |
| SAM.gov | Federal contractor status, EIN, legal entity details | Monthly |
| State licensing boards | State license number, license status, additional certifications | Quarterly |
| Web scraping (agency sites) | Phone, email, website, key staff names + titles, service area description | Monthly |
| LinkedIn (public profiles) | Key staff enrichment (Administrator, DON, CEO) | Quarterly |

### Data Fields (Full Schema)
See database schema section below.

---

## DATABASE SCHEMA

```sql
-- Medicare Home Health Agency core table
CREATE TABLE mhh_agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- CMS identifiers
  cms_certification_number TEXT UNIQUE NOT NULL,  -- CCN (6-digit)
  provider_name TEXT NOT NULL,
  doing_business_as TEXT,
  
  -- Location
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  state_abbr TEXT NOT NULL,
  zip TEXT,
  county TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Contact (enriched)
  phone TEXT,
  fax TEXT,
  email TEXT,
  website TEXT,
  
  -- Certification
  certification_date DATE,
  participation_date DATE,
  ownership_type TEXT,         -- 'proprietary' | 'non-profit' | 'government'
  chain_name TEXT,             -- parent chain if applicable
  chain_ccn TEXT,
  
  -- Quality data (from Medicare Compare)
  overall_star_rating DECIMAL(2,1),
  quality_of_patient_care_star DECIMAL(2,1),
  patient_survey_star DECIMAL(2,1),
  quality_score_updated_at DATE,
  
  -- Survey / deficiency data (from CASPER)
  total_survey_deficiencies INT DEFAULT 0,
  last_survey_date DATE,
  last_survey_result TEXT,     -- 'no deficiencies' | 'standard' | 'extended' | 'federal'
  has_open_enforcement BOOLEAN DEFAULT FALSE,
  
  -- Service area
  counties_served JSONB,       -- array of county names
  zips_served JSONB,           -- array of ZIP codes
  states_served JSONB,         -- multi-state agencies
  
  -- Key staff (enriched)
  administrator_name TEXT,
  administrator_email TEXT,
  director_of_nursing TEXT,
  ceo_name TEXT,
  ceo_email TEXT,
  
  -- SAM.gov
  sam_uei TEXT,
  sam_status TEXT,
  ein TEXT,
  
  -- State licensing
  state_license_number TEXT,
  state_license_status TEXT,
  
  -- Data product metadata
  is_active BOOLEAN DEFAULT TRUE,
  data_quality_score INT,      -- 0-100: how complete is this record?
  last_enriched_at TIMESTAMPTZ,
  last_cms_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Survey deficiency details
CREATE TABLE mhh_deficiencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES mhh_agencies(id),
  survey_date DATE NOT NULL,
  deficiency_code TEXT,
  deficiency_description TEXT,
  severity TEXT,               -- 'A' through 'L' (CMS scale)
  scope TEXT,                  -- 'isolated' | 'pattern' | 'widespread'
  corrected BOOLEAN DEFAULT FALSE,
  corrected_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API access log (for billing + usage tracking)
CREATE TABLE mhh_api_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  endpoint TEXT,
  query_params JSONB,
  records_returned INT,
  response_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers / subscriptions
CREATE TABLE mhh_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT UNIQUE NOT NULL,
  phone TEXT,
  tier TEXT NOT NULL,          -- 'starter' | 'pro' | 'enterprise' | 'api'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  monthly_mrr DECIMAL(10,2),
  api_key TEXT UNIQUE,
  api_calls_this_month INT DEFAULT 0,
  api_calls_limit INT,
  exports_this_month INT DEFAULT 0,
  exports_limit INT,
  is_active BOOLEAN DEFAULT TRUE,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mhh_state ON mhh_agencies(state_abbr);
CREATE INDEX idx_mhh_zip ON mhh_agencies(zip);
CREATE INDEX idx_mhh_star ON mhh_agencies(overall_star_rating);
CREATE INDEX idx_mhh_deficiencies ON mhh_agencies(total_survey_deficiencies);
CREATE INDEX idx_mhh_ownership ON mhh_agencies(ownership_type);
CREATE INDEX idx_mhh_chain ON mhh_agencies(chain_name);
```

---

## DATA PIPELINE

### Step 1: CMS CASPER Ingestion (automated monthly)
```
Source: https://data.cms.gov/provider-data/api/1/datastore/query/
Dataset: Home Health Agency Provider Data
Fields: CCN, provider_name, address, city, state, zip, certification_date,
        ownership_type, survey_date, deficiency_count, star_rating
Frequency: Monthly (CMS updates on the 1st)
Output: Upsert to mhh_agencies table (on_conflict = cms_certification_number)
```

### Step 2: Contact Enrichment (automated monthly)
```
For each agency without a phone/email/website:
  1. Search Google for "[agency_name] [city] [state] home health"
  2. Extract phone, website from top result
  3. Fetch website → extract email, key staff, service area text
  4. Update mhh_agencies record
  5. Set last_enriched_at = now()
  6. Update data_quality_score
Rate limit: 2 second delay between fetches
Model: Claude Haiku 4.5 for extraction (structured output)
```

### Step 3: Star Rating Sync (quarterly)
```
Source: Medicare Compare API (data.medicare.gov)
Fields: overall_star, quality_star, patient_survey_star
Match on: CCN
Frequency: Quarterly
```

### Step 4: Deficiency Detail Sync (monthly)
```
Source: CMS CASPER survey/deficiency export
Insert new deficiencies to mhh_deficiencies table
Update mhh_agencies.total_survey_deficiencies = count
Update mhh_agencies.last_survey_date
Update mhh_agencies.has_open_enforcement
```

### Step 5: Key Staff Enrichment (quarterly)
```
For Enterprise tier data:
  1. Search LinkedIn for "[agency_name] administrator home health"
  2. Extract: administrator name, director of nursing name, CEO/owner
  3. Cross-reference with state licensing board where available
  4. Store in mhh_agencies key staff fields
Note: LinkedIn enrichment is manual-assisted for first build; automate via Proxycurl API in v2
```

---

## FRONTEND PAGES

| Page | URL | Purpose |
|---|---|---|
| Homepage | / | Value prop, search bar, featured agencies |
| Search | /search | Filterable agency directory |
| Agency profile | /agency/[ccn] | Full agency profile page |
| State directory | /state/[state] | All agencies in a state |
| City directory | /state/[state]/[city] | City-level listing (programmatic SEO) |
| Compare | /compare | Side-by-side agency comparison |
| Pricing | /pricing | 4-tier pricing with Stripe checkout |
| API docs | /api-docs | REST API documentation |
| Dashboard | /dashboard | Customer portal: search, export, API key |
| Login / signup | /auth | Stripe Checkout → account creation |

---

## API ENDPOINTS

```
GET  /api/v1/agencies                    # Search + filter agencies
GET  /api/v1/agencies/:ccn               # Single agency by CCN
GET  /api/v1/agencies/:ccn/deficiencies  # Agency deficiency history
GET  /api/v1/agencies/nearby             # Agencies within N miles of ZIP
GET  /api/v1/states                      # Agency counts + stats by state
GET  /api/v1/search?q=                   # Full-text search
POST /api/v1/export                      # Bulk export (Pro/Enterprise only)

# Auth: API key in header (X-API-Key)
# Rate limits enforced by tier (tracked in mhh_api_log)
# All responses: JSON
```

---

## FILTER / SEARCH PARAMETERS

The search page and API both support:
- `state` — filter by state abbreviation
- `city` — filter by city
- `zip` — filter by ZIP code or radius
- `min_star` — minimum overall star rating (1–5)
- `max_deficiencies` — maximum total deficiencies
- `ownership_type` — proprietary / non-profit / government
- `has_open_enforcement` — boolean
- `chain_name` — filter by parent chain
- `certified_after` — certification date filter
- `sort` — star_rating | deficiencies | name | certification_date

---

## PRICING PAGE COPY

**Headline:** The most complete Medicare home health agency database in the US.

**Sub-headline:** 11,000+ agencies. Survey history. Star ratings. Contact info. Updated monthly.

**Starter — $500/month**
Perfect for consultants and care coordinators.
- Search and filter all 11,000+ agencies
- Quality scores and survey history
- Up to 10 agency profiles per day
- Email support

**Pro — $1,500/month**
For agencies and advisory firms needing full market coverage.
- Everything in Starter
- All data fields, including ownership and chain information
- CSV exports (1,000 records/month)
- Bulk search by geography, star rating, or deficiency count
- Priority support

**Enterprise — $2,500/month**
For PE firms, M&A advisors, and health IT teams.
- Everything in Pro
- Key staff data (administrator, DON, CEO) where available
- Unlimited exports
- Full REST API access
- Custom data delivery options
- Dedicated account support

**API — From $299/month**
For software vendors embedding home health data.
- $299/month: 5,000 API calls/month
- $599/month: 25,000 API calls/month
- $999/month: 100,000 API calls/month
- Overage: $0.01/call

---

## GO-TO-MARKET SEQUENCE

### Week 1–2: Build + seed data
1. Stand up Next.js app (clone SafeAtHome structure)
2. Run CMS CASPER ingestion pipeline → load all 11,000+ agencies to Supabase
3. Run enrichment pass on top 500 agencies (by star rating + location density)
4. Launch pricing page + Stripe Checkout
5. Build basic search interface

### Week 2–3: First customers
**Channel 1: Cold email to Medicare consultants**
- List source: LinkedIn (search “Medicare consultant” + “home health” + “senior care advisor”)
- Message: “I built a database of every Medicare-certified HHA with survey history and star ratings. Offering first-month free to consultants. Want access?”
- Target: 200 outreach → 20 trials → 5 paid ($500/month = $2,500 MRR)

**Channel 2: PE / M&A firm outreach**
- List source: LinkedIn (search “home health” + “private equity” + “senior care M&A”)
- Message: Pitch around acquisition due diligence use case
- Target: 50 outreach → 5 demos → 2 Enterprise ($2,500/month = $5,000 MRR)

**Channel 3: Content SEO (long-term)**
- Target keywords: “Medicare home health agency ratings”, “home health agency survey deficiencies”, “CMS CASPER data”
- Writer agent builds comparison + ranking content
- Programmatic: /state/[state] + /agency/[ccn] pages → 11,000+ auto-generated URLs

### Month 2+: Scale
- Partner with home health industry associations
- Referral program: consultants earn 10% for referrals (approved via Slack before activating)
- Consider healthcare data marketplaces: Definitive Healthcare, IQVIA listings

---

## TECH STACK

```
Frontend:    Next.js 15 + TypeScript + Tailwind → Vercel
Database:    Supabase (Postgres) — mhh_ prefix tables
Payments:    Stripe (subscriptions + Checkout) — already configured
Email:       Resend (welcome, API key delivery, invoices)
Auth:        Supabase Auth (email/password + magic link)
Data:        CMS CASPER API + Medicare Compare API (both free, public)
Enrichment:  Playwright (web scraping) + Claude Haiku (extraction)
Automation:  n8n (monthly sync workflows)
```

This is the **identical stack to SafeAtHome** — zero new infrastructure needed. The platform already supports it.

---

## AGENT ROLES FOR VENTURE #2

| Agent | Role |
|---|---|
| Scout | Monthly CMS data sync + contact enrichment (adapted from SafeAtHome product research) |
| Writer | SEO content for agency profiles + state/city directory pages |
| SEO Operator | Track rankings for “Medicare home health agency [state]” keywords |
| Revenue Monitor | Track MRR, API usage, export volume; alert on churn |
| Lead Router | Route enterprise demo requests to Mike for manual follow-up |

---

## REVENUE PROJECTIONS

| Timeframe | Scenario | MRR |
|---|---|---|
| Week 3 | Conservative: 2 Starter ($500) + 1 API ($299) | $1,299 |
| Month 2 | Conservative: 5 Starter + 2 Pro + 1 Enterprise | $7,000 |
| Month 3 | Base: 10 Starter + 4 Pro + 2 Enterprise | $16,000 |
| Month 6 | Scale: 20 Starter + 8 Pro + 5 Enterprise | $30,500 |

These are conservative. The PE/M&A segment alone can drive Enterprise deals fast — a single firm doing home health M&A could be worth $2,500/month and require zero ongoing support.

---

## OPERATING RULES (from OPERATING_PRINCIPLES.md)
- No autonomous payments — Stripe subscription webhook fires, Mike approves refunds only
- All API key generation is automated (safe, no money involved)
- CMS data ingestion is read-only from public sources — no approval needed
- Any outreach templates require Mike review before Scout sends
- All code in GitHub under mcraig001/safehome-guide (or new repo: mcraig001/medicare-hha-data)

---

## FIRST ACTIONS (run these in order)

1. **Create Supabase tables** — run schema above in Supabase SQL editor
2. **Build CMS ingestion script** — ~/ventures/medicare-hha/scripts/ingest-cms.py
3. **Run first data load** — populate mhh_agencies with all 11,000+ agencies
4. **Build Next.js search page** — filterable directory, minimal design
5. **Build pricing page** — 4 tiers, Stripe Checkout
6. **Run enrichment on top 500 agencies** — contact info + star ratings
7. **Cold email 200 Medicare consultants** — message template in GTM section above
8. **Post first customer acquisition to #revenue** — celebrate the signal
