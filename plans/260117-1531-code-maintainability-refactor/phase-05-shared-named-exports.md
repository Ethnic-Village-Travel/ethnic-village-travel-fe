# Phase 05: Convert Shared Components to Named Exports

**Parent Plan**: [plan.md](./plan.md)
**Parallel Group**: B (can run with Phases 06, 07)
**Depends On**: Phase 03 (chatbot consolidation)
**Blocks**: Phase 09 (folder reorganization)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-17 |
| Priority | MEDIUM |
| Status | PENDING |
| Estimated Effort | 1-2 hours |
| Files Modified | ~12 |

**Description**: Convert all default exports in `src/components/shared/` to named exports per code-standards.md.

---

## Key Insights (From Research)

- code-standards.md: "Prefer named exports over default exports for better IDE support and refactoring"
- ~9 files in shared/ use default exports
- Named exports improve: auto-imports, rename refactoring, tree-shaking
- Barrel exports maintain convenience

---

## Requirements

1. Convert all default exports to named exports
2. Update all import sites across codebase
3. Maintain barrel exports in index.ts files
4. No functional changes

---

## Architecture

### Before

```typescript
// loading.tsx
export default function Loading() { ... }

// Usage
import Loading from '@/components/shared/loading';
```

### After

```typescript
// loading.tsx
export function Loading() { ... }

// Usage
import { Loading } from '@/components/shared/loading';
```

---

## File Ownership (Exclusive to Phase 05)

| File | Action |
|------|--------|
| `shared/loading.tsx` | REFACTOR exports |
| `shared/language-switcher.tsx` | REFACTOR exports |
| `shared/bookmark-button.tsx` | REFACTOR exports |
| `shared/divider.tsx` | REFACTOR exports |
| `shared/form-errors.tsx` | REFACTOR exports |
| `shared/form-field.tsx` | REFACTOR exports |
| `shared/multiple-select.tsx` | REFACTOR exports |
| `shared/otp-input.tsx` | REFACTOR exports |
| `shared/page-hero.tsx` | REFACTOR exports |
| `shared/pagination-client.tsx` | REFACTOR exports |
| `shared/review-item.tsx` | REFACTOR exports |
| `shared/searchable-select.tsx` | REFACTOR exports |
| `shared/section-container.tsx` | REFACTOR exports |
| `shared/shell.tsx` | REFACTOR exports |
| `shared/simple-pagination.tsx` | REFACTOR exports |
| `shared/star-rating.tsx` | REFACTOR exports |
| `shared/structured-data.tsx` | REFACTOR exports |
| `shared/data-table/*.tsx` | REFACTOR exports (if needed) |
| `shared/filter/*.tsx` | REFACTOR exports (if needed) |
| `shared/filter-card/*.tsx` | REFACTOR exports (if needed) |
| `shared/export/*.tsx` | REFACTOR exports (if needed) |

**Excludes**: `shared/chatbot/` (handled by Phase 03)

---

## Implementation Steps

### Step 1: Identify Default Exports

```bash
grep -l "export default" src/components/shared/**/*.tsx
```

### Step 2: For Each File with Default Export

1. Change `export default function X()` to `export function X()`
2. If component name differs from file name, consider renaming
3. Update barrel export if exists

### Step 3: Update Import Sites

For each modified file, find and update all imports:

```bash
# Example for loading.tsx
grep -r "from.*shared/loading" src/
```

Change:
```typescript
// Before
import Loading from '@/components/shared/loading';

// After
import { Loading } from '@/components/shared/loading';
```

### Step 4: Update Barrel Exports

```typescript
// shared/index.ts (if exists)
export { Loading } from './loading';
export { LanguageSwitcher } from './language-switcher';
// ...
```

### Step 5: Verify

```bash
npm run lint && npm run build && npm run test:run
```

---

## Todo List

- [ ] List all default exports in shared/
- [ ] Convert loading.tsx to named export
- [ ] Convert language-switcher.tsx to named export
- [ ] Convert bookmark-button.tsx to named export
- [ ] Convert divider.tsx to named export
- [ ] Convert form-errors.tsx to named export
- [ ] Convert form-field.tsx to named export
- [ ] Convert multiple-select.tsx to named export
- [ ] Convert otp-input.tsx to named export
- [ ] Convert page-hero.tsx to named export
- [ ] Convert pagination-client.tsx to named export
- [ ] Convert review-item.tsx to named export
- [ ] Convert searchable-select.tsx to named export
- [ ] Convert section-container.tsx to named export
- [ ] Convert shell.tsx to named export
- [ ] Convert simple-pagination.tsx to named export
- [ ] Convert star-rating.tsx to named export
- [ ] Convert structured-data.tsx to named export
- [ ] Check and convert data-table/ files
- [ ] Check and convert filter/ files
- [ ] Check and convert filter-card/ files
- [ ] Check and convert export/ files
- [ ] Update all import statements
- [ ] Create/update barrel exports
- [ ] Run lint, build, and tests

---

## Success Criteria

1. Zero default exports in shared/ (except if needed for lazy loading)
2. All imports updated to named imports
3. `npm run build` passes
4. TypeScript finds all usages via "Find References"

---

## Conflict Prevention

- **Exclusive files**: Only Phase 05 touches shared/ (except chatbot handled by Phase 03)
- **No functional changes**: Only export patterns change
- **No overlap**: Phase 06 handles features/, Phase 07 handles core/

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Missed import update | MEDIUM | LOW | Use TypeScript errors to find |
| Build failure | MEDIUM | LOW | Incremental commits |
| Circular import issues | LOW | MEDIUM | Test build frequently |

---

## Security Considerations

- No security implications (export pattern only)

---

## Next Steps

After completion, Phase 09 can reorganize folder structure knowing all exports are consistent.
