# IDEA CRITERIA
## Venture Scoring Rubric — AI Holding Company
**Version:** 1.0 | **Created:** 2026-04-04
**Rule:** Minimum score of 70/100 required to build. No exceptions. Gut feel is not a score.

---

## SCORING RUBRIC (100 points total)

### 1. SPEED TO FIRST REVENUE (25 points)
*How quickly can this generate the first dollar?*

| Timeframe | Score |
|---|---|
| < 2 weeks | 25 |
| < 1 month | 20 |
| < 3 months | 15 |
| > 3 months | 5 |

**Notes:** Count from build-start to first paying customer. Not first traffic, not first lead — first dollar in.

---

### 2. AUTOMATION POTENTIAL (25 points)
*What percentage of ongoing operations can be handled by agents with no human intervention?*

| Automation Level | Score |
|---|---|
| > 90% automated | 25 |
| > 75% automated | 20 |
| > 50% automated | 15 |
| < 50% automated | 5 |

**Notes:** "Automated" means agents execute it — Scout, Writer, Lead Router, etc. Manual client calls, fulfillment, or human creative work reduces this score. If it requires Mike's time to deliver the product, score is capped at 15.

---

### 3. MARGIN PROFILE (25 points)
*What is the gross margin at steady state (excluding Mike's time)?*

| Gross Margin | Score |
|---|---|
| > 80% margin | 25 |
| > 60% margin | 20 |
| > 40% margin | 15 |
| < 40% margin | 5 |

**Notes:** Affiliate revenue = ~95% margin. Data product subscriptions = ~90% margin. Physical products or high-COGS digital = penalized. Services with contractor delivery = capped at 15.

---

### 4. DEFENSIBILITY (25 points)
*What makes this hard to copy once it's working?*

| Moat Type | Score |
|---|---|
| Data moat (proprietary database, network data) | 25 |
| Network effect (value increases with users) | 20 |
| Brand + SEO authority (years of compounding content) | 15 |
| No defensibility (anyone can replicate) | 5 |

**Notes:** Most of our ventures will be in the 15–20 range as SEO content compounds. Data products score 25 because the enriched database itself is the moat — competitors must rebuild it from scratch.

---

## SCORING THRESHOLDS

| Score | Decision |
|---|---|
| 85–100 | **PRIORITY BUILD** — flag in Slack, queue immediately |
| 70–84 | **APPROVED** — add to VENTURE_PIPELINE.md, build in sequence |
| 55–69 | **WATCH LIST** — monitor; revisit if circumstances change |
| < 55 | **REJECTED** — log reasoning, do not revisit without new information |

---

## AUTOMATIC DISQUALIFIERS (score becomes 0 regardless of rubric)

- Requires live sales staff or account management to deliver
- Primary revenue depends on paid acquisition (ads) as the only channel
- Requires regulatory approval or professional licensing to operate
- Requires building a two-sided marketplace from scratch (chicken-and-egg problem)
- Estimated build time > 6 weeks for a single person
- Requires hardware or physical inventory

---

## HOW SCOUT APPLIES THIS RUBRIC

1. Read the idea (from #mike-ideas Slack, Greg Isenberg content, or Scout's research)
2. Score each of the 4 dimensions with explicit reasoning
3. Check against disqualifiers
4. Post total score + breakdown to #mike-ideas
5. If 70+: post Approve/Reject buttons via Slack approval service
6. If 85+: tag as PRIORITY, post to #ops-safehome as well
7. If approved: add to VENTURE_PIPELINE.md and create `~/ventures/[venture-slug]/` folder
8. Log scoring run to agent_log in Supabase

---

## SCORING EXAMPLES

### SafeAtHome Guide (Venture #1) — BUILT
- Speed to revenue: 15 (< 3 months with full content build)
- Automation: 25 (> 90%: Scout researches, Writer writes, Lead Router routes, all automated)
- Margin: 25 (affiliate = 95%, lead sales = 100% margin)
- Defensibility: 15 (SEO authority compounds over 12–24 months)
- **Total: 80/100 — APPROVED** ✅

### Medicare Home Health Agency Data Product (Venture #2) — APPROVED
- Speed to revenue: 20 (< 1 month: CMS data is public, enrichment is automated)
- Margin: 25 (data subscription = ~90% margin)
- Automation: 23 (> 90%: CMS ingestion + enrichment + API all automated; minor data QA needed)
- Defensibility: 25 (data moat: enriched database with contact info, survey data, ownership — competitors must rebuild)
- **Total: 88 (adjusted)/100 — PRIORITY APPROVED** ✅
