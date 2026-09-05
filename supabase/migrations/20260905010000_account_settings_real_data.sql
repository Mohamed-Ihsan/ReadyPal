-- ReadyPal
-- Backend support for making the Account Settings screen (Security,
-- Preferences, Data, Help sections) operate on real data instead of mock
-- state: a per-user activity log the client can read/write for itself, and
-- the profile columns needed for privacy/language/notification preferences
-- and a soft-delete flag.

CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_activity_logs_user_id_created_at_idx
  ON public.user_activity_logs (user_id, created_at DESC);

ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own activity logs" ON public.user_activity_logs;
CREATE POLICY "Users can view their own activity logs"
  ON public.user_activity_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own activity logs" ON public.user_activity_logs;
CREATE POLICY "Users can insert their own activity logs"
  ON public.user_activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own activity logs" ON public.user_activity_logs;
CREATE POLICY "Users can delete their own activity logs"
  ON public.user_activity_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Preference/soft-delete columns on profiles. Existing self-update RLS on
-- profiles (already relied on by updateProfile()) covers writes to these.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_preferences jsonb,
  ADD COLUMN IF NOT EXISTS privacy_settings jsonb,
  ADD COLUMN IF NOT EXISTS language_region jsonb,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
