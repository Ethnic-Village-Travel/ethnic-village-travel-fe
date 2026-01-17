# Code Maintainability Refactoring Plan

**Date**: 2026-01-17 | **Status**: DRAFT | **Priority**: HIGH

---

## Executive Summary

Refactor codebase to improve maintainability by:
1. Decomposing large files (>300 lines) into smaller, focused components
2. Converting default exports to named exports per code-standards.md
3. Consolidating duplicate code (chatbot, promotion forms)
4. Running dead code elimination
5. Reorganizing folder structure for colocation

**Total Files Affected**: ~120 files
**Estimated Effort**: 8-10 phases, parallelizable to 3 execution waves

---

## Phase Overview

| Phase | Name | Files | Priority | Parallel Group | Depends On |
|-------|------|-------|----------|----------------|------------|
| 01 | Decompose Large UI Primitives | 3 | HIGH | A | None |
| 02 | Decompose Tour Management | 11 | HIGH | A | None | COMPLETED |
| 03 | Consolidate Chatbot Implementations | 3 | HIGH | A | None |
| 04 | Deduplicate Promotion Forms | 3 | MEDIUM | A | None |
| 05 | Convert Shared to Named Exports | ~12 | MEDIUM | B | None |
| 06 | Convert Features to Named Exports | ~69 | MEDIUM | B | None |
| 07 | Convert Core to Named Exports | ~5 | LOW | B | None |
| 08 | Dead Code Elimination (Knip) | TBD | MEDIUM | A | None |
| 09 | Folder Structure Reorganization | ~15 | MEDIUM | C | 01-08 |
| 10 | Tests and Documentation | ~10 | LOW | C | 01-09 |

---

## Parallelization Strategy

```
┌─────────────────────────────── WAVE 1 (Parallel Group A) ───────────────────────────────┐
│                                                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  Phase 01  │  │  Phase 02  │  │  Phase 03  │  │  Phase 04  │  │  Phase 08  │        │
│  │ UI Prims   │  │ Tour Mgmt  │  │  Chatbot   │  │ Promotion  │  │   Knip     │        │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘        │
│         │               │               │               │               │               │
└─────────┼───────────────┼───────────────┼───────────────┼───────────────┼───────────────┘
          │               │               │               │               │
          └───────────────┴───────────────┴───────────────┴───────────────┘
                                          │
┌─────────────────────────────── WAVE 2 (Parallel Group B) ───────────────────────────────┐
│                                          ▼                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                                         │
│  │  Phase 05  │  │  Phase 06  │  │  Phase 07  │                                         │
│  │  Shared    │  │  Features  │  │   Core     │                                         │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘                                         │
│         │               │               │                                                │
└─────────┼───────────────┼───────────────┼────────────────────────────────────────────────┘
          │               │               │
          └───────────────┴───────────────┘
                          │
┌─────────────────────────────── WAVE 3 (Sequential Group C) ─────────────────────────────┐
│                          ▼                                                               │
│  ┌────────────┐  ┌────────────┐                                                         │
│  │  Phase 09  │──│  Phase 10  │                                                         │
│  │  Folders   │  │Tests/Docs  │                                                         │
│  └────────────┘  └────────────┘                                                         │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## File Ownership Matrix

**CRITICAL**: Each file belongs to exactly ONE phase. No overlaps.

| Layer | Phase | Files Owned |
|-------|-------|-------------|
| UI Primitives | 01 | `file-upload.tsx`, `sidebar.tsx`, `sortable.tsx` |
| Tour Management | 02 | `tour-create-content.tsx`, `tour-edit-content.tsx`, `tour-itinerary.tsx`, `available-dates.tsx` |
| Shared Components | 03 | `chatbot-v2.tsx`, `chatbot-v3.tsx`, chatbot_v2/ folder |
| Promotion | 04 | `promotion-create.tsx`, `promotion-edit.tsx`, `promotion-list.tsx` |
| Shared Exports | 05 | All files in `src/components/shared/` (excluding chatbot_v2/) |
| Feature Exports | 06 | All files in `src/components/features/` (excluding tour-management/, promotion-management/) |
| Core Exports | 07 | All files in `src/core/` |
| Dead Code | 08 | Unused exports identified by Knip (no file overlap risk) |
| Folder Reorg | 09 | Moving files - no content changes |
| Tests/Docs | 10 | New test files, doc updates |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Import path breakage | HIGH | MEDIUM | Run `npm run build` after each phase |
| Merge conflicts | MEDIUM | LOW | Exclusive file ownership per phase |
| Regression bugs | LOW | HIGH | Test critical flows after Waves 1-2 |
| Breaking changes | LOW | HIGH | No API changes; internal refactor only |

---

## Success Criteria

1. **No file >300 lines** (except page.tsx/layout.tsx by Next.js convention)
2. **Zero default exports** outside of page.tsx/layout.tsx
3. **No duplicate components** (chatbot consolidated, promotion deduplicated)
4. **Knip clean**: 0 unused exports
5. **All tests pass**: `npm run test:run`
6. **Build succeeds**: `npm run build`

---

## Phase Documents

- [Phase 01: Decompose Large UI Primitives](./phase-01-decompose-ui-primitives.md)
- [Phase 02: Decompose Tour Management](./phase-02-decompose-tour-management.md)
- [Phase 03: Consolidate Chatbot](./phase-03-consolidate-chatbot.md)
- [Phase 04: Deduplicate Promotion Forms](./phase-04-deduplicate-promotion.md)
- [Phase 05: Convert Shared to Named Exports](./phase-05-shared-named-exports.md)
- [Phase 06: Convert Features to Named Exports](./phase-06-features-named-exports.md)
- [Phase 07: Convert Core to Named Exports](./phase-07-core-named-exports.md)
- [Phase 08: Dead Code Elimination](./phase-08-dead-code-elimination.md)
- [Phase 09: Folder Structure Reorganization](./phase-09-folder-reorganization.md)
- [Phase 10: Tests and Documentation](./phase-10-tests-documentation.md)

---

## Unresolved Questions

1. Should motion-highlight.tsx (535 lines) be decomposed in Phase 01 or left as-is (animation code)?
2. Does the existing test coverage need expansion before refactoring?
3. Are there CI/CD hooks that need updating after folder reorganization?
