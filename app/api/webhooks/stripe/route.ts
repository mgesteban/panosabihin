import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createSupabaseServerClient } from "@/lib/supabase"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription' && session.metadata?.user_id) {
          // Update user profile to mark as subscribed
          const { error } = await supabase
            .from('user_profiles')
            .update({
              has_paid: true,
              stripe_customer_id: session.customer as string,
              subscription_id: session.subscription as string,
              updated_at: new Date().toISOString()
            })
            .eq('id', session.metadata.user_id)

          if (error) {
            console.error('Error updating user profile:', error)
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
          }

          console.log(`User ${session.metadata.user_id} subscription activated`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Find user by subscription ID and mark as unsubscribed
        const { error } = await supabase
          .from('user_profiles')
          .update({
            has_paid: false,
            subscription_id: null,
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', subscription.id)

        if (error) {
          console.error('Error updating user profile on cancellation:', error)
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }

        console.log(`Subscription ${subscription.id} cancelled`)
        break
      }

      case 'invoice.payment_failed': {
        // Optionally handle failed payments
        console.log(`Payment failed for invoice`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
