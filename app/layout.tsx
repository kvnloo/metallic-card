import type React from "react"
import type { Metadata } from "next"
import { Josefin_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Silver Electric Border",
  description: "Dramatic silver electric border effect in Next.js",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={josefinSans.variable}>
        <ThemeProvider defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
