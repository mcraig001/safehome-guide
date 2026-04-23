-- Add outreach tracking to sh_contractors
ALTER TABLE sh_contractors
  ADD COLUMN IF NOT EXISTS outreach_status TEXT,
  ADD COLUMN IF NOT EXISTS outreach_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS outreach_completed_at TIMESTAMPTZ;

-- Outreach log: one row per email send attempt
CREATE TABLE IF NOT EXISTS sh_outreach_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID NOT NULL REFERENCES sh_contractors(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  email_sequence_step INT NOT NULL CHECK (email_sequence_step IN (1, 2, 3)),
  subject TEXT,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  resend_message_id TEXT,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'opened', 'replied', 'unsubscribed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sh_outreach_log_contractor ON sh_outreach_log(contractor_id);
CREATE INDEX IF NOT EXISTS idx_sh_outreach_log_status ON sh_outreach_log(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sh_contractors_outreach ON sh_contractors(outreach_status) WHERE outreach_status IS NOT NULL;
