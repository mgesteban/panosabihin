"use client"

import { useEffect } from "react"
import { createSupabaseClient } from "@/lib/supabase"

const HEARTBEAT_MS = 60_000
// Coming back to the tab after this long counts as a new visit, so hidden time isn't counted.
const NEW_VISIT_AFTER_MS = 5 * 60_000

function getVisitorId() {
  try {
    let id = localStorage.getItem("panosabihin_visitor_id")
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem("panosabihin_visitor_id", id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

/**
 * Records how long someone has the app open, for the daily scoreboard email.
 * Pass undefined while auth is still loading; a sign-in or sign-out starts a new visit.
 * Failures are ignored so tracking can never break the app.
 */
export function useUsageSession(userId: string | null | undefined) {
  useEffect(() => {
    if (userId === undefined) return

    const supabase = createSupabaseClient()
    let sessionId = ""
    let lastSeen = 0

    const startVisit = () => {
      sessionId = crypto.randomUUID()
      lastSeen = Date.now()
      void supabase.rpc("start_usage_session", { p_id: sessionId, p_visitor_id: getVisitorId() })
    }

    const ping = () => {
      if (document.visibilityState !== "visible") return
      if (Date.now() - lastSeen > NEW_VISIT_AFTER_MS) return startVisit()
      lastSeen = Date.now()
      void supabase.rpc("touch_usage_session", { p_id: sessionId })
    }

    startVisit()
    const timer = setInterval(ping, HEARTBEAT_MS)
    document.addEventListener("visibilitychange", ping)
    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", ping)
    }
  }, [userId])
}
