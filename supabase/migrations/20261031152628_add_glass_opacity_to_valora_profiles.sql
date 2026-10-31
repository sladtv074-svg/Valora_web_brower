/*
# Add glass opacity preference to Valora profiles

1. Modified Tables
- `valora_profiles`
  - `activity` can now be empty, so a profile can store only a display preference.
  - New column `glass_opacity` (integer, 20 to 100, default 60): how opaque the liquid glass panels look.

2. Security
- No change to row level security or grants. The existing four policies still restrict every row to its owner.

3. Important notes
- Existing rows keep their activity. The new column is filled with the default value.
*/

ALTER TABLE valora_profiles ALTER COLUMN activity DROP NOT NULL;

ALTER TABLE valora_profiles
  ADD COLUMN IF NOT EXISTS glass_opacity integer NOT NULL DEFAULT 60
  CHECK (glass_opacity BETWEEN 20 AND 100);
