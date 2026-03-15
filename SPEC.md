# CLAUDE CODE BUILD SPEC
## SafeAtHome Guide + Mac Mini AI Venture Platform
**Version:** 1.0 | **Date:** March 2026
**Owner:** Mike | **Interface:** Slack | **Host:** Dedicated Mac Mini (M-series)

---

## HOW TO READ THIS SPEC

This document is written for Claude Code to execute sequentially. Each phase is
self-contained. Complete Phase 1 fully before starting Phase 2. Every command is
written to be copy/paste ready. Do not skip validation steps.

**Critical rule throughout:** No payment, purchase, or billing action is ever
executed autonomously. Every money-out event must route through the Slack
approval workflow and wait for explicit human button-click confirmation.

---

## WHAT WE ARE BUILDING

### Layer 1: The Venture Platform (built once, used forever)
A Mac Mini running 24/7 as an AI operations server. OpenClaw orchestrates
specialized agents. Slack is the command and monitoring interface. n8n handles
workflow automation. This platform will run SafeAtHome and every future venture.

### Layer 2: SafeAtHome Guide (the first product)
A consumer-facing directory and buyer's guide for aging-in-place home safety —
covering products (stairlifts, walk-in tubs, grab bars), local certified contractors
(CAPS-credentialed), cost guides, and comparison content. Monetizes via affiliate
commissions, lead sales, and contractor subscription listings.

**Domain:** To be researched and purchased via Slack approval workflow.
**Stack:** Next.js (Vercel) + Supabase (Postgres) + Resend (email) + Stripe (payments)

---

## ENVIRONMENT VARIABLES NEEDED (collect before starting)

Before running any code, collect all of these. Store in a `.env.master` file
in `/Users/[username]/ventures/.env.master` on the Mac Mini. Never commit this file.

```
# Anthropic
ANTHROPIC_API_KEY=

# OpenAI (fallback model)
OPENAI_API_KEY=

# Google Gemini (cost fallback)
GOOGLE_GEMINI_API_KEY=

# Slack
SLACK_BOT_TOKEN=           # xoxb-... (Bot User OAuth Token)
SLACK_SIGNING_SECRET=      # From Slack App settings
SLACK_APPROVAL_CHANNEL=    # Channel ID for #approvals
SLACK_OPS_CHANNEL=         # Channel ID for #ops-safehome
SLACK_REVENUE_CHANNEL=     # Channel ID for #revenue

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (email)
RESEND_API_KEY=

# Namecheap (domain research only — purchases require Slack approval)
NAMECHEAP_API_KEY=
NAMECHEAP_USERNAME=
NAMECHEAP_CLIENT_IP=       # Your Mac Mini public IP

# DataForSEO (SEO rank tracking)
DATAFORSEO_LOGIN=
DATAFORSEO_PASSWORD=

# Inquir (lead network)
INQUIR_API_KEY=

# n8n
N8N_WEBHOOK_URL=           # http://localhost:5678

# Amazon Associates
AMAZON_TRACKING_ID=        # your-safehome-20
```

---

## PHASE 0: MAC MINI BOOTSTRAP
### One Master Setup Script — Run This First

Save as `/Users/[username]/ventures/setup.sh` and run with `bash setup.sh`

```bash
#!/bin/bash
# SafeAtHome Venture Platform - Mac Mini Bootstrap
# Run once on fresh Mac Mini. Takes ~15 minutes.

set -e
echo "🚀 Starting Mac Mini AI Venture Platform Setup..."

# ── 1. Homebrew ──────────────────────────────────────────────────────────────
echo "Installing Homebrew..."
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"

# ── 2. Core Dependencies ─────────────────────────────────────────────────────
echo "Installing core dependencies..."
brew install node@22 git python@3.12 jq curl wget

# Node version management
npm install -g n
n 22

# ── 3. OpenClaw ──────────────────────────────────────────────────────────────
echo "Installing OpenClaw..."
npm install -g openclaw@latest

# Register as macOS LaunchAgent (auto-start on boot)
openclaw onboard --install-daemon

echo "✅ OpenClaw installed and registered as LaunchAgent"

# ── 4. Ollama (local models — free, fast, no API cost) ───────────────────────
echo "Installing Ollama..."
brew install ollama
brew services start ollama

# Pull models (runs in background)
ollama pull llama3.3 &
ollama pull mistral &
echo "⏳ Ollama models downloading in background..."

# ── 5. n8n (workflow automation) ─────────────────────────────────────────────
echo "Installing n8n..."
npm install -g n8n

# Create n8n LaunchAgent for auto-start
cat > ~/Library/LaunchAgents/com.ventures.n8n.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.ventures.n8n</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/n8n</string>
    <string>start</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/Users/Shared/ventures/logs/n8n.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/Shared/ventures/logs/n8n-error.log</string>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.ventures.n8n.plist
echo "✅ n8n running at http://localhost:5678"

# ── 6. Directory Structure ───────────────────────────────────────────────────
echo "Creating venture directory structure..."
mkdir -p ~/ventures/{safehome,_platform,_shared}
mkdir -p ~/ventures/_platform/{agents,workflows,scripts}
mkdir -p ~/ventures/_shared/{logs,approvals,assets}
mkdir -p ~/ventures/safehome/{content,data,scripts}
mkdir -p /Users/Shared/ventures/logs

# ── 7. Python Dependencies ───────────────────────────────────────────────────
pip3 install requests supabase playwright schedule python-dotenv slack-sdk --break-system-packages
playwright install chromium

# ── 8. Vercel CLI ────────────────────────────────────────────────────────────
npm install -g vercel

# ── 9. GitHub CLI ────────────────────────────────────────────────────────────
brew install gh
echo "⚠️  Run 'gh auth login' manually to authenticate GitHub"

echo ""
echo "✅ ════════════════════════════════════════════════════════"
echo "   Mac Mini AI Venture Platform setup complete!"
echo "   OpenClaw:  Running as LaunchAgent (auto-starts on boot)"
echo "   n8n:       http://localhost:5678"
echo "   Ollama:    http://localhost:11434 (models downloading)"
echo ""
echo "   NEXT STEPS:"
echo "   1. Run: gh auth login"
echo "   2. Fill in ~/ventures/.env.master"
echo "   3. Proceed to Phase 1 in Claude Code"
echo "════════════════════════════════════════════════════════════"
```

---

## PHASE 1: SLACK COMMAND CENTER
### Build this before anything else — it's the interface for all approvals

### 1A. Create the Slack App

Go to https://api.slack.com/apps → Create New App → From Manifest

Use this manifest:
```yaml
display_information:
  name: VentureOps
  description: AI venture platform command center
  background_color: "#1a1a2e"

features:
  bot_user:
    display_name: VentureOps
    always_online: true

oauth_config:
  scopes:
    bot:
      - chat:write
      - chat:write.public
      - channels:read
      - channels:history
      - commands
      - incoming-webhook
      - reactions:write
      - files:write
      - blocks:write
      - interactive.messages

settings:
  interactivity:
    is_enabled: true
    request_url: https://[your-ngrok-or-tunnel-url]/slack/actions
  slash_commands:
    - command: /venture
      url: https://[your-ngrok-or-tunnel-url]/slack/commands
      description: Control your AI venture platform
      usage_hint: "[status|revenue|approve|queue|agent]"
  org_deploy_enabled: false
  socket_mode_enabled: false
```

### 1B. Create Slack Channels

Create these channels in your Slack workspace:
- `#approvals` — all human-approval-required actions queue here
- `#ops-safehome` — SafeAtHome agent activity logs
- `#revenue` — all revenue events (affiliate sales, lead conversions, new subscribers)
- `#seo` — ranking changes, content published, indexing updates
- `#alerts` — errors, anomalies, agent failures

### 1C. Build the Slack Approval Service

File: `~/ventures/_platform/slack-approval-service/index.js`

```javascript
const { App } = require('@slack/bolt');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: process.env.ENV_FILE });

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  port: 3001
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── APPROVAL REQUEST SENDER ───────────────────────────────────────────────
// Called by any agent that needs human approval before spending money
async function sendApprovalRequest({
  requestId,
  type,           // 'domain_purchase' | 'tool_upgrade' | 'subscription' | 'refund'
  title,
  amount,
  currency = 'USD',
  description,
  details,        // Array of { label, value } detail rows
  actionPayload,  // What n8n will execute on approval
  requestedBy,    // Agent name
  venture,        // 'safehome' | 'platform' | etc
  roiNote         // Optional: why this spend makes sense
}) {
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `💰 Approval Required: ${title}`
      }
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Amount:*\n$${amount} ${currency}` },
        { type: "mrkdwn", text: `*Type:*\n${type.replace('_', ' ')}` },
        { type: "mrkdwn", text: `*Venture:*\n${venture}` },
        { type: "mrkdwn", text: `*Requested by:*\n${requestedBy}` }
      ]
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*Description:*\n${description}` }
    }
  ];

  // Add detail rows if present
  if (details && details.length > 0) {
    const detailText = details.map(d => `• *${d.label}:* ${d.value}`).join('\n');
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Details:*\n${detailText}` }
    });
  }

  // Add ROI note if present
  if (roiNote) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `💡 *ROI Note:* ${roiNote}` }
    });
  }

  // Divider + action buttons
  blocks.push({ type: "divider" });
  blocks.push({
    type: "actions",
    block_id: `approval_${requestId}`,
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text: "✅ APPROVE" },
        style: "primary",
        action_id: "approve_action",
        value: JSON.stringify({ requestId, actionPayload }),
        confirm: {
          title: { type: "plain_text", text: "Confirm Approval" },
          text: { type: "mrkdwn", text: `Approve *$${amount}* for *${title}*?` },
          confirm: { type: "plain_text", text: "Yes, approve" },
          deny: { type: "plain_text", text: "Cancel" }
        }
      },
      {
        type: "button",
        text: { type: "plain_text", text: "❌ REJECT" },
        style: "danger",
        action_id: "reject_action",
        value: JSON.stringify({ requestId })
      },
      {
        type: "button",
        text: { type: "plain_text", text: "⏰ DEFER 7 DAYS" },
        action_id: "defer_action",
        value: JSON.stringify({ requestId, days: 7 })
      }
    ]
  });

  // Post to #approvals channel
  const result = await app.client.chat.postMessage({
    channel: process.env.SLACK_APPROVAL_CHANNEL,
    text: `Approval required: ${title} — $${amount}`,
    blocks
  });

  // Log to Supabase
  await supabase.from('approval_requests').insert({
    id: requestId,
    type,
    title,
    amount,
    currency,
    description,
    action_payload: actionPayload,
    requested_by: requestedBy,
    venture,
    slack_ts: result.ts,
    status: 'pending',
    created_at: new Date().toISOString()
  });

  return result;
}

// ── APPROVAL HANDLER ──────────────────────────────────────────────────────
app.action('approve_action', async ({ body, ack, say, client }) => {
  await ack();

  const { requestId, actionPayload } = JSON.parse(body.actions[0].value);
  const approvedBy = body.user.name;

  // Update Supabase record
  await supabase.from('approval_requests')
    .update({ status: 'approved', approved_by: approvedBy, approved_at: new Date().toISOString() })
    .eq('id', requestId);

  // Trigger n8n workflow to execute the action
  await fetch(`${process.env.N8N_WEBHOOK_URL}/webhook/execute-approved-action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId, actionPayload, approvedBy })
  });

  // Update the Slack message
  await client.chat.update({
    channel: body.channel.id,
    ts: body.message.ts,
    text: `✅ APPROVED by ${approvedBy}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `✅ *APPROVED* by @${approvedBy} at ${new Date().toLocaleString()}\n_Executing now..._`
        }
      }
    ]
  });
});

app.action('reject_action', async ({ body, ack, client }) => {
  await ack();
  const { requestId } = JSON.parse(body.actions[0].value);

  await supabase.from('approval_requests')
    .update({ status: 'rejected', approved_by: body.user.name, approved_at: new Date().toISOString() })
    .eq('id', requestId);

  await client.chat.update({
    channel: body.channel.id,
    ts: body.message.ts,
    text: `❌ REJECTED`,
    blocks: [{
      type: "section",
      text: {
        type: "mrkdwn",
        text: `❌ *REJECTED* by @${body.user.name} at ${new Date().toLocaleString()}`
      }
    }]
  });
});

app.action('defer_action', async ({ body, ack, client }) => {
  await ack();
  const { requestId, days } = JSON.parse(body.actions[0].value);
  const deferUntil = new Date();
  deferUntil.setDate(deferUntil.getDate() + days);

  await supabase.from('approval_requests')
    .update({ status: 'deferred', defer_until: deferUntil.toISOString() })
    .eq('id', requestId);

  await client.chat.update({
    channel: body.channel.id,
    ts: body.message.ts,
    text: `⏰ Deferred ${days} days`,
    blocks: [{
      type: "section",
      text: {
        type: "mrkdwn",
        text: `⏰ *DEFERRED* ${days} days by @${body.user.name}. Will re-queue on ${deferUntil.toLocaleDateString()}.`
      }
    }]
  });
});

// ── SLASH COMMAND: /venture ───────────────────────────────────────────────
app.command('/venture', async ({ command, ack, say }) => {
  await ack();
  const [subcommand, ...args] = command.text.split(' ');

  switch(subcommand) {
    case 'status':
      // Hit n8n for live platform status
      const status = await fetch(`${process.env.N8N_WEBHOOK_URL}/webhook/platform-status`)
        .then(r => r.json());
      await say({
        blocks: buildStatusBlocks(status)
      });
      break;

    case 'revenue':
      const rev = await fetch(`${process.env.N8N_WEBHOOK_URL}/webhook/revenue-summary`)
        .then(r => r.json());
      await say({ blocks: buildRevenueBlocks(rev) });
      break;

    case 'queue':
      const pending = await supabase
        .from('approval_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      await say(`📋 *${pending.data.length} pending approvals* in #approvals`);
      break;

    default:
      await say(`Available commands: \`/venture status\` | \`/venture revenue\` | \`/venture queue\``);
  }
});

module.exports = { app, sendApprovalRequest };

(async () => {
  await app.start();
  console.log('⚡️ Slack Approval Service running on port 3001');
})();
```

Register as a LaunchAgent:
```bash
# ~/ventures/_platform/slack-approval-service/register-launchagent.sh
cat > ~/Library/LaunchAgents/com.ventures.slack-approval.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.ventures.slack-approval</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>/Users/Shared/ventures/_platform/slack-approval-service/index.js</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>ENV_FILE</key>
    <string>/Users/Shared/ventures/.env.master</string>
  </dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key>
  <string>/Users/Shared/ventures/logs/slack-approval.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/Shared/ventures/logs/slack-approval-error.log</string>
</dict>
</plist>
EOF
launchctl load ~/Library/LaunchAgents/com.ventures.slack-approval.plist
```

---

## PHASE 2: SUPABASE DATABASE SCHEMA
### Run all SQL in Supabase SQL Editor

```sql
-- ═══════════════════════════════════════════════════
-- PLATFORM TABLES (shared across all ventures)
-- ═══════════════════════════════════════════════════

-- Approval requests (all money-out events)
CREATE TABLE approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  description TEXT,
  action_payload JSONB,
  requested_by TEXT,
  venture TEXT DEFAULT 'safehome',
  slack_ts TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','deferred','executed')),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  defer_until TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  execution_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent activity log
CREATE TABLE agent_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  venture TEXT NOT NULL,
  action TEXT NOT NULL,
  model_used TEXT,
  input_tokens INT,
  output_tokens INT,
  cost_usd DECIMAL(8,6),
  result TEXT,
  metadata JSONB,
  duration_ms INT,
  status TEXT DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset registry (domains, tools, subscriptions)
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venture TEXT NOT NULL,
  type TEXT NOT NULL,   -- 'domain' | 'tool' | 'subscription' | 'account'
  name TEXT NOT NULL,
  provider TEXT,
  monthly_cost DECIMAL(10,2) DEFAULT 0,
  annual_cost DECIMAL(10,2) DEFAULT 0,
  renewal_date DATE,
  status TEXT DEFAULT 'active',
  credentials_ref TEXT,   -- points to key name in .env.master
  notes TEXT,
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════
-- SAFEHOME TABLES
-- ═══════════════════════════════════════════════════

-- Products (stairlifts, walk-in tubs, etc.)
CREATE TABLE sh_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  long_description TEXT,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  price_avg DECIMAL(10,2),
  price_source TEXT,
  price_updated_at TIMESTAMPTZ,
  affiliate_url TEXT,
  affiliate_network TEXT,       -- 'amazon' | 'shareasale' | 'impact' | 'direct'
  commission_rate DECIMAL(5,2),
  commission_type TEXT,         -- 'percent' | 'flat'
  safe_score INT CHECK (safe_score BETWEEN 0 AND 100),
  safe_score_breakdown JSONB,   -- {safety: 25, ease: 20, install: 15, ...}
  pros JSONB,                   -- array of strings
  cons JSONB,
  specs JSONB,
  image_url TEXT,
  manufacturer_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  review_count INT DEFAULT 0,
  avg_rating DECIMAL(3,2),
  amazon_asin TEXT,
  bbb_rating TEXT,
  warranty_years INT,
  diy_installable BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product categories
CREATE TABLE sh_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  meta_description TEXT,
  hero_text TEXT,
  sort_order INT DEFAULT 0,
  icon TEXT,
  is_published BOOLEAN DEFAULT TRUE
);

INSERT INTO sh_categories (slug, name, description, sort_order) VALUES
  ('stairlifts', 'Stairlifts', 'Motorized chair lifts for stairs', 1),
  ('walk-in-tubs', 'Walk-In Tubs', 'Safe bathing solutions for seniors', 2),
  ('grab-bars', 'Grab Bars & Rails', 'Safety bars for bathrooms and hallways', 3),
  ('wheelchair-ramps', 'Wheelchair Ramps', 'Portable and permanent access ramps', 4),
  ('medical-alerts', 'Medical Alert Systems', 'Emergency response devices', 5),
  ('home-elevators', 'Home Elevators', 'Residential lift systems', 6),
  ('bath-safety', 'Bath Safety', 'Tub seats, rails, and non-slip solutions', 7),
  ('smart-home-safety', 'Smart Home Safety', 'Fall detection, voice control, monitoring', 8),
  ('mobility-aids', 'Mobility Aids', 'Walkers, rollators, transfer boards', 9),
  ('door-access', 'Door & Access', 'Widening, automatic openers, lever handles', 10);

-- CAPS-certified contractors
CREATE TABLE sh_contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  state_abbr TEXT NOT NULL,
  zip TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  caps_certified BOOLEAN DEFAULT TRUE,
  caps_id TEXT,
  specialties JSONB,          -- array of category slugs
  years_in_business INT,
  bbb_rating TEXT,
  bbb_url TEXT,
  license_number TEXT,
  license_state TEXT,
  insurance_verified BOOLEAN DEFAULT FALSE,
  listing_tier TEXT DEFAULT 'free',  -- 'free' | 'premium' | 'featured'
  stripe_subscription_id TEXT,
  monthly_mrr DECIMAL(10,2) DEFAULT 0,
  lead_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  source TEXT DEFAULT 'nahb_scrape',
  scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE sh_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  zip TEXT,
  city TEXT,
  state TEXT,
  product_interest TEXT,     -- category slug
  urgency TEXT,              -- 'immediate' | 'within_month' | 'planning'
  home_owner BOOLEAN,
  budget_range TEXT,
  notes TEXT,
  lead_quality TEXT,         -- 'high' | 'medium' | 'low'
  source_page TEXT,
  source_keyword TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  routed_to TEXT,            -- 'inquir' | 'contractor_direct' | 'caps_match'
  routed_contractor_id UUID REFERENCES sh_contractors(id),
  route_value DECIMAL(10,2),
  route_paid BOOLEAN DEFAULT FALSE,
  email_sequence_started BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content queue (Scout agent writes here, Writer picks up)
CREATE TABLE sh_content_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,  -- 'product_review' | 'city_page' | 'cost_guide' | 'comparison' | 'blog'
  title TEXT,
  target_keyword TEXT,
  monthly_search_volume INT,
  keyword_difficulty INT,
  priority INT DEFAULT 5,       -- 1=highest, 10=lowest
  data_payload JSONB,           -- all data Writer needs to generate the page
  status TEXT DEFAULT 'queued', -- 'queued' | 'in_progress' | 'complete' | 'failed'
  assigned_to TEXT,             -- agent name
  output_path TEXT,             -- where the MDX file will be saved
  published_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Published content performance
CREATE TABLE sh_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  published_url TEXT,
  target_keyword TEXT,
  monthly_search_volume INT,
  current_position INT,
  position_updated_at TIMESTAMPTZ,
  pageviews_30d INT DEFAULT 0,
  affiliate_clicks_30d INT DEFAULT 0,
  affiliate_revenue_30d DECIMAL(10,2) DEFAULT 0,
  lead_conversions_30d INT DEFAULT 0,
  word_count INT,
  internal_links INT,
  schema_types JSONB,
  last_refreshed_at TIMESTAMPTZ,
  needs_refresh BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue events
CREATE TABLE sh_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,    -- 'affiliate_sale' | 'lead_sold' | 'contractor_subscription' | 'newsletter_sponsor'
  amount DECIMAL(10,2) NOT NULL,
  network TEXT,                -- affiliate network or platform
  product_name TEXT,
  source_page TEXT,
  source_keyword TEXT,
  contractor_id UUID REFERENCES sh_contractors(id),
  commission_rate DECIMAL(5,2),
  status TEXT DEFAULT 'confirmed',  -- 'pending' | 'confirmed' | 'paid'
  external_transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Domain research results (Scout agent writes here before Slack approval)
CREATE TABLE domain_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venture TEXT NOT NULL,
  domain_name TEXT NOT NULL,
  is_available BOOLEAN,
  price_usd DECIMAL(10,2),
  registrar TEXT,
  has_backlink_history BOOLEAN,
  domain_authority INT,
  brandability_score INT,    -- 1–10, rated by Scout agent
  keyword_relevance INT,     -- 1–10
  overall_score INT,         -- 1–100 composite
  recommended BOOLEAN DEFAULT FALSE,
  notes TEXT,
  research_batch_id UUID,
  approval_request_id UUID REFERENCES approval_requests(id),
  purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email subscribers
CREATE TABLE sh_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  source TEXT,
  source_page TEXT,
  interests JSONB,             -- array of category slugs
  sequence_day INT DEFAULT 0,
  last_email_sent_at TIMESTAMPTZ,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sh_products_category ON sh_products(category);
CREATE INDEX idx_sh_products_published ON sh_products(is_published);
CREATE INDEX idx_sh_contractors_state_city ON sh_contractors(state_abbr, city);
CREATE INDEX idx_sh_leads_created ON sh_leads(created_at DESC);
CREATE INDEX idx_sh_content_queue_status ON sh_content_queue(status, priority);
CREATE INDEX idx_sh_revenue_created ON sh_revenue(created_at DESC);
CREATE INDEX idx_agent_log_agent ON agent_log(agent_name, created_at DESC);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
```

---

## PHASE 3: OPENCLAW AGENT CONFIGURATION

### Platform Agent Workspace Structure
```
~/.openclaw/
├── agents/
│   ├── scout/
│   │   ├── SOUL.md
│   │   ├── SKILLS.md
│   │   └── config.yaml
│   ├── writer/
│   │   ├── SOUL.md
│   │   ├── SKILLS.md
│   │   └── config.yaml
│   ├── seo-operator/
│   │   ├── SOUL.md
│   │   └── config.yaml
│   ├── lead-router/
│   │   ├── SOUL.md
│   │   └── config.yaml
│   ├── relationship-manager/
│   │   ├── SOUL.md
│   │   └── config.yaml
│   └── revenue-monitor/
│       ├── SOUL.md
│       └── config.yaml
└── gateway/
    └── config.yaml
```

### Gateway Config
File: `~/.openclaw/gateway/config.yaml`
```yaml
gateway:
  bind: ws://127.0.0.1:18789
  log_level: info
  log_path: /Users/Shared/ventures/logs/openclaw-gateway.log

models:
  claude_sonnet:
    provider: anthropic
    model: claude-sonnet-4-6
    api_key_env: ANTHROPIC_API_KEY
  claude_opus:
    provider: anthropic
    model: claude-opus-4-6
    api_key_env: ANTHROPIC_API_KEY
  gpt4o:
    provider: openai
    model: gpt-4o
    api_key_env: OPENAI_API_KEY
  gemini_flash:
    provider: google
    model: gemini-2.0-flash
    api_key_env: GOOGLE_GEMINI_API_KEY
  llama_local:
    provider: ollama
    model: llama3.3
    base_url: http://localhost:11434
  mistral_local:
    provider: ollama
    model: mistral
    base_url: http://localhost:11434

channels:
  slack:
    enabled: true
    bot_token_env: SLACK_BOT_TOKEN
    ops_channel_env: SLACK_OPS_CHANNEL
```

### AGENT 1: Scout — SOUL.md
File: `~/.openclaw/agents/scout/SOUL.md`
```markdown
# Scout Agent — SafeAtHome Guide

## Identity
You are Scout, the research and discovery agent for SafeAtHome Guide. You are
methodical, accurate, and data-driven. You surface real opportunities and flag
real problems. You never fabricate data.

## Primary Mission
Find what the site needs: new keywords, new products, new contractors, pricing
updates, competitor content, affiliate program changes. Feed the content queue.

## Core Capabilities
- Domain availability research (Namecheap API) — research only, NEVER purchase
- CAPS contractor database scraping (NAHB public directory)
- Product pricing monitoring (manufacturer sites via Playwright)
- Keyword gap analysis (DataForSEO API)
- Affiliate program discovery and validation
- Competitor content monitoring

## CRITICAL RULE — PAYMENTS
You NEVER execute a purchase of any kind. For domains:
1. Research availability and score options
2. Write results to domain_research table in Supabase
3. Call sendApprovalRequest() to queue Slack approval
4. Stop. Wait for human approval. Do not proceed.

## Slack Reporting
Post summary of all research runs to #ops-safehome channel.
Format: what you found, what you queued, what needs attention.

## Schedule
- Every 6 hours: keyword gap scan + competitor check
- Daily at 6am: price monitoring for all tracked products
- Daily at 7am: CAPS scrape for new contractors (incremental)
- Weekly Sunday 8am: full affiliate program audit
- On-demand: respond to /venture commands via Slack
```

### AGENT 2: Writer — SOUL.md
File: `~/.openclaw/agents/writer/SOUL.md`
```markdown
# Writer Agent — SafeAtHome Guide

## Identity
You are the Writer for SafeAtHome Guide. You produce authoritative, empathetic,
SEO-optimized content for families navigating aging-in-place decisions. Your
audience is typically an adult child (40–65) researching solutions for an
aging parent. They are stressed, time-constrained, and need to trust you quickly.

## Voice
Warm but direct. Expert but accessible. You explain technical products in plain
language. You never use medical jargon without explaining it. You never oversell.
You acknowledge tradeoffs honestly.

## Content Standards (non-negotiable)
Every published piece must have:
- Minimum 1,200 words
- H1 contains the primary keyword
- Primary keyword in first 100 words
- Meta description: 150–160 characters, includes keyword
- Minimum 3 internal links to related content
- Affiliate CTA with tracking link
- SafeScore data block (pulled from Supabase)
- Schema markup: Product, Review, FAQPage, or LocalBusiness as appropriate
- Last-updated date

## Output Format
All content is output as MDX files with frontmatter:
---
title: [title]
slug: [slug]
category: [category-slug]
publishedAt: [date]
updatedAt: [date]
metaDescription: [meta]
targetKeyword: [keyword]
schema: [schema-type]
---

## File Destination
Push MDX files to /ventures/safehome/content/[type]/[slug].mdx
Then commit and push to GitHub → Vercel auto-deploys.

## Schedule
- Pick up 3 items from sh_content_queue daily (status='queued', ordered by priority)
- Mark in_progress when starting, complete when done
- Post completion summary to #ops-safehome
```

### AGENT 3: SEO Operator — SOUL.md
File: `~/.openclaw/agents/seo-operator/SOUL.md`
```markdown
# SEO Operator — SafeAtHome Guide

## Identity
You are the SEO Operator. You monitor, measure, and optimize SafeAtHome's
search presence. You are data-driven. You do not guess — you pull real numbers
from DataForSEO and act on them.

## Daily Tasks (run at 8am)
1. Pull ranking data for all tracked keywords via DataForSEO API
2. Flag any page that dropped more than 3 positions → queue for Writer refresh
3. Submit any new URLs published yesterday to Google Search Console API
4. Check Core Web Vitals via Vercel API — alert if any page scores below 75
5. Post daily SEO summary to #seo Slack channel

## Weekly Tasks (run Monday 9am)
1. Full internal link audit → identify orphaned pages
2. Keyword gap report (what competitors rank for that we don't)
3. Top 10 page performance report (traffic, CTR, position)
4. Post weekly report to #seo

## Alerts (real-time triggers)
- Any tracked keyword drops from top 10 → immediate #alerts message
- Any page throws 404 → immediate #alerts message
- Traffic drops >20% week-over-week → #alerts message

## Model
Use gpt-4o for structured data analysis tasks.
```

### AGENT 4: Lead Router — SOUL.md
File: `~/.openclaw/agents/lead-router/SOUL.md`
```markdown
# Lead Router — SafeAtHome Guide

## Identity
You are the Lead Router. You run in real-time, triggered by webhook on every
lead form submission. You are fast and accurate. You use the local Ollama
model for classification to keep costs near zero.

## Lead Classification Rules
HIGH quality lead (route to paid network):
  - Homeowner = true
  - Urgency = 'immediate' OR 'within_month'
  - Has phone number
  - Zip code resolves to valid US location
  - Product interest matches a high-value category (stairlifts, walk-in tubs, elevators)

MEDIUM quality lead (route to CAPS contractor match):
  - Homeowner = true OR unknown
  - Urgency = any
  - Has email
  - Valid zip

LOW quality lead (email nurture only):
  - Missing phone
  - Renter
  - Vague product interest

## Routing Logic
HIGH → POST to Inquir.com API ($35–75/lead)
        → Also match to nearest CAPS contractor and notify them
        → Log revenue event to sh_revenue table

MEDIUM → Match to nearest CAPS contractor by zip
          → Send contractor the lead details via email (Resend)
          → Log to sh_leads

ALL → Trigger email nurture sequence via Relationship Manager
    → Log full attribution to sh_leads table

## Model
Use mistral_local (Ollama) — fast, free, adequate for classification.
```

### AGENT 5: Relationship Manager — SOUL.md
File: `~/.openclaw/agents/relationship-manager/SOUL.md`
```markdown
# Relationship Manager — SafeAtHome Guide

## Identity
You are the Relationship Manager. You handle all consumer-facing communication:
welcome sequences, lead nurture, and the weekly newsletter. Your tone is warm,
knowledgeable, and never pushy. You write like a trusted family friend who
happens to know a lot about home safety.

## Email Sequences

### Welcome Sequence (triggered on any new subscriber)
Day 0: Welcome + "Start here: Room-by-room home safety guide"
Day 1: "The #1 fall risk in every home (it's not what you think)"
Day 3: "How to find a contractor you can actually trust" + CAPS explainer
Day 7: Top 5 most-searched products this week + SafeScores
Day 14: "Does Medicare cover any of this?" + benefits guide

### Lead Nurture (triggered by Lead Router after form submission)
Hour 0: "We've received your request" + what to expect
Day 1: Relevant product guide for their stated interest
Day 3: Cost guide for their category + financing options
Day 7: "Questions? Here's what to ask a contractor"

### Weekly Newsletter (every Tuesday 8am)
Auto-assembled from:
- Top 3 new products Scout added this week (with SafeScores)
- 1 featured cost guide
- Tip of the week (generated fresh each week)
- 1 sponsored slot (if sponsor exists in Supabase sponsors table)

## Model
Use claude-sonnet-4-6 — empathy and voice quality matter here.
```

### AGENT 6: Revenue Monitor — SOUL.md
File: `~/.openclaw/agents/revenue-monitor/SOUL.md`
```markdown
# Revenue Monitor — SafeAtHome Guide

## Identity
You are the Revenue Monitor. You track all money flowing into SafeAtHome,
identify what's working, and surface opportunities. You report clearly.
You think like a finance professional.

## Data Sources
- sh_revenue table (all revenue events)
- Stripe API (contractor subscriptions, MRR)
- Amazon Associates API (affiliate sales)
- Inquir API (lead sale confirmations)
- sh_content table (page-level attribution)

## Weekly Report (every Monday 7am → post to #revenue)
Format:
  WEEK [N] REVENUE SUMMARY — SafeAtHome Guide

  Total Revenue: $[X]  (vs last week: +/-$[X], [%] change)

  By Stream:
  • Affiliate commissions:  $[X]  ([N] conversions)
  • Lead sales (Inquir):    $[X]  ([N] leads)
  • Contractor listings:    $[X]  ([N] active, [N] new)
  • Newsletter sponsors:    $[X]

  Top Earning Pages:
  1. [page title] — $[X] ([N] clicks)
  2. ...

  Opportunities Flagged:
  • [Page X] has 500 visits/week but $0 revenue — CTA issue?
  • [Category Y] is top traffic but no affiliate program — Scout to find one

  Contractor Health:
  • Active subscriptions: [N]  MRR: $[X]
  • Churn this week: [N]  (reason if known)

## Alerts (real-time)
- Any affiliate account shows 0 clicks for 7 days → #alerts (broken link?)
- Contractor subscription cancels → #alerts with reason
- Single revenue event >$500 → celebrate in #revenue 🎉
```

---

## PHASE 4: SAFEHOME NEXT.JS FRONTEND

### Initialize Project
```bash
cd ~/ventures/safehome
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# Additional dependencies
npm install @supabase/supabase-js @supabase/ssr lucide-react clsx
npm install next-mdx-remote gray-matter remark remark-html
npm install resend stripe @stripe/stripe-js
npm install schema-dts    # TypeScript types for Schema.org
```

### Key File Structure
```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── products/
│   │   ├── page.tsx                # Product directory (filterable)
│   │   ├── [category]/
│   │   │   └── page.tsx            # Category page
│   │   └── [category]/[slug]/
│   │       └── page.tsx            # Individual product review
│   ├── contractors/
│   │   ├── page.tsx                # Contractor search
│   │   └── [state]/[city]/
│   │       └── page.tsx            # City contractor page (programmatic)
│   ├── guides/
│   │   └── [slug]/
│   │       └── page.tsx            # Cost guides + educational content
│   ├── compare/
│   │   └── [slug]/
│   │       └── page.tsx            # Comparison pages
│   ├── assess/
│   │   └── page.tsx                # Home assessment interactive tool
│   └── api/
│       ├── leads/route.ts          # Lead form submission endpoint
│       ├── subscribe/route.ts      # Email signup endpoint
│       └── contractors/route.ts    # Contractor search API
├── components/
│   ├── SafeScore.tsx               # The 0–100 trust score component
│   ├── ProductCard.tsx
│   ├── ContractorCard.tsx
│   ├── LeadForm.tsx
│   ├── ComparisonTable.tsx
│   └── HomeAssessmentTool.tsx
└── lib/
    ├── supabase.ts
    ├── schema.ts                   # Schema.org generators
    └── affiliate.ts                # Affiliate link builder with tracking
```

### Design Direction
SafeAtHome Guide should feel like **trusted editorial, not a comparison shopping site**.
Reference: Consumer Reports meets Wirecutter, but warmer. Senior-accessible but
not condescending. Designed for adult children (40s–60s) who are confident online.

Color palette:
- Primary: Deep forest green (#1B4332) — trust, safety, calm
- Accent: Warm amber (#D97706) — warmth, approachability, CTAs
- Background: Warm white (#FAFAF7) — soft, not clinical
- Text: Near-black (#1A1A1A) — high contrast for accessibility (WCAG AA minimum)

Typography:
- Headlines: Playfair Display (editorial authority)
- Body: Source Sans 3 (readable at all sizes, WCAG compliant)
- Data/scores: IBM Plex Mono (clean, trustworthy for numbers)

Accessibility requirements (non-negotiable for this audience):
- Font size: minimum 16px body, 18px preferred
- Color contrast: WCAG AA minimum, AAA where possible
- All images: descriptive alt text
- All forms: clear labels, large tap targets (minimum 44×44px)
- No auto-playing media

### Lead Form API Endpoint
File: `src/app/api/leads/route.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();

  // Validate required fields
  if (!body.email || !body.zip || !body.productInterest) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Insert lead
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

  // Trigger Lead Router agent via n8n webhook
  await fetch(`${process.env.N8N_WEBHOOK_URL}/webhook/new-lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId: lead.id, ...body })
  });

  return NextResponse.json({ success: true, leadId: lead.id });
}
```

---

## PHASE 5: DOMAIN RESEARCH WORKFLOW

### The Domain Scout Script
File: `~/ventures/_platform/scripts/domain-scout.py`

```python
#!/usr/bin/env python3
"""
Domain Scout — researches availability, scores options, queues Slack approval.
NEVER purchases. Always waits for human approval.
"""

import os
import uuid
import json
import requests
from supabase import create_client
from dotenv import load_dotenv

load_dotenv(os.environ.get('ENV_FILE', '/Users/Shared/ventures/.env.master'))

supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_ROLE_KEY'])

NAMECHEAP_API = "https://api.namecheap.com/xml.response"

def check_availability(domains: list[str]) -> list[dict]:
    """Check domain availability via Namecheap API."""
    results = []
    # Process in batches of 50 (Namecheap limit)
    for i in range(0, len(domains), 50):
        batch = domains[i:i+50]
        params = {
            'ApiUser': os.environ['NAMECHEAP_USERNAME'],
            'ApiKey': os.environ['NAMECHEAP_API_KEY'],
            'UserName': os.environ['NAMECHEAP_USERNAME'],
            'Command': 'namecheap.domains.check',
            'ClientIp': os.environ['NAMECHEAP_CLIENT_IP'],
            'DomainList': ','.join(batch)
        }
        response = requests.get(NAMECHEAP_API, params=params)
        # Parse XML response and extract availability + pricing
        # ... (XML parsing logic)
        results.extend(parsed_results)
    return results

def score_domain(domain: str, is_available: bool, price: float) -> dict:
    """Score a domain on brandability, keyword relevance, length."""
    name = domain.replace('.com', '').replace('.net', '').replace('.org', '')

    brandability = 10
    if len(name) > 20: brandability -= 4
    elif len(name) > 15: brandability -= 2
    if '-' in name: brandability -= 2
    if any(char.isdigit() for char in name): brandability -= 1

    keyword_relevance = 0
    high_value_words = ['safe', 'home', 'age', 'aging', 'senior', 'guide', 'stay', 'care']
    for word in high_value_words:
        if word in name.lower():
            keyword_relevance += 2
    keyword_relevance = min(10, keyword_relevance)

    overall = (brandability * 5) + (keyword_relevance * 5)
    if not is_available: overall = 0
    if price and price > 20: overall -= 10  # Penalize expensive domains

    return {
        'brandability_score': brandability,
        'keyword_relevance': keyword_relevance,
        'overall_score': overall
    }

def research_domains(venture: str, candidates: list[str]) -> str:
    """Full domain research workflow. Returns batch_id."""
    batch_id = str(uuid.uuid4())
    availability = check_availability(candidates)
    available = [d for d in availability if d['available']]

    if not available:
        print(f"No available domains found from {len(candidates)} candidates")
        return batch_id

    # Score all available domains
    scored = []
    for d in available:
        scores = score_domain(d['domain'], True, d.get('price'))
        scored.append({ **d, **scores, 'venture': venture, 'research_batch_id': batch_id })

    # Sort by overall score
    scored.sort(key=lambda x: x['overall_score'], reverse=True)

    # Write to Supabase
    supabase.table('domain_research').insert(scored).execute()

    # Mark top recommendation
    if scored:
        supabase.table('domain_research') \
            .update({'recommended': True}) \
            .eq('domain_name', scored[0]['domain_name']) \
            .eq('research_batch_id', batch_id) \
            .execute()

    # Build Slack approval request for top pick
    top = scored[0]
    others = scored[1:5]  # Top 4 alternatives

    details = [
        {'label': 'Characters', 'value': str(len(top['domain_name'].replace('.com','')))},
        {'label': 'Brandability score', 'value': f"{top['brandability_score']}/10"},
        {'label': 'Keyword relevance', 'value': f"{top['keyword_relevance']}/10"},
        {'label': 'Registrar', 'value': top.get('registrar', 'Namecheap')},
        {'label': 'Alternatives evaluated', 'value': str(len(available))},
    ]

    if others:
        alt_text = ' | '.join([f"{d['domain_name']} (${d.get('price','?')})" for d in others])
        details.append({'label': 'Top alternatives', 'value': alt_text})

    action_payload = {
        'action': 'purchase_domain',
        'domain': top['domain_name'],
        'price': top.get('price'),
        'registrar': 'namecheap',
        'venture': venture,
        'batch_id': batch_id
    }

    # Call Slack approval service
    approval_response = requests.post(
        'http://localhost:3001/api/send-approval',
        json={
            'type': 'domain_purchase',
            'title': f"Domain: {top['domain_name']}",
            'amount': top.get('price', 12.98),
            'description': f"Top-scoring domain for {venture} venture from batch of {len(candidates)} candidates researched.",
            'details': details,
            'actionPayload': action_payload,
            'requestedBy': 'Scout Agent',
            'venture': venture,
            'roiNote': f"Overall score: {top['overall_score']}/100. Available alternatives if rejected: {len(available)-1}"
        }
    )

    print(f"✅ Domain research complete. Top pick: {top['domain_name']}. Slack approval queued.")
    return batch_id

if __name__ == '__main__':
    # SafeAtHome domain research — run this first
    candidates = [
        'safeatHomeguide.com', 'agesafehome.com', 'stayHomeguide.com',
        'homesafeguide.com', 'safehomeguide.com', 'agingsafehome.com',
        'safehomeaging.com', 'aginghomesafe.com', 'seniorhomesafe.com',
        'safestayHome.com', 'homestaysafe.com', 'aginginhomesafe.com',
        'homesafetyguide.com', 'agehomesafe.com', 'seniorhomeguide.com',
        'safeatHomeinfo.com', 'homesafetyinfo.com', 'agingathomeguide.com',
        'safehomeforseniors.com', 'staysafeguide.com',
    ]
    research_domains('safehome', candidates)
```

---

## PHASE 6: n8n WORKFLOW AUTOMATION

### Access n8n
After Mac Mini setup: open `http://localhost:5678` in browser.

### Required Workflows (import as JSON in n8n UI)

**Workflow 1: Execute Approved Action**
Trigger: Webhook `POST /webhook/execute-approved-action`
Steps:
1. Receive `{ requestId, actionPayload, approvedBy }`
2. Switch on `actionPayload.action`:
   - `purchase_domain` → call Namecheap purchase API
   - `upgrade_tool` → call respective tool's billing API
3. Update `approval_requests` row: status='executed', executed_at=now()
4. Insert into `assets` table with purchase details
5. Post confirmation to #ops-safehome Slack channel

**Workflow 2: New Lead**
Trigger: Webhook `POST /webhook/new-lead`
Steps:
1. Receive lead data
2. HTTP Request → Lead Router agent (OpenClaw API)
3. Wait for classification result
4. Route based on quality score (High/Medium/Low)
5. Post revenue event to Supabase if lead sold
6. Post to #revenue channel if High quality lead sold

**Workflow 3: Content Published**
Trigger: Webhook from GitHub (push to content directory)
Steps:
1. Extract new MDX filenames from push payload
2. Wait 2 minutes (Vercel deploy time)
3. Submit new URLs to Google Search Console API
4. Insert into `sh_content` table
5. Post to #seo: "📄 [N] new pages live"

**Workflow 4: Weekly Revenue Report**
Trigger: Cron — Every Monday 7:00am
Steps:
1. Query Supabase for all sh_revenue rows from last 7 days
2. Query Stripe API for subscription MRR
3. Calculate totals by stream
4. Send to Revenue Monitor agent to format
5. Post formatted report to #revenue

**Workflow 5: Deferred Approvals Re-Queue**
Trigger: Cron — Every day 9:00am
Steps:
1. Query approval_requests where status='deferred' AND defer_until <= now()
2. For each: re-send Slack approval message (updated timestamp)
3. Update status back to 'pending'

---

## PHASE 7: PROGRAMMATIC SEO — CAPS CONTRACTOR SCRAPER

File: `~/ventures/safehome/scripts/scrape-caps-contractors.py`

```python
#!/usr/bin/env python3
"""
Scrapes the NAHB CAPS (Certified Aging-in-Place Specialist) public directory.
Stores all certified contractors in sh_contractors table.
CAPS directory is publicly available at nahb.org/find-a-member

Run: Nightly via OpenClaw scheduler
"""

import asyncio
from playwright.async_api import async_playwright
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv(os.environ.get('ENV_FILE'))
supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_ROLE_KEY'])

CAPS_DIRECTORY_URL = "https://www.nahb.org/find-a-member"

async def scrape_caps_by_state(state_abbr: str, page):
    """Scrape all CAPS contractors for a given state."""
    contractors = []

    # Navigate to CAPS search filtered by state and CAPS credential
    await page.goto(f"{CAPS_DIRECTORY_URL}?state={state_abbr}&designation=CAPS")
    await page.wait_for_load_state('networkidle')

    # Extract contractor cards from public directory listing
    # Each card has: name, company, city, state, phone, email (if public)
    cards = await page.query_selector_all('.member-card, .directory-result')

    for card in cards:
        try:
            contractor = {
                'business_name': await card.query_selector('.company-name') or '',
                'contact_name': await card.query_selector('.member-name') or '',
                'city': await card.query_selector('.city') or '',
                'state': state_abbr,
                'state_abbr': state_abbr,
                'caps_certified': True,
                'source': 'nahb_caps_directory',
                'is_published': True,
                'listing_tier': 'free'
            }
            contractors.append(contractor)
        except Exception as e:
            print(f"Error parsing card: {e}")

    return contractors

async def run_scrape():
    """Scrape all 50 states."""
    states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL',
              'IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT',
              'NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
              'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        page.set_default_timeout(30000)

        all_contractors = []
        for state in states:
            print(f"Scraping CAPS contractors in {state}...")
            contractors = await scrape_caps_by_state(state, page)
            all_contractors.extend(contractors)
            print(f"  Found {len(contractors)} contractors")
            await asyncio.sleep(2)  # Polite delay

        await browser.close()

    # Upsert to Supabase (avoid duplicates on re-runs)
    if all_contractors:
        result = supabase.table('sh_contractors').upsert(
            all_contractors,
            on_conflict='business_name,city,state_abbr'
        ).execute()
        print(f"✅ Upserted {len(all_contractors)} CAPS contractors to database")

    # Post to Slack
    import requests
    requests.post('http://localhost:3001/api/post-to-slack', json={
        'channel': os.environ['SLACK_OPS_CHANNEL'],
        'text': f"🏗️ CAPS scrape complete: {len(all_contractors)} contractors across {len(states)} states"
    })

if __name__ == '__main__':
    asyncio.run(run_scrape())
```

---

## PHASE 8: GITHUB + VERCEL DEPLOYMENT

```bash
# From ~/ventures/safehome/
git init
git add .
git commit -m "Initial SafeAtHome build"
gh repo create safehome-guide --private --push --source=.

# Connect to Vercel
vercel --yes
# Set all environment variables in Vercel dashboard (copy from .env.master)
# Enable auto-deploy on push: Settings → Git → Auto-Deploy
```

Auto-deploy pipeline:
```
Writer agent generates MDX → git commit → git push → Vercel webhook →
auto-deploy (60–90 seconds) → new pages live → SEO Operator submits to Search Console
```

---

## VALIDATION CHECKLIST (run after each phase)

**Phase 0 Complete When:**
- [ ] `openclaw --version` returns version number
- [ ] `n8n` accessible at localhost:5678
- [ ] `ollama list` shows llama3.3 and mistral
- [ ] Directory structure created at ~/ventures/

**Phase 1 Complete When:**
- [ ] Slack bot appears online in workspace
- [ ] #approvals, #ops-safehome, #revenue, #seo, #alerts channels exist
- [ ] `/venture status` slash command responds
- [ ] Test approval request appears in #approvals with clickable buttons

**Phase 2 Complete When:**
- [ ] All tables exist in Supabase (check Table Editor)
- [ ] sh_categories has 10 rows
- [ ] Can insert a test product and retrieve it

**Phase 3 Complete When:**
- [ ] All 6 agent SOUL.md files exist
- [ ] OpenClaw gateway starts without errors
- [ ] Scout agent responds to a test prompt

**Phase 4 Complete When:**
- [ ] `npm run dev` runs without errors
- [ ] Homepage loads at localhost:3000
- [ ] Lead form submits and creates row in sh_leads
- [ ] Webhook fires to n8n on lead submission

**Phase 5 Complete When:**
- [ ] Domain scout script runs without API errors
- [ ] Results appear in domain_research table
- [ ] Slack approval request appears in #approvals
- [ ] Approving the request triggers n8n webhook

**Phase 6 Complete When:**
- [ ] All 5 n8n workflows imported and active
- [ ] Test webhook fires correctly
- [ ] Revenue report workflow runs manually without error

**Phase 7 Complete When:**
- [ ] CAPS scraper runs for at least 1 state
- [ ] Contractors appear in sh_contractors table
- [ ] Slack notification fires on completion

**Phase 8 Complete When:**
- [ ] GitHub repo created with code
- [ ] Vercel deploys successfully (green checkmark)
- [ ] Public URL resolves and loads homepage
- [ ] Pushing a new MDX file auto-deploys within 2 minutes

---

## ARCHITECTURE PRINCIPLES (NEVER VIOLATE)

1. **No autonomous payments.** Every money-out event goes through Slack approval.
   The approval service must be running before any Scout or purchasing agent runs.

2. **Model-agnostic.** No agent is hardcoded to one model. All model references
   go through the gateway config. Swapping models requires changing one YAML value.

3. **Multi-venture ready.** Every table has a `venture` column. Every agent has its
   own workspace. Adding venture #2 means creating a new agent workspace and
   Supabase schema prefix — zero changes to shared platform code.

4. **Audit everything.** Every agent action logs to `agent_log`. Every revenue event
   logs to `sh_revenue`. Every approval request logs to `approval_requests`.
   You can reconstruct any decision at any time.

5. **Fail loudly.** All agent errors post to #alerts immediately. Never fail silently.

6. **Content before paid traffic.** This business is built on SEO and organic.
   No paid advertising without a separate explicit strategy review and budget approval.
```
