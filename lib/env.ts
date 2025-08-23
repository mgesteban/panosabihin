// Environment variable validation
export const getOpenAIKey = () => {
  const key = process.env.OPENAI_API_KEY

  if (!key || key.length === 0) {
    throw new Error("OPENAI_API_KEY is not configured. Please add it to your environment variables.")
  }

  return key
}

// Check if OpenAI API key is configured
export const isOpenAIConfigured = () => {
  try {
    getOpenAIKey()
    return true
  } catch (error) {
    return false
  }
}

// Supabase environment validation
export const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || url.length === 0) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured. Please add it to your environment variables.")
  }

  if (!anonKey || anonKey.length === 0) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured. Please add it to your environment variables.")
  }

  return { url, anonKey }
}

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  try {
    getSupabaseConfig()
    return true
  } catch (error) {
    return false
  }
}

// Check if all required services are configured
export const areServicesConfigured = () => {
  return isOpenAIConfigured() && isSupabaseConfigured()
}
