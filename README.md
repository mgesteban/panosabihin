# AiPolyglot Translation App

A simple web application that translates any language to English using OpenAI's language models.

## Setting Up Your OpenAI API Key

There are several ways to set up your OpenAI API key:

### Option 1: Environment Variables (Recommended for Production)

1. Create a `.env.local` file in the root of your project
2. Add your OpenAI API key:
   \`\`\`
   OPENAI_API_KEY=your_api_key_here
   \`\`\`
3. Restart your development server

### Option 2: Vercel Environment Variables (For Deployment)

If deploying to Vercel:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add a new variable with the name `OPENAI_API_KEY` and your API key as the value
4. Redeploy your application

### Option 3: In-App API Key Entry (For Testing)

The app includes a form to enter your API key directly in the browser. This is stored in your browser's localStorage and is convenient for testing, but not recommended for production use.

## Getting an OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you won't be able to see it again)

## Development

\`\`\`bash
# Install dependencies
npm install

# Run the development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
