# VENTURE PIPELINE
## AI Holding Company — Scored Opportunity Register
**Version:** 1.0 | **Created:** 2026-04-04
**Rule:** Only approved ventures (70+) get built. Build in score order unless strategic reason to reorder.

---

## PIPELINE SUMMARY

| # | Venture | Score | Status | Est. Revenue Start |
|---|---|---|---|---|
| 1 | SafeAtHome Guide (niche directory) | 80/100 | 🟢 LIVE | Building now |
| 2 | Medicare Home Health Agency Data Product | 88/100 | 🔵 APPROVED | 2–3 weeks post-start |
| 3 | CAPS Contractor Database API | 78/100 | 🔵 APPROVED | 3–4 weeks post-start |
| 4 | Geriatric Care Manager Directory | 72/100 | 🔵 APPROVED | 4–6 weeks post-start |
| 5 | Home Health Aide Supply/Demand Data by ZIP | 70/100 | 🔵 APPROVED | 5–7 weeks post-start |
| 6 | Senior Living Facility Data Product | 68/100 | 🟡 WATCH LIST | Revisit after V2 |
| 7 | Aging-in-Place Interior Designers Directory | 65/100 | 🟡 WATCH LIST | Revisit Q3 |
| 8 | Medicare Advantage Plan Comparison Data API | 60/100 | 🟡 WATCH LIST | Regulatory risk |
| 9 | Senior Move Manager Directory | 58/100 | 🔴 WATCH/LOW | Low search volume |
| 10 | Adaptive Equipment Supplier Directory | 55/100 | 🔴 REJECTED | Too fragmented |
| 11 | Veterans Home Modification Grant Database | 72/100 | 🔵 APPROVED | 4–5 weeks post-start |

---

## APPROVED VENTURES — DETAILED SCORING

---

### VENTURE #2 — Medicare Home Health Agency Data Product
**Score: 88/100 — PRIORITY APPROVED**
**Status:** Spec written. Build queued.
**Recommended Stack:** Next.js + Supabase + Vercel + Stripe (identical to SafeAtHome)
**Est. Time to First Revenue:** 2–3 weeks

| Dimension | Score | Reasoning |
|---|---|---|
| Speed to first revenue | 20/25 | < 1 month: CMS CASPER data is public, enrichment is automated, Stripe already configured |
| Automation potential | 23/25 | > 90%: data ingestion, enrichment, API serving all automated; minor QA needed monthly |
| Margin profile | 25/25 | Data subscription: ~90% gross margin. $500–$2,500/month tiers. |
| Defensibility | 25/25 | Data moat: enriched database with contact data, deficiency history, ownership structure — must rebuild from scratch to compete |
| **Total** | **88/100** | **PRIORITY APPROVED** |

**Target Customers:**
- Home health agencies (competitive intelligence on competitors)
- Medicare consultants and advisors (market intelligence)
- Private equity firms evaluating acquisitions
- Placement agents and care coordinators
- Healthcare investors and analysts

**Why It Wins:** CMS publishes raw CASPER data publicly but it's unusable without enrichment. We add contact info, key staff, survey deficiency history, ownership, and service area mapping. The enriched product is 10x more valuable than the raw data — and the enrichment compounds automatically via Scout agent.

**Full Spec:** See `_platform/VENTURE_002_SPEC.md`

---

### VENTURE #3 — CAPS Contractor Database API
**Score: 78/100 — APPROVED**
**Status:** Inbox. Build after Venture #2.
**Recommended Stack:** Same as SafeAtHome (already have 35 contractors as seed data)
**Est. Time to First Revenue:** 3–4 weeks

| Dimension | Score | Reasoning |
|---|---|---|
| Speed to first revenue | 20/25 | < 1 month: seed data exists (35 contractors), Scout already scraping NAHB directory |
| Automation potential | 20/25 | > 75%: scraping + enrichment automated; manual verification for premium listings |
| Margin profile | 25/25 | API subscription or data export: ~90% margin |
| Defensibility | 15/25 | Brand + SEO authority: first-mover in CAPS data API, but not hard to replicate long-term |
| **Total** | **78/100** | **APPROVED** |

**Target Customers:**
- Software vendors serving home health agencies (need contractor referral data)
- Insurance companies mapping contractor availability
- SafeAtHome itself (internal product strengthening)
- Medicaid waiver programs (matching beneficiaries to contractors)

**Why It Wins:** We're already building the contractor database for SafeAtHome. Monetizing it as an API is almost zero incremental work. The differentiation is CAPS certification verification + contact enrichment + geographic coverage.

**Recommended Pricing:** $99/month (1,000 API calls), $299/month (10,000 calls), $999/month (unlimited + bulk export)
**Go-to-Market:** Cold outreach to home health software vendors; list on RapidAPI; content marketing targeting "CAPS contractor API" keyword.

---

### VENTURE #4 — Geriatric Care Manager Directory
**Score: 72/100 — APPROVED**
**Status:** Inbox. Build after Venture #3.
**Recommended Stack:** Same as SafeAtHome (directory model)
**Est. Time to First Revenue:** 4–6 weeks

| Dimension | Score | Reasoning |
|---|---|---|
| Speed to first revenue | 15/25 | < 3 months: requires data scraping + content build before monetization |
| Automation potential | 20/25 | > 75%: Scout scrapes NAPGCM directory, Writer builds location pages |
| Margin profile | 25/25 | Affiliate + lead gen + listing subscription: ~90% margin |
| Defensibility | 12/25 | SEO compounds over time; lower than data products |
| **Total** | **72/100** | **APPROVED** |

**Data Source:** National Association of Professional Geriatric Care Managers (NAPGCM) public directory
**Target Customers (directory visitors):** Adult children needing care coordination; discharge planners; elder law attorneys
**Revenue Model:** Lead gen + professional listing subscriptions ($49–$149/month)
**Why It Wins:** Geriatric care management is underserved in search. NAPGCM directory is the only public source, but it's not searchable by service type or insurance. We add those layers.

---

### VENTURE #5 — Home Health Aide Supply/Demand Data by ZIP
**Score: 70/100 — APPROVED**
**Status:** Inbox. Build after Venture #4 or in parallel with #3.
**Recommended Stack:** Supabase data product + simple API + CSV export
**Est. Time to First Revenue:** 5–7 weeks

| Dimension | Score | Reasoning |
|---|---|---|
| Speed to first revenue | 15/25 | < 3 months: requires aggregating multiple CMS + BLS datasets |
| Automation potential | 20/25 | > 75%: CMS data is public and structured; monthly refresh automated |
| Margin profile | 25/25 | Data subscription: ~90% margin |
| Defensibility | 10/25 | Moderate: BLS/CMS data is public, but ZIP-level aggregation with supply/demand ratio is novel |
| **Total** | **70/100** | **APPROVED** |

**Data Sources:** CMS home health agency data (CASPER), Bureau of Labor Statistics (home health aide employment by area), Medicare claims data (demand proxy)
**Target Customers:** Home health agency operators planning expansion; private equity evaluating market entry; staffing agencies; healthcare real estate investors
**Pricing:** $299/month (state-level), $799/month (ZIP-level full dataset), $2,499/month (custom analysis + API)

---

### VENTURE #11 — Veterans Home Modification Grant Database
**Score: 72/100 — APPROVED**
**Status:** Inbox. Can run parallel to other ventures (low build complexity).
**Recommended Stack:** Simple Next.js directory + Supabase
**Est. Time to First Revenue:** 4–5 weeks

| Dimension | Score | Reasoning |
|---|---|---|
| Speed to first revenue | 15/25 | < 3 months: requires data compilation + SEO content |
| Automation potential | 20/25 | > 75%: grant data is public + static (updates ~annually); Scout monitors |
| Margin profile | 25/25 | Affiliate + lead gen: ~92% margin |
| Defensibility | 12/25 | SEO + content authority; not a hard moat but first-mover advantage |
| **Total** | **72/100** | **APPROVED** |

**Data Sources:** VA SAH/SHA grants, HUD SHOP program, USDA RD programs, state veteran affairs departments
**Target Customers:** Veterans and family members; VA social workers; nonprofit housing orgs
**Why It Wins:** Veterans searching for home modification grants have high intent and zero good resources. Most searches return outdated PDF links and government jargon. A clean, current directory with eligibility filters + contractor referrals is the obvious product.
**Cross-sell:** CAPS contractor referrals from SafeAtHome database → direct revenue synergy

---

## WATCH LIST — Not Building Yet

### Senior Living Facility Data Product — 68/100
**Why not now:** Overlaps with Venture #2 but requires different data pipeline (state licensing boards vary widely). Revisit after Medicare data product is live — learnings will transfer.

### Aging-in-Place Interior Designers Directory — 65/100
**Why not now:** Smaller TAM than CAPS contractors; harder to find a clean public data source for designers. Revisit Q3.

### Medicare Advantage Plan Comparison Data API — 60/100
**Why flagged:** CMS publishes plan data but the regulatory environment around Medicare plan marketing is complex. Compliance risk reduces score. Revisit with legal review.

---

## REJECTED

### Adaptive Equipment Supplier Directory — 55/100
**Why rejected:** Market is highly fragmented (thousands of small suppliers with no central registry). Scout cannot build a comprehensive database at acceptable quality. Low average order value reduces affiliate potential. No clear path to defensibility.

### Senior Move Manager Directory — 58/100
**Why watch list / near-rejected:** National Association of Senior Move Managers (NASMM) directory has limited public data; members have low digital footprint. Search volume for this category is thin. May revisit if SafeAtHome builds enough SEO authority to cross-sell.

---

## BUILD SEQUENCE RECOMMENDATION

```
NOW:        Venture #1 SafeAtHome — get first content + revenue flowing
WEEK 2-3:   Start Venture #2 Medicare Data — 88/100 score, fastest path to $500+/month
WEEK 4-5:   Venture #3 CAPS API — data already exists in Supabase, near-zero incremental build
WEEK 6-8:   Venture #4 GCM Directory + Venture #11 Veterans Grants — can run parallel
WEEK 9-12:  Venture #5 HHA Supply/Demand Data — completes the data product cluster
```

**Rationale:** Data products (#2, #3, #5) have the best margin and defensibility. Directories (#1, #4, #11) build the audience and SEO authority that makes data products more credible. Running them together creates a compounding flywheel — each venture strengthens the others.
