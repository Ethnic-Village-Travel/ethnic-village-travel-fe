# Project Roadmap - Ethnic Village Travel Frontend

## Phase 1: Infrastructure & Foundation ✅ COMPLETED
- [x] Initial Project Setup (Next.js 14, App Router)
- [x] Internationalization (next-intl)
- [x] State Management (Zustand, TanStack Query)
- [x] Design System Foundation (Tailwind CSS, Radix UI)
- [x] Authentication Infrastructure
- [x] Dependency Maintenance: Phase 1 Safe Updates (22 packages) ✅ 2026-01-17
- [x] Framework Upgrade (Next.js 14 → 15, React 18 → 19) ✅ 2026-01-17

## Phase 2: Core Feature Implementation (Current)
- [ ] Admin Dashboard Enhancements
- [ ] Enhanced Booking Workflow
- [ ] Tour Content Management System
- [ ] Advanced User Profiles

## Phase 3: Optimization & Scale (Future)
- [ ] Performance Optimization (Core Web Vitals)
- [ ] Advanced Search & Filtering
- [ ] Real-time Chat Improvements
- [ ] ESLint 9 Migration (Blocked - ecosystem compatibility)
- [ ] Tailwind CSS v4 Migration (Deferred - high complexity)
- [ ] Zod v4 Migration (Deferred - API changes)

---

## Progress Overview
- Infrastructure: 100% ✅
- Core Features: 20%
- Optimization: 0%

---

## Changelog

### [Unreleased]

#### Added
- `rehype-raw@7.0.0` for HTML parsing in markdown

#### Changed
- **Upgrade Framework to Next.js 15.5.9 & React 19.2.3** (Phase 2B)
  - Migrated 13 files to support Async Request APIs (`params`, `searchParams`, `cookies`, `headers`).
  - Updated `package.json` with React 19 types and Next.js 15 dependencies.
  - Refined `useRef` usage and removed deprecated `isRedirectError`.
  - Verified build, lint, and core functionality.
- Updated 22 dependencies to latest patch/minor versions (Phase 1)
  - @tanstack/react-query: 5.74.3 → 5.90.18
  - framer-motion: 12.23.26 → 12.26.2
  - next-intl: 4.0.2 → 4.7.0
  - react-hook-form: 7.56.3 → 7.71.1
  - lucide-react: 0.511.0 → 0.562.0
  - And 17 other packages.
- Build and Lint processes verified successful after updates.

#### Security
- Documented pre-existing vulnerabilities in `quill` and `xlsx`.
