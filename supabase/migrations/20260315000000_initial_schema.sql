-- ═══════════════════════════════════════════════════
-- PLATFORM TABLES (shared across all ventures)
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS approval_requests (
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

CREATE TABLE IF NOT EXISTS agent_log (
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

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venture TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  provider TEXT,
  monthly_cost DECIMAL(10,2) DEFAULT 0,
  annual_cost DECIMAL(10,2) DEFAULT 0,
  renewal_date DATE,
  status TEXT DEFAULT 'active',
  credentials_ref TEXT,
  notes TEXT,
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════
-- SAFEHOME TABLES
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sh_products (
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
  affiliate_network TEXT,
  commission_rate DECIMAL(5,2),
  commission_type TEXT,
  safe_score INT CHECK (safe_score BETWEEN 0 AND 100),
  safe_score_breakdown JSONB,
  pros JSONB,
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

CREATE TABLE IF NOT EXISTS sh_categories (
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
  ('door-access', 'Door & Access', 'Widening, automatic openers, lever handles', 10)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS sh_contractors (
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
  specialties JSONB,
  years_in_business INT,
  bbb_rating TEXT,
  bbb_url TEXT,
  license_number TEXT,
  license_state TEXT,
  insurance_verified BOOLEAN DEFAULT FALSE,
  listing_tier TEXT DEFAULT 'free',
  stripe_subscription_id TEXT,
  monthly_mrr DECIMAL(10,2) DEFAULT 0,
  lead_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  source TEXT DEFAULT 'nahb_scrape',
  scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sh_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  zip TEXT,
  city TEXT,
  state TEXT,
  product_interest TEXT,
  urgency TEXT,
  home_owner BOOLEAN,
  budget_range TEXT,
  notes TEXT,
  lead_quality TEXT,
  source_page TEXT,
  source_keyword TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  routed_to TEXT,
  routed_contractor_id UUID REFERENCES sh_contractors(id),
  route_value DECIMAL(10,2),
  route_paid BOOLEAN DEFAULT FALSE,
  email_sequence_started BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sh_content_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  title TEXT,
  target_keyword TEXT,
  monthly_search_volume INT,
  keyword_difficulty INT,
  priority INT DEFAULT 5,
  data_payload JSONB,
  status TEXT DEFAULT 'queued',
  assigned_to TEXT,
  output_path TEXT,
  published_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sh_content (
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

CREATE TABLE IF NOT EXISTS sh_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  network TEXT,
  product_name TEXT,
  source_page TEXT,
  source_keyword TEXT,
  contractor_id UUID REFERENCES sh_contractors(id),
  commission_rate DECIMAL(5,2),
  status TEXT DEFAULT 'confirmed',
  external_transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS domain_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venture TEXT NOT NULL,
  domain_name TEXT NOT NULL,
  is_available BOOLEAN,
  price_usd DECIMAL(10,2),
  registrar TEXT,
  has_backlink_history BOOLEAN,
  domain_authority INT,
  brandability_score INT,
  keyword_relevance INT,
  overall_score INT,
  recommended BOOLEAN DEFAULT FALSE,
  notes TEXT,
  research_batch_id UUID,
  approval_request_id UUID REFERENCES approval_requests(id),
  purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sh_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  source TEXT,
  source_page TEXT,
  interests JSONB,
  sequence_day INT DEFAULT 0,
  last_email_sent_at TIMESTAMPTZ,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sh_products_category ON sh_products(category);
CREATE INDEX IF NOT EXISTS idx_sh_products_published ON sh_products(is_published);
CREATE INDEX IF NOT EXISTS idx_sh_contractors_state_city ON sh_contractors(state_abbr, city);
CREATE INDEX IF NOT EXISTS idx_sh_leads_created ON sh_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sh_content_queue_status ON sh_content_queue(status, priority);
CREATE INDEX IF NOT EXISTS idx_sh_revenue_created ON sh_revenue(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_log_agent ON agent_log(agent_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests(status);
