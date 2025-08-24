# Supabase Authentication Configuration Guide

## URL Configuration for Different Environments

You need to configure the correct redirect URLs in your Supabase project settings based on where your app is deployed:

### For Local Development
- **URL to add**: `http://localhost:3000`
- **When to use**: Testing locally during development
- **Supabase Dashboard**: Go to Authentication → URL Configuration → Site URL
- **Add to Redirect URLs**: `http://localhost:3000/**`

### For Production Deployment
Choose ONE of these based on your primary domain:

#### Option 1: Vercel Deployment
- **URL to add**: `https://v0-english-translation-app-ten.vercel.app`
- **When to use**: If this is your main production URL
- **Add to Redirect URLs**: `https://v0-english-translation-app-ten.vercel.app/**`

#### Option 2: Custom Domain
- **URL to add**: `https://www.panosabihin.com`
- **When to use**: If this is your custom domain (recommended)
- **Add to Redirect URLs**: `https://www.panosabihin.com/**`

## Step-by-Step Configuration

### 1. Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `sefpitazypdfimvbzjfi`

### 2. Configure Authentication URLs
1. Navigate to **Authentication** → **URL Configuration**
2. Set the **Site URL** to your primary domain
3. Add **Redirect URLs** for all environments you'll use

### 3. Recommended Configuration
```
Site URL: https://www.panosabihin.com
Redirect URLs:
- http://localhost:3000/**
- https://www.panosabihin.com/**
- https://v0-english-translation-app-ten.vercel.app/**
```

### 4. Additional Settings
- **Email Templates**: Update email confirmation links to use your primary domain
- **Email Providers**: Ensure SMTP is configured if using custom domain
- **Social Providers**: Update redirect URLs if using OAuth

## Current Issue Resolution

The app is not accessible because:
1. **Supabase is rejecting authentication requests** from your current domain
2. **Redirect URLs don't match** what's configured in Supabase
3. **Site URL might be incorrect** in Supabase settings

## Immediate Fix Steps

### For Local Testing (Right Now)
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add `http://localhost:3000` to Redirect URLs
3. Set Site URL to `http://localhost:3000` temporarily
4. Save changes
5. Refresh your local app

### For Production
1. Decide on your primary domain (`www.panosabihin.com` recommended)
2. Update Site URL to your primary domain
3. Add all deployment URLs to Redirect URLs
4. Update environment variables if needed
5. Redeploy your application

## Environment Variables Check

Ensure your `.env` file has the correct Supabase URL:
```
NEXT_PUBLIC_SUPABASE_URL=https://sefpitazypdfimvbzjfi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Testing After Configuration

1. **Clear browser cache** and cookies
2. **Restart development server** (`npm run dev`)
3. **Try signing up** with a new email
4. **Check email confirmation** works
5. **Test login flow** completely

## Common Mistakes to Avoid

- ❌ Using HTTP instead of HTTPS for production
- ❌ Forgetting the `/**` wildcard in redirect URLs
- ❌ Not including localhost for development
- ❌ Mismatched Site URL and actual domain
- ❌ Not restarting the app after Supabase changes

## Which URL Should You Use?

**Recommendation**: Use `https://www.panosabihin.com` as your primary domain because:
- It's your custom domain
- More professional and brandable
- Better for SEO and user trust
- You can always redirect other URLs to this one

Configure Supabase with `https://www.panosabihin.com` as the Site URL and add all three URLs to Redirect URLs for maximum flexibility.
