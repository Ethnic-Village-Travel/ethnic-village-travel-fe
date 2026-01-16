# Code Standards & Best Practices

## TypeScript Patterns
- **Strict Mode**: Always enabled.
- **Types vs Interfaces**: Prefer `type` for simple definitions and `interface` for extendable object structures.
- **Explicit Returns**: Functions should have explicit return types.
- **Avoid `any`**: Use `unknown` or specific types/generics.

## Component Patterns
- **Composition**: Use the `children` prop and Radix-like patterns for flexible components.
- **Custom Hooks**: Extract logic into hooks; keep components focused on presentation.
- **SharedFormField**: Always use the shared form field wrapper for consistency in validation and styling.
- **Memoization**: Use `useMemo` and `useCallback` only when performance profiling indicates necessity.

## State Management
- **Server State**: Use TanStack Query (`useQuery`, `useMutation`) for all API-related data.
- **Client State**: Use Zustand for global UI state (auth, progress, sidebar).
- **URL State**: Use `nuqs` for pagination, filtering, and sorting to keep UI in sync with the address bar.

## API Integration
- **Axios Instance**: Always use the central `api` instance from `@/core/api/api`.
- **Error Handling**: Use the built-in interceptors for 401/403 handling.
- **Type Safety**: Define Request/Response types for every API call.

## Form Standards
- **Validation**: Every form must have a Zod schema in `src/libs/schemas/`.
- **Hook Form**: Use `react-hook-form` with the Zod resolver.
- **Submit Handling**: Loading states must be managed via `isSubmitting` or TanStack Mutation states.

## Testing Conventions
- **Location**: Co-locate `*.test.ts` or `*.spec.tsx` with the source file.
- **Tools**: Vitest + React Testing Library.
- **Focus**: Test user interactions and complex business logic; avoid testing third-party primitives.

## Naming Conventions
- **Variables/Functions**: `camelCase`.
- **Classes/Components**: `PascalCase`.
- **Constants**: `UPPER_SNAKE_CASE`.
- **Files**: See `codebase-summary.md`.

## Import/Export Patterns
- **Path Aliases**: Always use `@/` for internal imports.
- **Order**:
  1. React/Next.js core
  2. Third-party libraries
  3. UI components (`@/components/ui`)
  4. Features/Shared components
  5. Hooks/Stores
  6. Types/Constants/Utils
- **Named Exports**: Prefer named exports over default exports for better IDE support and refactoring.

## Unresolved Questions
- Documentation of specific animation (Framer Motion) standards.
- Guidelines for handling large-scale data exports (Excel/CSV).
