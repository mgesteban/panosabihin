import Stripe from 'stripe'

// Server-side Stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export { stripe }

// Environment variables validation
export const getStripeConfig = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID

  if (!publishableKey || publishableKey.length === 0) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured. Please add it to your environment variables.")
  }

  if (!secretKey || secretKey.length === 0) {
    throw new Error("STRIPE_SECRET_KEY is not configured. Please add it to your environment variables.")
  }

  if (!priceId || priceId.length === 0) {
    throw new Error("STRIPE_PRICE_ID is not configured. Please add it to your environment variables.")
  }

  return { publishableKey, secretKey, priceId }
}

// Check if Stripe is configured
export const isStripeConfigured = () => {
  try {
    getStripeConfig()
    return true
  } catch (error) {
    return false
  }
}

// Client-side Stripe configuration
export const getStripePublishableKey = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured")
  }
  return key
}
