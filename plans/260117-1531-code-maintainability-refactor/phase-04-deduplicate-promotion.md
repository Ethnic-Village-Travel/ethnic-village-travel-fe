# Phase 04: Deduplicate Promotion Management Forms

**Parent Plan**: [plan.md](./plan.md)
**Parallel Group**: A (can run with Phases 01, 02, 03, 08)
**Depends On**: None
**Blocks**: Phase 06 (feature named exports)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-17 |
| Priority | MEDIUM |
| Status | PENDING |
| Estimated Effort | 2-3 hours |
| Files Modified | 3 |

**Description**: Deduplicate promotion-create.tsx (305 lines) and promotion-edit.tsx (311 lines) which have near-identical code.

---

## Key Insights (From Research)

- Create and edit forms are 98% identical (616 total lines, ~308 duplicated)
- Classic candidate for unified form component pattern
- Similar pattern to tour management but smaller scope
- Apply same refactoring approach as Phase 02

---

## Requirements

1. Create unified `PromotionForm` component
2. Reduce promotion-create.tsx to <80 lines
3. Reduce promotion-edit.tsx to <100 lines
4. Maintain all validation and business logic
5. No breaking changes

---

## Architecture

### Current Structure

```
src/components/features/admin/promotion-management/
├── promotion-create.tsx     # 305 lines
├── promotion-edit.tsx       # 311 lines
└── promotion-list.tsx
```

### Target Structure

```
src/components/features/admin/promotion-management/
├── components/
│   ├── promotion-form.tsx          # Shared form (~200 lines)
│   ├── promotion-code-section.tsx
│   ├── promotion-discount-section.tsx
│   ├── promotion-validity-section.tsx
│   └── index.ts
├── hooks/
│   └── use-promotion-form.ts
├── promotion-create.tsx            # Wrapper (~60 lines)
├── promotion-edit.tsx              # Wrapper (~80 lines)
└── promotion-list.tsx              # Unchanged
```

---

## File Ownership (Exclusive to Phase 04)

| File | Action |
|------|--------|
| `promotion-management/promotion-create.tsx` | REFACTOR |
| `promotion-management/promotion-edit.tsx` | REFACTOR |
| `promotion-management/promotion-list.tsx` | NO CHANGE (keep as-is) |
| `promotion-management/components/` | CREATE |
| `promotion-management/hooks/` | CREATE |

**No other phase modifies these files.**

---

## Implementation Steps

### Step 1: Analyze Create vs Edit

1. Diff promotion-create.tsx and promotion-edit.tsx
2. Document differences:
   - Initial data loading (edit only)
   - Submit endpoint (create vs update)
   - Success message/redirect
3. Map shared form fields

### Step 2: Create Folder Structure

```bash
mkdir -p src/components/features/admin/promotion-management/components
mkdir -p src/components/features/admin/promotion-management/hooks
```

### Step 3: Extract Form Sections

```typescript
// promotion-code-section.tsx
export function PromotionCodeSection() {
  const form = useFormContext();
  return (
    <FormField name="code" control={form.control}>
      {/* Code input with validation */}
    </FormField>
  );
}

// promotion-discount-section.tsx
export function PromotionDiscountSection() {
  // Discount type, value, max discount
}

// promotion-validity-section.tsx
export function PromotionValiditySection() {
  // Start date, end date, usage limit
}
```

### Step 4: Create Unified PromotionForm

```typescript
// promotion-form.tsx
interface PromotionFormProps {
  mode: 'create' | 'edit';
  initialData?: Promotion;
  onSubmit: (data: PromotionInput) => void;
  isSubmitting: boolean;
}

export function PromotionForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting
}: PromotionFormProps) {
  const form = usePromotionForm(initialData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PromotionCodeSection />
        <PromotionDiscountSection />
        <PromotionValiditySection />
        <Button type="submit" disabled={isSubmitting}>
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </form>
    </Form>
  );
}
```

### Step 5: Refactor Create Wrapper

```typescript
// promotion-create.tsx (~60 lines)
export function PromotionCreate() {
  const { mutate, isPending } = useCreatePromotion();
  const router = useRouter();

  const handleSubmit = (data: PromotionInput) => {
    mutate(data, {
      onSuccess: () => router.push(RouteConstant.admin_promotions)
    });
  };

  return (
    <PromotionForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={isPending}
    />
  );
}
```

### Step 6: Refactor Edit Wrapper

```typescript
// promotion-edit.tsx (~80 lines)
export function PromotionEdit({ promotionId }: Props) {
  const { data: promotion, isLoading } = usePromotion(promotionId);
  const { mutate, isPending } = useUpdatePromotion(promotionId);

  if (isLoading) return <Skeleton />;

  return (
    <PromotionForm
      mode="edit"
      initialData={promotion}
      onSubmit={mutate}
      isSubmitting={isPending}
    />
  );
}
```

### Step 7: Create Barrel Exports

```typescript
// components/index.ts
export { PromotionForm } from './promotion-form';
export { PromotionCodeSection } from './promotion-code-section';
// ...
```

### Step 8: Verify

```bash
npm run lint && npm run build && npm run test:run
```

---

## Todo List

- [ ] Analyze promotion-create.tsx structure
- [ ] Analyze promotion-edit.tsx structure
- [ ] Document shared vs different code
- [ ] Create components/ folder
- [ ] Create hooks/ folder
- [ ] Extract PromotionCodeSection
- [ ] Extract PromotionDiscountSection
- [ ] Extract PromotionValiditySection
- [ ] Create usePromotionForm hook
- [ ] Create unified PromotionForm
- [ ] Refactor promotion-create.tsx
- [ ] Refactor promotion-edit.tsx
- [ ] Create barrel exports
- [ ] Run lint, build, and tests
- [ ] Manual testing of create/edit flows

---

## Success Criteria

1. promotion-create.tsx < 80 lines
2. promotion-edit.tsx < 100 lines
3. ~300 lines of duplication eliminated
4. All validation works correctly
5. `npm run build` passes

---

## Conflict Prevention

- **Exclusive files**: Only Phase 04 touches promotion-management/ folder
- **No overlap**: Phase 02 handles tour management, Phase 06 handles other features
- **Clear boundary**: promotion-list.tsx unchanged

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Form validation regression | LOW | MEDIUM | Test all validation rules |
| Discount calculation error | LOW | HIGH | Unit test discount logic |
| Date handling issues | LOW | MEDIUM | Test edge cases (timezone) |

---

## Security Considerations

- Maintain code uniqueness validation
- Preserve discount value limits
- Keep authorization checks

---

## Next Steps

After completion, Phase 06 will convert to named exports. Phase 10 will add tests.
