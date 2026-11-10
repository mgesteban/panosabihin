import { createClient } from "@supabase/supabase-js"

// Server-only client that bypasses row-level security. Never import this from client components.
// Returns null when SUPABASE_SERVICE_ROLE_KEY isn't set, so callers can skip quietly.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}
