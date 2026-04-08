# 2FA Debug Tool

2FA Debug Tool - A modern Next.js app for generating and verifying OTP setups (TOTP and HOTP) with QR support, provider-aware options, and QA-focused testing workflows.

![](https://img.shields.io/github/stars/tristanbudd/2fa-debug-tool.svg)
![](https://img.shields.io/github/watchers/tristanbudd/2fa-debug-tool.svg)
![](https://img.shields.io/github/license/tristanbudd/2fa-debug-tool.svg)

![](https://img.shields.io/github/issues-raw/tristanbudd/2fa-debug-tool.svg)
![](https://img.shields.io/github/issues-closed-raw/tristanbudd/2fa-debug-tool.svg)
![](https://img.shields.io/github/issues-pr-raw/tristanbudd/2fa-debug-tool.svg)
![](https://img.shields.io/github/issues-pr-closed-raw/tristanbudd/2fa-debug-tool.svg)

## What This Project Is

This repository is a Next.js + TypeScript app for generating, displaying, and verifying 2FA test setups.

Primary use cases:

- Enter a company name or prefix plus an identifier or suffix, like the label shown in authenticator apps
- Configure provider-specific or custom OTP options
- Generate the written setup string and QR code for scanning
- Test manual OTP input and receive clear verification feedback
- Validate both time-based (TOTP) and counter-based (HOTP) flows

## Features

- Provider profiles for Google Authenticator, Microsoft Authenticator, and Custom mode
- OTP mode support for both TOTP and HOTP (with provider compatibility enforcement)
- Configurable algorithm, digits, period, and counter (based on selected profile)
- QR code and otpauth URI generation for scan-based setup
- Current code preview with countdown for refreshable TOTP windows
- HOTP testing controls including counter stepping and optional auto-advance after successful verification
- Server-side secret masking by default with separate reveal/copy controls
- Secret normalization (spaces/dashes ignored) for verification and current-code generation
- Split OTP input UX with paste support and keyboard navigation
- Theme toggle, responsive layout, and minimum-width fallback state

## Screenshots

Light Mode Preview:
<img width="1920" height="2248" alt="Light Mode Preview" src="https://github.com/user-attachments/assets/d85973d4-6e15-442e-9e1c-b19940139295" />

Dark Mode Preview:
<img width="1920" height="2248" alt="Dark Mode Preview:" src="https://github.com/user-attachments/assets/1b37d3fe-73e5-4d5f-ae46-e51d3608fb97" />

## Installation & Project Setup

1. Clone the repository

```bash
git clone https://github.com/tristanbudd/2fa-debug-tool.git
cd 2fa-debug-tool
```

2. Install dependencies (uses pnpm)

```bash
pnpm install
```

3. Run development server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Scripts

```bash
pnpm dev          # Start Next.js in development mode
pnpm build        # Build for production
pnpm start        # Start the production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix lint issues
pnpm format       # Run Prettier to format files
pnpm format:check # Check formatting
pnpm typecheck    # Run TypeScript type checking
pnpm prepare      # Set up Husky git hooks
```

## Development Notes

- This project uses Next.js 16, React 19, TypeScript 5 and Tailwind CSS.
- Prettier is configured with Tailwind and import sorting plugins.
- Husky pre-commit hook runs `pnpm lint && pnpm format:check && pnpm typecheck` on commit.

## Contributing

If you'd like to contribute, please read `CONTRIBUTING.md` and follow these general guidelines:

1. Fork the repository and create a branch for your feature/fix.
2. Run `pnpm install` and make changes.
3. Keep commits small and focused; add tests where appropriate.
4. Ensure formatting/linting passes locally: `pnpm lint && pnpm format:check && pnpm typecheck`.
5. Open a pull request describing the change and linking related issues.

## Issue & PR Templates

This repo contains templates under `.github/ISSUE_TEMPLATE` and `.github/PULL_REQUEST_TEMPLATE.md` to help standardize contributions.

## Security

If you discover a security vulnerability, please open a private issue and mark it sensitive, or follow `SECURITY.md`.

## License

This project is licensed under the MIT License, see the `LICENSE` file for details.
