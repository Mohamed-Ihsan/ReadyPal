-- ReadyPal
-- Create a secure booking-scoped direct conversation RPC.
--
-- This migration intentionally contains the original ON CONFLICT target used
-- during development. The follow-up migration
-- 20260830010000_fix_booking_conversation_conflict_target.sql
-- corrects the partial-index predicate so the RPC works correctly.

CREATE UNIQUE INDEX IF NOT EXISTS conversations_booking_direct_unique
ON public.conversations (booking_id)
WHERE type = 'direct' AND booking_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.create_booking_conversation(booking_uuid uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_booking public.bookings%ROWTYPE;
  v_conversation_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT *
  INTO v_booking
  FROM public.bookings
  WHERE id = booking_uuid;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF v_user_id <> v_booking.agent_id
     AND v_user_id <> v_booking.client_id THEN
    RAISE EXCEPTION 'Not authorized for this booking';
  END IF;

  IF v_booking.agent_id IS NULL OR v_booking.client_id IS NULL THEN
    RAISE EXCEPTION 'This booking has no one to message yet';
  END IF;

  SELECT id
  INTO v_conversation_id
  FROM public.conversations
  WHERE booking_id = booking_uuid
    AND type = 'direct'
  LIMIT 1;

  IF v_conversation_id IS NULL THEN
    INSERT INTO public.conversations (
      type,
      booking_id,
      category,
      is_emergency
    )
    VALUES (
      'direct',
      booking_uuid,
      'task',
      false
    )
    ON CONFLICT (booking_id) WHERE type = 'direct'
    DO NOTHING
    RETURNING id INTO v_conversation_id;

    IF v_conversation_id IS NULL THEN
      SELECT id
      INTO v_conversation_id
      FROM public.conversations
      WHERE booking_id = booking_uuid
        AND type = 'direct'
      LIMIT 1;
    END IF;
  END IF;

  INSERT INTO public.conversation_participants (
    conversation_id,
    user_id
  )
  VALUES (
    v_conversation_id,
    v_booking.agent_id
  )
  ON CONFLICT (conversation_id, user_id) DO NOTHING;

  INSERT INTO public.conversation_participants (
    conversation_id,
    user_id
  )
  VALUES (
    v_conversation_id,
    v_booking.client_id
  )
  ON CONFLICT (conversation_id, user_id) DO NOTHING;

  RETURN v_conversation_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_booking_conversation(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_booking_conversation(uuid) TO authenticated;
