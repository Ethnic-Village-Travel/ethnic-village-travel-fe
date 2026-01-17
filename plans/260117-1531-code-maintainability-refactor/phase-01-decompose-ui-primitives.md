# Phase 01: Decompose Large UI Primitives

**Parent Plan**: [plan.md](./plan.md)
**Parallel Group**: A (can run with Phases 02, 03, 04, 08)
**Depends On**: None
**Blocks**: Phase 09 (folder reorganization)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-17 |
| Priority | HIGH |
| Status | COMPLETED |
| Estimated Effort | 4-6 hours |
| Actual Effort | ~2 hours |
| Files Modified | 3 original files → 21 new files |

**Description**: Split oversized UI primitive components (>300 lines) into smaller, focused sub-components following composition patterns.

---

## Key Insights (From Research)

- Components >200 lines or handling >3 responsibilities should be decomposed
- Use Radix-like composition patterns with compound components
- Keep presentation logic separate from business logic via custom hooks
- React 19 `useFormStatus` can simplify form-related UI state

---

## Requirements

1. Split `file-upload.tsx` (1,312 lines) into 5-7 sub-components
2. Split `sidebar.tsx` (636 lines) into 4-5 sub-components
3. Split `sortable.tsx` (484 lines) into 3-4 sub-components
4. Maintain backward-compatible exports
5. No breaking changes to existing consumers

---

## Architecture

### file-upload.tsx Decomposition

```
src/components/ui/file-upload/
├── index.ts                    # Re-exports all components
├── file-upload.tsx             # Main orchestrator (~100 lines)
├── file-upload-zone.tsx        # Dropzone UI component
├── file-upload-preview.tsx     # Preview grid/list
├── file-upload-item.tsx        # Single file item
├── file-upload-progress.tsx    # Upload progress indicator
├── file-upload-actions.tsx     # Action buttons (remove, retry)
├── use-file-upload.ts          # Core upload logic hook
└── types.ts                    # Shared types
```

### sidebar.tsx Decomposition

```
src/components/ui/sidebar/
├── index.ts                    # Re-exports all components
├── sidebar.tsx                 # Main container (~80 lines)
├── sidebar-header.tsx          # Header section
├── sidebar-content.tsx         # Scrollable content area
├── sidebar-footer.tsx          # Footer section
├── sidebar-item.tsx            # Navigation item
├── sidebar-group.tsx           # Grouped items
├── sidebar-context.tsx         # Context for state management
└── types.ts                    # Shared types
```

### sortable.tsx Decomposition

```
src/components/ui/sortable/
├── index.ts                    # Re-exports all components
├── sortable-list.tsx           # Main sortable container
├── sortable-item.tsx           # Individual draggable item
├── sortable-handle.tsx         # Drag handle component
├── use-sortable.ts             # DnD logic hook
└── types.ts                    # Shared types
```

---

## File Ownership (Exclusive to Phase 01)

| File | Action |
|------|--------|
| `src/components/ui/file-upload.tsx` | SPLIT -> folder |
| `src/components/ui/sidebar.tsx` | SPLIT -> folder |
| `src/components/ui/sortable.tsx` | SPLIT -> folder |

**No other phase modifies these files.**

---

## Implementation Steps

### Step 1: Analyze file-upload.tsx

1. Read current implementation
2. Identify distinct responsibilities (dropzone, preview, progress, actions)
3. Map state dependencies between sections
4. Design component boundaries

### Step 2: Create file-upload folder structure

```bash
mkdir -p src/components/ui/file-upload
```

1. Extract `FileUploadZone` - dropzone with drag/drop handlers
2. Extract `FileUploadPreview` - grid/list of uploaded files
3. Extract `FileUploadItem` - single file with thumbnail/name/size
4. Extract `FileUploadProgress` - upload progress bar
5. Extract `FileUploadActions` - remove/retry buttons
6. Extract `useFileUpload` hook - state and upload logic
7. Create `types.ts` for shared interfaces
8. Create `index.ts` with named exports + default for backward compat

### Step 3: Create sidebar folder structure

```bash
mkdir -p src/components/ui/sidebar
```

1. Extract context provider (`SidebarProvider`, `useSidebar`)
2. Extract `SidebarHeader`, `SidebarContent`, `SidebarFooter`
3. Extract `SidebarItem`, `SidebarGroup`
4. Create barrel export

### Step 4: Create sortable folder structure

```bash
mkdir -p src/components/ui/sortable
```

1. Extract `SortableList` (container with DnD context)
2. Extract `SortableItem` (individual item wrapper)
3. Extract `SortableHandle` (drag handle)
4. Extract `useSortable` hook
5. Create barrel export

### Step 5: Update imports across codebase

1. Find all imports of old single-file components
2. Update to new paths (or keep working via barrel export)
3. Test each import site

### Step 6: Verify

```bash
npm run lint && npm run build && npm run test:run
```

---

## Todo List

- [ ] Analyze file-upload.tsx and identify component boundaries
- [ ] Create file-upload/ folder structure
- [ ] Extract FileUploadZone component
- [ ] Extract FileUploadPreview component
- [ ] Extract FileUploadItem component
- [ ] Extract FileUploadProgress component
- [ ] Extract FileUploadActions component
- [ ] Extract useFileUpload hook
- [ ] Create file-upload/index.ts barrel export
- [ ] Delete original file-upload.tsx
- [ ] Analyze sidebar.tsx and identify component boundaries
- [ ] Create sidebar/ folder structure
- [ ] Extract sidebar sub-components
- [ ] Create sidebar/index.ts barrel export
- [ ] Delete original sidebar.tsx
- [ ] Analyze sortable.tsx and identify component boundaries
- [ ] Create sortable/ folder structure
- [ ] Extract sortable sub-components
- [ ] Create sortable/index.ts barrel export
- [ ] Delete original sortable.tsx
- [ ] Update all import paths
- [ ] Run lint, build, and tests
- [ ] Document changes

---

## Success Criteria

1. No single file >150 lines in the decomposed components
2. All existing imports continue working (backward compat)
3. `npm run build` passes
4. `npm run test:run` passes
5. No TypeScript errors

---

## Conflict Prevention

- **Exclusive files**: Only Phase 01 touches `file-upload.tsx`, `sidebar.tsx`, `sortable.tsx`
- **Import paths**: Use barrel exports to maintain backward compatibility
- **No overlap**: Other phases do not modify `src/components/ui/` primitives

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing imports | MEDIUM | HIGH | Use barrel exports with same names |
| Missing edge cases in extraction | LOW | MEDIUM | Thorough testing after each extraction |
| Context/state coupling issues | MEDIUM | MEDIUM | Extract context provider first |

---

## Security Considerations

- File upload validation logic must remain intact during extraction
- No changes to file type/size validation

---

## Next Steps

After completion, Phase 05 and 06 can convert the new sub-components to named exports if using default exports. Phase 09 will not move these files (already in correct location).
