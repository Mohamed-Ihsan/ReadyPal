-- ReadyPal
-- Prevent duplicate bookings for the same application.
--
-- Confirmed against the live schema before adding this: bookings has no
-- UNIQUE constraint on application_id — inserting a second bookings row for
-- the same application_id currently succeeds silently. hireApplication() in
-- src/lib/api.ts already guards against this at the application layer (a
-- single atomically-guarded UPDATE on applications.status that only one
-- concurrent caller can win, plus an existing-booking check before ever
-- inserting), but that is not a substitute for the real database-level
-- invariant. This adds it directly. Idempotent: safe to run if the
-- constraint (or one with this name) already exists.
--
-- application_id is nullable on bookings, which is fine here — a UNIQUE
-- constraint does not restrict multiple NULLs in Postgres.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_application_id_key'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_application_id_key UNIQUE (application_id);
  END IF;
END $$;
