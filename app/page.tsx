import { Suspense } from "react"
import LandingPage from "@/components/landing-page"
import AuthWrapper from "@/components/auth/auth-wrapper"

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthWrapper>
        <LandingPage />
      </AuthWrapper>
    </Suspense>
  )
}
