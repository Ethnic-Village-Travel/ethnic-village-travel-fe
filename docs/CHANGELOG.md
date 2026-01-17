# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-01-17

### Added
- **Refactor (Phase 02)**: Completed tour management refactoring for admin dashboard.
  - Unified `TourForm` component replacing duplicate logic in create/edit views.
  - Extracted 5 atomic section components: `TourBasicInfo`, `TourPricing`, `TourItinerary`, `TourAvailableDates`, `TourServices`.
  - Introduced `useTourForm` custom hook for centralized validation and default state.
  - Reduced `tour-create-content.tsx` and `tour-edit-content.tsx` line counts by ~70%.
- `rehype-raw@^7.0.0` added to dependencies for improved markdown rendering support.

### Changed
- **Major Framework Upgrade (Phase 2B)**: Next.js 14.2.35 → 15.5.9, React 18.3.1 → 19.2.3
  - Migrated 13 page/layout files to async params API
  - Updated TypeScript types for React 19
  - Removed deprecated `isRedirectError` usage
  - All routes verified working with new async API patterns
- **Dependency Update (Phase 1)**: Updated 22 dependencies to latest patch/minor versions
  - Core: `@tanstack/react-query`, `framer-motion`, `next-intl`, `zustand`
  - Forms/UI: `react-hook-form`, `lucide-react`, `recharts`, `react-day-picker`
  - Utilities: `nuqs`, `@t3-oss/env-nextjs`, `fast-check`
  - Tooling: `prettier`, `vitest`, `@ianvs/prettier-plugin-sort-imports`
- Verified project build and linting status remain healthy following all updates.

### Fixed
- Resolved missing `rehype-raw` dependency error.

### Deferred
- **ESLint 9 (Phase 2A)**: Rolled back due to incompatibility with react-hooks plugin and Next.js ecosystem. Staying on ESLint 8.x.
- **Tailwind v4, Zod v4 (Phase 3)**: Deferred to future sprint due to high migration complexity.

### Security
- Audit identified 3 pre-existing vulnerabilities in legacy packages (`quill`, `xlsx`). Mitigation strategies documented in dependency update plan.
