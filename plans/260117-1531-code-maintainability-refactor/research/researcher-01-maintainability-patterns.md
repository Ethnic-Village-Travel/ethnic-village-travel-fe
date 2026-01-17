# Researcher Report: Next.js 15 + React 19 Maintainability Patterns
Date: 260117 | Topic: Code Maintainability Best Practices

## 1. Code Duplication Detection & Elimination
- **Patterns**: Extract repeated logic into **Custom Hooks** (client) or **Server Utilities** (server).
- **Tooling**: Use `jscpd` or `inspect-js` for static duplication analysis.
- **DRY Strategy**:
  - **Shared UI**: Centralize in `@/components/ui` (shadcn pattern).
  - **Logic**: Use pure functions in `src/utils` for deterministic logic.
  - **Validation**: Centralize Zod schemas in `src/libs/schemas` to share between Client Forms and Server Actions.

## 2. Component Complexity Management
- **Cyclomatic Complexity**: Aim for < 10 per function. Break down components when they exceed 200 lines or handle > 3 distinct responsibilities.
- **React 19 Improvements**:
  - **Actions**: Use `useTransition` and `useActionState` to remove manual `loading`/`error` state boilerplate.
  - **`use` Hook**: Simplify Promise/Context consumption. Allows conditional consumption (e.g., inside `if` blocks), reducing nested ternary/logical complexity.
  - **`useFormStatus`**: Use in child components to access parent form state without prop drilling.

## 3. Advanced Type Safety (TypeScript 5.x)
- **Type-Safe Server Actions**:
  ```typescript
  // Example of a type-safe action wrapper pattern
  export const createAction = <TInput, TOutput>(
    schema: z.ZodSchema<TInput>,
    handler: (data: TInput) => Promise<TOutput>
  ) => async (formData: FormData) => {
    const validated = schema.parse(Object.fromEntries(formData));
    return handler(validated);
  };
  ```
- **Discriminated Unions**: Use for state management (e.g., `type State = { status: 'idle' } | { status: 'loading' } | { status: 'success', data: T }`) to ensure exhaustive pattern matching.
- **Satisfies Operator**: Use `satisfies` to validate types without losing inference specificity.

## 4. Folder Structure (Next.js 15 App Router)
- **Colocation**: Keep route-specific components, styles, and tests inside the route folder.
- **Private Folders (`_`)**: Use for route-specific logic that shouldn't be routable.
- **Route Groups `()`**: Use for logical organization (e.g., `(marketing)`, `(admin)`) and layout boundaries without URL impact.
- **Recommended Hierarchy**:
  ```text
  src/
  ├── app/
  │   ├── (marketing)/
  │   │   ├── _components/  # Local components
  │   │   └── page.tsx
  ├── components/
  │   ├── ui/               # Primitives
  │   └── shared/           # Reusable cross-feature
  ├── features/             # Domain logic (Booking, Tour)
  └── core/                 # API, Types, Constants
  ```

## 5. Testing Strategy
- **Unit Testing**: Focus on `src/utils`, `src/hooks`, and leaf UI components using **Vitest**.
- **Integration Testing**: Use **React Testing Library** for complex interactions and **Playwright** for Server Component rendered output.
- **Mocking**: Minimize mocking. Use MSW (Mock Service Worker) for API mocking to keep tests realistic.

## Actionable Recommendations
1. **Migrate Forms**: Adopt `useActionState` and `useFormStatus` to reduce state management boilerplate.
2. **Refactor Folders**: Move route-specific components from `src/components/features` into local `_components` if they are not reused.
3. **Action Wrappers**: Implement a standard type-safe wrapper for Server Actions using Zod.
4. **Prune Duplication**: Run `jscpd` on `src/components/features` to identify refactoring candidates.

## Unresolved Questions
- Impact of React 19 `use` hook on existing TanStack Query `useQuery` patterns (coexistence vs replacement).
- Optimal strategy for sharing Zod schemas between client-side `react-hook-form` and server-side actions without duplication.

## Sources
- [Next.js Routing: Colocation](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [React 19 Blog Post](https://react.dev/blog/2024/12/05/react-19)
- [TypeScript 5.0 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/)
