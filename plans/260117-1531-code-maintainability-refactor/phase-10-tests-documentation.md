# Phase 10: Tests and Documentation

**Parent Plan**: [plan.md](./plan.md)
**Parallel Group**: C (sequential - final phase)
**Depends On**: Phases 01-09 (all refactoring complete)
**Blocks**: None (final phase)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-17 |
| Priority | LOW |
| Status | PENDING |
| Estimated Effort | 3-4 hours |
| Files Modified | ~10 new test files + docs |

**Description**: Add tests for refactored components and update documentation to reflect new structure.

---

## Key Insights (From Research)

- Vitest + React Testing Library for component tests
- Focus on user interactions, not implementation details
- Update codebase-summary.md with new structure
- Document patterns for future developers

---

## Requirements

1. Add tests for decomposed UI primitives
2. Add tests for unified form components
3. Add tests for consolidated chatbot
4. Update codebase-summary.md
5. Update code-standards.md if needed
6. Update CLAUDE.md with new patterns

---

## Test Coverage Targets

### UI Primitives (Phase 01 outputs)

| Component | Test File | Coverage |
|-----------|-----------|----------|
| FileUpload | `file-upload.test.tsx` | Upload, preview, remove |
| Sidebar | `sidebar.test.tsx` | Expand, collapse, navigation |
| Sortable | `sortable.test.tsx` | Drag, drop, reorder |

### Tour Form (Phase 02 outputs)

| Component | Test File | Coverage |
|-----------|-----------|----------|
| TourForm | `tour-form.test.tsx` | Validation, submit |
| TourItinerarySection | `tour-itinerary.test.tsx` | Add/remove days |

### Chatbot (Phase 03 outputs)

| Component | Test File | Coverage |
|-----------|-----------|----------|
| Chatbot | `chatbot.test.tsx` | Open, send message, close |

### Promotion Form (Phase 04 outputs)

| Component | Test File | Coverage |
|-----------|-----------|----------|
| PromotionForm | `promotion-form.test.tsx` | Validation, discount calc |

---

## File Ownership (Exclusive to Phase 10)

| File | Action |
|------|--------|
| `src/components/ui/file-upload/*.test.tsx` | CREATE |
| `src/components/ui/sidebar/*.test.tsx` | CREATE |
| `src/components/ui/sortable/*.test.tsx` | CREATE |
| `**/tour-management/**/*.test.tsx` | CREATE |
| `src/components/shared/chatbot/*.test.tsx` | CREATE |
| `**/promotion-management/**/*.test.tsx` | CREATE |
| `docs/codebase-summary.md` | UPDATE |
| `docs/code-standards.md` | UPDATE (if needed) |
| `CLAUDE.md` | UPDATE |

---

## Implementation Steps

### Step 1: Set Up Test Infrastructure (if needed)

Verify test setup:
```bash
npm run test:run -- --reporter=verbose
```

### Step 2: Add FileUpload Tests

```typescript
// file-upload/file-upload.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from './index';

describe('FileUpload', () => {
  it('renders dropzone', () => {
    render(<FileUpload onUpload={vi.fn()} />);
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    const onUpload = vi.fn();
    render(<FileUpload onUpload={onUpload} />);

    const input = screen.getByLabelText(/upload/i);
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onUpload).toHaveBeenCalledWith([file]);
  });

  it('shows preview after upload', async () => {
    // Test preview rendering
  });

  it('removes file on delete click', async () => {
    // Test file removal
  });
});
```

### Step 3: Add Sidebar Tests

```typescript
// sidebar/sidebar.test.tsx
describe('Sidebar', () => {
  it('renders navigation items', () => { });
  it('collapses on toggle', () => { });
  it('expands on toggle', () => { });
  it('highlights active route', () => { });
});
```

### Step 4: Add TourForm Tests

```typescript
// tour-form.test.tsx
describe('TourForm', () => {
  it('renders in create mode', () => { });
  it('renders in edit mode with data', () => { });
  it('validates required fields', () => { });
  it('submits form data', () => { });
});
```

### Step 5: Add Chatbot Tests

```typescript
// chatbot/chatbot.test.tsx
describe('Chatbot', () => {
  it('opens on button click', () => { });
  it('sends message on submit', () => { });
  it('displays received messages', () => { });
  it('closes on close button', () => { });
});
```

### Step 6: Add PromotionForm Tests

```typescript
// promotion-form.test.tsx
describe('PromotionForm', () => {
  it('validates promotion code format', () => { });
  it('calculates discount correctly', () => { });
  it('validates date range', () => { });
});
```

### Step 7: Run All Tests

```bash
npm run test:run
```

### Step 8: Update codebase-summary.md

Add new sections:
- Updated directory structure
- New component patterns
- Hook organization

### Step 9: Update code-standards.md

Add if needed:
- Compound component pattern
- Hook extraction guidelines
- Test file colocation

### Step 10: Update CLAUDE.md

Update:
- Component organization section
- Import patterns
- Testing patterns

---

## Todo List

### Tests
- [ ] Create file-upload.test.tsx
- [ ] Create sidebar.test.tsx
- [ ] Create sortable.test.tsx
- [ ] Create tour-form.test.tsx
- [ ] Create chatbot.test.tsx
- [ ] Create promotion-form.test.tsx
- [ ] Run all tests and verify pass

### Documentation
- [ ] Update codebase-summary.md with new structure
- [ ] Update code-standards.md with new patterns
- [ ] Update CLAUDE.md with refactoring outcomes
- [ ] Create ADR for refactoring decisions (optional)

---

## Success Criteria

1. All new tests pass
2. Test coverage for critical user flows
3. Documentation reflects current structure
4. New developers can understand patterns from docs

---

## Conflict Prevention

- **Final phase**: No conflicts possible
- **New files only**: Tests are additions
- **Doc updates**: Only Phase 10 touches docs

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Flaky tests | MEDIUM | LOW | Avoid timing dependencies |
| Missing test cases | LOW | LOW | Focus on critical paths |
| Outdated docs | MEDIUM | LOW | Review against actual code |

---

## Security Considerations

- Test security-related flows (auth, validation)
- Document security patterns

---

## Test Patterns to Follow

### Component Test Structure

```typescript
describe('ComponentName', () => {
  // Setup
  const defaultProps = { ... };

  // Rendering
  it('renders without crashing', () => { });

  // User interactions
  it('responds to user action', () => { });

  // Edge cases
  it('handles empty state', () => { });
  it('handles error state', () => { });
});
```

### Mock Patterns

```typescript
// API mocking with MSW (if needed)
// Zustand store mocking
// Router mocking
```

---

## Documentation Updates

### codebase-summary.md Changes

```markdown
## Component Organization (Updated)

### UI Primitives (src/components/ui/)
- Decomposed into sub-component folders
- Each folder contains: main component, sub-components, hooks, types

### Feature Components
- Admin features colocated with routes (_components)
- Marketing features in src/components/features/
```

### code-standards.md Additions

```markdown
## Component Decomposition

When a component exceeds 200 lines:
1. Extract sub-components to folder structure
2. Create barrel export (index.ts)
3. Extract hooks for logic
4. Create types.ts for interfaces
```

---

## Next Steps

Phase 10 is the final phase. After completion:
1. Merge refactoring branch to dev
2. Test in staging environment
3. Merge to main after verification
4. Monitor for any issues
