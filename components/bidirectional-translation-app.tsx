"use client"

import { useState, useEffect } from "react"
import { translateBidirectional } from "@/lib/bidirectional-translation-service"
import VoiceInput from "./voice-input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Loader2, AlertCircle, ArrowUpDown, Languages, Mic, Type } from "lucide-react"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"
import { User } from "@supabase/supabase-js"
import UpgradePrompt from "./payment/upgrade-prompt"

// Supported languages list
const SUPPORTED_LANGUAGES = [
  { code: "Filipino/Tagalog", label: "Filipino/Tagalog", flag: "🇵🇭" },
  { code: "Spanish", label: "Spanish", flag: "🇪🇸" },
  { code: "French", label: "French", flag: "🇫🇷" },
  { code: "German", label: "German", flag: "🇩🇪" },
  { code: "Italian", label: "Italian", flag: "🇮🇹" },
  { code: "Portuguese", label: "Portuguese", flag: "🇵🇹" },
  { code: "Russian", label: "Russian", flag: "🇷🇺" },
  { code: "Chinese", label: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "Japanese", label: "Japanese", flag: "🇯🇵" },
  { code: "Korean", label: "Korean", flag: "🇰🇷" },
  { code: "Arabic", label: "Arabic", flag: "🇸🇦" },
  { code: "Hindi", label: "Hindi", flag: "🇮🇳" },
  { code: "Turkish", label: "Turkish", flag: "🇹🇷" },
  { code: "Polish", label: "Polish", flag: "🇵🇱" },
  { code: "Dutch", label: "Dutch", flag: "🇳🇱" },
  { code: "Swedish", label: "Swedish", flag: "🇸🇪" },
  { code: "Danish", label: "Danish", flag: "🇩🇰" },
  { code: "Norwegian", label: "Norwegian", flag: "🇳🇴" },
  { code: "Finnish", label: "Finnish", flag: "🇫🇮" },
  { code: "Greek", label: "Greek", flag: "🇬🇷" },
  { code: "Hebrew", label: "Hebrew", flag: "🇮🇱" },
  { code: "Thai", label: "Thai", flag: "🇹🇭" },
  { code: "Vietnamese", label: "Vietnamese", flag: "🇻🇳" },
  { code: "Indonesian", label: "Indonesian", flag: "🇮🇩" },
  { code: "Malay", label: "Malay", flag: "🇲🇾" },
  { code: "Ukrainian", label: "Ukrainian", flag: "🇺🇦" },
  { code: "Czech", label: "Czech", flag: "🇨🇿" },
  { code: "Romanian", label: "Romanian", flag: "🇷🇴" },
  { code: "Hungarian", label: "Hungarian", flag: "🇭🇺" },
  { code: "Bulgarian", label: "Bulgarian", flag: "🇧🇬" },
  { code: "Croatian", label: "Croatian", flag: "🇭🇷" },
  { code: "Slovak", label: "Slovak", flag: "🇸🇰" },
  { code: "Slovenian", label: "Slovenian", flag: "🇸🇮" },
  { code: "Lithuanian", label: "Lithuanian", flag: "🇱🇹" },
  { code: "Latvian", label: "Latvian", flag: "🇱🇻" },
  { code: "Estonian", label: "Estonian", flag: "🇪🇪" },
  { code: "Persian", label: "Persian/Farsi", flag: "🇮🇷" },
  { code: "Urdu", label: "Urdu", flag: "🇵🇰" },
  { code: "Bengali", label: "Bengali", flag: "🇧🇩" },
  { code: "Tamil", label: "Tamil", flag: "🇮🇳" },
  { code: "Telugu", label: "Telugu", flag: "🇮🇳" },
  { code: "Marathi", label: "Marathi", flag: "🇮🇳" },
  { code: "Gujarati", label: "Gujarati", flag: "🇮🇳" },
  { code: "Kannada", label: "Kannada", flag: "🇮🇳" },
  { code: "Swahili", label: "Swahili", flag: "🇰🇪" },
  { code: "Afrikaans", label: "Afrikaans", flag: "🇿🇦" },
  { code: "Albanian", label: "Albanian", flag: "🇦🇱" },
  { code: "Armenian", label: "Armenian", flag: "🇦🇲" },
  { code: "Azerbaijani", label: "Azerbaijani", flag: "🇦🇿" },
  { code: "Basque", label: "Basque", flag: "🇪🇸" },
  { code: "Belarusian", label: "Belarusian", flag: "🇧🇾" },
  { code: "Bosnian", label: "Bosnian", flag: "🇧🇦" },
  { code: "Catalan", label: "Catalan", flag: "🇪🇸" },
  { code: "Georgian", label: "Georgian", flag: "🇬🇪" },
  { code: "Icelandic", label: "Icelandic", flag: "🇮🇸" },
  { code: "Irish", label: "Irish", flag: "🇮🇪" },
  { code: "Kazakh", label: "Kazakh", flag: "🇰🇿" },
  { code: "Macedonian", label: "Macedonian", flag: "🇲🇰" },
  { code: "Maltese", label: "Maltese", flag: "🇲🇹" },
  { code: "Mongolian", label: "Mongolian", flag: "🇲🇳" },
  { code: "Serbian", label: "Serbian", flag: "🇷🇸" },
  { code: "Welsh", label: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" }
]

interface UserProfile {
  id: string
  email: string
  translation_count: number
  has_paid: boolean
}

interface BidirectionalTranslationAppProps {
  user?: User
  userProfile?: UserProfile
  updateUserProfile?: (updates: Partial<UserProfile>) => Promise<UserProfile | undefined>
  canTranslate?: boolean
  remainingTranslations?: number
}

export default function BidirectionalTranslationApp({ 
  user, 
  userProfile, 
  updateUserProfile, 
  canTranslate = true, 
  remainingTranslations = 100 
}: BidirectionalTranslationAppProps) {
  const [inputText, setInputText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState("")
  const [nativeLanguage, setNativeLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('aipolyglot-native-language')
    return savedLanguage || "Spanish"
  })
  const [translationDirection, setTranslationDirection] = useState<'auto' | 'to-english' | 'to-native'>('auto')
  const [lastTranslationDirection, setLastTranslationDirection] = useState<'english-to-native' | 'native-to-english' | null>(null)
  const [conversationMode, setConversationMode] = useState(false)

  // Helper function to detect RTL languages
  const isRTL = (language: string) => {
    const rtlLanguages = ['Arabic', 'Hebrew', 'Persian', 'Urdu']
    return rtlLanguages.includes(language)
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) return

    // Check if user can translate
    if (!canTranslate) {
      toast({
        title: "Translation Limit Reached",
        description: "You've used all 100 free translations. Please upgrade to continue.",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)
    setError("")
    setTranslatedText("")

    try {
      console.log("Sending bidirectional translation request for:", inputText)
      
      const result = await translateBidirectional({
        text: inputText,
        targetLanguage: nativeLanguage,
        autoDetect: translationDirection === 'auto',
        sourceLanguage: translationDirection === 'to-english' ? 'other' : 
                       translationDirection === 'to-native' ? 'en' : undefined
      })

      console.log("Received translation result:", result)

      if (!result.translatedText || result.translatedText.trim() === "") {
        throw new Error("Received empty translation result")
      }

      setTranslatedText(result.translatedText)
      setLastTranslationDirection(result.translationDirection)

      // Save detected native language for future use
      if (result.translationDirection === 'native-to-english' && translationDirection === 'auto') {
        localStorage.setItem('aipolyglot-native-language', nativeLanguage)
      }

      // Update translation count if user is authenticated and hasn't paid
      if (user && userProfile && !userProfile.has_paid && updateUserProfile) {
        try {
          await updateUserProfile({
            translation_count: userProfile.translation_count + 1
          })
        } catch (updateError) {
          console.error("Error updating translation count:", updateError)
        }
      }

      // Show payment prompt if this was the 100th translation
      if (userProfile && !userProfile.has_paid && userProfile.translation_count + 1 >= 100) {
        setTimeout(() => {
          toast({
            title: "Free Translations Used",
            description: "You've used all 100 free translations. Upgrade for unlimited access!",
            variant: "default",
          })
        }, 2000)
      }

    } catch (err) {
      console.error("Translation error in component:", err)
      const errorMessage = err instanceof Error ? err.message : "Translation failed"
      setError(errorMessage)

      toast({
        title: "Translation Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleVoiceInput = (transcript: string) => {
    setInputText(transcript)
    // Auto-translate when voice input is received
    if (transcript && transcript.trim() !== "") {
      setTimeout(() => {
        handleTranslate()
      }, 500)
    }
  }

  const handleUpgrade = async () => {
    if (updateUserProfile && userProfile) {
      try {
        await updateUserProfile({
          has_paid: true
        })
        toast({
          title: "Upgrade Successful!",
          description: "You now have unlimited translations.",
        })
      } catch (error) {
        console.error("Error updating payment status:", error)
      }
    }
  }

  const toggleConversationMode = () => {
    setConversationMode(!conversationMode)
    if (!conversationMode) {
      setTranslationDirection('auto')
      toast({
        title: "Conversation Mode Enabled",
        description: "App will automatically detect language direction for seamless conversations.",
      })
    } else {
      toast({
        title: "Conversation Mode Disabled",
        description: "You can now manually control translation direction.",
      })
    }
  }

  const getDirectionLabel = () => {
    const shortName = nativeLanguage.split('/')[0]
    switch (translationDirection) {
      case 'auto':
        return 'Auto-detect'
      case 'to-english':
        return `${shortName} → English`
      case 'to-native':
        return `English → ${shortName}`
      default:
        return 'Auto-detect'
    }
  }

  const getResultLabel = () => {
    if (!lastTranslationDirection) return "Translation:"
    return lastTranslationDirection === 'english-to-native' 
      ? `${nativeLanguage} Translation:`
      : "English Translation:"
  }

  // Show upgrade prompt if user has reached limit
  if (!canTranslate && userProfile && !userProfile.has_paid) {
    return (
      <UpgradePrompt 
        userEmail={user?.email} 
        onUpgrade={handleUpgrade}
      />
    )
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]">
          <Image
            src="/images/panosabihinlogo.png"
            alt="Panosabihin - Universal Translation Assistant"
            fill
            sizes="(max-width: 640px) 120px, 150px"
            priority
            className="object-contain"
          />
        </div>
        <p className="text-sm text-center text-muted-foreground mt-2">
          Speak or type in {SUPPORTED_LANGUAGES.length}+ languages. Perfect for multilingual conversations.
        </p>
      </div>

      {/* Language Selection Card */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Languages className="h-4 w-4" />
            Select Your Native Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={nativeLanguage}
            onValueChange={(value) => {
              setNativeLanguage(value)
              localStorage.setItem('aipolyglot-native-language', value)
              toast({
                title: "Language Updated",
                description: `Your native language is now set to ${value}`,
              })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            This will be used as your primary translation language
          </p>
        </CardContent>
      </Card>

      {/* Quick Language Selection */}
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Quick Select:</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SUPPORTED_LANGUAGES.slice(0, 8).map((lang) => (
              <Button
                key={lang.code}
                variant={nativeLanguage === lang.code ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setNativeLanguage(lang.code)
                  localStorage.setItem('aipolyglot-native-language', lang.code)
                  toast({
                    title: "Language Updated",
                    description: `Native language set to ${lang.label}`,
                  })
                }}
                className="text-xs p-2"
                title={lang.label}
              >
                {lang.flag}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversation Mode Toggle */}
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span className="text-sm font-medium">Conversation Mode</span>
            </div>
            <Button
              variant={conversationMode ? "default" : "outline"}
              size="sm"
              onClick={toggleConversationMode}
              className="gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              {conversationMode ? "ON" : "OFF"}
            </Button>
          </div>
          {conversationMode && (
            <p className="text-xs text-muted-foreground mt-2">
              Auto-detects language direction for seamless back-and-forth conversations
            </p>
          )}
        </CardContent>
      </Card>

      {/* Translation Direction Control */}
      {!conversationMode && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Translation Direction:</span>
              <Badge variant="outline">{getDirectionLabel()}</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant={translationDirection === 'auto' ? "default" : "outline"}
                size="sm"
                onClick={() => setTranslationDirection('auto')}
                className="flex-1"
              >
                Auto
              </Button>
              <Button
                variant={translationDirection === 'to-english' ? "default" : "outline"}
                size="sm"
                onClick={() => setTranslationDirection('to-english')}
                className="flex-1"
              >
                → EN
              </Button>
              <Button
                variant={translationDirection === 'to-native' ? "default" : "outline"}
                size="sm"
                onClick={() => setTranslationDirection('to-native')}
                className="flex-1"
              >
                → {nativeLanguage.split('/')[0].substring(0, 3).toUpperCase()}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Card */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Type className="h-4 w-4" />
            Input Text
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Textarea
              placeholder={conversationMode 
                ? "Type or speak in any language for conversation..." 
                : "Type or speak your text..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={`min-h-[100px] resize-none text-base ${isRTL(nativeLanguage) ? 'text-right' : ''}`}
              dir={isRTL(nativeLanguage) ? 'rtl' : 'ltr'}
              aria-label="Text to translate"
            />

            <div className="flex justify-between items-center">
              <Button
                onClick={handleTranslate}
                disabled={isTranslating || !inputText.trim()}
                className="gap-2 h-12 px-4 text-base"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Translate
                  </>
                )}
              </Button>

              <VoiceInput 
                onTranscript={handleVoiceInput} 
                isProcessing={isTranslating}
                language={nativeLanguage}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="text-red-500 text-sm mb-4 text-center flex items-center justify-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {/* Translation Result */}
      {translatedText && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {getResultLabel()}
              {lastTranslationDirection && (
                <Badge variant="secondary" className="ml-auto">
                  {lastTranslationDirection === 'english-to-native' ? '🇺🇸 → 🌏' : '🌏 → 🇺🇸'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className={`p-3 bg-muted rounded-md text-base ${isRTL(nativeLanguage) && lastTranslationDirection === 'english-to-native' ? 'text-right' : ''}`}
              dir={isRTL(nativeLanguage) && lastTranslationDirection === 'english-to-native' ? 'rtl' : 'ltr'}
            >
              {translatedText}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
