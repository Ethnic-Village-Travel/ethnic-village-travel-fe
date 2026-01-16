# Next.js 15 Migration Research

## Overview

Next.js 15 introduces significant breaking changes, primarily around async APIs and caching behavior.

## Key Breaking Changes

### 1. Async Request APIs (CRITICAL)

Previously synchronous Dynamic APIs are now asynchronous:

| API | Change |
|-----|--------|
| `cookies()` | Now returns `Promise<ReadonlyRequestCookies>` |
| `headers()` | Now returns `Promise<ReadonlyHeaders>` |
| `draftMode()` | Now returns `Promise<{ isEnabled: boolean }>` |
| `params` | Now `Promise<{ [key]: string }>` in layouts/pages |
| `searchParams` | Now `Promise<{ [key]: string }>` in pages |

### Migration Pattern

```typescript
// BEFORE (Next.js 14)
export default function Page({ params, searchParams }) {
  const { slug } = params;
  const { query } = searchParams;
}

// AFTER (Next.js 15)
export default async function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ query: string }>;
}) {
  const { slug } = await props.params;
  const { query } = await props.searchParams;
}
```

### 2. Caching Behavior Changes

| Feature | v14 Default | v15 Default | Opt-in |
|---------|-------------|-------------|--------|
| fetch() | cached | NOT cached | `{ cache: 'force-cache' }` |
| GET handlers | cached | NOT cached | `export const dynamic = 'force-static'` |
| Client router | reused | NOT reused | `staleTimes` config |

### 3. React 19 Requirement

- Minimum React version: 19
- `useFormState` deprecated -> use `useActionState`
- `useFormStatus` adds: `data`, `method`, `action`

### 4. Removed/Deprecated

- `experimental-edge` runtime -> `edge`
- `@next/font` -> built-in `next/font`
- `geo` and `ip` from NextRequest (use @vercel/functions)
- `experimental.bundlePagesExternals` -> `bundlePagesRouterDependencies`
- `experimental.serverComponentsExternalPackages` -> `serverExternalPackages`

## Codemods Available

```bash
# Automated upgrade (recommended)
npx @next/codemod@canary upgrade latest

# Individual codemods
npx @next/codemod@canary async-request-api  # async cookies/headers/params
npx @next/codemod@canary next-request-geo-ip  # geo/ip removal
```

## Impact Assessment for This Project

### High Impact Files

1. **Middleware** (`src/middleware.ts`)
   - Uses `cookies()` and `headers()`
   - Must add `await`

2. **All page.tsx files**
   - Any using `params` or `searchParams` props
   - Pattern: `src/app/[locale]/**/page.tsx`

3. **All layout.tsx files**
   - Any using `params` prop
   - Pattern: `src/app/[locale]/**/layout.tsx`

4. **API Routes**
   - Pattern: `src/app/api/**/route.ts`
   - `params` in route handlers

### Compatibility Notes

- next-intl 4.x: Compatible with Next.js 15
- nuqs: May need updates for async searchParams
- Radix UI: Compatible with React 19
- TanStack Query: Compatible with React 19
- Zustand: Compatible with React 19

## References

- https://nextjs.org/docs/app/building-your-application/upgrading/version-15
- https://nextjs.org/blog/next-15
