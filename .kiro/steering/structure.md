# Project Structure

## Root Configuration

- `next.config.mjs` - Next.js configuration with next-intl plugin
- `tailwind.config.ts` - Tailwind CSS with custom theme and color system
- `tsconfig.json` - TypeScript config with `@/*` path alias to `src/*`
- `.env` / `.env.dev` - Environment variables

## App Directory (`src/app/[locale]`)

Next.js App Router with locale-based routing:

- `(marketing)/` - Public-facing pages (tours, articles, homepage)

  - `page.tsx` - Homepage
  - `tour/` - Tour listing and detail pages
  - `article/` - Blog/article pages
  - `order/[id]/` - Order confirmation pages
  - `payment/` - Payment success/cancel pages
  - `personal/` - User dashboard (account, bookmarks, transactions)

- `admin/` - Protected admin dashboard

  - `tour/` - Tour management
  - `role/` - Role and permission management
  - `assigned-available-dates/` - Employee assignment management

- `403/` - Access denied page
- `layout.tsx` - Root layout with providers
- `providers.tsx` - React Query and other providers

## Source Structure (`src/`)

### `apis/`

API client functions organized by domain (auth, tour, booking, etc.)

- Uses Axios with centralized config in `src/core/api/`

### `components/`

- `ui/` - Base UI components (shadcn/ui style)
- `shared/` - Reusable components (data-table, filters, form fields)
- `features/` - Feature-specific components organized by domain
  - `auth/` - Authentication popups
  - `tour/` - Tour-related components
  - `order/` - Booking flow components
  - `personal/` - User dashboard components
  - `admin/` - Admin-specific components
- `layout/` - Layout components (headers, footers, sidebars)
- `animate-ui/` - Animation wrappers and effects

### `hooks/`

- `api/` - React Query hooks (useTour, useBooking, useAuth, etc.)
- Custom hooks (use-data-table, use-query-params, use-mobile, etc.)

### `types/`

TypeScript type definitions organized by domain

- Request/response types
- Entity types
- Enums in `src/constants/enum/`

### `lib/`

Utility libraries and configurations

- `i18n.ts`, `i18n-navigation.ts`, `i18n-url.ts` - Internationalization setup
- `schemas/` - Zod validation schemas
- `auth.ts` - Authentication utilities
- `data-table.ts` - Data table helpers

### `store/`

Zustand stores for global state

- `useAuthStore` - Authentication state
- `useBookingStore` - Booking flow state
- `useUserStore` - User profile state
- `useTourAssignmentStore` - Admin tour assignment state

### `utils/`

Helper functions (date, string, number formatting, route guards, etc.)

### `constants/`

- `route.ts` - Route definitions
- `permission-map.ts` - Permission and role mappings
- `enum/` - Enums for booking, tour, bookmark statuses

### `middleware.ts`

Next.js middleware for:

- Locale routing (next-intl)
- Authentication checks
- Permission-based access control

## Naming Conventions

- **Files**: kebab-case (`tour-detail.tsx`, `use-booking.ts`)
- **Components**: PascalCase (`TourDetail`, `BookingCard`)
- **Hooks**: camelCase with `use` prefix (`useTour`, `useBooking`)
- **Types**: PascalCase (`Tour`, `BookingRequest`)
- **Constants**: UPPER_SNAKE_CASE (`API_ROOT`, `TOUR_QUERY_KEY`)

## Import Patterns

- Use `@/` alias for absolute imports from `src/`
- Group imports: external → internal → relative
- Prettier handles import sorting automatically

## Component Organization

Feature components follow this pattern:

```
features/
  tour/
    tour-detail/
      index.tsx              # Main component export
      tour-detail-header.tsx # Sub-components
      tour-detail-content.tsx
      floating-booking-panel/
        index.tsx
        booking-calculator.tsx
```
