import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createSupabaseServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the price ID from environment variables
    const priceId = process.env.STRIPE_PRICE_ID
    if (!priceId) {
      return NextResponse.json({ error: "Stripe price ID not configured" }, { status: 500 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/?success=true`,
      cancel_url: `${request.headers.get('origin')}/?canceled=true`,
      metadata: {
        user_id: user.id,
        user_email: user.email || '',
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
    })

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
