# Phase 06: Convert Feature Components to Named Exports

**Parent Plan**: [plan.md](./plan.md)
**Parallel Group**: B (can run with Phases 05, 07)
**Depends On**: Phases 02, 04 (tour and promotion refactoring)
**Blocks**: Phase 09 (folder reorganization)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-17 |
| Priority | MEDIUM |
| Status | PENDING |
| Estimated Effort | 3-4 hours |
| Files Modified | ~69 |

**Description**: Convert all default exports in `src/components/features/` to named exports per code-standards.md.

---

## Key Insights (From Research)

- ~69 files in features/ use default exports
- Largest refactoring scope by file count
- Feature components are highly interconnected
- Must coordinate with Phase 02 (tour) and Phase 04 (promotion) outputs

---

## Requirements

1. Convert all default exports to named exports
2. Update all import sites (may be 150+ locations)
3. Create/update barrel exports per feature folder
4. No functional changes

---

## Architecture

### Target Export Pattern

```typescript
// article-item.tsx
// Before
export default function ArticleItem() { ... }

// After
export function ArticleItem() { ... }
```

### Barrel Export Pattern

```typescript
// features/article/index.ts
export { ArticleItem } from './article-item';
export { ArticleDetail } from './article-detail';
export { ArticleSearch } from './article-search';
// ...
```

---

## File Ownership (Exclusive to Phase 06)

**All files in these folders** (excluding tour-management/ and promotion-management/):

| Folder | Estimated Files |
|--------|-----------------|
| `features/about/` | 5 |
| `features/admin/article-management/` | 4 |
| `features/admin/assignment/` | 6 |
| `features/admin/booking-management/` | 5 |
| `features/admin/category-management/` | 3 |
| `features/admin/dashboard/` | 5 |
| `features/admin/role-management/` | 5 |
| `features/admin/user-management/` | 1 |
| `features/article/` | 10 |
| `features/auth/` | 5 |
| `features/booking/` | 15 |
| `features/card-update/` | 1 |
| `features/contact/` | 2 |
| `features/home/` | 8 |
| `features/tour/` | ~10 |

**Excludes** (handled by other phases):
- `features/admin/tour-management/` (Phase 02)
- `features/admin/promotion-management/` (Phase 04)

---

## Implementation Steps

### Step 1: Generate File List

```bash
grep -r "export default" src/components/features/ --include="*.tsx" \
  | grep -v "tour-management" \
  | grep -v "promotion-management"
```

### Step 2: Group by Feature Folder

Create conversion checklist per folder:
- about/
- admin/article-management/
- admin/assignment/
- (etc.)

### Step 3: Convert Each Feature Folder

For each folder:
1. Convert all `export default` to `export`
2. Create/update index.ts barrel
3. Update imports within the folder
4. Update imports from outside the folder

### Step 4: Batch Import Updates

Use VSCode/IDE refactoring or script:

```bash
# Find all imports of a specific file
grep -r "from.*features/about/about-hero" src/
```

### Step 5: Create Barrel Exports

For each feature folder, create index.ts:

```typescript
// features/about/index.ts
export { AboutCta } from './about-cta';
export { AboutHero } from './about-hero';
export { AboutMission } from './about-mission';
export { AboutStats } from './about-stats';
export { AboutValues } from './about-values';
```

### Step 6: Verify Incrementally

After each feature folder:
```bash
npm run lint && npm run build
```

### Step 7: Final Verification

```bash
npm run lint && npm run build && npm run test:run
```

---

## Todo List

### Admin Features
- [ ] Convert admin/article-management/*.tsx
- [ ] Convert admin/assignment/*.tsx
- [ ] Convert admin/booking-management/*.tsx
- [ ] Convert admin/category-management/*.tsx
- [ ] Convert admin/dashboard/*.tsx
- [ ] Convert admin/role-management/*.tsx
- [ ] Convert admin/user-management/*.tsx

### Marketing Features
- [ ] Convert about/*.tsx
- [ ] Convert article/*.tsx
- [ ] Convert auth/*.tsx
- [ ] Convert booking/*.tsx
- [ ] Convert card-update/*.tsx
- [ ] Convert contact/*.tsx
- [ ] Convert home/*.tsx
- [ ] Convert tour/*.tsx

### Final Steps
- [ ] Create/update all barrel exports
- [ ] Update all import statements
- [ ] Run final lint, build, and tests

---

## Success Criteria

1. Zero default exports in features/ (outside Phase 02/04 scope)
2. All imports updated to named imports
3. Barrel exports exist for each feature folder
4. `npm run build` passes
5. `npm run test:run` passes

---

## Conflict Prevention

- **Exclusive files**: Phase 06 owns features/ except tour-management and promotion-management
- **Wait for Phase 02/04**: If they create new files, those need to follow named export pattern already
- **No overlap**: Phase 05 handles shared/, Phase 07 handles core/

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Many missed imports | HIGH | LOW | TypeScript errors reveal all |
| Long conversion time | MEDIUM | LOW | Can batch by folder |
| IDE auto-import issues | LOW | LOW | Clear cache, restart |

---

## Security Considerations

- No security implications (export pattern only)

---

## Next Steps

After completion, all feature components follow named export pattern. Phase 09 can reorganize folders with consistent exports.
