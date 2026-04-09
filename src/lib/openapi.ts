import { TOTP_PROFILES } from "@/lib/totp-profiles"

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "2FA Debug Tool API",
    version: "1.0.0",
    description:
      "Public OTP utility API for generating, inspecting, and verifying TOTP/HOTP credentials. This spec intentionally excludes /api/og.",
  },
  servers: [{ url: "/", description: "Same-origin server" }],
  tags: [
    { name: "otp", description: "OTP generation and verification endpoints" },
    { name: "meta", description: "API metadata and capability discovery" },
  ],
  paths: {
    "/api/otp/profiles": {
      get: {
        tags: ["otp", "meta"],
        operationId: "getOtpProfiles",
        summary: "Get supported provider/mode constraints",
        description:
          "Returns provider constraints used by this API (supported modes, digits, algorithms, and periods).",
        responses: {
          "200": {
            description: "Provider profile map",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProfilesResponse" },
              },
            },
          },
        },
      },
      options: {
        tags: ["meta"],
        operationId: "optionsOtpProfiles",
        summary: "CORS preflight",
        responses: {
          "204": { description: "Preflight accepted" },
        },
      },
    },
    "/api/otp/generate": {
      post: {
        tags: ["otp"],
        operationId: "generateOtpPayload",
        summary: "Generate OTP setup payload",
        description:
          "Generates a new secret, otpauth URI, QR code data URL, and current OTP code for the selected profile.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/GenerateRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Generated setup payload",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GenerateResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      options: {
        tags: ["meta"],
        operationId: "optionsOtpGenerate",
        summary: "CORS preflight",
        responses: {
          "204": { description: "Preflight accepted" },
        },
      },
    },
    "/api/otp/verify": {
      post: {
        tags: ["otp"],
        operationId: "verifyOtpCode",
        summary: "Verify OTP token",
        description:
          "Verifies a submitted OTP token against secret and provider settings. Secret is normalized by removing spaces/dashes and converting to uppercase.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VerifyRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Verification result",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VerifyResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      options: {
        tags: ["meta"],
        operationId: "optionsOtpVerify",
        summary: "CORS preflight",
        responses: {
          "204": { description: "Preflight accepted" },
        },
      },
    },
    "/api/otp/current": {
      post: {
        tags: ["otp"],
        operationId: "getCurrentOtpCode",
        summary: "Get current OTP code",
        description:
          "Returns the current OTP code for a known secret and profile settings. In TOTP mode, also returns remaining seconds in the active period window.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CurrentCodeRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Current code and timing",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CurrentCodeResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      options: {
        tags: ["meta"],
        operationId: "optionsOtpCurrent",
        summary: "CORS preflight",
        responses: {
          "204": { description: "Preflight accepted" },
        },
      },
    },
    "/api/openapi.json": {
      get: {
        tags: ["meta"],
        operationId: "getOpenApiDocument",
        summary: "Get OpenAPI document",
        description: "Returns the OpenAPI definition for public API consumers.",
        responses: {
          "200": {
            description: "OpenAPI JSON document",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
      options: {
        tags: ["meta"],
        operationId: "optionsOpenApiDocument",
        summary: "CORS preflight",
        responses: {
          "204": { description: "Preflight accepted" },
        },
      },
    },
  },
  components: {
    schemas: {
      Provider: {
        type: "string",
        enum: ["google", "microsoft", "custom"],
        default: "google",
      },
      Mode: {
        type: "string",
        enum: ["totp", "hotp"],
      },
      Algorithm: {
        type: "string",
        enum: ["SHA1", "SHA256", "SHA512"],
      },
      GenerateRequest: {
        type: "object",
        required: ["issuer", "account"],
        additionalProperties: false,
        properties: {
          issuer: {
            type: "string",
            minLength: 1,
            description: "Authenticator issuer name (e.g. company name).",
          },
          account: {
            type: "string",
            minLength: 1,
            description: "Authenticator account label (email, username, or suffix).",
          },
          provider: { $ref: "#/components/schemas/Provider" },
          mode: { $ref: "#/components/schemas/Mode" },
          algorithm: { $ref: "#/components/schemas/Algorithm" },
          digits: {
            type: "integer",
            minimum: 4,
            maximum: 10,
            description:
              "Required format depends on provider. Google/Microsoft currently require 6; custom supports 4-10.",
          },
          period: {
            type: "integer",
            minimum: 1,
            maximum: 300,
            description:
              "TOTP period in seconds. Provider-specific restrictions apply unless provider=custom.",
          },
          counter: {
            type: "integer",
            minimum: 0,
            default: 0,
            description: "HOTP counter value.",
          },
        },
      },
      GenerateResponse: {
        type: "object",
        required: ["currentCode", "counter", "mode", "otpauthUri", "qrDataUrl", "secret"],
        additionalProperties: false,
        properties: {
          currentCode: { type: "string" },
          counter: { type: "integer", minimum: 0 },
          mode: { $ref: "#/components/schemas/Mode" },
          otpauthUri: { type: "string" },
          qrDataUrl: { type: "string", description: "Base64 data URL for QR image." },
          secret: { type: "string" },
        },
      },
      VerifyRequest: {
        type: "object",
        required: ["secret", "token"],
        additionalProperties: false,
        properties: {
          secret: {
            type: "string",
            minLength: 1,
            description: "Setup secret. Spaces and dashes are ignored server-side.",
          },
          token: {
            type: "string",
            minLength: 4,
            description: "User-provided OTP digits as a string.",
          },
          provider: { $ref: "#/components/schemas/Provider" },
          mode: { $ref: "#/components/schemas/Mode" },
          algorithm: { $ref: "#/components/schemas/Algorithm" },
          digits: {
            type: "integer",
            minimum: 4,
            maximum: 10,
          },
          period: {
            type: "integer",
            minimum: 1,
            maximum: 300,
          },
          counter: {
            type: "integer",
            minimum: 0,
            default: 0,
          },
        },
      },
      VerifyResponse: {
        type: "object",
        required: ["isValid"],
        additionalProperties: false,
        properties: {
          isValid: { type: "boolean" },
        },
      },
      CurrentCodeRequest: {
        type: "object",
        required: ["secret"],
        additionalProperties: false,
        properties: {
          secret: {
            type: "string",
            minLength: 1,
            description: "Setup secret. Spaces and dashes are ignored server-side.",
          },
          provider: { $ref: "#/components/schemas/Provider" },
          mode: { $ref: "#/components/schemas/Mode" },
          algorithm: { $ref: "#/components/schemas/Algorithm" },
          digits: {
            type: "integer",
            minimum: 4,
            maximum: 10,
          },
          period: {
            type: "integer",
            minimum: 1,
            maximum: 300,
          },
          counter: {
            type: "integer",
            minimum: 0,
            default: 0,
          },
        },
      },
      CurrentCodeResponse: {
        type: "object",
        required: ["currentCode", "remainingSeconds"],
        additionalProperties: false,
        properties: {
          currentCode: { type: "string" },
          remainingSeconds: {
            anyOf: [{ type: "integer", minimum: 0 }, { type: "null" }],
            description: "TOTP countdown seconds; null for HOTP.",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["error"],
        additionalProperties: false,
        properties: {
          error: { type: "string" },
        },
      },
      ProfilesResponse: {
        type: "object",
        required: ["providers"],
        additionalProperties: false,
        properties: {
          providers: {
            type: "object",
            additionalProperties: true,
            description: "Provider profile map keyed by provider id.",
          },
        },
      },
    },
  },
} as const

export function getProfilesResponse() {
  return {
    providers: TOTP_PROFILES,
  }
}
