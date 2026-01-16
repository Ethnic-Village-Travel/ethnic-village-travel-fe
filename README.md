# Ethnic Village Travel - Frontend

Next.js 14 frontend for the Ethnic Village Travel platform, a booking system for exploring Vietnamese ethnic culture.

## Quick Start

### Prerequisites
- Node.js 18+
- npm / pnpm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view.

## Commands
- `npm run dev`: Start dev server.
- `npm run build`: Build for production.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint.
- `npm run format`: Format code with Prettier.
- `npm test`: Run tests with Vitest.

## Project Structure
- `src/app/[locale]/`: App Router (Marketing, Admin, Personal).
- `src/components/`: UI, Shared, and Feature-based components.
- `src/core/`: API layer, constants, and global types.
- `src/hooks/`: Custom React hooks and TanStack Query wrappers.
- `src/libs/`: 3rd-party configs (i18n, schemas, auth).
- `src/stores/`: Zustand state management.

## Documentation
Comprehensive documentation is available in the `docs/` directory:
- [Project Overview & PDR](./docs/project-overview-pdr.md)
- [Codebase Summary](./docs/codebase-summary.md)
- [Code Standards](./docs/code-standards.md)
- [System Architecture](./docs/system-architecture.md)

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **State**: Zustand, TanStack Query, nuqs
- **UI**: Tailwind CSS, Radix UI, shadcn/ui, Framer Motion
- **Forms**: React Hook Form, Zod
- **API**: Axios
- **i18n**: next-intl
- **Testing**: Vitest, React Testing Library

## Development Workflow
1. Create a feature branch from `dev`.
2. Follow [Code Standards](./docs/code-standards.md).
3. Ensure linting and tests pass.
4. Open a PR to `dev`.
