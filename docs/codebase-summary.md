# Codebase Summary - Ethnic Village Travel Frontend

## Directory Structure

- `src/app/[locale]/`: Main entry point for Next.js App Router.
  - `(marketing)/`: Public-facing pages (Home, Tours, About, Articles).
  - `admin/`: Restricted admin dashboard pages.
  - `personal/`: Protected user profile and booking history pages.
- `src/components/`:
  - `ui/`: Design system primitives (Radix UI + shadcn/ui).
  - `shared/`: Reusable components used across multiple features.
  - `features/`: Domain-specific components (admin, auth, booking, tour, article).
  - `layout/`: Global layout components (Header, Footer, Sidebar).
- `src/core/`:
  - `api/`: Axios instance and API service definitions.
  - `constants/`: Global constants, route definitions, and permission maps.
  - `enum/`: TypeScript enums for status, roles, etc.
  - `types/`: Global and domain-specific TypeScript definitions.
- `src/hooks/`: Custom React hooks, including TanStack Query wrappers.
- `src/libs/`: Third-party library configurations (i18n, Zod schemas, auth).
- `src/stores/`: Zustand store definitions for client-side state.
- `src/styles/`: Global CSS, Tailwind configurations, and admin-specific styles.
- `src/utils/`: Pure utility functions and route guards.
- `src/messages/`: JSON translation files for i18n.

## Key Files & Purposes

- `src/middleware.ts`: Orchestrates i18n routing, authentication checks, and RBAC via cookies.
- `src/core/api/api.ts`: Configures Axios with interceptors for token injection and error handling.
- `src/libs/i18n-navigation.ts`: Exports locale-aware navigation hooks and components.
- `src/core/constants/permission-map.ts`: Central registry for route-to-permission mapping.
- `src/utils/route-guard.ts`: Defines protected and public routes.
- `src/libs/env.ts`: Validates environment variables at build/runtime.

## Component Organization

The project follows a **Feature-Based Architecture**:
- Components are grouped by domain in `src/components/features/`.
- UI primitives are kept separate in `src/components/ui/`.
- Shared logic/UI is in `src/components/shared/`.

## Module Dependencies

- **UI**: Radix UI, Framer Motion, Lucide React.
- **State**: Zustand, TanStack Query, nuqs.
- **Forms**: React Hook Form, Zod.
- **API**: Axios.
- **i18n**: next-intl.

## File Naming Conventions

- **Components**: PascalCase (e.g., `BookingForm.tsx`).
- **Hooks**: camelCase with `use` prefix (e.g., `useDataTable.ts`).
- **Utilities/Core**: kebab-case (e.g., `route-guard.ts`, `api.ts`).
- **Pages**: `page.tsx` within directory-based routing.

## Refactored Feature Modules

### Tour Management (Admin)
Location: `src/components/features/admin/tour-management/`
- **Pattern**: Section-based component composition with a unified form hook.
- **Unified Form**: `TourForm.tsx` (handles both Create/Edit modes).
- **Custom Hook**: `useTourForm.ts` centralizes Zod validation and default values.
- **Atomic Sections**:
  - `TourBasicInfoSection`: Name, slug, status, duration.
  - `TourPricingSection`: Adult/Child pricing.
  - `TourItinerarySection`: Dynamic itinerary steps.
  - `TourAvailableDatesSection`: Date management.
  - `TourServicesSection`: Included/Excluded services.

## Unresolved Questions
- None at this stage.
