DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sh_contractors_unique'
  ) THEN
    ALTER TABLE sh_contractors ADD CONSTRAINT sh_contractors_unique UNIQUE (business_name, city, state_abbr);
  END IF;
END $$;
