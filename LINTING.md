# Linting and Formatting

This project uses ESLint and Prettier for code quality and consistency.

## Config Files

- `.prettierrc.json`
- `.prettierignore`
- `eslint.config.mjs`
- `.vscode/settings.json`

## Package Scripts

```bash
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm typecheck
```

## Typical Local Workflow

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

## VS Code Recommendation

Recommended extensions:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

The repository already includes workspace settings for format-on-save and explicit ESLint fixes.

## Husky Note

Husky is installed and initialized. The pre-commit hook now runs the project checks directly.

Current hook content:

```bash
pnpm lint && pnpm format:check && pnpm typecheck
```

TODO (project setup): add tests to the hook once a stable test suite exists.
