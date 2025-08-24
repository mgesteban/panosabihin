"use client"

import { useState } from "react"
import { translateToEnglish } from "@/lib/translation-service"
import VoiceInput from "./voice-input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Loader2, AlertCircle, CreditCard } from "lucide-react"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"
import { User } from "@supabase/supabase-js"
import UpgradePrompt from "./payment/upgrade-prompt"

interface UserProfile {
  id: string
  email: string
  translation_count: number
  has_paid: boolean
}

interface TranslationAppProps {
  user?: User
  userProfile?: UserProfile
  updateUserProfile?: (updates: Partial<UserProfile>) => Promise<UserProfile | undefined>
  canTranslate?: boolean
  remainingTranslations?: number
}

export default function TranslationApp({ 
  user, 
  userProfile, 
  updateUserProfile, 
  canTranslate = true, 
  remainingTranslations = 5 
}: TranslationAppProps) {
  const [inputText, setInputText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState("")

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
      console.log("Sending translation request for:", inputText)
      const result = await translateToEnglish(inputText)
      console.log("Received translation result:", result)

      if (!result || result.trim() === "") {
        throw new Error("Received empty translation result")
      }

      setTranslatedText(result)

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
            src="/images/aipolyglot-logo.png"
            alt="AiPolyglot - Translation Assistant"
            fill
            sizes="(max-width: 640px) 120px, 150px"
            priority
            className="object-contain"
          />
        </div>
        <p className="text-sm text-center text-muted-foreground mt-2">
          Speak or type in any language. Get English translation.
        </p>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <Textarea
              placeholder="Type or speak in any language..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[100px] resize-none text-base"
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

              <VoiceInput onTranscript={handleVoiceInput} isProcessing={isTranslating} />
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

      {translatedText && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-sm font-medium mb-2 text-muted-foreground">English Translation:</h2>
            <div className="p-3 bg-muted rounded-md text-base">{translatedText}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
