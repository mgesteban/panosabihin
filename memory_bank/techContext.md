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

### Backend Technologies
- **Runtime**: Node.js with Next.js API routes
- **AI Integration**: OpenAI SDK (latest) for GPT-3.5-turbo access
- **HTTP Client**: Native fetch API for client-server communication
- **Environment**: Environment variables for configuration management

### Development Tools
- **Package Manager**: npm/pnpm for dependency management
- **Build System**: Next.js built-in build system
- **CSS Processing**: PostCSS with Tailwind CSS
- **Type Checking**: TypeScript compiler with strict mode
- **Linting**: Next.js ESLint configuration

### Browser APIs
- **Web Speech API**: For voice recognition functionality
- **Fetch API**: For HTTP requests to translation service
- **Local Storage**: For potential client-side data persistence

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
  "@ai-sdk/openai": "latest"   // AI SDK for OpenAI integration
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
- **ES6+ Features**: Requires modern JavaScript engine support
- **Fetch API**: Native support in all target browsers
- **CSS Grid/Flexbox**: Modern layout features required

### Performance Constraints
- **API Rate Limits**: OpenAI API has usage limits and costs
- **Network Dependency**: Requires internet connection for all translations
- **Client-Side Processing**: Voice recognition happens in browser
- **Bundle Size**: Large dependency tree affects initial load time

### Security Constraints
- **API Key Management**: OpenAI key must be server-side only
- **CORS Policies**: Browser security affects API access patterns
- **Input Validation**: All user input must be sanitized
- **Environment Variables**: Sensitive data in environment configuration

## Development Setup

### Prerequisites
- Node.js 18+ for Next.js compatibility
- npm or pnpm for package management
- OpenAI API key for translation functionality
- Modern browser for development and testing

### Environment Configuration
```bash
# Required environment variables
OPENAI_API_KEY=your_openai_api_key_here

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
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── translation-app.tsx
│   └── voice-input.tsx
├── lib/                   # Utility libraries
│   ├── translation-service.ts
│   └── utils.ts
├── hooks/                 # Custom React hooks
├── public/               # Static assets
└── styles/               # Additional styles
```

## API Integration

### OpenAI Configuration
- **Model**: GPT-3.5-turbo for cost-effective translation
- **Temperature**: 0.3 for consistent, focused translations
- **Max Tokens**: 1000 to handle longer text inputs
- **System Prompt**: Structured prompt for translation quality

### API Route Design
```typescript
// /api/translate endpoint
POST /api/translate
Content-Type: application/json
{
  "text": "string to translate"
}

Response:
{
  "translatedText": "English translation"
}
```

### Error Handling
- **Network Errors**: Fetch failures handled gracefully
- **API Errors**: OpenAI service errors mapped to user messages
- **Validation Errors**: Input validation with clear feedback
- **Rate Limiting**: Graceful handling of API limits

## Performance Considerations

### Optimization Strategies
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component for logos
- **CSS Optimization**: Tailwind CSS purging unused styles
- **Bundle Analysis**: Regular bundle size monitoring

### Caching Strategy
- **Static Assets**: Next.js automatic static asset caching
- **API Responses**: No caching for translation results (real-time)
- **Component Memoization**: React.memo for expensive components
- **Build Optimization**: Next.js production optimizations

## Deployment Considerations

### Platform Requirements
- **Node.js Runtime**: Server environment with Node.js support
- **Environment Variables**: Secure storage for API keys
- **HTTPS**: Required for Web Speech API in production
- **CDN**: Static asset delivery optimization

### Recommended Platforms
- **Vercel**: Optimal for Next.js applications
- **Netlify**: Good alternative with serverless functions
- **Railway/Render**: Container-based deployment options
- **AWS/GCP**: Enterprise-grade cloud platforms

### Production Configuration
- **Environment Variables**: Production API keys and configuration
- **Error Monitoring**: Sentry or similar error tracking
- **Analytics**: Usage tracking and performance monitoring
- **Security Headers**: HTTPS, CSP, and other security measures

## Future Technical Considerations

### Scalability Improvements
- **Caching Layer**: Redis for translation result caching
- **Database**: Persistent storage for user preferences/history
- **CDN**: Global content delivery for better performance
- **Microservices**: Separate translation service for scaling

### Technology Upgrades
- **Next.js 15**: Future framework updates
- **React 19**: Upcoming React features
- **OpenAI Models**: Newer, more capable models
- **Web APIs**: Emerging browser capabilities
