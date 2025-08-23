# Project Brief: AiPolyglot Translation App

## Project Overview
AiPolyglot is a web-based translation application that enables users to translate text from any language to English using OpenAI's GPT models. The application supports both text input and voice input for maximum accessibility and ease of use.

## Core Requirements

### Primary Functionality
- **Universal Translation**: Accept input in any language and translate to English
- **Voice Input**: Support speech-to-text input using browser's Web Speech API
- **Text Input**: Traditional textarea input for typing
- **Real-time Translation**: Immediate translation upon input submission
- **Error Handling**: Robust error handling for API failures and edge cases

### Technical Requirements
- **Framework**: Next.js 14 with TypeScript
- **UI Library**: Radix UI components with Tailwind CSS
- **AI Integration**: OpenAI GPT-3.5-turbo for translation
- **Voice Recognition**: Browser Web Speech API
- **Responsive Design**: Mobile-first approach with clean, minimal interface

### Performance Goals
- **Speed**: Fast translation responses (< 3 seconds)
- **Reliability**: Graceful error handling and fallbacks
- **Accessibility**: Voice input for hands-free operation
- **User Experience**: Intuitive, single-purpose interface

## Success Criteria
1. Users can successfully translate text from any language to English
2. Voice input works reliably across supported browsers
3. Application handles errors gracefully with user feedback
4. Interface is responsive and accessible on mobile devices
5. Translation quality is accurate and natural-sounding

## Constraints
- Requires OpenAI API key for functionality
- Voice input limited to browsers supporting Web Speech API
- Translation limited to English output only
- Dependent on internet connectivity for API calls

## Target Users
- Multilingual individuals needing quick English translations
- Language learners practicing comprehension
- Travelers needing basic translation assistance
- Anyone needing quick text or voice translation to English
