"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

type SR = InstanceType<typeof window.webkitSpeechRecognition> | InstanceType<typeof window.SpeechRecognition> | null;

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
  /** Optional: override language preference order */
  preferredLangs?: string[];
  /** Optional: called on fatal errors (unsupported / permission denied) */
  onFatalError?: (err: string) => void;
}

export default function VoiceInput({
  onTranscript,
  isProcessing,
  preferredLangs = [
    // Spanish
    "es-MX", "es-ES",
    // Filipino / Tagalog
    "tl-PH", "fil-PH",
    // Chinese (Simplified/Traditional)
    "zh-CN", "zh-TW",
    // Hindi
    "hi-IN",
    // English
    "en-US"
  ],
  onFatalError
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [activeLang, setActiveLang] = useState<string | null>(null);

  const recognitionRef = useRef<SR>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stoppingRef = useRef(false);
  const langIndexRef = useRef(0);

  // Build recognition instance
  const createRecognition = useCallback((): SR => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return null;
    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = true; // allow live capture, we'll return only final
    rec.maxAlternatives = 1;
    return rec;
  }, []);

  // Preflight mic: prompt permission once to surface clearer errors
  const preflightMic = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // immediately stop tracks; we only wanted the permission prompt
      stream.getTracks().forEach(t => t.stop());
    } catch (err) {
      throw new Error("Microphone permission denied or not available.");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rec = createRecognition();
      if (!rec) {
        setIsSupported(false);
        return;
      }
      recognitionRef.current = rec as SR;

      const handleResult = (event: any) => {
        // Aggregate interim; emit only when final
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText += result[0].transcript;
          }
        }
        if (finalText.trim()) {
          onTranscript(finalText.trim());
          stopListening(); // stop after a final result
        }
      };

      const handleError = (event: any) => {
        // Chrome may emit "no-speech" normally; we'll handle with a toast once
        const err = event?.error as string | undefined;
        let msg = "Voice input error occurred.";
        switch (err) {
          case "not-allowed":
          case "permission-denied":
            msg = "Microphone access denied. Please allow microphone permissions and try again.";
            break;
          case "no-speech":
            msg = "No speech detected. Please try again.";
            break;
          case "audio-capture":
            msg = "No microphone found. Please check your microphone connection.";
            break;
          case "network":
            msg = "Network error occurred. Please check your internet connection.";
            break;
          case "service-not-allowed":
            msg = "Speech recognition service not allowed. Use HTTPS and a supported browser (Chrome).";
            break;
          default:
            if (err !== "aborted") {
              msg = "Could not access microphone. Check browser permissions.";
            }
        }
        if (err !== "aborted") {
          toast({ title: "Voice Input Error", description: msg, variant: "destructive" });
        }
        stopListening();
      };

      const handleEnd = () => {
        // Only stop if we didn't intentionally stop; Chrome fires onend a lot.
        if (!stoppingRef.current) stopListening();
      };

      (recognitionRef.current as any).onresult = handleResult;
      (recognitionRef.current as any).onerror = handleError;
      (recognitionRef.current as any).onend = handleEnd;

      setIsSupported(true);
    } catch (e) {
      console.error("Error initializing speech recognition:", e);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          (recognitionRef.current as any).onresult = null;
          (recognitionRef.current as any).onerror = null;
          (recognitionRef.current as any).onend = null;
          (recognitionRef.current as any).abort?.();
        } catch {}
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createRecognition, onTranscript]);

  const pickNextLang = () => {
    const idx = langIndexRef.current % preferredLangs.length;
    const lang = preferredLangs[idx];
    langIndexRef.current += 1;
    return lang;
  };

  const startListening = useCallback(async () => {
    if (isProcessing || isListening) return;
    if (!recognitionRef.current) {
      setIsSupported(false);
      onFatalError?.("SpeechRecognition not supported in this browser.");
      toast({
        title: "Voice Input Not Available",
        description: "Your browser doesn't support speech recognition. Try Chrome or use text input.",
        variant: "destructive",
      });
      return;
    }

    try {
      await preflightMic(); // surface permission issues early

      stoppingRef.current = false;

      // Choose the next language in the preference list (round-robin)
      const lang = pickNextLang();
      setActiveLang(lang);
      (recognitionRef.current as any).lang = lang;

      (recognitionRef.current as any).start();
      setIsListening(true);

      // Hard stop after 12s to avoid hanging sessions
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (isListening) stopListening();
      }, 12000);
    } catch (err: any) {
      console.error("Error starting speech recognition:", err);
      setIsSupported(false);
      onFatalError?.(String(err?.message ?? err));
      toast({
        title: "Microphone Unavailable",
        description: "Please allow mic permissions and ensure a microphone is connected.",
        variant: "destructive",
      });
    }
  }, [isProcessing, isListening, onFatalError, preflightMic]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    stoppingRef.current = true;
    try {
      (recognitionRef.current as any).stop();
    } catch {}
    setIsListening(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const toggleListening = () => {
    if (isProcessing) return;
    if (isListening) stopListening();
    else startListening();
  };

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
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
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
      <span className="text-[10px] text-muted-foreground" aria-live="polite">
        {activeLang ? `Language: ${activeLang}` : "\u00A0"}
      </span>
    </div>
  );
}
