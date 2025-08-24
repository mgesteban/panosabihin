# Technical Context: AiPolyglot Translation App

## Technology Stack

### Frontend Technologies
- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript 5.x for type safety
- **UI Library**: React 18 with functional components and hooks
- **Component System**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS 3.4.17 with custom configuration
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Geist font family for modern typography
- **Authentication**: Supabase Auth for user management
- **Payment Processing**: Stripe Checkout for subscriptions

### Backend Technologies
- **Runtime**: Node.js with Next.js API routes
- **Database**: Supabase PostgreSQL with Row Level Security
- **AI Integration**: OpenAI SDK (latest) for GPT-3.5-turbo access
- **Payment Processing**: Stripe SDK for payment handling
- **Authentication**: Supabase server-side client
- **HTTP Client**: Native fetch API for client-server communication
- **Environment**: Environment variables for configuration management

### Development Tools
- **Package Manager**: npm/pnpm for dependency management
- **Build System**: Next.js built-in build system
- **CSS Processing**: PostCSS with Tailwind CSS
- **Type Checking**: TypeScript compiler with strict mode
- **Linting**: Next.js ESLint configuration
- **Database Management**: Supabase Dashboard and CLI

### Browser APIs
- **Web Speech API**: Advanced voice recognition with language cycling
- **Fetch API**: For HTTP requests to translation service
- **Local Storage**: For client-side state persistence
- **Geolocation API**: Potential future feature for location-based services

## Dependencies Analysis

### Core Dependencies
```json
{
  "next": "14.2.16",           // React framework with SSR/SSG
  "react": "^18",              // UI library
  "react-dom": "^18",          // React DOM renderer
  "typescript": "^5",          // Type system
  "tailwindcss": "^3.4.17",   // Utility-first CSS
  "openai": "latest",          // OpenAI API client
  "@supabase/supabase-js": "^2.x.x",  // Supabase client
  "stripe": "latest"           // Stripe payment processing
}
```

### UI Component Dependencies
```json
{
  "@radix-ui/react-*": "1.x.x",  // Accessible UI primitives
  "lucide-react": "^0.454.0",    // Icon library
  "class-variance-authority": "^0.7.1",  // Component variant management
  "clsx": "^2.1.1",              // Conditional className utility
  "tailwind-merge": "^2.5.5"     // Tailwind class merging
}
```

### Form and Validation
```json
{
  "react-hook-form": "^7.54.1",     // Form state management
  "@hookform/resolvers": "^3.9.1",  // Form validation resolvers
  "zod": "^3.24.1"                  // Schema validation
}
```

### Additional Features
```json
{
  "sonner": "^1.7.1",           // Toast notifications
  "next-themes": "^0.4.4",      // Theme management
  "@vercel/analytics": "latest"  // Analytics integration
}
```

## Technical Constraints

### Browser Compatibility
- **Web Speech API**: Limited to modern browsers (Chrome, Edge, Safari)
- **Language Support**: Varies by browser and platform for voice recognition
- **ES6+ Features**: Requires modern JavaScript engine support
- **Fetch API**: Native support in all target browsers
- **CSS Grid/Flexbox**: Modern layout features required

### Performance Constraints
- **API Rate Limits**: OpenAI API has usage limits and costs
- **Database Connections**: Supabase connection pooling limits
- **Stripe API Limits**: Payment processing rate limits
- **Network Dependency**: Requires internet connection for all core features
- **Client-Side Processing**: Voice recognition happens in browser
- **Bundle Size**: Large dependency tree affects initial load time

### Security Constraints
- **API Key Management**: OpenAI and Stripe keys must be server-side only
- **Database Security**: Row Level Security policies in Supabase
- **CORS Policies**: Browser security affects API access patterns
- **Input Validation**: All user input must be sanitized
- **Environment Variables**: Sensitive data in environment configuration
- **Webhook Security**: Stripe webhook signature verification required

## Development Setup

### Prerequisites
- Node.js 18+ for Next.js compatibility
- npm or pnpm for package management
- OpenAI API key for translation functionality
- Supabase project with database setup
- Stripe account for payment processing
- Modern browser for development and testing

### Environment Configuration
```bash
# Required environment variables
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Optional environment variables
NODE_ENV=development|production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development Commands
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── translate/     # Translation endpoint
│   │   ├── create-checkout-session/  # Stripe checkout
│   │   └── webhooks/stripe/  # Payment webhooks
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── payment/          # Payment components
│   ├── translation-app.tsx
│   └── voice-input.tsx
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client configuration
│   ├── stripe.ts         # Stripe client configuration
│   ├── translation-service.ts
│   ├── env.ts            # Environment validation
│   └── utils.ts
├── hooks/                 # Custom React hooks
├── memory_bank/          # Project documentation
├── public/               # Static assets
└── styles/               # Additional styles
```

## API Integration

### OpenAI Configuration
- **Model**: GPT-3.5-turbo for cost-effective translation
- **Temperature**: 0.3 for consistent, focused translations
- **Max Tokens**: 1000 to handle longer text inputs
- **System Prompt**: Structured prompt for translation quality
- **Error Handling**: Comprehensive error mapping and user feedback

### Supabase Configuration
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Email/password with session management
- **Real-time**: Subscription updates via real-time listeners
- **Storage**: Potential future file upload capabilities
- **Edge Functions**: Potential future serverless function usage

### Stripe Configuration
- **Checkout Sessions**: Server-side session creation
- **Webhooks**: Automated subscription status updates
- **Customer Management**: Automatic customer creation and management
- **Subscription Handling**: Monthly/yearly subscription plans
- **Security**: Webhook signature verification

### API Route Design
```typescript
// /api/translate endpoint
POST /api/translate
Authorization: Bearer <supabase_token>
Content-Type: application/json
{
  "text": "string to translate"
}

Response:
{
  "translatedText": "English translation"
}

// /api/create-checkout-session endpoint
POST /api/create-checkout-session
Authorization: Bearer <supabase_token>
Content-Type: application/json
{
  "priceId": "stripe_price_id"
}

Response:
{
  "url": "stripe_checkout_url"
}
```

### Error Handling
- **Network Errors**: Fetch failures handled gracefully
- **API Errors**: OpenAI service errors mapped to user messages
- **Authentication Errors**: Supabase auth failures with user guidance
- **Payment Errors**: Stripe errors with actionable feedback
- **Validation Errors**: Input validation with clear feedback
- **Rate Limiting**: Graceful handling of API limits

## Database Schema

### User Profiles Table
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  translation_count INTEGER DEFAULT 0,
  subscription_status TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.email() = email);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.email() = email);
```

### Indexes for Performance
```sql
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_stripe_customer ON user_profiles(stripe_customer_id);
```

## Voice Recognition Technology

### Language Cycling Implementation
```typescript
// Advanced language cycling for Tagalog optimization
const languages = [
  'es-ES',    // Spanish (baseline recognition)
  'fil-PH',   // Filipino (primary Tagalog)
  'tl-PH',    // Tagalog (fallback)
  'zh-CN',    // Chinese (Mandarin)
  'hi-IN',    // Hindi
  'en-US'     // English (final fallback)
];

// Recognition configuration
const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true;
recognition.maxAlternatives = 3;
```

### Performance Optimizations
- **12-second timeout**: Extended recognition window
- **Interim results**: Real-time feedback during recognition
- **Language indicators**: Visual feedback for current language
- **Error recovery**: Automatic fallback to next language
- **Accuracy tracking**: 80-90% accuracy for Tagalog recognition

## Performance Considerations

### Optimization Strategies
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component for logos
- **CSS Optimization**: Tailwind CSS purging unused styles
- **Bundle Analysis**: Regular bundle size monitoring
- **Database Optimization**: Indexed queries and connection pooling
- **API Optimization**: Efficient Supabase and Stripe API usage

### Caching Strategy
- **Static Assets**: Next.js automatic static asset caching
- **API Responses**: No caching for translation results (real-time)
- **User Sessions**: Supabase session caching
- **Component Memoization**: React.memo for expensive components
- **Build Optimization**: Next.js production optimizations

## Deployment Considerations

### Platform Requirements
- **Node.js Runtime**: Server environment with Node.js support
- **Environment Variables**: Secure storage for API keys
- **HTTPS**: Required for Web Speech API and Stripe in production
- **Database**: PostgreSQL-compatible database (Supabase)
- **CDN**: Static asset delivery optimization

### Recommended Platforms
- **Vercel**: Optimal for Next.js applications with Supabase integration
- **Netlify**: Good alternative with serverless functions
- **Railway/Render**: Container-based deployment options
- **AWS/GCP**: Enterprise-grade cloud platforms

### Production Configuration
- **Environment Variables**: Production API keys and configuration
- **Database**: Production Supabase project with proper RLS policies
- **Stripe**: Production Stripe account with webhook endpoints
- **Error Monitoring**: Sentry or similar error tracking
- **Analytics**: Usage tracking and performance monitoring
- **Security Headers**: HTTPS, CSP, and other security measures

## Security Implementation

### Authentication Security
- **Row Level Security**: Database-level access control
- **JWT Tokens**: Secure session management
- **Server-side Validation**: All API routes validate authentication
- **Session Expiry**: Automatic token refresh and expiry handling

### Payment Security
- **PCI Compliance**: Stripe handles all payment data
- **Webhook Verification**: Cryptographic signature verification
- **Server-side Processing**: All payment logic server-side
- **Customer Data Protection**: Minimal PII storage

### API Security
- **Rate Limiting**: Usage-based limits prevent abuse
- **Input Sanitization**: All user input validated and sanitized
- **CORS Configuration**: Proper cross-origin request handling
- **Environment Isolation**: Separate dev/staging/production environments

## Future Technical Considerations

### Scalability Improvements
- **Caching Layer**: Redis for translation result caching
- **Database Scaling**: Read replicas and connection pooling
- **CDN**: Global content delivery for better performance
- **Microservices**: Separate translation service for scaling
- **Load Balancing**: Multi-region deployment

### Technology Upgrades
- **Next.js 15**: Future framework updates
- **React 19**: Upcoming React features
- **OpenAI Models**: Newer, more capable models (GPT-4, etc.)
- **Supabase Features**: Real-time subscriptions, edge functions
- **Web APIs**: Emerging browser capabilities

### Monitoring and Analytics
- **Performance Monitoring**: Real-time application performance
- **Error Tracking**: Comprehensive error logging and alerting
- **Usage Analytics**: User behavior and feature adoption
- **Business Metrics**: Translation volume, subscription conversions
- **Cost Monitoring**: API usage and infrastructure costs
