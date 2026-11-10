import { type NextRequest, NextResponse } from "next/server"
import { buildScoreboard, sendScoreboardEmail } from "@/lib/scoreboard"

export const dynamic = "force-dynamic"

// Called daily by Vercel Cron (see vercel.json), which sends "Authorization: Bearer $CRON_SECRET".
// Add ?preview=1 to get the email as a web page instead of sending it.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const report = await buildScoreboard()
    if (request.nextUrl.searchParams.get("preview")) {
      return new NextResponse(report.html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
    }
    await sendScoreboardEmail(report)
    return NextResponse.json({ sent: true, subject: report.subject })
  } catch (error) {
    console.error("Scoreboard failed:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Scoreboard failed" }, { status: 500 })
  }
}
