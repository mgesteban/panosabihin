import { NextResponse } from "next/server"

export async function GET() {
  // Check if the API key is configured (don't return the actual key for security)
  const isApiKeyConfigured = !!process.env.OPENAI_API_KEY

  // Return whether the API key is configured
  return NextResponse.json({
    apiKeyConfigured: isApiKeyConfigured,
    nodeEnv: process.env.NODE_ENV,
  })
}
