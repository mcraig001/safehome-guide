-- IdeaBrowser ideas ingestion table
-- Stores every idea fetched from IdeaBrowser MCP API.
-- Scored against IDEA_CRITERIA.md by Claude Haiku via WF08.

CREATE TABLE IF NOT EXISTS public.ideabrowser_ideas (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id         integer       NOT NULL UNIQUE,          -- IdeaBrowser's own numeric ID
  title             text          NOT NULL,
  summary           text,
  idea_type         text,                                   -- 'platform', 'service', 'saas', etc.
  market            text,                                   -- 'B2B', 'B2C', etc.
  target            text,
  ib_score_opportunity  integer,                            -- IdeaBrowser opportunity score 0-10
  ib_score_pain         integer,                            -- IdeaBrowser pain score 0-10
  ib_score_timing       integer,                            -- IdeaBrowser timing score 0-10
  ib_score_builder      integer,                            -- IdeaBrowser builder_confidence 0-10
  ib_tags           text[],                                 -- e.g. ['perfect_timing', 'massive_market']
  raw_data          jsonb,                                  -- full API response object
  score             integer,                                -- our IDEA_CRITERIA.md score 0-100
  score_breakdown   jsonb,                                  -- { speed, automation, margin, defense, reasoning }
  status            text          NOT NULL DEFAULT 'new'    -- new | scored | approved | rejected | built
                    CHECK (status IN ('new','scored','approved','rejected','built')),
  hub_url           text,                                   -- link to IdeaBrowser idea page
  discovered_at     timestamptz   NOT NULL DEFAULT now(),
  scored_at         timestamptz,
  actioned_at       timestamptz,
  created_at        timestamptz   NOT NULL DEFAULT now(),
  updated_at        timestamptz   NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ideabrowser_ideas_updated_at ON public.ideabrowser_ideas;
CREATE TRIGGER ideabrowser_ideas_updated_at
  BEFORE UPDATE ON public.ideabrowser_ideas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ib_ideas_status      ON public.ideabrowser_ideas (status);
CREATE INDEX IF NOT EXISTS idx_ib_ideas_score        ON public.ideabrowser_ideas (score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_ib_ideas_discovered   ON public.ideabrowser_ideas (discovered_at DESC);
CREATE INDEX IF NOT EXISTS idx_ib_ideas_source_id    ON public.ideabrowser_ideas (source_id);

-- RLS: service role bypasses; anon has no access
ALTER TABLE public.ideabrowser_ideas ENABLE ROW LEVEL SECURITY;
