import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin"] })

// --- THIS IS THE UPDATED PART ---
export const metadata: Metadata = {
  // This is the text for the browser tab
  title: "რაგბის კლუბი ლელო | Rugby Club Lelo Tbilisi",
  
  // This is the description for Google search results
  description: "რაგბის კლუბი ლელო/Rugby Club Lelo Tbilisi",
  
  icons: {
    icon: "/images/favicon.ico",
  },
}
// --- END OF UPDATED PART ---

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}