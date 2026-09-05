-- ReadyPal
-- Create a secure direct-conversation RPC for client <-> agent messaging
-- started outside of a booking (e.g. from the hiring/negotiation flow).
--
-- Mirrors create_booking_conversation(): runs SECURITY DEFINER because the
-- caller needs to insert a conversation_participants row for the other
-- party, which normal RLS does not permit from the client.

CREATE OR REPLACE FUNCTION public.create_direct_conversation(other_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_conversation_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF other_user_id IS NULL THEN
    RAISE EXCEPTION 'Missing recipient';
  END IF;

  IF other_user_id = v_user_id THEN
    RAISE EXCEPTION 'Cannot start a conversation with yourself';
  END IF;

  -- Reuse an existing direct conversation between exactly these two users.
  SELECT cp1.conversation_id
  INTO v_conversation_id
  FROM public.conversation_participants cp1
  JOIN public.conversation_participants cp2
    ON cp2.conversation_id = cp1.conversation_id
   AND cp2.user_id = other_user_id
  JOIN public.conversations c ON c.id = cp1.conversation_id
  WHERE cp1.user_id = v_user_id
    AND c.type = 'direct'
  LIMIT 1;

  IF v_conversation_id IS NULL THEN
    INSERT INTO public.conversations (type, category, is_emergency)
    VALUES ('direct', 'care', false)
    RETURNING id INTO v_conversation_id;

    INSERT INTO public.conversation_participants (conversation_id, user_id)
    VALUES (v_conversation_id, v_user_id)
    ON CONFLICT (conversation_id, user_id) DO NOTHING;

    INSERT INTO public.conversation_participants (conversation_id, user_id)
    VALUES (v_conversation_id, other_user_id)
    ON CONFLICT (conversation_id, user_id) DO NOTHING;
  END IF;

  RETURN v_conversation_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_direct_conversation(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_direct_conversation(uuid) TO authenticated;
