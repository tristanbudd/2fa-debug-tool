/**
 * @file route.ts
 * @description Verifies a user-provided OTP code against a previously generated secret.
 */

import { NextResponse } from "next/server"
import { OTP, type HashAlgorithm } from "otplib"

import { buildCorsPreflightResponse, withPublicCors } from "@/lib/api-cors"
import {
  getModeProfile,
  isAuthenticatorProvider,
  isOTPMode,
  TOTP_PROFILES,
  type AuthenticatorProvider,
  type OTPMode,
} from "@/lib/totp-profiles"

type VerifyRequest = {
  secret?: string
  token?: string
  algorithm?: string
  counter?: number
  digits?: number
  mode?: string
  period?: number
  provider?: string
}

function json(body: unknown, init?: ResponseInit) {
  return withPublicCors(NextResponse.json(body, init))
}

export async function OPTIONS() {
  return buildCorsPreflightResponse()
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyRequest

    const secret = (body.secret ?? "")
      .trim()
      .replace(/[\s-]+/g, "")
      .toUpperCase()
    const token = (body.token ?? "").trim()
    const providerCandidate = String(body.provider ?? "google")
    const provider: AuthenticatorProvider = isAuthenticatorProvider(providerCandidate)
      ? providerCandidate
      : "google"
    const profile = TOTP_PROFILES[provider]
    const modeCandidate = String(body.mode ?? profile.defaultMode)
    const mode: OTPMode = isOTPMode(modeCandidate) ? modeCandidate : profile.defaultMode
    const modeProfile = getModeProfile(provider, mode)

    if (!modeProfile || !profile.supportedModes.includes(mode)) {
      return json(
        { error: `${profile.label} does not support ${mode.toUpperCase()} mode.` },
        { status: 400 }
      )
    }

    const algorithm = (body.algorithm ?? modeProfile.algorithms[0]).toUpperCase()
    const digits = Number(body.digits ?? modeProfile.digits[0])
    const period = Number(body.period ?? modeProfile.periods[0] ?? 30)
    const counter = Number(body.counter ?? 0)

    if (!secret || !token) {
      return json({ error: "Secret and token are required." }, { status: 400 })
    }

    const isCustomProvider = provider === "custom"

    if (
      !isCustomProvider &&
      !modeProfile.algorithms.includes(algorithm as (typeof modeProfile.algorithms)[number])
    ) {
      return json(
        {
          error: `${profile.label} does not support algorithm ${algorithm} for ${mode.toUpperCase()}.`,
        },
        { status: 400 }
      )
    }

    if (isCustomProvider && !["SHA1", "SHA256", "SHA512"].includes(algorithm)) {
      return json(
        { error: "Custom mode supports SHA1, SHA256, or SHA512 algorithms only." },
        { status: 400 }
      )
    }

    if (!isCustomProvider && !modeProfile.digits.includes(digits)) {
      return json(
        {
          error: `${profile.label} does not support ${digits}-digit codes for ${mode.toUpperCase()}.`,
        },
        { status: 400 }
      )
    }

    if (isCustomProvider && (!Number.isInteger(digits) || digits < 4 || digits > 10)) {
      return json(
        { error: "Custom mode requires digits to be an integer between 4 and 10." },
        { status: 400 }
      )
    }

    if (mode === "totp") {
      if (!isCustomProvider && !modeProfile.periods.includes(period)) {
        return json(
          { error: `${profile.label} does not support ${period}-second periods.` },
          { status: 400 }
        )
      }

      if (isCustomProvider && (!Number.isInteger(period) || period < 1 || period > 300)) {
        return json(
          { error: "Custom mode requires period to be an integer between 1 and 300 seconds." },
          { status: 400 }
        )
      }
    } else if (!Number.isInteger(counter) || counter < 0) {
      return json({ error: "Counter must be a non-negative integer." }, { status: 400 })
    }

    if (!/^\d+$/.test(token) || token.length !== digits) {
      return json({ error: `Code must be exactly ${digits} numeric digits.` }, { status: 400 })
    }

    const otp = new OTP({ strategy: mode })
    const algorithmName = algorithm.toLowerCase() as HashAlgorithm
    const result = otp.verifySync({
      algorithm: algorithmName,
      counter: mode === "hotp" ? counter : undefined,
      counterTolerance: mode === "hotp" ? 0 : undefined,
      digits,
      epochTolerance: mode === "totp" ? period : undefined,
      period: mode === "totp" ? period : undefined,
      secret,
      token,
    })

    return json({ isValid: result.valid })
  } catch {
    return json({ error: "Failed to verify code." }, { status: 500 })
  }
}
