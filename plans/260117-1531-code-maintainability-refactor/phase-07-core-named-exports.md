# Phase 07: Convert Core Utilities to Named Exports

**Parent Plan**: [plan.md](./plan.md)
**Parallel Group**: B (can run with Phases 05, 06)
**Depends On**: None
**Blocks**: None

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-17 |
| Priority | LOW |
| Status | PENDING |
| Estimated Effort | 30 minutes |
| Files Modified | ~5 |

**Description**: Convert remaining default exports in `src/core/` to named exports.

---

## Key Insights (From Research)

- Only ~1 file uses default export in core/
- Most core utilities already use named exports
- Quick win with minimal risk

---

## Requirements

1. Convert any default exports to named exports
2. Update import sites
3. Ensure API instance pattern is consistent

---

## File Ownership (Exclusive to Phase 07)

| File | Action |
|------|--------|
| `src/core/api/api.ts` | CHECK - likely `export default api` |
| `src/core/api/config.ts` | CHECK |
| `src/core/api/utils.ts` | CHECK |
| `src/core/api/index.ts` | UPDATE barrel |
| `src/core/constants/*.ts` | CHECK (likely already named) |
| `src/core/enum/*.ts` | CHECK (likely already named) |
| `src/core/types/*.ts` | CHECK (likely already named) |

---

## Implementation Steps

### Step 1: Identify Default Exports

```bash
grep -r "export default" src/core/ --include="*.ts"
```

### Step 2: Analyze api.ts Pattern

The Axios instance is commonly exported as default:

```typescript
// Current (likely)
const api = axios.create({ ... });
export default api;

// Target
export const api = axios.create({ ... });
```

### Step 3: Update Imports

Find all usages:
```bash
grep -r "from.*core/api/api" src/
grep -r "from.*core/api'" src/
```

Change:
```typescript
// Before
import api from '@/core/api/api';

// After
import { api } from '@/core/api/api';
```

### Step 4: Update Barrel Export

```typescript
// core/api/index.ts
export { api } from './api';
export { apiConfig } from './config';
// ...
```

### Step 5: Verify

```bash
npm run lint && npm run build && npm run test:run
```

---

## Todo List

- [ ] Identify all default exports in core/
- [ ] Convert api.ts to named export
- [ ] Update all api imports (~50+ locations)
- [ ] Check config.ts exports
- [ ] Check utils.ts exports
- [ ] Update barrel exports
- [ ] Run lint, build, and tests

---

## Success Criteria

1. Zero default exports in core/
2. All imports updated
3. `npm run build` passes
4. API calls work correctly

---

## Conflict Prevention

- **Exclusive files**: Only Phase 07 touches core/
- **No overlap**: Phases 05, 06 handle components

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API import breakage | MEDIUM | HIGH | Find all usages first |
| Missing interceptor | LOW | HIGH | Test API calls |

---

## Security Considerations

- Maintain token injection in interceptors
- Keep error handling intact

---

## Next Steps

Quick phase - can be done anytime during Wave 2.
