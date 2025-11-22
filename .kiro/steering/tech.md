# Tech Stack

## Framework & Runtime

- **Next.js 14** (App Router) - React framework with server-side rendering
- **React 18** - UI library
- **TypeScript 5** - Type-safe JavaScript

## State Management & Data Fetching

- **TanStack Query (React Query)** - Server state management and caching
- **Zustand** - Client state management
- **React Hook Form** - Form state and validation
- **Zod** - Schema validation

## UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **class-variance-authority (CVA)** - Component variant management

## Internationalization

- **next-intl** - i18n with routing support
- Supported locales: `vi` (default), `en`
- Messages in `src/messages/{locale}.json`

## Data Tables

- **TanStack Table** - Headless table library
- Custom data-table components in `src/components/shared/data-table`

## API & HTTP

- **Axios** - HTTP client
- API base URL: `process.env.NEXT_PUBLIC_SERVER_URI`
- Timeout: 150s

## Development Tools

- **ESLint** - Linting (@antfu/eslint-config)
- **Prettier** - Code formatting
- **Docker** - Containerization support

## Common Commands

```bash
# Development
yarn dev              # Start dev server (localhost:3000)

# Build & Production
yarn build            # Build for production
yarn start            # Start production server

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Fix ESLint issues
yarn format           # Format with Prettier
```
