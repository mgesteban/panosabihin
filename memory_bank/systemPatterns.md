# System Patterns: AiPolyglot Translation App

## System Architecture

### Application Structure
```
AiPolyglot Translation App
├── Frontend (Next.js Client)
│   ├── Authentication (Supabase Auth)
│   ├── UI Components (React + Radix UI + Tailwind)
│   ├── State Management (React useState + useEffect)
│   ├── Voice Input (Web Speech API + Language Cycling)
│   ├── Payment Integration (Stripe Checkout)
│   └── Translation Service (Fetch API)
├── Backend (Next.js API Routes)
│   ├── Translation Endpoint (/api/translate)
│   ├── Payment Processing (/api/create-checkout-session)
│   ├── Webhook Handling (/api/webhooks/stripe)
│   └── Environment Testing (/api/test-env)
├── Database (Supabase PostgreSQL)
│   ├── User Profiles
│   ├── Translation Usage Tracking
│   └── Subscription Management
└── External Services
    ├── OpenAI GPT-3.5-turbo (Translation)
    ├── Supabase (Auth + Database)
    ├── Stripe (Payment Processing)
    └── Browser Web Speech API (Voice Recognition)
```

### Component Architecture

#### Core Components
1. **AuthWrapper** (Authentication Container)
   - Manages user authentication state
   - Handles user profile creation and updates
   - Tracks translation usage and subscription status
   - Enforces 100-translation free trial limit

2. **TranslationApp** (Main Application Container)
   - Orchestrates translation workflow
   - Manages application state (input, output, loading, errors)
   - Integrates with authentication and payment systems
   - Handles upgrade prompts for subscription users

3. **VoiceInput** (Advanced Voice Recognition)
   - Multi-language cycling system (Spanish → Filipino/Tagalog → Chinese → Hindi → English)
   - Optimized for Tagalog recognition (80-90% accuracy)
   - Interim results processing with 12-second timeout
   - Visual language indicators and status feedback

4. **UpgradePrompt** (Payment Integration)
   - Stripe Checkout integration
   - Subscription upgrade workflow
   - Free trial limit notifications

## Key Technical Decisions

### Authentication & User Management

#### Supabase Integration Pattern
- **Server-Side Auth**: Async Supabase client creation for Next.js App Router compatibility
- **Profile Management**: Automatic user profile creation on first login
- **Usage Tracking**: Real-time translation count updates in database
- **Session Management**: Persistent authentication across browser sessions

#### User State Management
```typescript
// Pattern: Centralized user state with usage tracking
const [user, setUser] = useState<User | null>(null)
const [profile, setProfile] = useState<UserProfile | null>(null)
const [loading, setLoading] = useState(true)

// Usage validation pattern
const canTranslate = () => {
  if (!profile) return false
  if (profile.subscription_status === 'active') return true
  return profile.translation_count < 100 // Free trial limit
}
```

### Payment System Architecture

#### Stripe Integration Pattern
- **Checkout Sessions**: Server-side session creation for security
- **Webhook Processing**: Automated subscription status updates
- **Database Sync**: Real-time subscription status synchronization
- **Error Handling**: Comprehensive payment error recovery

#### Subscription Workflow
```
User Upgrade Request → Stripe Checkout → Payment Success → Webhook → Database Update → UI Refresh
```

### Voice Recognition Enhancement

#### Language Cycling System
```typescript
// Pattern: Sequential language optimization for Tagalog
const languages = [
  'es-ES',    // Spanish (baseline)
  'fil-PH',   // Filipino (primary Tagalog)
  'tl-PH',    // Tagalog (fallback)
  'zh-CN',    // Chinese
  'hi-IN',    // Hindi
  'en-US'     // English (final fallback)
]

// Cycling pattern with interim results
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript
  if (event.results[0].isFinal) {
    handleFinalResult(transcript)
  } else {
    handleInterimResult(transcript) // Real-time feedback
  }
}
```

### Database Patterns

#### User Profile Schema
```sql
-- Pattern: Comprehensive user tracking
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  translation_count INTEGER DEFAULT 0,
  subscription_status TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

#### Usage Tracking Pattern
- **Atomic Updates**: Translation count incremented atomically
- **Subscription Validation**: Real-time subscription status checks
- **Audit Trail**: Comprehensive usage tracking for analytics

### API Route Design

#### Translation Endpoint Pattern
```typescript
// Pattern: Authenticated translation with usage validation
export async function POST(request: Request) {
  // 1. Validate authentication
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // 2. Check usage limits
  const canTranslate = await validateUsageLimit(user.email)
  
  // 3. Process translation
  const result = await openai.chat.completions.create(...)
  
  // 4. Update usage tracking
  await incrementTranslationCount(user.email)
  
  return NextResponse.json({ translation: result })
}
```

#### Webhook Security Pattern
```typescript
// Pattern: Stripe webhook verification and processing
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const event = stripe.webhooks.constructEvent(body, signature, secret)
  
  switch (event.type) {
    case 'checkout.session.completed':
      await updateSubscriptionStatus(event.data.object)
      break
  }
}
```

## Component Relationships

### Dependency Graph
```
AuthWrapper (Authentication Container)
├── TranslationApp (Main Application)
│   ├── VoiceInput (Voice Recognition)
│   ├── UpgradePrompt (Payment Integration)
│   ├── UI Components (Radix + Tailwind)
│   └── translation-service (API Communication)
├── Supabase Client (Database + Auth)
└── Stripe Integration (Payment Processing)

API Routes
├── /api/translate (Translation Processing)
├── /api/create-checkout-session (Payment Initiation)
└── /api/webhooks/stripe (Payment Completion)

External Services
├── OpenAI GPT-3.5-turbo (Translation Engine)
├── Supabase (Backend Services)
└── Stripe (Payment Processing)
```

### Data Flow Patterns

#### Authentication Flow
```
Page Load → Supabase Auth Check → User Profile Fetch → Usage Validation → UI Render
```

#### Translation Flow
```
User Input → Usage Validation → API Call → OpenAI Processing → Usage Update → Result Display
```

#### Payment Flow
```
Upgrade Request → Stripe Session → Checkout → Webhook → Database Update → UI Refresh
```

## Performance Patterns

### Optimization Strategies
- **Async Loading**: Non-blocking authentication and profile loading
- **Debounced Voice Input**: 12-second timeout prevents excessive API calls
- **Optimistic UI Updates**: Immediate feedback with background validation
- **Language Cycling**: Progressive enhancement for voice recognition accuracy
- **Database Indexing**: Optimized queries for user profiles and usage tracking

### Caching Patterns
- **Client-Side State**: User profile and subscription status cached in React state
- **Session Persistence**: Supabase handles authentication session caching
- **API Response Caching**: Translation results cached in component state

## Security Patterns

### Authentication Security
- **Server-Side Validation**: All API routes validate user authentication
- **Row-Level Security**: Supabase RLS policies protect user data
- **Session Management**: Secure token-based authentication
- **Profile Isolation**: Users can only access their own data

### Payment Security
- **Server-Side Processing**: All payment operations handled server-side
- **Webhook Verification**: Stripe signature verification for webhook security
- **API Key Protection**: Sensitive keys stored in environment variables
- **PCI Compliance**: Stripe handles all payment data processing

### Input Validation
- **Server-Side Validation**: All inputs validated before processing
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **XSS Protection**: Input sanitization and output encoding
- **Rate Limiting**: Usage limits prevent API abuse

## Scalability Considerations

### Current Architecture Benefits
- **Stateless API Design**: Horizontal scaling capability
- **Database Optimization**: Indexed queries for performance
- **External Service Integration**: Offloaded processing to specialized services
- **Component Modularity**: Independent feature scaling

### Monitoring & Analytics
- **Usage Tracking**: Comprehensive translation usage analytics
- **Error Logging**: Detailed error tracking and reporting
- **Performance Metrics**: API response time monitoring
- **User Behavior**: Translation patterns and feature usage

### Future Scaling Patterns
- **Caching Layer**: Redis for translation result caching
- **CDN Integration**: Static asset optimization
- **Microservices**: Service extraction for independent scaling
- **Load Balancing**: Multi-region deployment capability
- **Database Sharding**: User-based data partitioning

## Error Handling Patterns

### Layered Error Recovery
1. **Client-Side**: UI error states and user feedback
2. **API Layer**: Structured error responses with actionable messages
3. **Service Layer**: External service failure handling and retries
4. **Database Layer**: Transaction rollback and data consistency

### User Experience Patterns
- **Graceful Degradation**: Core functionality maintained during service outages
- **Progressive Enhancement**: Advanced features enhance but don't break basic functionality
- **Error Communication**: Clear, actionable error messages for users
- **Retry Mechanisms**: Automatic retry for transient failures
