import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    console.log("Bidirectional Translation API route called")

    // Check if the API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured in environment variables")
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    // Parse the request body
    const body = await request.json()
    const { text, targetLanguage, sourceLanguage, autoDetect = true } = body

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    console.log("Translating text:", text)
    console.log("Target language:", targetLanguage)
    console.log("Source language:", sourceLanguage)
    console.log("Auto detect:", autoDetect)

    let systemPrompt = ""
    let userPrompt = ""

    if (autoDetect) {
      // Auto-detect mode: determine language and translate accordingly
      systemPrompt = `You are AiPolyglot, a professional bidirectional translation assistant. 

Your task is to:
1. Detect if the input text is in English or another language
2. If the text is in English, translate it to ${targetLanguage || 'the user\'s native language'}
3. If the text is NOT in English, translate it to English
4. Provide highly accurate, natural-sounding translations that preserve meaning, tone, and cultural context
5. Pay special attention to idiomatic expressions, cultural nuances, and proper names

Return ONLY the translated text without any additional explanations, notes, or language labels.`

      userPrompt = `Translate this text appropriately (English to ${targetLanguage || 'native language'} OR native language to English): "${text}"`
    } else {
      // Manual mode: translate from source to target language
      const fromLang = sourceLanguage === 'en' ? 'English' : sourceLanguage
      const toLang = targetLanguage === 'en' ? 'English' : targetLanguage

      systemPrompt = `You are AiPolyglot, a professional translation assistant. Provide highly accurate, natural-sounding translations from ${fromLang} to ${toLang} that preserve the original meaning, tone, and cultural context. Pay special attention to idiomatic expressions, cultural nuances, and proper names. Only return the translated text without any additional explanations or notes.`

      userPrompt = `Translate the following text from ${fromLang} to ${toLang}: "${text}"`
    }

    // Use OpenAI's chat completions API for translation with GPT-4 for superior quality
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 1500,
    })

    // Extract the translated text from the response
    const translatedText = response.choices[0]?.message?.content?.trim()

    console.log("Translation result:", translatedText)

    if (!translatedText) {
      throw new Error("No translation returned from OpenAI")
    }

    // Detect the direction of translation for response
    const detectionResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a language detection assistant. Determine if the given text is primarily in English or another language. Respond with only 'english' or 'other'.",
        },
        {
          role: "user",
          content: `Detect the primary language of this text: "${text}"`,
        },
      ],
      temperature: 0.1,
      max_tokens: 10,
    })

    const detectedLanguage = detectionResponse.choices[0]?.message?.content?.trim().toLowerCase()
    const translationDirection = detectedLanguage === 'english' ? 'english-to-native' : 'native-to-english'

    // Return the translated text with metadata
    return NextResponse.json({ 
      translatedText,
      translationDirection,
      detectedSourceLanguage: detectedLanguage === 'english' ? 'en' : 'other'
    })
  } catch (error) {
    // Log the error
    console.error("Bidirectional Translation API error:", error)

    // Return an appropriate error response
    return NextResponse.json({ error: "Translation failed. Please try again." }, { status: 500 })
  }
}
