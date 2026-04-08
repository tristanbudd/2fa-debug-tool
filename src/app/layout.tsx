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
  title: {
    default: "2FA Debug Tool",
    template: "%s | 2FA Debug Tool",
  },
  description:
    "2FA Debug Tool - A modern Next.js app for generating and verifying OTP setups (TOTP and HOTP) with QR support, provider-aware options, and QA-focused testing workflows.",
  keywords: [
    "2FA",
    "OTP",
    "TOTP",
    "HOTP",
    "authenticator",
    "QR code",
    "developer tools",
    "QA testing",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "2FA Debug Tool",
    title: "2FA Debug Tool",
    description:
      "Generate and verify OTP setups (TOTP and HOTP) with QR support for development and QA testing.",
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
      "Generate and verify OTP setups (TOTP and HOTP) with QR support for development and QA testing.",
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
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <a
          href="#main-content"
          className="bg-background text-foreground sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:border focus:px-3 focus:py-2"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
