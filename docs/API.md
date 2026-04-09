# API Documentation

This document covers the public OTP API endpoints for 2FA Debug Tool.

Scope:

- Included: `/api/otp/generate`, `/api/otp/verify`, `/api/otp/current`, `/api/otp/profiles`, `/api/openapi.json`
- Excluded: `/api/og` (Open Graph image endpoint)

## Public Access

All documented API endpoints are publicly callable and support CORS.

Response headers include:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

Preflight (`OPTIONS`) is implemented for each documented endpoint.

## OpenAPI Definition

Machine-readable OpenAPI JSON is available at:

- `/api/openapi.json`

You can import this directly into tools like Postman, Insomnia, Stoplight, and Swagger UI.

## Endpoint Summary

- `GET /api/otp/profiles`
  - Returns supported provider constraints used by the API.
  - Useful when building clients that need to dynamically render valid options.

- `POST /api/otp/generate`
  - Generates secret, otpauth URI, QR data URL, and current OTP code.

- `POST /api/otp/verify`
  - Verifies a user-supplied token.

- `POST /api/otp/current`
  - Returns current OTP code for a known secret.
  - For TOTP, also returns countdown (`remainingSeconds`).

- `GET /api/openapi.json`
  - Returns the OpenAPI 3.1 document.

## Common Parameters

Supported providers:

- `google`
- `microsoft`
- `custom`

Supported modes:

- `totp`
- `hotp`

Supported algorithms:

- `SHA1`
- `SHA256`
- `SHA512`

Useful request parameters:

- `provider`
  - Selects profile rules (available modes, digits, algorithms, periods).
- `mode`
  - Chooses `totp` or `hotp`.
- `digits`
  - Code length. Provider restrictions apply.
- `period`
  - TOTP time-step in seconds.
- `counter`
  - HOTP counter value.

Validation behavior:

- `secret` is normalized server-side (spaces/dashes removed, uppercased).
- `token` must be numeric and exactly the selected `digits` length.

## Example Requests

Generate payload:

```bash
curl -X POST http://localhost:3000/api/otp/generate \
  -H "Content-Type: application/json" \
  -d '{
    "issuer": "Acme Inc",
    "account": "qa-user@example.com",
    "provider": "google",
    "mode": "totp"
  }'
```

Verify code:

```bash
curl -X POST http://localhost:3000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "JBSWY3DPEHPK3PXP",
    "token": "123456",
    "provider": "google",
    "mode": "totp"
  }'
```

Get current code:

```bash
curl -X POST http://localhost:3000/api/otp/current \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "JBSWY3DPEHPK3PXP",
    "provider": "google",
    "mode": "totp"
  }'
```

Fetch profile constraints:

```bash
curl http://localhost:3000/api/otp/profiles
```

Fetch OpenAPI:

```bash
curl http://localhost:3000/api/openapi.json
```
