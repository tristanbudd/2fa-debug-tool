/**
 * @file totp-profiles.ts
 * @description Supported TOTP option profiles for authenticator apps.
 */

export type TOTPAlgorithm = "SHA1" | "SHA256" | "SHA512"
export type AuthenticatorProvider = "google" | "microsoft" | "custom"
export type OTPMode = "totp" | "hotp"

export type OTPModeProfile = {
  algorithms: TOTPAlgorithm[]
  digits: number[]
  periods: number[]
  keyTypeLabel: string
  label: string
  supportsCountdown: boolean
}

export type TOTPProfile = {
  defaultMode: OTPMode
  label: string
  supportedModes: OTPMode[]
  modeOptions: Record<OTPMode, OTPModeProfile | null>
}

// Keep this list strict so generated and verified codes match real app behavior.
export const TOTP_PROFILES: Record<AuthenticatorProvider, TOTPProfile> = {
  custom: {
    defaultMode: "totp",
    label: "Custom Configuration",
    supportedModes: ["totp", "hotp"],
    modeOptions: {
      hotp: {
        algorithms: ["SHA1", "SHA256", "SHA512"],
        digits: [4, 5, 6, 7, 8, 9, 10],
        keyTypeLabel: "Counter based",
        label: "Counter based (HOTP)",
        periods: [],
        supportsCountdown: false,
      },
      totp: {
        algorithms: ["SHA1", "SHA256", "SHA512"],
        digits: [4, 5, 6, 7, 8, 9, 10],
        keyTypeLabel: "Time based",
        label: "Time based (TOTP)",
        periods: [15, 30, 45, 60, 90, 120],
        supportsCountdown: true,
      },
    },
  },
  google: {
    defaultMode: "totp",
    label: "Google Authenticator",
    supportedModes: ["totp", "hotp"],
    modeOptions: {
      hotp: {
        algorithms: ["SHA1"],
        digits: [6],
        keyTypeLabel: "Counter based",
        label: "Counter based (HOTP)",
        periods: [],
        supportsCountdown: false,
      },
      totp: {
        algorithms: ["SHA1"],
        digits: [6],
        keyTypeLabel: "Time based",
        label: "Time based (TOTP)",
        periods: [30],
        supportsCountdown: true,
      },
    },
  },
  microsoft: {
    defaultMode: "totp",
    label: "Microsoft Authenticator",
    supportedModes: ["totp"],
    modeOptions: {
      hotp: null,
      totp: {
        algorithms: ["SHA1"],
        digits: [6],
        keyTypeLabel: "Time based",
        label: "Time based (TOTP)",
        periods: [30],
        supportsCountdown: true,
      },
    },
  },
}

export function isAuthenticatorProvider(value: string): value is AuthenticatorProvider {
  return value === "google" || value === "microsoft" || value === "custom"
}

export function isOTPMode(value: string): value is OTPMode {
  return value === "totp" || value === "hotp"
}

export function getModeProfile(provider: AuthenticatorProvider, mode: OTPMode) {
  return TOTP_PROFILES[provider].modeOptions[mode]
}
