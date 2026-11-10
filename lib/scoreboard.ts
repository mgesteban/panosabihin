import { getSupabaseAdmin } from "./supabase-admin"

const TZ = "America/Los_Angeles"
const DAY_MS = 86_400_000

// Approximate list prices (USD per 1M tokens), used only when the OpenAI admin key isn't set.
const PRICES: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
}

// ---------- Pacific-time day boundaries ----------

function pacificParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value)
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute"), second: get("second") }
}

/** The instant that is midnight in Pacific time on the given calendar date (month is 1-based). */
export function pacificMidnight(year: number, month: number, day: number) {
  const guess = Date.UTC(year, month - 1, day)
  const p = pacificParts(new Date(guess))
  const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - guess
  return new Date(guess - offset)
}

/** Yesterday as a Pacific-time calendar day. */
export function yesterdayPacific(now = new Date()) {
  const today = pacificParts(now)
  const end = pacificMidnight(today.year, today.month, today.day)
  const start = pacificMidnight(today.year, today.month, today.day - 1)
  const d = pacificParts(new Date(start.getTime() + 12 * 3_600_000))
  return { start, end, year: d.year, month: d.month, day: d.day }
}

// ---------- Data gathering ----------

type Supabase = NonNullable<ReturnType<typeof getSupabaseAdmin>>

// Supabase returns at most 1000 rows per request, so read in pages.
async function fetchAll<T>(query: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const rows: T[] = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await query(from, from + 999)
    if (error) throw new Error(error.message)
    rows.push(...(data ?? []))
    if (!data || data.length < 1000) return rows
  }
}

type Profile = { id: string; email: string; translation_count: number; has_paid: boolean; created_at: string }
type Session = { user_id: string | null; visitor_id: string; started_at: string; last_seen_at: string }
type TranslationEvent = { model: string; input_tokens: number; output_tokens: number }

async function loadData(supabase: Supabase, start: Date, end: Date) {
  const [profiles, sessions, events] = await Promise.all([
    fetchAll<Profile>((a, b) =>
      supabase.from("user_profiles").select("id,email,translation_count,has_paid,created_at").order("created_at").range(a, b)),
    fetchAll<Session>((a, b) =>
      supabase.from("usage_sessions").select("user_id,visitor_id,started_at,last_seen_at")
        .gte("started_at", start.toISOString()).lt("started_at", end.toISOString()).order("started_at").range(a, b)),
    fetchAll<TranslationEvent>((a, b) =>
      supabase.from("translation_events").select("model,input_tokens,output_tokens")
        .gte("created_at", start.toISOString()).lt("created_at", end.toISOString()).order("created_at").range(a, b)),
  ])
  return { profiles, sessions, events }
}

/** Actual OpenAI spend for one UTC day and the month so far, from the OpenAI costs API. */
async function fetchOpenAICosts(year: number, month: number, day: number) {
  const key = process.env.OPENAI_ADMIN_KEY
  if (!key) return null
  const monthStart = Date.UTC(year, month - 1, 1) / 1000
  const dayStart = Date.UTC(year, month - 1, day) / 1000
  const res = await fetch(
    `https://api.openai.com/v1/organization/costs?start_time=${monthStart}&bucket_width=1d&limit=31`,
    { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" },
  )
  if (!res.ok) throw new Error(`OpenAI costs API returned ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const body = (await res.json()) as {
    data: Array<{ start_time: number; results: Array<{ amount?: { value?: number } }> }>
  }
  let dayCost = 0
  let monthCost = 0
  for (const bucket of body.data) {
    const total = bucket.results.reduce((sum, r) => sum + Number(r.amount?.value ?? 0), 0)
    if (bucket.start_time > dayStart) continue // only count through the reported day
    monthCost += total
    if (bucket.start_time === dayStart) dayCost = total
  }
  return { dayCost, monthCost }
}

// ---------- Report ----------

const minutes = (ms: number) => Math.round(ms / 60_000)
const usd = (n: number) => `$${n.toFixed(n < 1 ? 4 : 2)}`
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!)

export async function buildScoreboard(now = new Date()) {
  const { start, end, year, month, day } = yesterdayPacific(now)
  const dateLabel = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    timeZone: "UTC", weekday: "long", month: "long", day: "numeric", year: "numeric",
  })
  const problems: string[] = []
  const sections: Array<{ title: string; rows: Array<[string, string]> }> = []
  let userTable = ""

  // Users, visits, time in app, translations
  const supabase = getSupabaseAdmin()
  let tokenEstimate: number | null = null
  if (!supabase) {
    problems.push("SUPABASE_SERVICE_ROLE_KEY isn't set, so user and visit numbers are missing.")
  } else {
    try {
      const { profiles, sessions, events } = await loadData(supabase, start, end)
      const durations = sessions.map((s) => Math.max(0, Date.parse(s.last_seen_at) - Date.parse(s.started_at)))
      const totalMs = durations.reduce((a, b) => a + b, 0)
      const visitors = new Set(sessions.map((s) => s.visitor_id)).size
      const signedIn = new Set(sessions.flatMap((s) => (s.user_id ? [s.user_id] : [])))

      const newUsers = profiles.filter((p) => { const t = Date.parse(p.created_at); return t >= start.getTime() && t < end.getTime() })
      const ages = profiles.map((p) => (end.getTime() - Date.parse(p.created_at)) / DAY_MS)
      const avgAge = ages.length ? ages.reduce((a, b) => a + b, 0) / ages.length : 0
      const inputTokens = events.reduce((a, e) => a + e.input_tokens, 0)
      const outputTokens = events.reduce((a, e) => a + e.output_tokens, 0)
      tokenEstimate = events.reduce((sum, e) => {
        const price = PRICES[e.model]
        return price ? sum + (e.input_tokens * price.input + e.output_tokens * price.output) / 1e6 : sum
      }, 0)

      sections.push({ title: "Who used it", rows: [
        ["Visitors", String(visitors)],
        ["Signed-in users active", String(signedIn.size)],
        ["Visits", String(sessions.length)],
        ["Translations", String(events.length)],
      ] })
      sections.push({ title: "Time in app", rows: [
        ["Total", `${minutes(totalMs)} min`],
        ["Average per visitor", `${visitors ? minutes(totalMs / visitors) : 0} min`],
        ["Longest visit", `${minutes(Math.max(0, ...durations))} min`],
      ] })
      sections.push({ title: "Members", rows: [
        ["Total accounts", String(profiles.length)],
        ["New yesterday", newUsers.length ? `${newUsers.length} (${newUsers.map((u) => u.email).join(", ")})` : "0"],
        ["Paying", String(profiles.filter((p) => p.has_paid).length)],
        ["Average time as a member", `${Math.round(avgAge)} days`],
        ["All-time translations", String(profiles.reduce((a, p) => a + (p.translation_count ?? 0), 0))],
      ] })

      // Per-user table for signed-in users who were active yesterday
      const msByUser = new Map<string, number>()
      sessions.forEach((s, i) => { if (s.user_id) msByUser.set(s.user_id, (msByUser.get(s.user_id) ?? 0) + durations[i]) })
      const active = profiles.filter((p) => msByUser.has(p.id)).sort((a, b) => msByUser.get(b.id)! - msByUser.get(a.id)!)
      if (active.length) {
        userTable = `<h3 style="margin:24px 0 8px">Signed-in users active yesterday</h3>
<table cellpadding="6" style="border-collapse:collapse;font-size:14px;width:100%">
<tr style="text-align:left;border-bottom:1px solid #ccc"><th>Email</th><th>Time</th><th>Member for</th><th>Translations (all-time)</th><th>Paid</th></tr>
${active.slice(0, 25).map((p) => `<tr style="border-bottom:1px solid #eee"><td>${esc(p.email)}</td><td>${minutes(msByUser.get(p.id)!)} min</td><td>${Math.floor((end.getTime() - Date.parse(p.created_at)) / DAY_MS)} days</td><td>${p.translation_count}</td><td>${p.has_paid ? "Yes" : "No"}</td></tr>`).join("\n")}
</table>`
      }
      sections.push({ title: "OpenAI tokens", rows: [
        ["Input", inputTokens.toLocaleString("en-US")],
        ["Output", outputTokens.toLocaleString("en-US")],
      ] })
    } catch (error) {
      problems.push(`Couldn't read usage data from Supabase: ${error instanceof Error ? error.message : error}. Has supabase/scoreboard.sql been run?`)
    }
  }

  // OpenAI spend
  const costRows: Array<[string, string]> = []
  try {
    const costs = await fetchOpenAICosts(year, month, day)
    if (costs) {
      costRows.push([`Yesterday (UTC day)`, usd(costs.dayCost)], ["This month so far", usd(costs.monthCost)])
    } else {
      problems.push("OPENAI_ADMIN_KEY isn't set, so OpenAI cost is an estimate from logged tokens.")
    }
  } catch (error) {
    problems.push(`Couldn't read OpenAI costs: ${error instanceof Error ? error.message : error}`)
  }
  if (!costRows.length && tokenEstimate !== null) costRows.push(["Yesterday (estimate)", usd(tokenEstimate)])
  if (costRows.length) sections.push({ title: "OpenAI cost", rows: costRows })

  const subject = `Panosabihin scoreboard – ${dateLabel}`
  const html = `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px;color:#111">
<h2 style="margin:0 0 4px">Panosabihin daily scoreboard</h2>
<p style="margin:0 0 16px;color:#555">${esc(dateLabel)} (Pacific time)</p>
${sections.map((s) => `<h3 style="margin:20px 0 8px">${esc(s.title)}</h3>
<table cellpadding="4" style="border-collapse:collapse;font-size:15px">
${s.rows.map(([k, v]) => `<tr><td style="color:#555;padding-right:24px">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join("\n")}
</table>`).join("\n")}
${userTable}
${problems.length ? `<div style="margin-top:24px;padding:12px;background:#fff4e5;border-radius:6px;font-size:14px"><strong>Setup notes</strong><ul style="margin:8px 0 0;padding-left:20px">${problems.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>` : ""}
</div>`
  const text = [
    `Panosabihin daily scoreboard – ${dateLabel} (Pacific time)`,
    ...sections.flatMap((s) => ["", s.title, ...s.rows.map(([k, v]) => `  ${k}: ${v}`)]),
    ...(problems.length ? ["", "Setup notes", ...problems.map((p) => `  - ${p}`)] : []),
  ].join("\n")

  return { subject, html, text }
}

export async function sendScoreboardEmail(report: { subject: string; html: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.SCOREBOARD_EMAIL_TO
  if (!apiKey || !to) throw new Error("RESEND_API_KEY and SCOREBOARD_EMAIL_TO must be set")
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.SCOREBOARD_EMAIL_FROM || "Panosabihin Scoreboard <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      subject: report.subject,
      html: report.html,
      text: report.text,
    }),
  })
  if (!res.ok) throw new Error(`Resend returned ${res.status}: ${(await res.text()).slice(0, 300)}`)
}
