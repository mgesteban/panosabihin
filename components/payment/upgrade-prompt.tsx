"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Check, Zap } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface UpgradePromptProps {
  userEmail?: string
  onUpgrade?: () => void
}

export default function UpgradePrompt({ userEmail, onUpgrade }: UpgradePromptProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = async () => {
    setIsProcessing(true)

    try {
      toast({
        title: "Redirecting to Payment",
        description: "Taking you to secure Stripe checkout...",
      })

      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      
      if (url) {
        // Redirect to Stripe checkout
        window.location.href = url
      } else {
        throw new Error('No checkout URL received')
      }

    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Upgrade to Unlimited</CardTitle>
          <CardDescription>
            You've used all 100 free translations. Upgrade now for unlimited access!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-sm">Unlimited translations</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-sm">Voice input support</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-sm">High-quality AI translations</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-sm">No ads or interruptions</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-3xl font-bold">$9</div>
            <div className="text-sm text-muted-foreground">per month</div>
            <div className="text-xs text-muted-foreground mt-1">Cancel anytime</div>
          </div>

          {/* Payment Button */}
          <Button 
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full h-12 text-base gap-2"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Redirecting...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Subscribe for $9/month
              </>
            )}
          </Button>

          {/* Security note */}
          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Stripe. Your payment information is encrypted and secure.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
