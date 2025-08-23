# System Patterns: AiPolyglot Translation App

## System Architecture

### Application Structure
```
AiPolyglot Translation App
├── Frontend (Next.js Client)
│   ├── UI Components (React + Radix UI)
│   ├── State Management (React useState)
│   ├── Voice Input (Web Speech API)
│   └── Translation Service (Fetch API)
├── Backend (Next.js API Routes)
│   ├── Translation Endpoint (/api/translate)
│   ├── Environment Test (/api/test-env)
│   └── OpenAI Integration
└── External Services
    ├── OpenAI GPT-3.5-turbo
    └── Browser Web Speech API
```

### Component Architecture

#### Core Components
1. **TranslationApp** (Main Container)
   - Manages application state (input, output, loading, errors)
   - Orchestrates user interactions
   - Handles translation workflow

2. **VoiceInput** (Voice Recognition)
   - Encapsulates Web Speech API logic
   - Manages microphone permissions and browser compatibility
   - Provides voice-to-text functionality

3. **UI Components** (Radix UI + Custom)
   - Button, Card, Textarea for user interface
   - Toast notifications for user feedback
   - Responsive layout components

## Key Technical Decisions

### Frontend Patterns

#### State Management
- **React useState**: Simple state management for component-level state
- **No Global State**: Application complexity doesn't warrant Redux/Zustand
- **Local State Pattern**: Each component manages its own state independently

#### Error Handling
- **Layered Error Handling**: Errors caught at multiple levels
  - API level: Server-side error responses
  - Service level: Client-side fetch error handling
  - Component level: UI error state management
- **User-Friendly Messages**: Technical errors translated to actionable user guidance

#### Voice Input Pattern
- **Progressive Enhancement**: Voice input enhances but doesn't replace text input
- **Browser Detection**: Graceful degradation when Web Speech API unavailable
- **Auto-Translation**: Voice input automatically triggers translation for seamless UX

### Backend Patterns

#### API Route Design
- **Single Responsibility**: Each API route handles one specific function
- **Error Standardization**: Consistent error response format across endpoints
- **Environment Validation**: Separate endpoint for testing API key configuration

#### OpenAI Integration
- **Server-Side API Calls**: Protects API key from client exposure
- **Structured Prompts**: Consistent system message for translation quality
- **Response Validation**: Ensures translation content exists before returning

### Data Flow Patterns

#### Translation Workflow
```
User Input → Component State → Translation Service → API Route → OpenAI → Response Chain
```

1. **Input Capture**: Text or voice input captured in TranslationApp
2. **State Update**: Input stored in component state
3. **Service Call**: translation-service.ts makes API request
4. **API Processing**: /api/translate route handles OpenAI communication
5. **Response Handling**: Result flows back through the chain
6. **UI Update**: Component state updated with translation result

#### Voice Input Workflow
```
Voice Button → Speech Recognition → Transcript → Auto-Translation → Result Display
```

## Design Patterns in Use

### Component Patterns
- **Container/Presentational**: TranslationApp (container) manages VoiceInput (presentational)
- **Composition**: UI components composed together rather than inheritance
- **Props Interface**: TypeScript interfaces define component contracts

### Service Patterns
- **Facade Pattern**: translation-service.ts provides simple interface to complex API interaction
- **Error Boundary Pattern**: Multiple layers of error handling and recovery
- **Async/Await Pattern**: Consistent asynchronous operation handling

### API Patterns
- **RESTful Design**: POST /api/translate follows REST conventions
- **Request/Response Schema**: Structured JSON for API communication
- **Middleware Pattern**: Next.js API routes act as middleware layer

## Component Relationships

### Dependency Graph
```
TranslationApp
├── VoiceInput (voice recognition)
├── UI Components (buttons, cards, inputs)
├── translation-service (API communication)
└── Hooks (toast notifications)

translation-service
└── /api/translate (server endpoint)

/api/translate
└── OpenAI SDK (external service)
```

### Data Flow
- **Unidirectional**: Data flows down through props, events flow up through callbacks
- **Event-Driven**: User interactions trigger state changes and API calls
- **Reactive**: UI automatically updates based on state changes

## Performance Patterns

### Optimization Strategies
- **Lazy Loading**: Components loaded only when needed
- **Debouncing**: Voice input includes timeout to prevent excessive API calls
- **Error Recovery**: Failed requests don't break application state
- **Progressive Enhancement**: Core functionality works without advanced features

### Resource Management
- **API Rate Limiting**: Single translation per user action prevents spam
- **Memory Management**: Component cleanup prevents memory leaks
- **Network Efficiency**: Minimal API calls, efficient request/response format

## Security Patterns

### API Key Protection
- **Server-Side Storage**: OpenAI API key stored in environment variables
- **No Client Exposure**: API key never sent to browser
- **Environment Validation**: Separate endpoint for testing configuration

### Input Validation
- **Server-Side Validation**: API routes validate input before processing
- **Client-Side Checks**: UI prevents empty submissions
- **Error Sanitization**: Error messages don't expose sensitive information

## Scalability Considerations

### Current Architecture Benefits
- **Stateless Design**: No server-side session management required
- **Component Isolation**: Features can be modified independently
- **Service Abstraction**: Easy to swap translation providers
- **Responsive Design**: Scales across device types

### Future Scaling Patterns
- **Caching Layer**: Could add Redis for translation caching
- **Rate Limiting**: Could implement user-based rate limiting
- **Load Balancing**: Stateless design supports horizontal scaling
- **Microservices**: Translation service could be extracted to separate service
