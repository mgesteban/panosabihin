import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AiPolyglot - Simple English Translation",
  description: "Translate any language to English with voice or text input",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F5F0E5]`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <main className="min-h-screen py-6 flex flex-col">{children}</main>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
