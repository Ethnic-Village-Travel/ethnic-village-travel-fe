# Design Document - Frontend Component Restructure

## Overview

Tài liệu này mô tả thiết kế chi tiết cho việc tái cấu trúc components trong dự án Ethnic Village Travel Frontend. Mục
tiêu là tạo ra một cấu trúc components nhất quán, dễ bảo trì, và tuân theo best practices của React/Next.js.

Việc tái cấu trúc sẽ tập trung vào:

- Chuẩn hóa cấu trúc thư mục và naming conventions
- Tối ưu hóa barrel exports (index.ts files)
- Nhóm shared components theo chức năng
- Xác định và xử lý components không sử dụng
- Đảm bảo tính nhất quán trong cách import/export

## Architecture

### Current Structure Analysis

Cấu trúc hiện tại:

```
components/
├── features/          # Domain-specific components
│   ├── about/
│   ├── admin/
│   ├── article/
│   ├── auth/
│   ├── booking/
│   ├── home/
│   ├── tour/
│   └── user/
├── layout/           # Layout components
│   ├── admin/
│   └── marketing/
├── shared/           # Shared components (flat structure)
│   ├── chatbot/
│   ├── data-table/
│   ├── filter/
│   └── [individual files]
└── ui/              # Primitive UI components (shadcn/ui)
```

**Vấn đề hiện tại:**

1. Shared components không được nhóm theo chức năng (flat structure)
2. Một số feature folders thiếu index.ts exports
3. Naming conventions không nhất quán (một số file dùng underscore, một số dùng dash)
4. Có duplicate components (ví dụ: floating-booking-panel xuất hiện ở nhiều nơi)
5. Không có cơ chế xác định unused components

### Target Structure

Cấu trúc mục tiêu:

```
components/
├── features/
│   └── {domain}/
│       └── {feature-name}/
│           ├── index.ts              # Barrel exports
│           ├── {feature-name}.tsx    # Main component
│           ├── components/           # Sub-components (if > 3)
│           ├── hooks/                # Feature-specific hooks
│           └── types.ts              # Feature-specific types
├── layout/
│   ├── admin/
│   │   └── index.ts
│   ├── marketing/
│   │   └── index.ts
│   └── shared/                       # Shared layouts
│       └── index.ts
├── shared/
│   ├── form/                         # Form-related components
│   │   ├── form-field.tsx
│   │   ├── form-errors.tsx
│   │   └── index.ts
│   ├── data-display/                 # Data display components
│   │   ├── data-table/
│   │   ├── review-item.tsx
│   │   ├── star-rating.tsx
│   │   └── index.ts
│   ├── feedback/                     # Feedback components
│   │   ├── loading.tsx
│   │   └── index.ts
│   ├── navigation/                   # Navigation components
│   │   ├── pagination-client.tsx
│   │   ├── language-switcher.tsx
│   │   └── index.ts
│   ├── layout/                       # Layout helpers
│   │   ├── section-container.tsx
│   │   ├── shell.tsx
│   │   ├── page-hero.tsx
│   │   └── index.ts
│   └── input/                        # Input components
│       ├── otp-input.tsx
│       ├── multiple-select.tsx
│       └── index.ts
└── ui/                               # Keep flat (shadcn/ui standard)
```

## Components and Interfaces

### 1. Feature Component Structure

Mỗi feature component sẽ tuân theo cấu trúc:

```typescript
// features/{domain}/{feature-name}/index.ts
export { default } from './{feature-name}';
export * from './components';
export type * from './types';

// features/{domain}/{feature-name}/{feature-name}.tsx
'use client'; // if needed

import { ... } from 'react';
import { ... } from '@/components/ui/...';
import { ... } from './components';

interface FeatureNameProps {
  // Props definition
}

export default function FeatureName({ ...props }: FeatureNameProps) {
  // Component logic
  return (...)
}
```

**Quy tắc:**

- Main component file name phải match với folder name
- Default export cho main component
- Named exports cho sub-components và types
- Sub-components trong folder `components/` nếu có > 3 components
- Feature-specific hooks trong folder `hooks/`
- Feature-specific types trong file `types.ts`

### 2. Shared Component Organization

Shared components được nhóm theo chức năng:

**Form Components** (`shared/form/`)

- `form-field.tsx` - Generic form field wrapper
- `form-errors.tsx` - Form error display
- `index.ts` - Barrel exports

**Data Display Components** (`shared/data-display/`)

- `data-table/` - Complex data table components
- `review-item.tsx` - Review display
- `star-rating.tsx` - Star rating display
- `bookmark-button.tsx` - Bookmark action button
- `index.ts` - Barrel exports

**Feedback Components** (`shared/feedback/`)

- `loading.tsx` - Loading indicators
- `divider.tsx` - Visual dividers
- `index.ts` - Barrel exports

**Navigation Components** (`shared/navigation/`)

- `pagination-client.tsx` - Client-side pagination
- `language-switcher.tsx` - Language switcher
- `index.ts` - Barrel exports

**Layout Components** (`shared/layout/`)

- `section-container.tsx` - Section wrapper
- `shell.tsx` - Page shell
- `page-hero.tsx` - Hero section
- `index.ts` - Barrel exports

**Input Components** (`shared/input/`)

- `otp-input.tsx` - OTP input field
- `multiple-select.tsx` - Multi-select dropdown
- `index.ts` - Barrel exports

### 3. Layout Component Structure

Layout components được tổ chức theo context:

```typescript
// layout/{context}/index.ts
export { default as Header } from './header';
export { default as Footer } from './footer';
export { default as Sidebar } from './sidebar';

// layout/{context}/header.tsx
export default function Header() {
  return (...)
}
```

### 4. UI Component Structure

UI components giữ cấu trúc flat theo chuẩn shadcn/ui:

```typescript
// ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: { ... },
      size: { ... }
    }
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  // Props
}

export function Button({ variant, size, ...props }: ButtonProps) {
  return (...)
}
```

## Data Models

### Component Metadata Structure

Để hỗ trợ việc phân tích và refactor, chúng ta sẽ sử dụng cấu trúc metadata:

```typescript
interface ComponentMetadata {
  path: string; // Đường dẫn file
  name: string; // Tên component
  type: 'feature' | 'shared' | 'layout' | 'ui';
  exports: {
    default?: string; // Default export name
    named: string[]; // Named exports
  };
  imports: {
    internal: string[]; // Internal imports
    external: string[]; // External imports
  };
  usedBy: string[]; // Files import component này
  hasIndexFile: boolean; // Có file index.ts không
  followsNamingConvention: boolean;
}

interface RefactorPlan {
  componentsToMove: Array<{
    from: string;
    to: string;
    reason: string;
  }>;
  componentsToRename: Array<{
    path: string;
    oldName: string;
    newName: string;
  }>;
  indexFilesToCreate: string[];
  unusedComponents: string[];
  duplicateComponents: Array<{
    name: string;
    locations: string[];
  }>;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a
formal statement about what the system should do. Properties serve as the bridge between human-readable specifications
and machine-verifiable correctness guarantees._

### Property 1: Feature folders have index files

_For any_ feature component folder in `components/features/`, the folder should contain an `index.ts` or `index.tsx`
file that exports the main component. **Validates: Requirements 1.3**

### Property 2: Component files follow kebab-case naming

_For any_ component file in the components directory, the filename should follow kebab-case pattern (lowercase with
hyphens, no underscores or spaces). **Validates: Requirements 2.2, 5.1**

### Property 3: Shared component folders have index files

_For any_ subdirectory in `components/shared/`, the directory should contain an `index.ts` file with barrel exports.
**Validates: Requirements 2.3**

### Property 4: UI component imports use correct alias

_For any_ import statement importing from UI components, the import path should use the `@/components/ui/` alias
pattern. **Validates: Requirements 3.3**

### Property 5: UI components with sub-components export from same file

_For any_ UI component file that defines multiple related components (like Form, FormField, FormItem), all components
should be exported from the same file. **Validates: Requirements 3.4**

### Property 6: Layout folders have index files

_For any_ layout context folder in `components/layout/`, the folder should contain an `index.ts` file with barrel
exports. **Validates: Requirements 4.2**

### Property 7: Layout component imports use correct alias

_For any_ import statement importing layout components, the import path should use the `@/components/layout/{context}`
pattern. **Validates: Requirements 4.3**

### Property 8: Component exports use PascalCase

_For any_ component export (default or named), the exported component name should follow PascalCase convention.
**Validates: Requirements 5.2**

### Property 9: Component folders follow kebab-case naming

_For any_ component folder in the components directory, the folder name should follow kebab-case pattern. **Validates:
Requirements 5.3**

### Property 10: Props interfaces follow naming convention

_For any_ component with a props interface, the interface name should follow the pattern `{ComponentName}Props`.
**Validates: Requirements 5.4**

### Property 11: Type-only files have correct suffix

_For any_ file that only contains TypeScript type definitions (no runtime code), the filename should end with
`.types.ts` or `.type.ts`. **Validates: Requirements 5.5**

### Property 12: Feature index files have default export

_For any_ `index.ts` file in a feature folder, the file should have a default export pointing to the main component.
**Validates: Requirements 6.1**

### Property 13: Feature index files have named exports for public components

_For any_ feature folder with multiple public components, the `index.ts` file should export them as named exports.
**Validates: Requirements 6.2**

### Property 14: Intra-feature imports use relative paths

_For any_ import statement within the same feature folder, the import should use relative paths (`./ ` or `../`).
**Validates: Requirements 6.3**

### Property 15: Cross-feature imports use absolute paths

_For any_ import statement importing from a different feature, the import should use absolute path with `@/` alias.
**Validates: Requirements 6.4**

### Property 16: Unused components are identified

_For any_ component file in the codebase, if it is not imported by any other file and not used in any page/route, it
should be identified as unused. **Validates: Requirements 7.1**

## Error Handling

### Refactoring Errors

**File System Errors:**

- Missing files during move operations
- Permission errors
- Path conflicts

**Handling:**

```typescript
try {
  await moveComponent(from, to);
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(`Source file not found: ${from}`);
    // Log to refactor report
  } else if (error.code === 'EEXIST') {
    console.error(`Target already exists: ${to}`);
    // Prompt for merge strategy
  }
  // Rollback changes
}
```

**Import Resolution Errors:**

- Broken imports after moving files
- Circular dependencies

**Handling:**

- Run TypeScript compiler after each batch of changes
- Use automated import fixing tools (like ts-morph)
- Maintain import map for updates

### Validation Errors

**Naming Convention Violations:**

```typescript
function validateNaming(filename: string): ValidationResult {
  const kebabCasePattern = /^[a-z0-9]+(-[a-z0-9]+)*\.(tsx?|jsx?)$/;

  if (!kebabCasePattern.test(filename)) {
    return {
      valid: false,
      error: `Filename "${filename}" does not follow kebab-case convention`,
    };
  }

  return { valid: true };
}
```

**Structure Violations:**

```typescript
function validateFeatureStructure(featurePath: string): ValidationResult {
  const hasIndexFile = fs.existsSync(path.join(featurePath, 'index.ts'));

  if (!hasIndexFile) {
    return {
      valid: false,
      error: `Feature folder "${featurePath}" missing index.ts file`,
    };
  }

  return { valid: true };
}
```

## Testing Strategy

### Unit Testing

**Component Structure Tests:**

- Test helper functions for path manipulation
- Test naming convention validators
- Test metadata extraction functions

**Example:**

```typescript
describe('validateNaming', () => {
  it('should accept valid kebab-case filenames', () => {
    expect(validateNaming('tour-detail.tsx')).toEqual({ valid: true });
    expect(validateNaming('booking-wizard.tsx')).toEqual({ valid: true });
  });

  it('should reject invalid filenames', () => {
    expect(validateNaming('TourDetail.tsx').valid).toBe(false);
    expect(validateNaming('tour_detail.tsx').valid).toBe(false);
    expect(validateNaming('tour detail.tsx').valid).toBe(false);
  });
});
```

### Property-Based Testing

Chúng ta sẽ sử dụng **fast-check** (JavaScript/TypeScript property-based testing library) để test các correctness
properties.

**Configuration:**

- Minimum 100 iterations per property test
- Use custom generators for file paths and component names
- Tag each test with corresponding property number

**Example Property Test:**

```typescript
import fc from 'fast-check';

describe('Property Tests', () => {
  it('Property 1: Feature folders have index files', () => {
    // Feature: fe-component-restructure, Property 1
    const featureFolders = getFeatureFolders('src/components/features');

    featureFolders.forEach(folder => {
      const hasIndex = fs.existsSync(path.join(folder, 'index.ts')) || fs.existsSync(path.join(folder, 'index.tsx'));
      expect(hasIndex).toBe(true);
    });
  });

  it('Property 2: Component files follow kebab-case naming', () => {
    // Feature: fe-component-restructure, Property 2
    fc.assert(
      fc.property(fc.array(fc.string()), componentFiles => {
        const actualFiles = getAllComponentFiles('src/components');
        return actualFiles.every(file => {
          const filename = path.basename(file);
          return /^[a-z0-9]+(-[a-z0-9]+)*\.(tsx?|jsx?)$/.test(filename);
        });
      }),
      { numRuns: 100 },
    );
  });
});
```

### Integration Testing

**Refactor Workflow Tests:**

- Test complete refactor process on sample directory
- Verify imports still resolve after refactoring
- Verify TypeScript compilation succeeds

**Example:**

```typescript
describe('Refactor Integration', () => {
  it('should successfully refactor a feature folder', async () => {
    const testDir = createTestDirectory();
    await refactorFeature(testDir);

    // Verify structure
    expect(fs.existsSync(path.join(testDir, 'index.ts'))).toBe(true);

    // Verify TypeScript compiles
    const result = await runTypeScriptCompiler(testDir);
    expect(result.errors).toHaveLength(0);
  });
});
```

### Manual Testing Checklist

- [ ] All pages render correctly after refactor
- [ ] No console errors in browser
- [ ] TypeScript compilation succeeds
- [ ] ESLint passes
- [ ] Build succeeds (`yarn build`)
- [ ] All existing tests pass
- [ ] Hot reload works in development

## Implementation Approach

### Phase 1: Analysis & Planning

1. Scan all component files and build metadata
2. Identify naming convention violations
3. Identify missing index files
4. Identify unused components
5. Identify duplicate components
6. Generate refactor plan

### Phase 2: Shared Components Reorganization

1. Create new category folders in `shared/`
2. Move components to appropriate categories
3. Create index.ts files with barrel exports
4. Update all imports across codebase

### Phase 3: Feature Components Standardization

1. Create missing index.ts files
2. Rename files to follow kebab-case
3. Reorganize sub-components into `components/` folders
4. Update exports and imports

### Phase 4: Layout Components Cleanup

1. Ensure all layout contexts have index.ts
2. Create `shared/` folder for common layouts
3. Update imports

### Phase 5: Validation & Cleanup

1. Run all property tests
2. Fix any violations
3. Remove or deprecate unused components
4. Update documentation

### Phase 6: Final Verification

1. Run full test suite
2. Build production bundle
3. Manual testing
4. Code review

## Migration Strategy

### Backward Compatibility

Để đảm bảo không break existing code:

1. **Gradual Migration:**

   - Giữ old imports hoạt động bằng re-exports
   - Deprecate old paths với comments
   - Remove sau khi verify không còn usage

2. **Import Aliases:**

   ```typescript
   // Old path (deprecated)
   export { FormField } from './form-field';

   // New path
   export { FormField } from './form/form-field';
   ```

3. **Automated Import Updates:**
   - Sử dụng codemod hoặc ts-morph để update imports
   - Run trong CI/CD để catch regressions

### Rollback Plan

Nếu gặp vấn đề:

1. Revert Git commits
2. Restore từ backup
3. Fix issues và retry
4. Document lessons learned

## Performance Considerations

### Build Performance

- Barrel exports có thể ảnh hưởng tree-shaking
- Giải pháp: Sử dụng named exports thay vì export \*
- Monitor bundle size trước và sau refactor

### Development Performance

- Hot reload có thể chậm hơn với nhiều barrel exports
- Giải pháp: Sử dụng direct imports trong development nếu cần

## Documentation Updates

Sau khi refactor, cập nhật:

1. `structure.md` - Cấu trúc components mới
2. Component README files
3. Import guidelines
4. Examples trong documentation

## Success Criteria

Refactor thành công khi:

- ✅ Tất cả property tests pass
- ✅ TypeScript compilation không có errors
- ✅ Build thành công
- ✅ Tất cả existing tests pass
- ✅ Không có console errors
- ✅ Bundle size không tăng đáng kể (< 5%)
- ✅ Code review approved
