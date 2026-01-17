# Phase 08: Dead Code Elimination (Knip)

**Parent Plan**: [plan.md](./plan.md)
**Parallel Group**: A (can run with Phases 01, 02, 03, 04)
**Depends On**: None
**Blocks**: Phase 09 (folder reorganization)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-17 |
| Priority | MEDIUM |
| Status | PENDING |
| Estimated Effort | 1-2 hours |
| Files Modified | TBD (depends on Knip output) |

**Description**: Run Knip to identify and remove unused exports, dependencies, and dead code.

---

## Key Insights (From Research)

- Knip is the modern replacement for ts-prune
- Detects: unused exports, unused dependencies, unused files
- Safe removal with git - can always revert
- Run AFTER component decomposition to avoid false negatives

---

## Requirements

1. Install and configure Knip
2. Run analysis and review results
3. Remove confirmed dead code
4. Update dependencies if needed
5. Document any false positives

---

## Architecture

### Knip Configuration

```typescript
// knip.config.ts
export default {
  entry: [
    'src/app/**/page.tsx',
    'src/app/**/layout.tsx',
    'src/middleware.ts',
  ],
  project: ['src/**/*.{ts,tsx}'],
  ignore: [
    'src/test/**',
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
  ],
  ignoreDependencies: [
    // Build tools, not imported in code
    '@types/*',
    'prettier*',
    'eslint*',
  ],
};
```

---

## File Ownership (Exclusive to Phase 08)

**Dynamic - depends on Knip output**

This phase will identify files/exports to remove. Since it only DELETES code (not modifies shared code), there is no conflict risk with other phases.

| Action | Target |
|--------|--------|
| DELETE | Unused export functions |
| DELETE | Unused type definitions |
| DELETE | Unused files entirely |
| UPDATE | package.json (unused deps) |

---

## Implementation Steps

### Step 1: Install Knip

```bash
npm install -D knip
```

### Step 2: Create Configuration

Create `knip.config.ts` at project root:

```typescript
import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'src/app/**/page.tsx',
    'src/app/**/layout.tsx',
    'src/middleware.ts',
  ],
  project: ['src/**/*.{ts,tsx}'],
  ignore: [
    'src/test/**',
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
  ],
  ignoreDependencies: [
    // PostCSS plugins (loaded by config)
    'tailwindcss',
    'autoprefixer',
    // Build-time only
    '@types/*',
  ],
};

export default config;
```

### Step 3: Run Initial Analysis

```bash
npx knip
```

### Step 4: Review Results

Knip output categories:
- **Unused files**: Files not imported anywhere
- **Unused exports**: Named exports not used
- **Unused dependencies**: npm packages not imported
- **Unlisted binaries**: Scripts using unlisted packages

### Step 5: Triage Results

For each finding:
1. Verify it's truly unused (not dynamically imported)
2. Check if it's a false positive (config file, etc.)
3. Mark for removal or add to ignore list

### Step 6: Remove Dead Code

```bash
# For each confirmed unused file
rm src/path/to/unused-file.ts

# For unused exports, edit the file to remove
```

### Step 7: Remove Unused Dependencies

```bash
npm uninstall unused-package-1 unused-package-2
```

### Step 8: Verify

```bash
npm run lint && npm run build && npm run test:run
```

### Step 9: Add Knip to CI (Optional)

```json
// package.json
{
  "scripts": {
    "knip": "knip",
    "knip:fix": "knip --fix"
  }
}
```

---

## Todo List

- [ ] Install knip as dev dependency
- [ ] Create knip.config.ts
- [ ] Run initial knip analysis
- [ ] Document all findings
- [ ] Triage: true unused vs false positives
- [ ] Update knip.config.ts with ignore rules
- [ ] Remove confirmed unused files
- [ ] Remove confirmed unused exports
- [ ] Remove unused npm dependencies
- [ ] Run lint, build, and tests
- [ ] Add knip script to package.json
- [ ] Document any remaining false positives

---

## Success Criteria

1. `npx knip` returns 0 issues (or only documented exceptions)
2. No unused exports in codebase
3. No unused npm dependencies
4. `npm run build` passes
5. Bundle size reduced (measure before/after)

---

## Conflict Prevention

- **Deletion only**: This phase only deletes - no edit conflicts possible
- **Run independently**: Can run parallel to decomposition phases
- **Order flexibility**: Can run before or after export conversion phases

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| False positive removal | MEDIUM | MEDIUM | Manual review before delete |
| Dynamic import missed | LOW | HIGH | Check for dynamic imports |
| Config file mistaken as dead | LOW | MEDIUM | Proper Knip config |

---

## Security Considerations

- Review removed code for any security-related functionality
- Ensure no auth/validation logic accidentally removed

---

## Expected Findings

Based on codebase analysis, likely candidates:
- Old chatbot-v2 components (after Phase 03)
- Deprecated utility functions
- Unused type definitions
- Development-only dependencies

---

## Next Steps

After Knip cleanup, Phase 09 can reorganize folders with confidence that only used code remains.
