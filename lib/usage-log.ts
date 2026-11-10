import type OpenAI from "openai"
import { getSupabaseAdmin } from "./supabase-admin"

// Records one translation and its OpenAI token use for the scoreboard. Never throws.
export async function logTranslation(
  endpoint: string,
  model: string,
  usages: Array<OpenAI.CompletionUsage | undefined>,
) {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) return
    const { error } = await supabase.from("translation_events").insert({
      endpoint,
      model,
      input_tokens: usages.reduce((sum, u) => sum + (u?.prompt_tokens ?? 0), 0),
      output_tokens: usages.reduce((sum, u) => sum + (u?.completion_tokens ?? 0), 0),
    })
    if (error) console.error("Could not log translation:", error.message)
  } catch (error) {
    console.error("Could not log translation:", error)
  }
}
