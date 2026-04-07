<div align="center">
  <img width="820" height="312" alt="2FA Debug Tool" src="https://github.com/user-attachments/assets/e81e927e-5b31-4225-a551-1f41a70128ca" />
</div>

# 2FA Debug Tool

2FA Debug Tool - A fast, modern Next.js-based tool for generating TOTP test setups with QR codes, immediate code generation, and authenticator code verification for secure development and QA testing.

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
- Configure the available TOTP options the target app supports
- Generate the written setup string and QR code for scanning
- Test a manual OTP input field and return a clear yes/no verification result

## Planned Features

- Company/prefix and identifier/suffix input with TOTP options configuration
- TOTP key creation with configurable issuer, account, digits, period, and algorithm
- otpauth URI and QR code generation for authenticator app scanning
- Manual OTP code input field with automatic yes/no verification feedback

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
