/**
 * @file route.ts
 * @description Generates an OTP setup payload including secret, otpauth URI, QR image, and current code.
 */

import { NextResponse } from "next/server"
import { OTP, type HashAlgorithm } from "otplib"
import QRCode from "qrcode"

import {
  getModeProfile,
  isAuthenticatorProvider,
  isOTPMode,
  TOTP_PROFILES,
  type AuthenticatorProvider,
  type OTPMode,
} from "@/lib/totp-profiles"

type GenerateRequest = {
  issuer?: string
  account?: string
  algorithm?: string
  counter?: number
  digits?: number
  mode?: string
  period?: number
  provider?: string
}

function buildOtpauthUri(params: {
  account: string
  algorithm: string
  counter: number
  digits: number
  issuer: string
  mode: OTPMode
  period: number
  secret: string
}) {
  const label = `${encodeURIComponent(params.issuer)}:${encodeURIComponent(params.account)}`
  const query = new URLSearchParams({
    algorithm: params.algorithm,
    digits: String(params.digits),
    issuer: params.issuer,
    secret: params.secret,
  })

  if (params.mode === "totp") {
    query.set("period", String(params.period))
  } else {
    query.set("counter", String(params.counter))
  }

  return `otpauth://${params.mode}/${label}?${query.toString()}`
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest

    const issuer = (body.issuer ?? "").trim()
    const account = (body.account ?? "").trim()
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

    if (!issuer || !account) {
      return NextResponse.json({ error: "Issuer and account are required." }, { status: 400 })
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

    const secret = otp.generateSecret()
    const otpauthUri = buildOtpauthUri({
      account,
      algorithm,
      counter,
      digits,
      issuer,
      mode,
      period,
      secret,
    })
    const currentCode = otp.generateSync({
      algorithm: algorithmName,
      counter: mode === "hotp" ? counter : undefined,
      digits,
      period: mode === "totp" ? period : undefined,
      secret,
    })
    const qrDataUrl = await QRCode.toDataURL(otpauthUri, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 320,
    })

    return NextResponse.json({
      currentCode,
      counter,
      mode,
      otpauthUri,
      qrDataUrl,
      secret,
    })
  } catch {
    return NextResponse.json({ error: "Failed to generate setup payload." }, { status: 500 })
  }
}
