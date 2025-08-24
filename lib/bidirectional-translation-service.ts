interface BidirectionalTranslationRequest {
  text: string
  targetLanguage?: string
  sourceLanguage?: string
  autoDetect?: boolean
}

interface BidirectionalTranslationResponse {
  translatedText: string
  translationDirection: 'english-to-native' | 'native-to-english'
  detectedSourceLanguage: string
}

export async function translateBidirectional({
  text,
  targetLanguage = 'Filipino/Tagalog',
  sourceLanguage,
  autoDetect = true
}: BidirectionalTranslationRequest): Promise<BidirectionalTranslationResponse> {
  try {
    const response = await fetch('/api/translate-bidirectional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage,
        autoDetect
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.translatedText) {
      throw new Error('No translation received from server')
    }

    return {
      translatedText: data.translatedText,
      translationDirection: data.translationDirection,
      detectedSourceLanguage: data.detectedSourceLanguage
    }
  } catch (error) {
    console.error('Bidirectional translation service error:', error)
    throw error
  }
}

// Legacy function for backward compatibility
export async function translateToEnglish(text: string): Promise<string> {
  const result = await translateBidirectional({
    text,
    targetLanguage: 'English',
    autoDetect: false,
    sourceLanguage: 'other'
  })
  return result.translatedText
}
