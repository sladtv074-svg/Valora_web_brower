/*
# Create profiles table for Valora activity choice

1. New Tables
- `valora_profiles`: the main internet activity chosen during onboarding
  - `user_id` (uuid, primary key, defaults to the signed-in user)
  - `activity` (text, one of: gamer, streamer, professionnel, loisir)
  - `updated_at` (timestamp)

2. Security
- Row level security enabled.
- Only the `authenticated` role can reach the table, and only its own row (ownership checked with auth.uid()).
- Four separate policies (select, insert, update, delete).

3. Important notes
- One profile per user. Changing the activity updates the same row.
*/

CREATE TABLE IF NOT EXISTS valora_profiles (
  user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  activity text NOT NULL CHECK (activity IN ('gamer', 'streamer', 'professionnel', 'loisir')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE valora_profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON valora_profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_valora_profile" ON valora_profiles;
CREATE POLICY "select_own_valora_profile" ON valora_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_valora_profile" ON valora_profiles;
CREATE POLICY "insert_own_valora_profile" ON valora_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_valora_profile" ON valora_profiles;
CREATE POLICY "update_own_valora_profile" ON valora_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_valora_profile" ON valora_profiles;
CREATE POLICY "delete_own_valora_profile" ON valora_profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
