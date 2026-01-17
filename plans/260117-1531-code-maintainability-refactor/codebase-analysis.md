# Codebase Analysis for Refactoring

**Date**: 2026-01-17 15:31
**Project**: Ethnic Village Travel Frontend
**Stack**: Next.js 15.5.9, React 19.2.3, TypeScript

---

## Metrics Summary

- **Total TS/TSX Files**: 490
- **Component Directories**: 73
- **Default Exports**: 141 files (should use named exports per code-standards.md)
- **Largest Files** (lines):
  1. `file-upload.tsx` - 1,312 lines ⚠️
  2. `sidebar.tsx` - 636 lines
  3. `tour-edit-content.tsx` - 549 lines
  4. `motion-highlight.tsx` - 535 lines
  5. `chatbot-v3.tsx` - 530 lines

---

## Identified Refactoring Opportunities

### 1. File Size Issues
**Priority**: HIGH

Files >300 lines violate component complexity guidelines:
- `src/components/ui/file-upload.tsx` (1,312 lines)
- `src/components/ui/sidebar.tsx` (636 lines)
- `src/components/features/admin/tour-management/*` (482-549 lines)
- `src/components/shared/chatbot_v2/*` (374-530 lines)

**Action**: Split into sub-components

### 2. Default Export Usage
**Priority**: MEDIUM

141 files use `export default` - violates code-standards.md preference for named exports.

**Affected Areas**:
- All `page.tsx` files (Next.js convention - KEEP)
- All `layout.tsx` files (Next.js convention - KEEP)
- Component files in `features/` and `shared/` - **REFACTOR**
- Core utilities - **REFACTOR**

### 3. Code Duplication Candidates
**Priority**: HIGH

Duplicate patterns identified:
- Chatbot versions: `chatbot-v2.tsx` (374L), `chatbot-v3.tsx` (530L)
- Booking panels: 3 different implementations across features
- Tour create/edit forms: Similar structure (482L vs 549L)
- Promotion create/edit: Near-identical code (305L vs 311L)

### 4. Folder Structure Misalignment
**Priority**: MEDIUM

Route-specific components in global locations:
- `src/components/features/admin/*` should move closer to `src/app/[locale]/admin/`
- `src/components/features/tour/tour-list/*` should use `_components` pattern

### 5. Type Safety Gaps
**Priority**: LOW

From code-standards.md:
- Missing explicit return types on functions
- Potential `any` usage (needs deeper analysis)

---

## Recommendations by Phase

### Phase 1: Component Decomposition (Can run in parallel)
- **Phase 1A**: Refactor large UI components (`file-upload`, `sidebar`, `sortable`)
- **Phase 1B**: Refactor large feature components (tour create/edit, promotion create/edit)
- **Phase 1C**: Consolidate chatbot versions

### Phase 2: Export Pattern Migration (Can run in parallel)
- **Phase 2A**: Convert shared components to named exports
- **Phase 2B**: Convert feature components to named exports
- **Phase 2C**: Convert core utilities to named exports

### Phase 3: Folder Structure Optimization (Must wait for Phase 1-2)
- **Phase 3A**: Move admin components to route folders
- **Phase 3B**: Reorganize marketing route components

### Phase 4: Dead Code Elimination (Can run in parallel)
- **Phase 4A**: Run `knip` and remove unused exports
- **Phase 4B**: Remove unused dependencies

### Phase 5: Testing & Documentation (Must wait for all)
- **Phase 5A**: Add tests for refactored components
- **Phase 5B**: Update documentation

---

## Parallelization Strategy

**Parallel Groups**:
1. **Group A** (Independent): Phase 1A, 1B, 1C, 2A, 2B, 2C, 4A, 4B
2. **Group B** (Depends on Group A): Phase 3A, 3B
3. **Group C** (Depends on Group B): Phase 5A, 5B

**Execution Plan**:
```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Phase 1A│  │ Phase 1B│  │ Phase 1C│
│ (UI)    │  │(Features)│  │(Chatbot)│
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────────┼────────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
┌────▼────┐  ┌───▼─────┐  ┌───▼─────┐
│ Phase 2A│  │ Phase 2B│  │ Phase 2C│
│(Shared) │  │(Features)│  │ (Core)  │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────────┼────────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
┌────▼────┐  ┌───▼─────┐
│ Phase 3A│  │ Phase 3B│
│ (Admin) │  │(Marketing)
└────┬────┘  └────┬────┘
     │            │
     └──────┬─────┘
            │
       ┌────▼────┐
       │ Phase 4 │
       │ (Tests) │
       └─────────┘
```

---

## Risk Assessment

| Phase | Risk | Reason |
|-------|------|--------|
| 1A-1C | LOW | Component decomposition is isolated |
| 2A-2C | LOW | Named exports are backward compatible |
| 3A-3B | MEDIUM | Moving files affects imports |
| 4A-4B | LOW | Dead code removal is safe with git |
| 5A-5B | LOW | Documentation only |

---

## File Ownership Matrix

Will be detailed in individual phase documents.

**Principle**: Each phase owns exclusive files - no overlaps to prevent merge conflicts.
