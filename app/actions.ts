"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getOpenAIKey, isOpenAIConfigured } from "@/lib/env"

export async function translateAction(formData: FormData) {
  try {
    // Check if OpenAI API key is configured
    if (!isOpenAIConfigured()) {
      return { error: "OpenAI API key is not configured. Please add it to your environment variables." }
    }

    const text = formData.get("text") as string

    if (!text || text.trim() === "") {
      return { error: "Text is required" }
    }

    console.log("Server action translating:", text)

    // Make sure we have the API key
    getOpenAIKey()

    const { text: translatedText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Translate the following text to English: "${text}"`,
      system:
        "You are AiPolyglot, a helpful translation assistant. Provide accurate, natural-sounding English translations. Only return the translated text without any additional explanations or notes.",
      maxTokens: 3000,
    })

    console.log("Server action translation result:", translatedText)

    return { translatedText }
  } catch (error) {
    console.error("Server action translation error:", error)
    if (error instanceof Error && error.message.includes("API key")) {
      return { error: "OpenAI API key is not configured. Please check your environment variables." }
    }
    return { error: error instanceof Error ? error.message : "Translation failed" }
  }
}
