import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Log that we're starting the translation process
    console.log("Translation API route called")

    // Check if the API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured in environment variables")
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    // Parse the request body
    const body = await request.json()
    const { text } = body

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    console.log("Translating text:", text)

    // Use OpenAI's chat completions API for translation
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are AiPolyglot, a helpful translation assistant. Provide accurate, natural-sounding English translations. Only return the translated text without any additional explanations or notes.",
        },
        {
          role: "user",
          content: `Translate the following text to English: "${text}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    })

    // Extract the translated text from the response
    const translatedText = response.choices[0]?.message?.content?.trim()

    console.log("Translation result:", translatedText)

    if (!translatedText) {
      throw new Error("No translation returned from OpenAI")
    }

    // Return the translated text
    return NextResponse.json({ translatedText })
  } catch (error) {
    // Log the error
    console.error("Translation API error:", error)

    // Return an appropriate error response
    return NextResponse.json({ error: "Translation failed. Please try again." }, { status: 500 })
  }
}
