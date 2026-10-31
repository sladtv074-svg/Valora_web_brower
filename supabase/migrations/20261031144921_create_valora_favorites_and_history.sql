/*
# Create favorites and history tables for Valora browser

1. New Tables
- `valora_favorites`: saved pages for each signed-in user
  - `id` (uuid, primary key)
  - `user_id` (uuid, defaults to the signed-in user)
  - `title` (text, not null)
  - `url` (text, not null)
  - `created_at` (timestamp)
- `valora_history`: pages visited by each signed-in user
  - `id` (uuid, primary key)
  - `user_id` (uuid, defaults to the signed-in user)
  - `title` (text, not null)
  - `url` (text, not null)
  - `visited_at` (timestamp)

2. Security
- Row level security enabled on both tables.
- Only the `authenticated` role can reach them, and only its own rows (ownership checked with auth.uid()).
- Four separate policies per table (select, insert, update, delete).

3. Important notes
- A favorite URL can be saved only once per user (unique constraint).
- Deleting a user account removes their favorites and history.
*/

CREATE TABLE IF NOT EXISTS valora_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valora_favorites_user_url_key UNIQUE (user_id, url)
);

CREATE INDEX IF NOT EXISTS valora_favorites_user_id_idx ON valora_favorites (user_id);

CREATE TABLE IF NOT EXISTS valora_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  visited_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS valora_history_user_id_idx ON valora_history (user_id, visited_at DESC);

ALTER TABLE valora_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE valora_history ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON valora_favorites TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON valora_history TO authenticated;

DROP POLICY IF EXISTS "select_own_valora_favorites" ON valora_favorites;
CREATE POLICY "select_own_valora_favorites" ON valora_favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_valora_favorites" ON valora_favorites;
CREATE POLICY "insert_own_valora_favorites" ON valora_favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_valora_favorites" ON valora_favorites;
CREATE POLICY "update_own_valora_favorites" ON valora_favorites FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_valora_favorites" ON valora_favorites;
CREATE POLICY "delete_own_valora_favorites" ON valora_favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_valora_history" ON valora_history;
CREATE POLICY "select_own_valora_history" ON valora_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_valora_history" ON valora_history;
CREATE POLICY "insert_own_valora_history" ON valora_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_valora_history" ON valora_history;
CREATE POLICY "update_own_valora_history" ON valora_history FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_valora_history" ON valora_history;
CREATE POLICY "delete_own_valora_history" ON valora_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
