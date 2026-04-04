# PLATFORM MEMORY
## AI Holding Company — Living Context File
**Version:** 1.0 | **Created:** 2026-04-04 | **Owner:** Mike DeLong
**Rule:** Every agent reads this on startup. Every agent appends learnings at the bottom. This file gets smarter with every run.

---

## PLATFORM STATUS

**Goal:** $50K MRR in 90 days → $500K/month
**Interface:** Slack (phone) | **Engine:** Mac Mini (24/7) | **Root:** ~/ventures/
**Approval gate:** All payments require Slack button-click — NO autonomous spending, ever

### Infrastructure
| Component | Status | Detail |
|---|---|---|
| Mac Mini | ✅ Running 24/7 | ~/ventures/ root |
| n8n | ✅ 5 workflows active | localhost:5678 |
| Supabase | ✅ Live | rmaokwylstpvmaaycuiu |
| Slack / VentureOps bot | ✅ Active | approval gate live |
| Cloudflare tunnels | ✅ Active | slack-approval.safeathomeguides.com |
| GitHub | ✅ Active | mcraig001/safehome-guide |
| Vercel | ✅ Deployed | safehome-black.vercel.app |

---

## VENTURE #1 — SAFEATOME GUIDE
**Status:** LIVE | **Domain:** safeathomeguides.com
**Stage:** Infrastructure complete. Content = 0. Revenue = $0.

### What's Built
- Next.js + Supabase + Vercel stack ✅
- 6 OpenClaw agent SOUL.md files ✅ (Scout, Writer, SEO Operator, Lead Router, Revenue Monitor, Domain Scout)
- 5 n8n workflows active ✅
- 10 product categories seeded ✅
- 35 CAPS contractors in sh_contractors ✅
- 1 test lead in sh_leads
- Slack approval service running ✅
- Affiliate priorities: Inquir.com + Impact.com first; Amazon Associates deferred until traffic threshold

### Current Metrics (2026-04-04)
| Metric | Value |
|---|---|
| Contractors (sh_contractors) | 35 |
| Products (sh_products) | 0 |
| Published content (sh_content) | 0 |
| Leads (sh_leads) | 1 (test) |
| Revenue | $0 |

### Revenue Model (in priority order)
1. **Affiliate commissions** — product reviews → Impact.com / Inquir links
2. **Lead sales** — high-quality leads → Inquir.com ($35–75/lead)
3. **Contractor subscriptions** — Stripe → premium/featured listings

### Immediate Next Actions (Priority Order)
1. Scout to research + stage first 10 products (stairlifts = highest commercial intent)
2. Writer to produce first 5 product review pages (MDX → auto-deploy)
3. SEO Operator: submit URLs to Google + activate rank tracking
4. Revenue Monitor: verify Inquir API key + activate lead routing

---

## VENTURE #2 — MEDICARE HOME HEALTH DATA PRODUCT
**Status:** APPROVED (88/100) | **Stage:** Spec written, build not started
**Target:** First revenue in 2–3 weeks post-build-start
See: `_platform/VENTURE_002_SPEC.md`

---

## AGENT SYSTEM ARCHITECTURE

### The OpenClaw Self-Improvement Loop (Nick Vasilescu pattern)
```
Agent completes task
  → Logs what it learned to PLATFORM_MEMORY.md (this file)
  → Updates its own SOUL.md with refined patterns
  → Patterns compound — platform gets smarter every run
```

### Agent Roster
| Agent | Role | Preferred Model | Schedule |
|---|---|---|---|
| Scout | Product research + CAPS scraping + domain research | Haiku 4.5 | Every 6h |
| Writer | Content creation (MDX → Vercel auto-deploy) | Sonnet 4.6 | Daily, 3 items |
| SEO Operator | Rank tracking + keyword gaps + GSC indexing | Haiku 4.5 | Daily 8am |
| Lead Router | Lead scoring + routing (realtime webhook) | Haiku 4.5 (Ollama fallback) | On webhook |
| Revenue Monitor | Revenue tracking + anomaly detection + weekly report | Haiku 4.5 | Daily 6am + Mon 7am |
| Domain Scout | Domain availability + scoring + Slack approval | Haiku 4.5 | On demand |

### Slack Channel Map
| Channel | Purpose |
|---|---|
| #ops-safehome | All SafeAtHome agent activity |
| #approvals | All money-out requests (button-click required) |
| #revenue | Revenue events + weekly report |
| #seo | Ranking updates, content published |
| #alerts | Errors, anomalies, agent failures |
| #mike-ideas | Idea intake → Scout scores within 6h |

---

## GREG ISENBERG FRAMEWORKS (Operating Playbooks)

### 1. Frey Chu — Niche Directory Model
*SafeAtHome Guide is this model in production.*
- Pick underserved niche with real buying intent + low competition
- Build directory + contractor listings + product reviews
- SEO as primary and only traffic driver (organic first, always)
- Monetize: affiliate commissions + lead gen + listing subscriptions
- Key insight: "boring" niches (aging-in-place, senior safety) = low keyword competition, high commercial intent, older buyers who trust editorial

### 2. Cody Schneider — GTM Engineering Stack
- Build demand capture first (SEO content), then demand gen
- Programmatic SEO: city pages × product categories = thousands of indexable URLs at near-zero marginal cost
- Stack: DataForSEO (keyword research) → Writer agent (content) → Vercel (auto-deploy) → GSC API (indexing)
- Workflow: keyword gap → brief → Writer → auto-deploy → submit to GSC → track

### 3. James Dickerson — Claude Code Marketing System
- Claude Code generates marketing assets at scale from single templates
- Product review template → 1,000s of pages from structured Supabase data
- City + contractor pages: [city] × [service] × [state] = programmatic SEO scale without manual writing

### 4. Nick Vasilescu — OpenClaw Sub-Agent Model
- One gateway → multiple specialized agents, each with a SOUL.md
- Agents update their own SOUL.md as they learn → self-improving
- Platform is model-agnostic: swap models in one YAML line
- Memory architecture: PLATFORM_MEMORY.md = shared brain; SOUL.md = individual agent memory

### 5. Jonathan Courtney — Promoter Blueprint
- Build the audience before you need it
- Email list is the asset that survives algorithm changes
- Weekly newsletter = recurring revenue surface (affiliate + sponsor)
- Lead nurture sequences = relationship → conversion

### 6. Greg Isenberg — Service-to-SaaS Playbook
- Start with done-for-you (lead gen, contractor matching)
- Productize into self-serve SaaS when patterns emerge
- Data products = highest-margin SaaS: build once, sell repeatedly
- Medicare/senior care data = massive underserved enterprise buyer segment (PE, consultants, operators)

---

## IDEA SCORING PATTERNS (Scout updates this as it learns)

### Historically High-Scoring Patterns (score 75+)
- Data products built on CMS/government public data = defensible moat, low build cost
- Niche directories in aging/senior/healthcare = clear buyer, low competition, high affiliate value
- Products with enterprise buyers (PE, consultants, operators) = high willingness to pay

### Historically Low-Scoring Patterns (score <60)
- Generic SaaS without a data moat
- Anything requiring live sales staff or manual fulfillment
- Consumer products with short purchase cycles and no recurring revenue
- B2C with paid acquisition as primary channel (not this platform's strength)

### Idea Intake Process
1. Submit to #mike-ideas Slack channel
2. Scout scores against IDEA_CRITERIA.md within 6 hours
3. Score 70+: Approve/Reject buttons appear
4. Score 85+: PRIORITY flag + immediate notification
5. Approved: added to VENTURE_PIPELINE.md + venture folder created

---

## STANDARD VENTURE STACK (reuse for every new venture)
```
Frontend:    Next.js → Vercel (auto-deploy on git push)
Database:    Supabase (Postgres + Auth)
Payments:    Stripe
Email:       Resend
Automation:  n8n (same 5 workflow patterns)
Agents:      OpenClaw (same 6 agent patterns)
Secrets:     ~/ventures/.env.master (never committed)
```
Adding a new venture = new agent workspace + new Supabase schema prefix. Zero changes to shared platform code.

---

## OPERATING PRINCIPLES (inviolable)
1. **No autonomous payments** — every money-out event goes through Slack approval + button-click
2. **Everything in GitHub** — nothing exists only on the Mac Mini
3. **Audit everything** — every agent action logs to agent_log in Supabase
4. **Agents propose, Mike decides** — agents research and stage; human approves
5. **Build fast, kill losers, scale winners** — no long-term planning docs; iterate
6. **IDEA_CRITERIA.md is the filter** — minimum 70/100 to build anything
7. **Content before paid traffic** — SEO organic always; no paid ads without explicit budget approval

---

## MEMORY UPDATE LOG
*Agents append a single row here after each run*

| Date | Agent | Learning |
|---|---|---|
| 2026-04-04 | Platform Init | PLATFORM_MEMORY.md v1.0 created. Venture #1 live, 35 contractors, 0 revenue. Venture #2 approved (88/100), spec queued. All 5 n8n workflows confirmed active. |
