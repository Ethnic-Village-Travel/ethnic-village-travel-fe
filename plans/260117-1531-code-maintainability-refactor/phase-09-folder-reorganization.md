# Phase 09: Folder Structure Reorganization

**Parent Plan**: [plan.md](./plan.md)
**Parallel Group**: C (sequential - must run after all Wave 1 and Wave 2 phases)
**Depends On**: Phases 01-08 (all decomposition and cleanup complete)
**Blocks**: Phase 10 (tests and documentation)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-17 |
| Priority | MEDIUM |
| Status | PENDING |
| Estimated Effort | 2-3 hours |
| Files Modified | ~15 (moves, not edits) |

**Description**: Reorganize folder structure to follow Next.js 15 colocation patterns - move route-specific components closer to their routes.

---

## Key Insights (From Research)

- Next.js 15 App Router recommends colocation of route-specific components
- Use `_components` private folders for route-local components
- Keep truly shared components in `src/components/`
- Route groups `()` already used: (marketing), admin

---

## Requirements

1. Identify route-specific vs truly shared components
2. Move route-specific admin components to `app/[locale]/admin/_components/`
3. Move route-specific marketing components to route folders
4. Update all import paths
5. No functional changes

---

## Architecture

### Current Structure (After Phases 01-08)

```
src/
├── app/
│   └── [locale]/
│       ├── (marketing)/
│       │   ├── page.tsx
│       │   ├── tours/
│       │   └── articles/
│       └── admin/
│           ├── layout.tsx
│           ├── dashboard/
│           ├── tours/
│           └── bookings/
└── components/
    └── features/
        └── admin/
            ├── dashboard/         # Admin-only
            ├── tour-management/   # Admin-only
            ├── booking-management/ # Admin-only
            └── ...
```

### Target Structure

```
src/
├── app/
│   └── [locale]/
│       ├── (marketing)/
│       │   ├── _components/           # Marketing-shared
│       │   │   ├── tour-card.tsx
│       │   │   └── article-card.tsx
│       │   ├── page.tsx
│       │   ├── tours/
│       │   │   └── _components/       # Tour route specific
│       │   └── articles/
│       │       └── _components/       # Article route specific
│       └── admin/
│           ├── _components/           # Admin-shared
│           │   ├── data-table/
│           │   └── shell/
│           ├── layout.tsx
│           ├── dashboard/
│           │   ├── page.tsx
│           │   └── _components/       # Dashboard specific
│           ├── tours/
│           │   ├── page.tsx
│           │   └── _components/       # Tour management
│           └── bookings/
│               ├── page.tsx
│               └── _components/       # Booking management
└── components/
    ├── ui/                            # Design primitives (unchanged)
    └── shared/                        # Cross-feature shared (reduced)
```

---

## File Ownership (Exclusive to Phase 09)

**Moves only - no content modifications**

| Source | Destination |
|--------|-------------|
| `features/admin/dashboard/` | `app/[locale]/admin/dashboard/_components/` |
| `features/admin/tour-management/` | `app/[locale]/admin/tours/_components/` |
| `features/admin/booking-management/` | `app/[locale]/admin/bookings/_components/` |
| `features/admin/promotion-management/` | `app/[locale]/admin/promotions/_components/` |
| `features/admin/article-management/` | `app/[locale]/admin/articles/_components/` |
| `features/admin/category-management/` | `app/[locale]/admin/categories/_components/` |
| `features/admin/role-management/` | `app/[locale]/admin/roles/_components/` |
| `features/admin/user-management/` | `app/[locale]/admin/users/_components/` |
| `features/admin/assignment/` | `app/[locale]/admin/assignments/_components/` |

**Keep in src/components/features/** (used by multiple routes):
- `features/about/` - marketing pages
- `features/article/` - both marketing and personal
- `features/auth/` - global auth popups
- `features/booking/` - booking wizard (multiple routes)
- `features/contact/` - marketing
- `features/home/` - homepage only
- `features/tour/` - marketing tour pages

---

## Implementation Steps

### Step 1: Create Target Directories

```bash
mkdir -p src/app/[locale]/admin/dashboard/_components
mkdir -p src/app/[locale]/admin/tours/_components
mkdir -p src/app/[locale]/admin/bookings/_components
mkdir -p src/app/[locale]/admin/promotions/_components
mkdir -p src/app/[locale]/admin/articles/_components
mkdir -p src/app/[locale]/admin/categories/_components
mkdir -p src/app/[locale]/admin/roles/_components
mkdir -p src/app/[locale]/admin/users/_components
mkdir -p src/app/[locale]/admin/assignments/_components
```

### Step 2: Move Dashboard Components

```bash
mv src/components/features/admin/dashboard/* \
   src/app/[locale]/admin/dashboard/_components/
```

### Step 3: Update Imports in Dashboard Page

```typescript
// Before
import { DashboardStatsCards } from '@/components/features/admin/dashboard';

// After
import { DashboardStatsCards } from './_components';
```

### Step 4: Repeat for Each Admin Section

Move components and update imports for:
- tours/
- bookings/
- promotions/
- articles/
- categories/
- roles/
- users/
- assignments/

### Step 5: Create Admin Shared Components

If components are shared across multiple admin routes:

```bash
mkdir -p src/app/[locale]/admin/_components
```

Move shared admin utilities there.

### Step 6: Update Path Aliases (if needed)

If using barrel imports, update them to point to new locations.

### Step 7: Verify

```bash
npm run lint && npm run build && npm run test:run
```

---

## Todo List

- [ ] Create all target _components directories
- [ ] Move dashboard components
- [ ] Update dashboard page imports
- [ ] Move tour-management components
- [ ] Update tours page imports
- [ ] Move booking-management components
- [ ] Update bookings page imports
- [ ] Move promotion-management components
- [ ] Update promotions page imports
- [ ] Move article-management components
- [ ] Update articles page imports
- [ ] Move category-management components
- [ ] Update categories page imports
- [ ] Move role-management components
- [ ] Update roles page imports
- [ ] Move user-management components
- [ ] Update users page imports
- [ ] Move assignment components
- [ ] Update assignments page imports
- [ ] Identify shared admin components
- [ ] Create admin/_components for shared
- [ ] Remove empty features/admin folders
- [ ] Run lint, build, and tests
- [ ] Test all admin routes manually

---

## Success Criteria

1. All admin components colocated with routes
2. `src/components/features/admin/` is empty or removed
3. All imports use relative paths (`./_components`)
4. `npm run build` passes
5. All admin pages render correctly

---

## Conflict Prevention

- **Sequential phase**: Runs after all other phases complete
- **Move only**: No content edits, just file moves
- **No parallel work**: This phase modifies import paths that other phases touched

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Import path breakage | HIGH | MEDIUM | TypeScript errors catch all |
| Missing move | MEDIUM | LOW | Build failure reveals |
| Route conflict | LOW | HIGH | Test each route |

---

## Security Considerations

- Private folders `_` prevent accidental routing
- Maintain permission checks in middleware

---

## Decision: Marketing Components

**Keep in src/components/features/**: Marketing feature components are used by multiple routes and should remain in the shared location:

- `features/about/` - About page only, but complex enough to keep
- `features/article/` - Used by marketing + personal (bookmarks)
- `features/booking/` - Used by tour detail + personal
- `features/home/` - Homepage sections
- `features/tour/` - Tour list, detail pages

Moving these would create more complexity than benefit.

---

## Next Steps

After completion, Phase 10 adds tests and updates documentation to reflect new structure.
