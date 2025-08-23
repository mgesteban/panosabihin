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
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

        if (!SpeechRecognition) {
          console.log("SpeechRecognition not supported")
          setIsSupported(false)
          return
        }

        // Create a test instance to verify it works
        const testRecognition = new SpeechRecognition()

        // Set up the recognition instance
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "auto" // Auto-detect language

        recognitionRef.current.onresult = (event: any) => {
          if (event.results && event.results[0]) {
            const transcript = event.results[0][0].transcript
            onTranscript(transcript)
          }
          stopListening()
        }

        recognitionRef.current.onerror = (event: any) => {
          console.log("Speech recognition error:", event.error)

          // Only show errors that aren't from normal stopping
          if (event.error !== "aborted" && event.error !== "no-speech") {
            toast({
              title: "Voice Input Error",
              description: "Could not access microphone. Please check your browser permissions.",
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
