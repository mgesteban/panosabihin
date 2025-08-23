import TranslationApp from "@/components/translation-app"
import AuthWrapper from "@/components/auth/auth-wrapper"

export default function Home() {
  return (
    <AuthWrapper>
      <TranslationApp />
    </AuthWrapper>
  )
}
