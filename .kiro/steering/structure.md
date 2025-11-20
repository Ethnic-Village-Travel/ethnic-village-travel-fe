---
inclusion: always
---

# Project Structure & Architecture

## Directory Structure

### App Router (`src/app/[locale]`)

Next.js 14 App Router with i18n routing. All routes are locale-prefixed (`/vi/*`, `/en/*`).

**Route Groups:**

- `(marketing)/` - Public pages (no auth required)

  - `/` - Homepage with tour discovery
  - `/tour` - Tour listing and `/tour/[slug]` - Tour details
  - `/article` - Blog listing and `/article/[slug]` - Article details
  - `/order/[id]` - Order confirmation after booking
  - `/payment/success|cancel` - Payment callback pages
  - `/personal/*` - User dashboard (auth required: account, bookmarks, transactions)

- `admin/` - Admin dashboard (role-based access)

  - `/admin/tour` - Tour CRUD and `/admin/tour/create` - Tour creation
  - `/admin/role/create` - Role and permission management
  - `/admin/assigned-available-dates` - Employee tour assignments

- `403/` - Access denied page
- `layout.tsx` - Root layout with providers (React Query, i18n, auth)
- `providers.tsx` - Client-side provider setup

### Core Directories (`src/`)

**`data/apis/`** - API client functions

- One file per domain: `tour.api.ts`, `booking.api.ts`, `auth.api.ts`, etc.
- Use centralized Axios instance from `src/core/api/api.ts`
- Return raw API responses (no transformation here)

**`hooks/api/`** - React Query hooks

- Wrap API calls with `useQuery` or `useMutation`
- Handle caching, refetching, optimistic updates
- Transform API responses to frontend types
- Example: `useTour.ts` exports `useGetTourDetail`, `useGetTourList`, etc.

**`components/`** - Component hierarchy

- `ui/` - Primitive components (Button, Input, Dialog) - shadcn/ui style
- `shared/` - Cross-feature reusable components (DataTable, Filters, FormField)
- `features/` - Domain-specific components (tour, booking, auth, admin)
- `layout/` - Layout components (Header, Footer, Sidebar, Navigation)

**`types/`** - TypeScript definitions

- Organized by domain: `tour.type.ts`, `booking/`, `user.type.ts`
- Separate request/response types: `booking.request.ts`, `booking.response.ts`
- Use `.type.ts` suffix for type-only files

**`stores/`** - Zustand global state

- Use for cross-component state (auth, booking flow, UI state)
- Keep stores small and focused on single domain
- Prefer React Query for server state

**`libs/`** - Utilities and configurations

- `i18n*.ts` - Internationalization setup (next-intl)
- `schemas/` - Zod validation schemas for forms
- `auth.ts` - Auth utilities and session management
- `data-table.ts` - Data table configuration helpers

**`utils/`** - Pure helper functions

- Organized by type: `date.ts`, `string.ts`, `number.ts`, `url.ts`
- No side effects, easily testable

**`core/`** - Core business logic

- `api/` - Axios configuration and interceptors
- `constants/` - App-wide constants (routes, permissions, entity names)
- `enum/` - TypeScript enums for status codes, types

## Architecture Patterns

### Data Flow

1. **Page/Component** → calls hook from `hooks/api/`
2. **React Query Hook** → calls function from `data/apis/`
3. **API Function** → makes HTTP request via Axios
4. **Response** → transformed in hook → returned to component

### Component Patterns

- **Server Components** (default): Use for static content, SEO-critical pages
- **Client Components** (`'use client'`): Use for interactivity, hooks, browser APIs
- **Feature Components**: Group related components in subdirectories with `index.tsx` as main export

### State Management Strategy

- **Server State**: React Query (API data, caching, background refetch)
- **Global Client State**: Zustand (auth, multi-step forms, UI preferences)
- **Local State**: `useState` (component-specific, ephemeral)
- **Form State**: React Hook Form + Zod (validation, submission)

### API Integration

- Base URL: `process.env.NEXT_PUBLIC_SERVER_URI`
- Timeout: 150 seconds
- Auth: JWT tokens in cookies, auto-attached via interceptors
- Error handling: Centralized in `utils/handle-error.ts`

## Naming Conventions

**Files & Folders:**

- Components: `kebab-case.tsx` (e.g., `tour-detail-header.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-tour.ts`)
- Types: `kebab-case.type.ts` (e.g., `booking.type.ts`)
- APIs: `kebab-case.api.ts` (e.g., `tour.api.ts`)
- Utils: `kebab-case.ts` (e.g., `date.ts`)

**Code:**

- Components: `PascalCase` (e.g., `TourDetailHeader`)
- Hooks: `camelCase` with `use` prefix (e.g., `useTourDetail`)
- Functions: `camelCase` (e.g., `formatCurrency`)
- Types/Interfaces: `PascalCase` (e.g., `Tour`, `BookingRequest`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_TIMEOUT`, `TOUR_STATUS`)
- Enums: `PascalCase` for enum, `UPPER_SNAKE_CASE` for values

## Import Rules

**Path Aliases:**

- Use `@/` for all imports from `src/` (e.g., `@/components/ui/button`)
- Never use relative imports across directories (e.g., `../../../components`)

**Import Order** (auto-sorted by Prettier):

1. External packages (react, next, etc.)
2. Internal absolute imports (`@/components`, `@/hooks`, etc.)
3. Relative imports (`./`, `../`)
4. Type imports (use `import type` when possible)

**Example:**

```typescript
import { useState } from 'react';
import { formatDate } from '@/utils/date';
import { useQuery } from '@tanstack/react-query';

import type { Tour } from '@/types/tour.type';
import { useTour } from '@/hooks/api/useTour';
import { Button } from '@/components/ui/button';
```

## Component Organization

**Feature Component Structure:**

```
features/
  tour/
    tour-detail/
      index.tsx                    # Main component, re-exports
      tour-detail-header.tsx       # Sub-components
      tour-detail-content.tsx
      tour-detail-overview.tsx
      floating-booking-panel/      # Nested feature
        index.tsx
        booking-calculator.tsx
```

**Component File Template:**

```typescript
'use client' // Only if needed

import { ... } from 'react'
import { ... } from '@/...'

import type { ... } from '@/types/...'

interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ ...props }: ComponentNameProps) {
  // Component logic
  return (...)
}
```

## Creating New Features

**When adding a new feature (e.g., "reviews"):**

1. **API Layer**: `src/data/apis/review.api.ts`

   - Export functions: `getReviews`, `createReview`, etc.

2. **Types**: `src/types/review.type.ts`

   - Define `Review`, `ReviewRequest`, `ReviewResponse`

3. **React Query Hook**: `src/hooks/api/useReview.ts`

   - Export `useGetReviews`, `useCreateReview`, etc.

4. **Components**: `src/components/features/review/`

   - Create feature-specific components

5. **Page**: `src/app/[locale]/(marketing)/review/page.tsx`
   - Use hooks and components to build page

## Key Architectural Rules

- **Separation of Concerns**: Keep API logic, business logic, and UI separate
- **Type Safety**: Define types for all API requests/responses
- **Reusability**: Extract shared logic to hooks, shared components to `shared/`
- **Colocation**: Keep related files close (components, types, hooks for a feature)
- **Server-First**: Use Server Components by default, add `'use client'` only when needed
- **Internationalization**: All user-facing text must use `next-intl` (no hardcoded strings)
- **Error Handling**: Use try-catch in API calls, display user-friendly errors via toast
- **Loading States**: Always handle loading and error states in components
