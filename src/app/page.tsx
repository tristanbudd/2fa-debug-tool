/**
 * @file page.tsx
 * @description Functional homepage for generating and verifying OTP setups.
 */

"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react"
import Image from "next/image"
import Link from "next/link"

import {
  getModeProfile,
  TOTP_PROFILES,
  type AuthenticatorProvider,
  type OTPMode,
  type TOTPAlgorithm,
} from "@/lib/totp-profiles"
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

type GenerateResponse = {
  currentCode: string
  counter?: number
  mode?: OTPMode
  otpauthUri: string
  qrDataUrl: string
  secret: string
}

type VerifyResponse = {
  isValid: boolean
}

type CurrentCodeResponse = {
  currentCode: string
  error?: string
  remainingSeconds?: number | null
}

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

function GoogleAuthenticatorIcon() {
  return (
    <svg aria-hidden className="size-4" viewBox="-3 0 262 262" fill="none">
      <path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      />
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      />
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      />
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      />
    </svg>
  )
}

function MicrosoftAuthenticatorIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none">
      <rect x="3" y="3" width="8" height="8" fill="#F25022" />
      <rect x="13" y="3" width="8" height="8" fill="#7FBA00" />
      <rect x="3" y="13" width="8" height="8" fill="#00A4EF" />
      <rect x="13" y="13" width="8" height="8" fill="#FFB900" />
    </svg>
  )
}

function CustomAuthenticatorIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="8" cy="7" r="1.5" fill="currentColor" />
      <circle cx="16" cy="12" r="1.5" fill="currentColor" />
      <circle cx="10" cy="17" r="1.5" fill="currentColor" />
    </svg>
  )
}

function getProviderLabel(providerValue: AuthenticatorProvider) {
  if (providerValue === "google") {
    return "Google Authenticator"
  }

  if (providerValue === "microsoft") {
    return "Microsoft Authenticator"
  }

  return "Custom (advanced)"
}

function ProviderIcon({ providerValue }: { providerValue: AuthenticatorProvider }) {
  if (providerValue === "google") {
    return <GoogleAuthenticatorIcon />
  }

  if (providerValue === "microsoft") {
    return <MicrosoftAuthenticatorIcon />
  }

  return <CustomAuthenticatorIcon />
}

function getMaskedSecret(secret: string) {
  if (!secret) {
    return "Not generated yet"
  }

  return "•".repeat(Math.min(12, secret.length))
}

function normalizeSecretValue(secret: string) {
  return secret.replace(/[\s-]+/g, "").toUpperCase()
}

export default function Home() {
  const [viewportWidth, setViewportWidth] = useState(0)

  const [provider, setProvider] = useState<AuthenticatorProvider>("google")
  const [mode, setMode] = useState<OTPMode>("totp")

  const [issuer, setIssuer] = useState("")
  const [account, setAccount] = useState("")
  const [algorithm, setAlgorithm] = useState<TOTPAlgorithm>("SHA1")
  const [digits, setDigits] = useState(6)
  const [period, setPeriod] = useState(30)
  const [counter, setCounter] = useState(0)

  const [secret, setSecret] = useState("")
  const [otpauthUri, setOtpauthUri] = useState("")
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [currentCode, setCurrentCode] = useState("")

  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState("")

  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""))
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState("")
  const [verifySuccess, setVerifySuccess] = useState<boolean | null>(null)

  const [showCurrentCode, setShowCurrentCode] = useState(false)
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null)
  const [isCurrentCodeRefreshAvailable, setIsCurrentCodeRefreshAvailable] = useState(false)
  const [autoAdvanceCounter, setAutoAdvanceCounter] = useState(true)
  const [showManualSetupKey, setShowManualSetupKey] = useState(false)

  const [isSecretCopied, setIsSecretCopied] = useState(false)
  const [showServerSecret, setShowServerSecret] = useState(false)
  const [revealServerSecret, setRevealServerSecret] = useState(false)

  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([])

  const providerProfile = TOTP_PROFILES[provider]
  const isCustomProvider = provider === "custom"
  const activeMode: OTPMode = providerProfile.supportedModes.includes(mode)
    ? mode
    : providerProfile.defaultMode
  const activeModeProfile = getModeProfile(provider, activeMode)

  const handleDigitsChange = useCallback((newDigits: number) => {
    setDigits(newDigits)
    setOtpDigits(Array(newDigits).fill(""))
    otpInputRefs.current = []
    setVerifyMessage("")
    setVerifySuccess(null)
  }, [])

  const handleProviderChange = useCallback(
    (newProvider: AuthenticatorProvider) => {
      setProvider(newProvider)
      const newProfile = TOTP_PROFILES[newProvider]
      const fallbackMode = newProfile.supportedModes.includes(mode) ? mode : newProfile.defaultMode
      setMode(fallbackMode)

      const modeProfile = getModeProfile(newProvider, fallbackMode)
      if (modeProfile) {
        if (!modeProfile.algorithms.includes(algorithm)) {
          setAlgorithm(modeProfile.algorithms[0])
        }
        if (!modeProfile.digits.includes(digits)) {
          handleDigitsChange(modeProfile.digits[0])
        }
        if (
          newProvider !== "custom" &&
          fallbackMode === "totp" &&
          !modeProfile.periods.includes(period)
        ) {
          setPeriod(modeProfile.periods[0])
        }
      }
    },
    [mode, algorithm, digits, period, handleDigitsChange]
  )

  const handleModeChange = useCallback(
    (newMode: OTPMode) => {
      setMode(newMode)
      const modeProfile = getModeProfile(provider, newMode)
      if (modeProfile) {
        if (!modeProfile.algorithms.includes(algorithm)) {
          setAlgorithm(modeProfile.algorithms[0])
        }
        if (!modeProfile.digits.includes(digits)) {
          handleDigitsChange(modeProfile.digits[0])
        }
      }
    },
    [provider, algorithm, digits, handleDigitsChange]
  )

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const otpCode = useMemo(() => otpDigits.join(""), [otpDigits])
  const otpSplitIndex = Math.floor(digits / 2)
  const isUnsupportedWidth = viewportWidth > 0 && viewportWidth < 300

  const refreshCurrentCode = useCallback(async () => {
    if (!secret) {
      setCurrentCode("")
      setIsCurrentCodeRefreshAvailable(false)
      return false
    }

    try {
      const response = await fetch("/api/otp/current", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          algorithm,
          counter,
          digits,
          mode: activeMode,
          period,
          provider,
          secret,
        }),
      })

      const payload = (await response.json()) as CurrentCodeResponse
      if (!response.ok || payload.error) {
        setIsCurrentCodeRefreshAvailable(false)
        setCountdownSeconds(null)
        return false
      }

      setCurrentCode(payload.currentCode)
      setCountdownSeconds(activeMode === "totp" ? (payload.remainingSeconds ?? null) : null)
      setIsCurrentCodeRefreshAvailable(true)
      return true
    } catch {
      // Keep last known code visible if refresh request fails.
      setIsCurrentCodeRefreshAvailable(false)
      return false
    }
  }, [secret, algorithm, counter, digits, activeMode, period, provider])

  useEffect(() => {
    if (!showCurrentCode || !secret) {
      return
    }

    if (activeMode === "totp") {
      const tick = async () => {
        const refreshed = await refreshCurrentCode()
        if (!refreshed) {
          setCountdownSeconds(null)
        }
      }

      void tick()
      const interval = window.setInterval(() => {
        void tick()
      }, 1000)

      return () => {
        window.clearInterval(interval)
      }
    }

    window.setTimeout(() => {
      void refreshCurrentCode()
    }, 0)
  }, [showCurrentCode, secret, activeMode, period, refreshCurrentCode])

  const handleGenerate = async () => {
    if (!issuer.trim() || !account.trim()) {
      setGenerateError("Company / Prefix and Identifier / Suffix are required.")
      return
    }

    setIsGenerating(true)
    setGenerateError("")
    setVerifyMessage("")
    setVerifySuccess(null)

    try {
      const response = await fetch("/api/otp/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account,
          algorithm,
          counter,
          digits,
          issuer,
          mode: activeMode,
          period,
          provider,
        }),
      })

      const payload = (await response.json()) as GenerateResponse & { error?: string }
      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? "Failed to generate setup payload.")
      }

      setSecret(payload.secret)
      setOtpauthUri(payload.otpauthUri)
      setQrDataUrl(payload.qrDataUrl)
      setCurrentCode(payload.currentCode)
      if (typeof payload.counter === "number") {
        setCounter(payload.counter)
      }
      setOtpDigits(Array(digits).fill(""))
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate setup payload."
      setGenerateError(message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOTPInputChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const next = [...otpDigits]
    next[index] = digit
    setOtpDigits(next)

    if (digit && index < digits - 1) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOTPInputKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOTPPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, digits)

    if (!pasted) {
      return
    }

    const next = Array(digits).fill("")
    for (let i = 0; i < pasted.length; i += 1) {
      next[i] = pasted[i] ?? ""
    }

    setOtpDigits(next)
    const nextIndex = Math.min(pasted.length, digits - 1)
    otpInputRefs.current[nextIndex]?.focus()
  }

  const handleVerify = async () => {
    if (!secret) {
      setVerifySuccess(false)
      setVerifyMessage("Generate setup data or provide a server-side secret before verification")
      return
    }

    if (otpCode.length !== digits) {
      setVerifySuccess(false)
      setVerifyMessage(`Enter all ${digits} digits before verifying`)
      return
    }

    setIsVerifying(true)
    setVerifyMessage("")
    setVerifySuccess(null)

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          algorithm,
          counter,
          digits,
          mode: activeMode,
          period,
          provider,
          secret,
          token: otpCode,
        }),
      })

      const payload = (await response.json()) as VerifyResponse & { error?: string }
      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? "Verification failed")
      }

      setVerifySuccess(payload.isValid)

      if (payload.isValid && activeMode === "hotp" && autoAdvanceCounter) {
        setCounter((current) => current + 1)
        setOtpDigits(Array(digits).fill(""))
        setVerifyMessage("Code is valid. Counter auto-advanced by 1 for the next HOTP test.")
      } else {
        setVerifyMessage(payload.isValid ? "Code is valid" : "Code is not valid")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed"
      setVerifySuccess(false)
      setVerifyMessage(message)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCopySecret = async () => {
    if (!secret) {
      return
    }

    try {
      await navigator.clipboard.writeText(secret)
      setIsSecretCopied(true)
      window.setTimeout(() => {
        setIsSecretCopied(false)
      }, 1500)
    } catch {
      setIsSecretCopied(false)
    }
  }

  const toggleServerSecretVisibility = () => {
    setShowServerSecret((current) => {
      const next = !current
      if (!next) {
        setRevealServerSecret(false)
      }
      return next
    })
  }

  if (!activeModeProfile) {
    return null
  }

  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-5xl flex-1 justify-center px-0 py-0 min-[400px]:px-4 sm:px-6 lg:px-8"
    >
      {isUnsupportedWidth ? (
        <section className="flex min-h-screen w-full items-center justify-center p-6">
          <div className="border-border bg-background w-full max-w-sm border p-4">
            <h1 className="text-base font-semibold">Screen size unsupported</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              This tool requires at least 300px viewport width. Please rotate your device or use a
              larger screen.
            </p>
          </div>
        </section>
      ) : (
        <div className="border-border/80 bg-background/95 w-full max-w-3xl border-x-0 px-0 py-6 min-[400px]:border-x sm:px-8 sm:py-8">
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
              Generate OTP setup data, preview QR output, and validate authenticator codes.
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
                  <Input
                    id="issuer"
                    placeholder="Example Corp"
                    value={issuer}
                    onChange={(event) => setIssuer(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identifier">Identifier / Suffix</Label>
                  <Input
                    id="identifier"
                    placeholder="qa.user@example.com"
                    value={account}
                    onChange={(event) => setAccount(event.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Section: Authenticator option profile */}
            <section className="border-border/80 border-t px-4 py-7 sm:px-6 sm:py-8">
              <div className="mb-4 space-y-1">
                <h2 className="text-base font-medium sm:text-lg">2. Authenticator Options</h2>
                <p className="text-muted-foreground text-sm">
                  Select a strict app profile or Custom to choose your own algorithm/digits/period.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Authenticator App</Label>
                  <Select value={provider} onValueChange={handleProviderChange}>
                    <SelectTrigger
                      id="provider"
                      className="relative w-full pl-8"
                      aria-label="Authenticator app"
                    >
                      <span className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2">
                        <ProviderIcon providerValue={provider} />
                      </span>
                      <SelectValue placeholder="Select app">
                        {getProviderLabel(provider)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">
                        <span className="inline-flex items-center gap-2">
                          <GoogleAuthenticatorIcon />
                          Google Authenticator
                        </span>
                      </SelectItem>
                      <SelectItem value="microsoft">
                        <span className="inline-flex items-center gap-2">
                          <MicrosoftAuthenticatorIcon />
                          Microsoft Authenticator
                        </span>
                      </SelectItem>
                      <SelectItem value="custom">
                        <span className="inline-flex items-center gap-2">
                          <CustomAuthenticatorIcon />
                          Custom (advanced)
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mode">Key Type</Label>
                  <Select value={activeMode} onValueChange={handleModeChange}>
                    <SelectTrigger
                      id="mode"
                      className="w-full"
                      disabled={providerProfile.supportedModes.length === 1}
                    >
                      <SelectValue placeholder="Select key type" />
                    </SelectTrigger>
                    <SelectContent>
                      {providerProfile.supportedModes.map((modeOption) => {
                        const modeProfile = getModeProfile(provider, modeOption)
                        if (!modeProfile) {
                          return null
                        }

                        return (
                          <SelectItem key={modeOption} value={modeOption}>
                            {modeProfile.label}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="algorithm">Algorithm</Label>
                  <Select
                    value={algorithm}
                    onValueChange={(value) => setAlgorithm(value as TOTPAlgorithm)}
                  >
                    <SelectTrigger
                      id="algorithm"
                      className="w-full"
                      disabled={activeModeProfile.algorithms.length === 1}
                    >
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeModeProfile.algorithms.map((algorithmOption) => (
                        <SelectItem key={algorithmOption} value={algorithmOption}>
                          {algorithmOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="digits">Digits</Label>
                  {isCustomProvider ? (
                    <Input
                      id="digits"
                      type="number"
                      min={4}
                      max={10}
                      step={1}
                      value={digits}
                      onChange={(event) => {
                        const parsed = Number(event.target.value)
                        if (Number.isFinite(parsed) && parsed >= 4 && parsed <= 10) {
                          handleDigitsChange(Math.floor(parsed))
                        }
                      }}
                    />
                  ) : (
                    <Select
                      value={String(digits)}
                      onValueChange={(value) => handleDigitsChange(Number(value))}
                    >
                      <SelectTrigger
                        id="digits"
                        className="w-full"
                        disabled={activeModeProfile.digits.length === 1}
                      >
                        <SelectValue placeholder="Select digits" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeModeProfile.digits.map((digitsOption) => (
                          <SelectItem key={digitsOption} value={String(digitsOption)}>
                            {digitsOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {activeMode === "totp" ? (
                  <div className="space-y-2">
                    <Label htmlFor="period">Period (seconds)</Label>
                    {isCustomProvider ? (
                      <Input
                        id="period"
                        type="number"
                        min={1}
                        max={300}
                        step={1}
                        value={period}
                        onChange={(event) => {
                          const parsed = Number(event.target.value)
                          if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 300) {
                            setPeriod(Math.floor(parsed))
                          }
                        }}
                      />
                    ) : (
                      <Select
                        value={String(period)}
                        onValueChange={(value) => setPeriod(Number(value))}
                      >
                        <SelectTrigger
                          id="period"
                          className="w-full"
                          disabled={activeModeProfile.periods.length === 1}
                        >
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeModeProfile.periods.map((periodOption) => (
                            <SelectItem key={periodOption} value={String(periodOption)}>
                              {periodOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="counter">Counter</Label>
                    <Input
                      id="counter"
                      type="number"
                      min={0}
                      step={1}
                      value={counter}
                      onChange={(event) => {
                        const parsed = Number(event.target.value)
                        if (Number.isFinite(parsed) && parsed >= 0) {
                          setCounter(Math.floor(parsed))
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Section: URI and QR output */}
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
                    value={otpauthUri}
                    readOnly
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>QR Preview</Label>
                  <div className="bg-muted text-muted-foreground flex min-h-40 items-center justify-center border border-dashed p-4 text-sm">
                    {qrDataUrl ? (
                      <Image
                        src={qrDataUrl}
                        alt="Generated OTP QR code"
                        width={160}
                        height={160}
                        unoptimized
                      />
                    ) : (
                      "QR code preview will appear here"
                    )}
                  </div>
                </div>

                <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Setup Output"}
                </Button>

                {generateError ? (
                  <p className="text-sm text-red-600" role="alert" aria-live="polite">
                    {generateError}
                  </p>
                ) : null}

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label>Current Code</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCurrentCode((current) => {
                          const next = !current
                          if (!next) {
                            setCountdownSeconds(null)
                            setIsCurrentCodeRefreshAvailable(false)
                          }
                          return next
                        })
                      }}
                      disabled={!secret}
                    >
                      {showCurrentCode ? "Hide Code" : "Show Code"}
                    </Button>
                  </div>

                  {showCurrentCode ? (
                    <div className="bg-muted/50 border-border/70 space-y-1 border p-3">
                      <p className="font-mono text-sm">
                        {currentCode || "Waiting for generated secret"}
                      </p>
                      {activeMode === "totp" &&
                      isCurrentCodeRefreshAvailable &&
                      countdownSeconds != null ? (
                        <p className="text-muted-foreground text-xs">
                          Refreshes in {countdownSeconds}s
                        </p>
                      ) : null}
                      <p className="text-muted-foreground text-xs">
                        This code may look out of sync if apps started at different times, but both
                        codes are very likely to work.
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Current code hidden by default. Reveal only when needed.
                    </p>
                  )}
                </div>

                {activeMode === "hotp" ? (
                  <div className="bg-muted/50 border-border/70 space-y-3 border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">Counter Test Controls</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setAutoAdvanceCounter((current) => !current)}
                      >
                        Auto-advance: {autoAdvanceCounter ? "On" : "Off"}
                      </Button>
                    </div>

                    <p className="text-muted-foreground text-xs">
                      Use these controls to test counter drift scenarios. Changing the counter
                      updates the server-generated HOTP code and verification target.
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCounter((current) => Math.max(0, current - 1))}
                        disabled={counter <= 0}
                      >
                        Counter -1
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCounter((current) => current + 1)}
                      >
                        Counter +1
                      </Button>
                      <p className="font-mono text-sm">Active counter: {counter}</p>
                    </div>
                  </div>
                ) : null}

                <div className="bg-muted/50 border-border/70 space-y-3 border p-3 text-sm">
                  <p className="font-medium">Manual Setup ({providerProfile.label})</p>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">Account name</p>
                      <p>{account || "(from Identifier / Suffix)"}</p>
                      <p className="text-muted-foreground text-xs">Source: Identifier / Suffix</p>
                    </div>
                    <div>
                      <p className="font-medium">Issuer / Code name</p>
                      <p>{issuer || "(from Company / Prefix)"}</p>
                      <p className="text-muted-foreground text-xs">Source: Company / Prefix</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Your key</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => setShowManualSetupKey((current) => !current)}
                          aria-label={
                            showManualSetupKey ? "Hide manual setup key" : "Show manual setup key"
                          }
                        >
                          {showManualSetupKey ? (
                            <svg
                              aria-hidden
                              viewBox="0 0 20 20"
                              className="size-4"
                              fill="currentColor"
                            >
                              <path d="M10 4c3.96 0 7.39 2.34 8.95 5.73a1 1 0 0 1 0 .54A10.1 10.1 0 0 1 16.7 13.7l1.01 1a.75.75 0 1 1-1.06 1.06l-13-13A.75.75 0 1 1 4.7 1.7l2.02 2.02A10.6 10.6 0 0 1 10 4Zm2.18 6.42-2.6-2.6a2 2 0 0 0 2.6 2.6Zm4.9 2.78a10.8 10.8 0 0 0 1.87-2.93A8.92 8.92 0 0 0 15.63 6.8l1.45 1.45a9.98 9.98 0 0 1 1.87 1.48.75.75 0 0 1 0 1.06 10.7 10.7 0 0 1-1.87 1.47ZM10 16c-3.96 0-7.39-2.34-8.95-5.73a1 1 0 0 1 0-.54A10.08 10.08 0 0 1 4.3 6.3L2.99 5a10.05 10.05 0 0 0-1.94 2.98 2.5 2.5 0 0 0 0 2.04C2.69 13.7 6.2 16 10 16c1.5 0 2.92-.35 4.2-.96l-1.53-1.53c-.83.32-1.73.49-2.67.49Zm-4.4-4.4 2.6 2.6a2 2 0 0 1-2.6-2.6Z" />
                            </svg>
                          ) : (
                            <svg
                              aria-hidden
                              viewBox="0 0 20 20"
                              className="size-4"
                              fill="currentColor"
                            >
                              <path d="M10 4c3.8 0 7.31 2.3 8.95 5.73a1 1 0 0 1 0 .54C17.31 13.7 13.8 16 10 16s-7.31-2.3-8.95-5.73a1 1 0 0 1 0-.54C2.69 6.3 6.2 4 10 4Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
                            </svg>
                          )}
                        </Button>
                      </div>
                      <p className="font-mono">
                        {showManualSetupKey
                          ? secret || "(not generated yet)"
                          : getMaskedSecret(secret)}
                      </p>
                      <p className="text-muted-foreground text-xs">Source: Server-side Secret</p>
                    </div>
                    <div>
                      <p className="font-medium">Type of key</p>
                      <p>{activeModeProfile.keyTypeLabel}</p>
                      <p className="text-muted-foreground text-xs">Source: Authenticator Options</p>
                    </div>
                    {activeMode === "hotp" ? (
                      <div>
                        <p className="font-medium">Counter</p>
                        <p>{counter}</p>
                        <p className="text-muted-foreground text-xs">Source: Counter option</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Manual OTP verification */}
            <section className="border-border/80 border-t px-4 py-7 sm:px-6 sm:py-8">
              <div className="mb-4 space-y-1">
                <h2 className="text-base font-medium sm:text-lg">4. Verify Authenticator Code</h2>
                <p className="text-muted-foreground text-sm">
                  Manual OTP input area with verification feedback.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="server-secret">Server-side Secret (Base32)</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopySecret}
                        disabled={!secret}
                      >
                        {isSecretCopied ? "Copied" : "Copy Secret"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={toggleServerSecretVisibility}
                      >
                        {showServerSecret ? "Hide Secret" : "Show Secret"}
                      </Button>
                    </div>
                  </div>

                  {showServerSecret ? (
                    <div className="space-y-2">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          id="server-secret"
                          type={revealServerSecret ? "text" : "password"}
                          placeholder="Generated or custom base32 secret"
                          value={secret}
                          onChange={(event) =>
                            setSecret(normalizeSecretValue(event.target.value.trim()))
                          }
                          className="font-mono"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setRevealServerSecret((current) => !current)}
                        >
                          {revealServerSecret ? "Mask" : "Reveal"}
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Secret is masked by default. Reveal only when needed.
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Secret hidden by default. Copy works without revealing.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>OTP Code</Label>
                  <div
                    className="flex flex-wrap gap-2 sm:gap-3"
                    role="group"
                    aria-label="OTP code"
                    onPaste={handleOTPPaste}
                  >
                    {otpDigits.map((value, index) => (
                      <div key={index} className="contents">
                        <Input
                          ref={(element) => {
                            otpInputRefs.current[index] = element
                          }}
                          aria-label={`OTP digit ${index + 1}`}
                          inputMode="numeric"
                          maxLength={1}
                          value={value}
                          onChange={(event) => handleOTPInputChange(index, event.target.value)}
                          onKeyDown={(event) => handleOTPInputKeyDown(index, event)}
                          className="h-11 w-10 text-center text-lg sm:h-12 sm:w-12"
                        />
                        {index === otpSplitIndex - 1 ? (
                          <span
                            aria-hidden
                            className="text-muted-foreground inline-flex h-11 items-center px-0.5 text-base sm:h-12"
                          >
                            -
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleVerify}
                  disabled={isVerifying}
                >
                  Verify Code
                </Button>

                <p
                  aria-live="polite"
                  className={
                    verifySuccess == null
                      ? "text-muted-foreground text-sm"
                      : verifySuccess
                        ? "text-sm text-green-600"
                        : "text-sm text-red-600"
                  }
                >
                  Verification status: {verifyMessage || "waiting for input"}
                </p>
              </div>
            </section>
          </div>

          <section className="border-border/80 border-t px-4 pt-7 pb-0 sm:px-6 sm:pt-8 sm:pb-0">
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
                <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="currentColor">
                  <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm0 4a1 1 0 0 1 1 1v4.25a1 1 0 1 1-2 0V6.5a1 1 0 0 1 1-1Zm0 8.5a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
                </svg>
                Report an issue
              </Link>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
