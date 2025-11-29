# Implementation Plan - Frontend Component Restructure

- [-] 1. Setup và phân tích codebase hiện tại

  - Tạo scripts để scan và phân tích component structure
  - Build component metadata (paths, exports, imports, usage)
  - Identify violations và generate refactor report
  - _Requirements: 1.3, 2.2, 5.1, 7.1_

- [ ] 1.1 Tạo script phân tích component metadata

  - Viết function để scan tất cả component files
  - Extract exports (default và named)
  - Extract imports (internal và external)
  - Build dependency graph
  - _Requirements: 7.1_

- [ ] 1.2 Tạo script validate naming conventions

  - Validate kebab-case cho filenames
  - Validate PascalCase cho component names
  - Validate Props interface naming
  - Generate violation report
  - _Requirements: 5.1, 5.2, 5.4_

- [ ]\* 1.3 Write property test cho component metadata extraction

  - **Property 16: Unused components are identified**
  - **Validates: Requirements 7.1**

- [ ] 1.4 Tạo script identify missing index files

  - Scan feature folders
  - Scan shared component folders
  - Scan layout folders
  - Generate list of folders cần tạo index.ts
  - _Requirements: 1.3, 2.3, 4.2_

- [ ]\* 1.5 Write property tests cho index file detection

  - **Property 1: Feature folders have index files**
  - **Validates: Requirements 1.3**
  - **Property 3: Shared component folders have index files**
  - **Validates: Requirements 2.3**
  - **Property 6: Layout folders have index files**
  - **Validates: Requirements 4.2**

- [ ] 1.6 Generate comprehensive refactor report

  - Components to move
  - Components to rename
  - Index files to create
  - Unused components
  - Duplicate components
  - Save report to file
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 5.1, 7.1_

- [ ] 2. Reorganize Shared Components

  - Tạo category folders trong shared/
  - Move components vào categories phù hợp
  - Tạo index.ts files với barrel exports
  - Update imports across codebase
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 2.1 Tạo shared component category folders

  - Tạo `shared/form/`
  - Tạo `shared/data-display/`
  - Tạo `shared/feedback/`
  - Tạo `shared/navigation/`
  - Tạo `shared/layout/`
  - Tạo `shared/input/`
  - _Requirements: 2.1_

- [ ] 2.2 Move form-related components

  - Move `form-field.tsx` → `form/`
  - Move `form-errors.tsx` → `form/`
  - Create `form/index.ts` với barrel exports
  - _Requirements: 2.2, 2.3_

- [ ] 2.3 Move data-display components

  - Move `review-item.tsx` → `data-display/`
  - Move `star-rating.tsx` → `data-display/`
  - Move `bookmark-button.tsx` → `data-display/`
  - Keep `data-table/` trong `data-display/`
  - Create `data-display/index.ts`
  - _Requirements: 2.2, 2.3_

- [ ] 2.4 Move feedback components

  - Move `loading.tsx` → `feedback/`
  - Move `divider.tsx` → `feedback/`
  - Create `feedback/index.ts`
  - _Requirements: 2.2, 2.3_

- [ ] 2.5 Move navigation components

  - Move `pagination-client.tsx` → `navigation/`
  - Move `language-switcher.tsx` → `navigation/`
  - Create `navigation/index.ts`
  - _Requirements: 2.2, 2.3_

- [ ] 2.6 Move layout helper components

  - Move `section-container.tsx` → `layout/`
  - Move `shell.tsx` → `layout/`
  - Move `page-hero.tsx` → `layout/`
  - Create `layout/index.ts`
  - _Requirements: 2.2, 2.3_

- [ ] 2.7 Move input components

  - Move `otp-input.tsx` → `input/`
  - Move `multiple-select.tsx` → `input/`
  - Create `input/index.ts`
  - _Requirements: 2.2, 2.3_

- [ ] 2.8 Update all imports for shared components

  - Tạo script để find và replace imports
  - Update imports từ flat structure sang categorized structure
  - Verify TypeScript compilation
  - _Requirements: 2.1, 2.2, 2.3_

- [ ]\* 2.9 Write property tests cho shared components structure

  - **Property 2: Component files follow kebab-case naming**
  - **Validates: Requirements 2.2, 5.1**
  - **Property 3: Shared component folders have index files**
  - **Validates: Requirements 2.3**

- [ ] 3. Standardize Feature Components

  - Create missing index.ts files
  - Rename files theo kebab-case
  - Reorganize sub-components
  - Update exports và imports
  - _Requirements: 1.1, 1.2, 1.3, 5.1, 5.2, 5.3, 6.1, 6.2_

- [ ] 3.1 Create index.ts for features missing them

  - Scan features/ và identify folders without index.ts
  - Generate index.ts với appropriate exports
  - Verify exports work correctly
  - _Requirements: 1.3, 6.1, 6.2_

- [ ] 3.2 Rename feature component files to kebab-case

  - Identify files not following kebab-case
  - Rename files (e.g., `additional_information_card.tsx` → `additional-information-card.tsx`)
  - Update imports
  - _Requirements: 5.1_

- [ ] 3.3 Reorganize booking feature components

  - Review booking-wizard structure (đã tốt)
  - Consolidate duplicate floating-booking-panel
  - Update imports
  - _Requirements: 1.2_

- [ ] 3.4 Reorganize tour feature components

  - Review tour-detail structure
  - Ensure proper sub-component organization
  - Update index.ts exports
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 3.5 Reorganize admin feature components

  - Review admin/tour-management structure
  - Create missing index.ts files
  - Standardize sub-component organization
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 3.6 Update feature component exports

  - Ensure default export cho main component
  - Add named exports cho public sub-components
  - Verify import paths
  - _Requirements: 6.1, 6.2_

- [ ]\* 3.7 Write property tests cho feature components

  - **Property 1: Feature folders have index files**
  - **Validates: Requirements 1.3**
  - **Property 8: Component exports use PascalCase**
  - **Validates: Requirements 5.2**
  - **Property 9: Component folders follow kebab-case naming**
  - **Validates: Requirements 5.3**
  - **Property 12: Feature index files have default export**
  - **Validates: Requirements 6.1**
  - **Property 13: Feature index files have named exports**
  - **Validates: Requirements 6.2**

- [ ] 4. Standardize Layout Components

  - Ensure index.ts files exist
  - Create shared/ folder for common layouts
  - Update imports
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 4.1 Create index.ts for layout folders

  - Create `layout/admin/index.ts`
  - Create `layout/marketing/index.ts`
  - Verify exports
  - _Requirements: 4.2_

- [ ] 4.2 Create layout/shared folder

  - Identify layouts used across contexts
  - Create `layout/shared/` folder
  - Move shared layouts
  - Create `layout/shared/index.ts`
  - _Requirements: 4.1_

- [ ] 4.3 Update layout component imports

  - Update imports to use `@/components/layout/{context}`
  - Verify all pages still work
  - _Requirements: 4.3_

- [ ]\* 4.4 Write property tests cho layout components

  - **Property 6: Layout folders have index files**
  - **Validates: Requirements 4.2**
  - **Property 7: Layout component imports use correct alias**
  - **Validates: Requirements 4.3**

- [ ] 5. Validate UI Components

  - Verify UI components follow shadcn/ui conventions
  - Check import patterns
  - Validate CVA usage for variants
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 5.1 Audit UI component structure

  - Verify flat structure
  - Check for sub-components exported from same file
  - Document any deviations
  - _Requirements: 3.1, 3.4_

- [ ] 5.2 Validate UI component imports across codebase

  - Scan all imports of UI components
  - Ensure they use `@/components/ui/` alias
  - Fix any incorrect imports
  - _Requirements: 3.3_

- [ ]\* 5.3 Write property tests cho UI components

  - **Property 4: UI component imports use correct alias**
  - **Validates: Requirements 3.3**
  - **Property 5: UI components with sub-components export from same file**
  - **Validates: Requirements 3.4**

- [-] 6. Validate Import Patterns

  - Check intra-feature imports use relative paths
  - Check cross-feature imports use absolute paths
  - Fix violations
  - _Requirements: 6.3, 6.4_

- [ ] 6.1 Scan và validate import patterns

  - Identify intra-feature imports using absolute paths
  - Identify cross-feature imports using relative paths
  - Generate fix list
  - _Requirements: 6.3, 6.4_

- [ ] 6.2 Fix import pattern violations

  - Update intra-feature imports to relative paths
  - Update cross-feature imports to absolute paths
  - Verify TypeScript compilation
  - _Requirements: 6.3, 6.4_

- [ ]\* 6.3 Write property tests cho import patterns

  - **Property 14: Intra-feature imports use relative paths**
  - **Validates: Requirements 6.3**
  - **Property 15: Cross-feature imports use absolute paths**
  - **Validates: Requirements 6.4**

- [-] 7. Handle Unused Components

  - Identify unused components
  - Review with team
  - Remove or deprecate
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 7.1 Generate unused components report

  - Run dependency analysis
  - Identify components not imported anywhere
  - Exclude entry points (pages, layouts)
  - Create report for review
  - _Requirements: 7.1_

- [ ] 7.2 Review unused components

  - Manual review của unused components list
  - Categorize: delete, deprecate, or keep
  - Document decisions
  - _Requirements: 7.2_

- [ ] 7.3 Remove confirmed unused components

  - Delete components marked for removal
  - Verify no broken imports
  - Commit changes
  - _Requirements: 7.3_

- [ ] 7.4 Deprecate components for future removal

  - Create `_deprecated/` folder
  - Move components to deprecate
  - Add deprecation comments
  - Update documentation
  - _Requirements: 7.4_

- [ ] 8. Validate Props Interfaces và Type Files

  - Check Props interface naming
  - Validate type-only files have correct suffix
  - Fix violations
  - _Requirements: 5.4, 5.5_

- [ ] 8.1 Scan Props interfaces

  - Find all Props interfaces
  - Validate naming pattern `{ComponentName}Props`
  - Generate fix list
  - _Requirements: 5.4_

- [ ] 8.2 Fix Props interface naming

  - Rename interfaces to follow convention
  - Update usages
  - Verify TypeScript compilation
  - _Requirements: 5.4_

- [ ] 8.3 Validate type-only files

  - Identify files with only type definitions
  - Check for `.types.ts` or `.type.ts` suffix
  - Rename if needed
  - _Requirements: 5.5_

- [ ]\* 8.4 Write property tests cho types

  - **Property 10: Props interfaces follow naming convention**
  - **Validates: Requirements 5.4**
  - **Property 11: Type-only files have correct suffix**
  - **Validates: Requirements 5.5**

- [ ] 9. Checkpoint - Run all property tests

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Final Validation và Documentation

  - Run full test suite
  - Build production bundle
  - Update documentation
  - Create migration guide
  - _Requirements: All_

- [ ] 10.1 Run full test suite

  - Run all unit tests
  - Run all property tests
  - Run integration tests
  - Fix any failures
  - _Requirements: All_

- [ ] 10.2 Verify TypeScript compilation

  - Run `tsc --noEmit`
  - Fix any type errors
  - Ensure no regressions
  - _Requirements: All_

- [ ] 10.3 Verify production build

  - Run `yarn build`
  - Check bundle size
  - Ensure no build errors
  - Compare with baseline
  - _Requirements: All_

- [ ] 10.4 Run ESLint

  - Run `yarn lint`
  - Fix any linting errors
  - Ensure code quality
  - _Requirements: All_

- [ ]\* 10.5 Manual testing checklist

  - Test all pages render correctly
  - Check browser console for errors
  - Verify hot reload works
  - Test key user flows
  - _Requirements: All_

- [ ] 10.6 Update documentation

  - Update `structure.md` với new component structure
  - Document import patterns
  - Add examples
  - Update README if needed
  - _Requirements: All_

- [ ] 10.7 Create migration guide

  - Document breaking changes
  - Provide import update examples
  - List deprecated components
  - Add troubleshooting section
  - _Requirements: All_

- [ ] 11. Final Checkpoint - Verify everything works
  - Ensure all tests pass, ask the user if questions arise.
