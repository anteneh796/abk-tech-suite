import React from "react"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/providers/query-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ErrorBoundary } from "@/components/providers/error-boundary"
import { DynamicBranding } from "@/components/layout/dynamic-branding"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata = {
  title: "ABK Technologies | Engineering Sustainable Solutions for Ethiopia",
  description:
    "Industrial Machine Maintenance, Renewable Energy Solutions, and Technical Consulting. Engineering sustainable solutions that power progress for Ethiopia.",
  keywords: [
    "industrial engineering",
    "renewable energy",
    "Ethiopia",
    "machine maintenance",
    "solar energy",
    "technical consulting",
  ],
}

export const viewport = {
  themeColor: "#0a0a0a",
}

import { LoadingBar } from "@/components/layout/loading-bar"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${jetbrainsMono.variable}`}>
        <QueryProvider>
          <AuthProvider>
            <ErrorBoundary>
              <React.Suspense fallback={null}>
                <LoadingBar />
                <DynamicBranding />
              </React.Suspense>
              {children}
              <Toaster />
            </ErrorBoundary>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
