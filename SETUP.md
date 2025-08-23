# AiPolyglot Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account and project
- Stripe account with $9/month subscription product created
- OpenAI API key

## Environment Variables Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update the following variables in `.env.local`:
- `OPENAI_API_KEY`: Your OpenAI API key
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PRICE_ID`: Your Stripe price ID for the $9/month subscription
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret (set up after creating webhook)

## Supabase Database Setup

Run this SQL in your Supabase SQL editor to create the user_profiles table:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  translation_count INTEGER DEFAULT 0,
  has_paid BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Stripe Webhook Setup

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the webhook secret and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Installation & Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## User Flow

1. **Registration**: Users sign up with email/password
2. **Free Usage**: Users get 5 free translations
3. **Upgrade Prompt**: After 5 translations, users see subscription prompt
4. **Payment**: Users are redirected to Stripe checkout for $9/month subscription
5. **Unlimited Access**: After successful payment, users get unlimited translations

## Features

- ✅ Email/password authentication with Supabase
- ✅ Translation usage tracking (5 free translations)
- ✅ $9/month subscription with Stripe
- ✅ Automatic webhook handling for subscription events
- ✅ Voice input with Web Speech API
- ✅ Mobile-responsive design
- ✅ Real-time usage counter in header

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy!

### Other Platforms

Make sure to:
- Set all environment variables
- Configure the Stripe webhook URL to point to your deployed domain
- Ensure HTTPS is enabled (required for Web Speech API)

## Troubleshooting

- **Supabase Connection Issues**: Check your URL and anon key
- **Stripe Webhook Issues**: Verify webhook secret and endpoint URL
- **Voice Input Not Working**: Ensure HTTPS and supported browser
- **Translation Errors**: Verify OpenAI API key and credits

## Support

For issues, check the console logs and verify all environment variables are correctly set.
