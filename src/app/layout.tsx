/**
 * @file layout.tsx
 * @description Root layout shared across all routes. Sets up global fonts, metadata, and analytics.
 */

import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"

import { cn } from "@/lib/utils"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://2fa.tristanbudd.com"),
  title: "2FA Debug Tool",
  description:
    "2FA Debug Tool - Generate TOTP QR Codes & Verify Authenticator Codes | Secure Development & QA Testing",
  openGraph: {
    type: "website",
    siteName: "2FA Debug Tool",
    title: "2FA Debug Tool",
    description:
      "Generate TOTP QR Codes & Verify Authenticator Codes for Development and QA Testing",
    url: "https://2fa.tristanbudd.com",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "2FA Debug Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2FA Debug Tool",
    description:
      "Generate TOTP QR Codes & Verify Authenticator Codes for Development and QA Testing",
    images: ["/api/og"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
