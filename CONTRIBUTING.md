# Contributing to 2FA Debug Tool

Thanks for helping improve this project.

This is an early-stage tool focused on generating 2FA test setups and verifying authenticator code entry in development and QA environments.

## How to Contribute

1. Fork and create a focused branch:

```bash
git checkout -b feat/your-feature
```

2. Install dependencies and start local dev:

```bash
pnpm install
pnpm dev
```

3. Keep changes small and targeted.

4. Run checks before opening a PR:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

5. Open a pull request to `main` with context, rationale, and screenshots for UI work.

## Project-Specific Guidelines

- Never commit real production 2FA secrets, QR payloads, or private keys.
- Use sample or generated test data only.
- When changing the generator, document the company/prefix field, identifier/suffix field, and any extra options you support.
- If behavior depends on OTP timing windows, include reproduction steps and expected window values.

## Suggested PR Scope

- One feature or one bug fix per PR
- Include docs updates when behavior changes
- Include tests where practical

## Code of Conduct

Please follow [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
