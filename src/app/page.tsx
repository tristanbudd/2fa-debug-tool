/**
 * @file page.tsx
 * @description Homepage placeholder UI for the 2FA Debug Tool.
 */

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"

function OgrShieldIcon() {
  return (
    <svg aria-hidden className="text-foreground size-6" viewBox="0 0 512 512">
      <path
        d="M256.001,0L29.89,130.537c0,47.476,4.506,88.936,12.057,125.463C88.61,481.721,256.001,512,256.001,512s167.389-30.279,214.053-256c7.551-36.527,12.057-77.986,12.057-125.463L256.001,0z M256.118,466.723c-0.035-0.012-0.082-0.028-0.117-0.039v-47.672V256H140.77H91.122c-6.67-29.738-11.109-63.506-12.394-101.93L255.999,51.728h0.002v51.73V256h115.27h49.625C385.636,413.404,287.327,456.774,256.118,466.723z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 justify-center px-0 py-0 min-[400px]:px-4 sm:px-6 lg:px-8">
      <section className="flex min-h-screen w-full items-center justify-center p-6 min-[300px]:hidden">
        <div className="border-border bg-background w-full max-w-sm border p-4">
          <h1 className="text-base font-semibold">Screen size unsupported</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            This tool requires at least 300px viewport width. Please rotate your device or use a
            larger screen.
          </p>
        </div>
      </section>

      <div className="border-border/80 bg-background/95 hidden w-full max-w-3xl border-x-0 px-0 py-6 min-[300px]:block min-[400px]:border-x sm:px-8 sm:py-8">
        <header className="space-y-4 pb-7">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-0">
            <div className="flex items-center gap-2">
              <OgrShieldIcon />
              <h1 className="text-lg font-semibold tracking-tight min-[400px]:text-2xl sm:text-3xl">
                2FA Debug Tool
              </h1>
            </div>
            <ThemeToggle />
          </div>

          <p className="text-muted-foreground px-4 text-sm sm:px-0 sm:text-base">
            Generate TOTP setup data, preview QR output, and validate authenticator codes.
          </p>
        </header>

        <div className="overflow-hidden">
          {/* Section: Label/prefix and account identifier inputs */}
          <section className="border-border/80 border-t px-4 py-7 sm:px-6 sm:py-8">
            <div className="mb-4 space-y-1">
              <h2 className="text-base font-medium sm:text-lg">1. Setup Label Inputs</h2>
              <p className="text-muted-foreground text-sm">
                Enter issuer/prefix and account identifier/suffix as shown in authenticator apps.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="issuer">Company / Prefix</Label>
                <Input id="issuer" placeholder="Example Corp" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifier">Identifier / Suffix</Label>
                <Input id="identifier" placeholder="qa.user@example.com" disabled />
              </div>
            </div>
          </section>

          {/* Section: TOTP option placeholders */}
          <section className="border-border/80 border-t px-4 py-7 sm:px-6 sm:py-8">
            <div className="mb-4 space-y-1">
              <h2 className="text-base font-medium sm:text-lg">2. TOTP Options</h2>
              <p className="text-muted-foreground text-sm">
                Configure algorithm, digits, and period supported by the target app.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="algorithm">Algorithm</Label>
                <Select disabled>
                  <SelectTrigger id="algorithm" className="w-full">
                    <SelectValue placeholder="SHA1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sha1">SHA1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="digits">Digits</Label>
                <Select disabled>
                  <SelectTrigger id="digits" className="w-full">
                    <SelectValue placeholder="6" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Period (seconds)</Label>
                <Select disabled>
                  <SelectTrigger id="period" className="w-full">
                    <SelectValue placeholder="30" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Section: URI and QR output placeholders */}
          <section className="border-border/80 border-t px-4 py-7 sm:px-6 sm:py-8">
            <div className="mb-4 space-y-1">
              <h2 className="text-base font-medium sm:text-lg">3. Generate Setup String & QR</h2>
              <p className="text-muted-foreground text-sm">
                Create an otpauth URI and matching QR code output for authenticator app scanning.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-uri">otpauth URI Output</Label>
                <Textarea
                  id="otp-uri"
                  placeholder="otpauth://totp/Example%20Corp:qa.user%40example.com?..."
                  className="min-h-20"
                  disabled
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>QR Preview Placeholder</Label>
                <div className="bg-muted text-muted-foreground flex h-40 items-center justify-center border border-dashed text-sm">
                  QR code preview will appear here
                </div>
              </div>

              <Button className="w-full" disabled>
                Generate Placeholder Output
              </Button>
            </div>
          </section>

          {/* Section: Manual OTP verification placeholder */}
          <section className="border-border/80 border-t px-4 py-7 sm:px-6 sm:py-8">
            <div className="mb-4 space-y-1">
              <h2 className="text-base font-medium sm:text-lg">4. Verify Authenticator Code</h2>
              <p className="text-muted-foreground text-sm">
                Manual OTP input area with placeholder verification state.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>OTP Code</Label>
                <div
                  className="flex flex-wrap gap-2 sm:gap-3"
                  role="group"
                  aria-label="6-digit OTP code"
                >
                  <Input
                    aria-label="OTP digit 1"
                    inputMode="numeric"
                    maxLength={1}
                    className="h-11 w-10 text-center text-lg sm:h-12 sm:w-12"
                  />
                  <Input
                    aria-label="OTP digit 2"
                    inputMode="numeric"
                    maxLength={1}
                    className="h-11 w-10 text-center text-lg sm:h-12 sm:w-12"
                  />
                  <Input
                    aria-label="OTP digit 3"
                    inputMode="numeric"
                    maxLength={1}
                    className="h-11 w-10 text-center text-lg sm:h-12 sm:w-12"
                  />
                  <span
                    aria-hidden
                    className="text-muted-foreground inline-flex h-11 items-center px-0.5 text-base sm:h-12"
                  >
                    -
                  </span>
                  <Input
                    aria-label="OTP digit 4"
                    inputMode="numeric"
                    maxLength={1}
                    className="h-11 w-10 text-center text-lg sm:h-12 sm:w-12"
                  />
                  <Input
                    aria-label="OTP digit 5"
                    inputMode="numeric"
                    maxLength={1}
                    className="h-11 w-10 text-center text-lg sm:h-12 sm:w-12"
                  />
                  <Input
                    aria-label="OTP digit 6"
                    inputMode="numeric"
                    maxLength={1}
                    className="h-11 w-10 text-center text-lg sm:h-12 sm:w-12"
                  />
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Verify Code
              </Button>
              <p className="text-muted-foreground text-sm">
                Verification status: waiting for implementation.
              </p>
            </div>
          </section>
        </div>

        <section className="border-border/80 border-t px-4 py-7 sm:px-6 sm:py-8">
          <div className="flex items-center justify-between gap-4 max-[399px]:flex-col max-[399px]:items-start">
            <Link
              href="https://github.com/tristanbudd/2fa-debug-tool"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="currentColor">
                <path d="M10 1a9 9 0 0 0-2.847 17.538c.45.084.615-.195.615-.435 0-.21-.008-.905-.012-1.64-2.502.544-3.03-1.06-3.03-1.06-.41-1.038-1-1.314-1-1.314-.818-.56.062-.548.062-.548.904.064 1.38.928 1.38.928.804 1.378 2.11.98 2.624.75.082-.582.314-.98.57-1.205-1.998-.227-4.099-.999-4.099-4.448 0-.983.352-1.787.928-2.416-.093-.227-.402-1.14.088-2.377 0 0 .756-.242 2.476.923A8.62 8.62 0 0 1 10 5.84a8.62 8.62 0 0 1 2.255.303c1.72-1.165 2.475-.923 2.475-.923.49 1.237.182 2.15.09 2.377.577.63.927 1.433.927 2.416 0 3.458-2.104 4.218-4.108 4.44.323.277.61.82.61 1.652 0 1.193-.01 2.154-.01 2.447 0 .242.162.524.62.434A9 9 0 0 0 10 1Z" />
              </svg>
              View project on GitHub
            </Link>

            <Link
              href="https://github.com/tristanbudd/2fa-debug-tool/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none">
                <path
                  d="M10 18A8 8 0 1 0 10 2a8 8 0 0 0 0 16Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M10 6.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="12.8" r="0.8" fill="currentColor" />
              </svg>
              Report an issue
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
