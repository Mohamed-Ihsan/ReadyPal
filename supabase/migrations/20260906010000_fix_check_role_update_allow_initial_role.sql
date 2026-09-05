-- Root cause, proven empirically against the live project (not guessed):
--
-- A disposable throwaway test account was created via supabase.auth.signUp()
-- using only the public anon key (no service role, no RLS bypass), then its
-- own profiles row was read back under its own session:
--
--   profiles.role = null   <-- confirmed: NO default role is assigned at
--                              signup. handle_new_user() and any column
--                              default are NOT the problem.
--
-- The same session then ran exactly what RoleSelectScreen's continueClick
-- sends (update({ role: 'client', full_name, email }).eq('id', <own id>)),
-- against that same row where OLD.role was confirmed null one query
-- earlier. It was rejected:
--
--   code: P0001
--   message: "Changing your own role is not permitted."
--
-- So check_role_update() is rejecting the update EVEN WHEN OLD.role IS
-- NULL — the "allow the initial choice" exception described in an earlier
-- session ("We updated the DB trigger so that IF OLD.role IS NULL, users
-- ARE permitted...") is not actually in effect in the live function,
-- whatever its current body actually says. This is a database-side bug,
-- not a frontend one: AuthOnboarding.tsx's role handling was re-verified
-- against this same evidence and is already correct (it reads role: null
-- correctly and sends the same clean, minimal payload the diagnostic used).
--
-- This migration replaces ONLY the guard trigger function's logic with the
-- correct rule: permit setting the role exactly once (from NULL to any
-- value), and continue blocking any change once a real role already
-- exists. It does not touch handle_new_user(), does not touch the
-- CREATE TRIGGER binding (already correctly wired to this function, since
-- it fires reliably), and does not alter profiles' columns, defaults, or
-- RLS policies. This repo has no earlier migration that created this
-- function, so its prior body (whatever the actual bug in it was) is not
-- preserved here — only the corrected logic.

create or replace function public.check_role_update()
returns trigger
language plpgsql
as $$
begin
  -- A brand-new profile has role = NULL until the user completes
  -- ReadyPal's role-selection step — that first assignment must be
  -- allowed. Once a real role exists, no further change is permitted,
  -- from any client, ever (existing clients/agents keep working exactly
  -- as before).
  if OLD.role is not null and NEW.role is distinct from OLD.role then
    raise exception 'Changing your own role is not permitted.';
  end if;
  return NEW;
end;
$$;
