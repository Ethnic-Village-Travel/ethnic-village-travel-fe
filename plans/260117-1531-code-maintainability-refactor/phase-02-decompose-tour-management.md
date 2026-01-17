# Phase 02: Decompose Tour Management Components

**Parent Plan**: [plan.md](./plan.md)
**Parallel Group**: A (can run with Phases 01, 03, 04, 08)
**Depends On**: None
**Blocks**: Phase 06 (feature named exports)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-17 |
| Priority | HIGH |
| Status | PENDING |
| Estimated Effort | 4-6 hours |
| Files Modified | 4 |

**Description**: Decompose large tour management components and consolidate create/edit forms to reduce duplication.

---

## Key Insights (From Research)

- tour-create-content.tsx (482 lines) and tour-edit-content.tsx (549 lines) share ~70% similar code
- Extract shared form logic into reusable `TourForm` component
- Use Zod schema sharing pattern from researcher-01 recommendations
- Apply React 19 `useActionState` for form submission if applicable

---

## Requirements

1. Create unified `TourForm` component used by both create and edit
2. Reduce tour-create-content.tsx to <150 lines
3. Reduce tour-edit-content.tsx to <150 lines
4. Extract itinerary and available-dates into reusable sub-components
5. Maintain existing functionality

---

## Architecture

### Current Structure

```
src/components/features/admin/tour-management/
├── tour-create/
│   ├── tour-create-content.tsx    # 482 lines
│   ├── tour-itinerary.tsx
│   ├── available-dates.tsx
│   └── in-ex-service.tsx
├── tour-edit/
│   └── tour-edit-content.tsx      # 549 lines
└── tour-list/
    └── ...
```

### Target Structure

```
src/components/features/admin/tour-management/
├── components/
│   ├── tour-form.tsx              # Shared form (~200 lines)
│   ├── tour-basic-info-section.tsx
│   ├── tour-itinerary-section.tsx
│   ├── tour-available-dates-section.tsx
│   ├── tour-services-section.tsx
│   ├── tour-pricing-section.tsx
│   └── index.ts
├── hooks/
│   ├── use-tour-form.ts           # Form logic hook
│   └── index.ts
├── schemas/
│   └── tour-form.schema.ts        # Zod schema
├── tour-create/
│   └── tour-create-content.tsx    # ~80 lines (wrapper)
├── tour-edit/
│   └── tour-edit-content.tsx      # ~100 lines (wrapper + data fetch)
└── tour-list/
    └── ...
```

---

## File Ownership (Exclusive to Phase 02)

| File | Action |
|------|--------|
| `tour-management/tour-create/tour-create-content.tsx` | REFACTOR |
| `tour-management/tour-create/tour-itinerary.tsx` | MOVE to components/ |
| `tour-management/tour-create/available-dates.tsx` | MOVE to components/ |
| `tour-management/tour-create/in-ex-service.tsx` | MOVE to components/ |
| `tour-management/tour-edit/tour-edit-content.tsx` | REFACTOR |
| `tour-management/components/` | CREATE (new folder) |
| `tour-management/hooks/` | CREATE (new folder) |

**No other phase modifies these files.**

---

## Implementation Steps

### Step 1: Analyze Create vs Edit Differences

1. Diff `tour-create-content.tsx` and `tour-edit-content.tsx`
2. Identify shared JSX patterns
3. Identify differences (initial data, submit endpoint, success redirect)
4. Document data flow

### Step 2: Create Shared Infrastructure

```bash
mkdir -p src/components/features/admin/tour-management/components
mkdir -p src/components/features/admin/tour-management/hooks
```

### Step 3: Extract Form Sections

1. Create `TourBasicInfoSection` - name, description, category
2. Create `TourItinerarySection` - refactor from tour-itinerary.tsx
3. Create `TourAvailableDatesSection` - refactor from available-dates.tsx
4. Create `TourServicesSection` - refactor from in-ex-service.tsx
5. Create `TourPricingSection` - pricing fields

### Step 4: Create Unified TourForm

```typescript
// tour-form.tsx
export function TourForm({
  mode,
  initialData,
  onSubmit
}: TourFormProps) {
  const form = useTourForm(initialData);

  return (
    <Form {...form}>
      <TourBasicInfoSection />
      <TourItinerarySection />
      <TourAvailableDatesSection />
      <TourServicesSection />
      <TourPricingSection />
      <FormActions mode={mode} />
    </Form>
  );
}
```

### Step 5: Refactor Create/Edit Wrappers

```typescript
// tour-create-content.tsx (~80 lines)
export function TourCreateContent() {
  const { mutate, isPending } = useCreateTour();

  return (
    <TourForm
      mode="create"
      onSubmit={mutate}
      isSubmitting={isPending}
    />
  );
}
```

```typescript
// tour-edit-content.tsx (~100 lines)
export function TourEditContent({ tourId }: Props) {
  const { data: tour } = useTour(tourId);
  const { mutate, isPending } = useUpdateTour(tourId);

  if (!tour) return <Skeleton />;

  return (
    <TourForm
      mode="edit"
      initialData={tour}
      onSubmit={mutate}
      isSubmitting={isPending}
    />
  );
}
```

### Step 6: Update Imports

1. Update all imports referencing moved files
2. Ensure barrel exports are correct

### Step 7: Verify

```bash
npm run lint && npm run build && npm run test:run
```

---

## Todo List

- [ ] Analyze tour-create-content.tsx structure
- [ ] Analyze tour-edit-content.tsx structure
- [ ] Diff and document shared vs different code
- [ ] Create components/ folder
- [ ] Create hooks/ folder
- [ ] Extract TourBasicInfoSection
- [ ] Refactor tour-itinerary.tsx to TourItinerarySection
- [ ] Refactor available-dates.tsx to TourAvailableDatesSection
- [ ] Refactor in-ex-service.tsx to TourServicesSection
- [ ] Extract TourPricingSection
- [ ] Create useTourForm hook
- [ ] Create unified TourForm component
- [ ] Refactor tour-create-content.tsx to use TourForm
- [ ] Refactor tour-edit-content.tsx to use TourForm
- [ ] Create barrel exports
- [ ] Update all import paths
- [ ] Run lint, build, and tests
- [ ] Manual testing of create/edit flows

---

## Success Criteria

1. tour-create-content.tsx < 100 lines
2. tour-edit-content.tsx < 120 lines
3. No code duplication between create and edit
4. All form validations work correctly
5. `npm run build` passes
6. Create and edit tour flows work identically to before

---

## Conflict Prevention

- **Exclusive files**: Only Phase 02 touches tour-management/ folder
- **New files only**: Creating new components, not modifying shared utilities
- **No overlap**: Phase 04 handles promotion management separately

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Form validation regression | MEDIUM | HIGH | Comprehensive manual testing |
| Edit-specific logic lost | LOW | HIGH | Careful extraction, test edit flow |
| Breaking API contract | LOW | HIGH | Keep same form field names |

---

## Security Considerations

- Maintain existing input validation
- Preserve file upload security checks
- Keep authorization checks in place

---

## Next Steps

After completion, Phase 06 will convert these components to named exports. Phase 10 will add tests for the unified TourForm.
