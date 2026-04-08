/**
 * @file route.ts
 * @description Returns the current OTP code for a supplied server-side secret and settings.
 */

import { NextResponse } from "next/server"
import { OTP, type HashAlgorithm } from "otplib"

import {
  getModeProfile,
  isAuthenticatorProvider,
  isOTPMode,
  TOTP_PROFILES,
  type AuthenticatorProvider,
  type OTPMode,
} from "@/lib/totp-profiles"

type CurrentRequest = {
  algorithm?: string
  counter?: number
  digits?: number
  mode?: string
  period?: number
  secret?: string
  provider?: string
}

function getRemainingSeconds(period: number) {
  const unixSeconds = Math.floor(Date.now() / 1000)
  const remainder = unixSeconds % period
  return remainder === 0 ? period : period - remainder
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CurrentRequest

    const secret = (body.secret ?? "")
      .trim()
      .replace(/[\s-]+/g, "")
      .toUpperCase()
    const providerCandidate = String(body.provider ?? "google")
    const provider: AuthenticatorProvider = isAuthenticatorProvider(providerCandidate)
      ? providerCandidate
      : "google"
    const profile = TOTP_PROFILES[provider]
    const modeCandidate = String(body.mode ?? profile.defaultMode)
    const mode: OTPMode = isOTPMode(modeCandidate) ? modeCandidate : profile.defaultMode
    const modeProfile = getModeProfile(provider, mode)

    if (!modeProfile || !profile.supportedModes.includes(mode)) {
      return NextResponse.json(
        { error: `${profile.label} does not support ${mode.toUpperCase()} mode.` },
        { status: 400 }
      )
    }

    const algorithm = (body.algorithm ?? modeProfile.algorithms[0]).toUpperCase()
    const digits = Number(body.digits ?? modeProfile.digits[0])
    const period = Number(body.period ?? modeProfile.periods[0] ?? 30)
    const counter = Number(body.counter ?? 0)

    if (!secret) {
      return NextResponse.json({ error: "Secret is required." }, { status: 400 })
    }

    const isCustomProvider = provider === "custom"

    if (
      !isCustomProvider &&
      !modeProfile.algorithms.includes(algorithm as (typeof modeProfile.algorithms)[number])
    ) {
      return NextResponse.json(
        {
          error: `${profile.label} does not support algorithm ${algorithm} for ${mode.toUpperCase()}.`,
        },
        { status: 400 }
      )
    }

    if (isCustomProvider && !["SHA1", "SHA256", "SHA512"].includes(algorithm)) {
      return NextResponse.json(
        { error: "Custom mode supports SHA1, SHA256, or SHA512 algorithms only." },
        { status: 400 }
      )
    }

    if (!isCustomProvider && !modeProfile.digits.includes(digits)) {
      return NextResponse.json(
        {
          error: `${profile.label} does not support ${digits}-digit codes for ${mode.toUpperCase()}.`,
        },
        { status: 400 }
      )
    }

    if (isCustomProvider && (!Number.isInteger(digits) || digits < 4 || digits > 10)) {
      return NextResponse.json(
        { error: "Custom mode requires digits to be an integer between 4 and 10." },
        { status: 400 }
      )
    }

    if (mode === "totp") {
      if (!isCustomProvider && !modeProfile.periods.includes(period)) {
        return NextResponse.json(
          { error: `${profile.label} does not support ${period}-second periods.` },
          { status: 400 }
        )
      }

      if (isCustomProvider && (!Number.isInteger(period) || period < 1 || period > 300)) {
        return NextResponse.json(
          { error: "Custom mode requires period to be an integer between 1 and 300 seconds." },
          { status: 400 }
        )
      }
    } else if (!Number.isInteger(counter) || counter < 0) {
      return NextResponse.json(
        { error: "Counter must be a non-negative integer." },
        { status: 400 }
      )
    }

    const otp = new OTP({ strategy: mode })
    const algorithmName = algorithm.toLowerCase() as HashAlgorithm
    const currentCode = otp.generateSync({
      algorithm: algorithmName,
      counter: mode === "hotp" ? counter : undefined,
      digits,
      period: mode === "totp" ? period : undefined,
      secret,
    })

    return NextResponse.json({
      currentCode,
      remainingSeconds: mode === "totp" ? getRemainingSeconds(period) : null,
    })
  } catch {
    return NextResponse.json({ error: "Failed to generate current code." }, { status: 500 })
  }
}
