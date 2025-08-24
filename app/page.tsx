import BidirectionalTranslationApp from "@/components/bidirectional-translation-app"
import AuthWrapper from "@/components/auth/auth-wrapper"

export default function Home() {
  return (
    <AuthWrapper>
      <BidirectionalTranslationApp />
    </AuthWrapper>
  )
}
