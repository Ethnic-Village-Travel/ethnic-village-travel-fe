# ESLint 9 Migration Research

## Overview

ESLint 9 introduces flat config as the default, deprecating `.eslintrc.*` files.

## Key Breaking Changes

### 1. Flat Config Required

- `.eslintrc.*` files no longer auto-detected
- Must use `eslint.config.js` (or `.mjs`, `.cjs`)
- New config format uses JavaScript arrays

### 2. Deprecated APIs Removed

- Function-style rules no longer supported
- Many `context` methods moved to `SourceCode`
- `FlatESLint` renamed to `ESLint`
- `FlatRuleTester` renamed to `RuleTester`

### 3. eslint:recommended Changes

- Must use `@eslint/js` package instead of string

```javascript
// BEFORE
extends: ['eslint:recommended']

// AFTER
import js from '@eslint/js';
export default [js.configs.recommended, ...];
```

## @antfu/eslint-config Compatibility

- **Requirement**: ESLint v9.5.0+
- **Current version**: v7.0.1 (latest stable)
- Uses flat config since v1.0
- Full ESLint 9 support

## Migration for This Project

### Current Setup (Inferred)

Project uses:
- @antfu/eslint-config ^4.12.0
- eslint ^8
- eslint-config-next ^14.2.35
- @eslint/eslintrc ^3 (compatibility layer)

### Target Setup

```javascript
// eslint.config.mjs
import antfu from '@antfu/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';
import queryPlugin from '@tanstack/eslint-plugin-query';

export default antfu(
  {
    typescript: true,
    react: true,
    stylistic: {
      semi: true,
      quotes: 'single',
    },
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'out/**',
      'public/**',
    ],
  },
  // Next.js plugin
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  // TanStack Query
  {
    plugins: {
      '@tanstack/query': queryPlugin,
    },
    rules: {
      ...queryPlugin.configs.recommended.rules,
    },
  },
  // Project-specific rules
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'style/brace-style': ['error', '1tbs'],
    },
  }
);
```

### Packages to Update

```bash
npm install -D \
  eslint@^9.39.2 \
  @antfu/eslint-config@^7.0.1 \
  @tanstack/eslint-plugin-query@^5.73.3

npm uninstall @eslint/eslintrc
```

### Files to Delete

- `.eslintrc.js` (if exists)
- `.eslintrc.json` (if exists)
- `.eslintrc.yaml` (if exists)

### eslint-config-next Note

For Next.js 15, use `eslint-config-next@15` which may have its own flat config support. Check compatibility with @antfu/eslint-config.

## References

- https://eslint.org/docs/latest/use/migrate-to-9.0.0
- https://github.com/antfu/eslint-config
- https://github.com/vercel/next.js/tree/canary/packages/eslint-config-next
