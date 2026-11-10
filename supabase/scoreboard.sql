-- Scoreboard tracking tables. Run once in the Supabase SQL editor.

-- One row per visit. Browsers never touch the table directly: they go through the
-- two functions below, so visitors can't read or edit anyone else's sessions.
CREATE TABLE IF NOT EXISTS public.usage_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- null for visitors who aren't signed in
  visitor_id TEXT NOT NULL,                                  -- random id kept in the browser
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS usage_sessions_started_at_idx ON public.usage_sessions (started_at);
ALTER TABLE public.usage_sessions ENABLE ROW LEVEL SECURITY; -- no policies: only the server can read it

CREATE OR REPLACE FUNCTION public.start_usage_session(p_id UUID, p_visitor_id TEXT)
RETURNS VOID LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO usage_sessions (id, user_id, visitor_id)
  VALUES (p_id, auth.uid(), LEFT(p_visitor_id, 64))
  ON CONFLICT (id) DO NOTHING;
$$;

-- Sessions can only be extended for 12 hours, so a stray tab can't inflate the numbers forever.
CREATE OR REPLACE FUNCTION public.touch_usage_session(p_id UUID)
RETURNS VOID LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE usage_sessions SET last_seen_at = NOW()
  WHERE id = p_id AND started_at > NOW() - INTERVAL '12 hours';
$$;

REVOKE ALL ON FUNCTION public.start_usage_session(UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.touch_usage_session(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.start_usage_session(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.touch_usage_session(UUID) TO anon, authenticated;

-- One row per successful translation, written by the server with the OpenAI tokens it used.
CREATE TABLE IF NOT EXISTS public.translation_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  endpoint TEXT NOT NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS translation_events_created_at_idx ON public.translation_events (created_at);
ALTER TABLE public.translation_events ENABLE ROW LEVEL SECURITY; -- no policies: server only
