# CI and Git Hooks

This project uses GitHub Actions for CI and Husky for local git hook automation.

## GitHub Actions Workflow

CI file: `.github/workflows/ci.yml`

Current workflow runs on push to `main` and on pull requests.

Checks performed:

- Install dependencies with `pnpm install --frozen-lockfile`
- Run ESLint
- Run Prettier check
- Run TypeScript typecheck
- Build the Next.js app

## Husky Status

Husky is installed and initialized.

Current `.husky/pre-commit` runs the project checks:

```bash
pnpm lint && pnpm format:check && pnpm typecheck
```

TODO: add automated tests to the hook once the test strategy is finalized.

## Useful Commands

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

## Troubleshooting

If git hooks are not running:

```bash
pnpm exec husky
```

If CI fails but local passes:

- Verify Node.js and pnpm versions
- Reinstall with `pnpm install --frozen-lockfile`
- Ensure lockfile is committed
