"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isProcessing: boolean
}

export default function VoiceInput({ onTranscript, isProcessing }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  // Check for browser support
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Try to access the SpeechRecognition API
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

        if (!SpeechRecognition) {
          console.log("SpeechRecognition not supported in this browser")
          setIsSupported(false)
          return
        }

        // Set up the recognition instance
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US" // Set to English, but will detect other languages

        recognitionRef.current.onresult = (event: any) => {
          if (event.results && event.results[0]) {
            const transcript = event.results[0][0].transcript
            onTranscript(transcript)
          }
          stopListening()
        }

        recognitionRef.current.onerror = (event: any) => {
          console.log("Speech recognition error:", event.error)

          let errorMessage = "Voice input error occurred."
          
          switch (event.error) {
            case "not-allowed":
              errorMessage = "Microphone access denied. Please allow microphone permissions and try again."
              break
            case "no-speech":
              errorMessage = "No speech detected. Please try again."
              break
            case "audio-capture":
              errorMessage = "No microphone found. Please check your microphone connection."
              break
            case "network":
              errorMessage = "Network error occurred. Please check your internet connection."
              break
            case "service-not-allowed":
              errorMessage = "Speech recognition service not allowed. Please try using HTTPS."
              break
            default:
              if (event.error !== "aborted") {
                errorMessage = "Could not access microphone. Please check your browser permissions."
              }
          }

          // Only show errors that aren't from normal stopping
          if (event.error !== "aborted") {
            toast({
              title: "Voice Input Error",
              description: errorMessage,
              variant: "destructive",
            })
          }

          stopListening()
        }

        recognitionRef.current.onend = () => {
          stopListening()
        }
      } catch (error) {
        console.error("Error initializing speech recognition:", error)
        setIsSupported(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {
          console.log("Error cleaning up speech recognition", e)
        }
      }
    }
  }, [onTranscript])

  const startListening = () => {
    if (isProcessing || isListening || !recognitionRef.current) return

    try {
      recognitionRef.current.start()
      setIsListening(true)

      // Safety timeout to stop listening after 10 seconds
      setTimeout(() => {
        if (isListening) {
          stopListening()
        }
      }, 10000)
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      setIsSupported(false)
      toast({
        title: "Voice Input Not Available",
        description: "Please use text input instead.",
        variant: "destructive",
      })
    }
  }

  const stopListening = () => {
    if (!isListening || !recognitionRef.current) return

    try {
      recognitionRef.current.stop()
    } catch (e) {
      // Ignore errors when stopping
      console.log("Error stopping recognition", e)
    }

    setIsListening(false)
  }

  const toggleListening = () => {
    if (isProcessing) return

    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // If speech recognition is not supported, show a disabled button
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center">
        <Button
          disabled
          variant="outline"
          className="rounded-full h-14 w-14 p-0 flex items-center justify-center opacity-50"
          aria-label="Voice input not available"
        >
          <Mic className="h-6 w-6" />
        </Button>
        <span className="text-xs text-muted-foreground mt-1">Not available</span>
      </div>
    )
  }

  return (
    <Button
      onClick={toggleListening}
      disabled={isProcessing}
      variant="destructive"
      className="rounded-full h-14 w-14 p-0 flex items-center justify-center bg-red-600 hover:bg-red-700"
      aria-label={isListening ? "Stop listening" : "Start voice input"}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? (
        <MicOff className="h-8 w-8" />
      ) : isProcessing ? (
        <Loader2 className="h-8 w-8 animate-spin" />
      ) : (
        <Mic className="h-8 w-8" />
      )}
    </Button>
  )
}
