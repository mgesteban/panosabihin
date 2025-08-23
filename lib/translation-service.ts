export async function translateToEnglish(text: string) {
  try {
    console.log("Starting translation for:", text)

    // Call our API route instead of directly using the OpenAI SDK
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Translation failed")
    }

    const data = await response.json()

    if (!data.translatedText) {
      throw new Error("No translation returned")
    }

    return data.translatedText
  } catch (error) {
    console.error("Translation error:", error)
    throw new Error(error instanceof Error ? error.message : "Translation failed. Please try again.")
  }
}
