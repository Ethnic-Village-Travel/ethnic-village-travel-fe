# Project Roadmap - Ethnic Village Travel Frontend

## Phase 1: Infrastructure & Foundation (Current)
- [x] Initial Project Setup (Next.js 14, App Router)
- [x] Internationalization (next-intl)
- [x] State Management (Zustand, TanStack Query)
- [x] Design System Foundation (Tailwind CSS, Radix UI)
- [x] Authentication Infrastructure
- [x] Dependency Maintenance: Phase 1 Safe Updates (22 packages) ✅ 2026-01-17

## Phase 2: Core Feature Implementation
- [ ] Admin Dashboard Migration (ESLint 9, Flat Config)
- [ ] Framework Upgrade (Next.js 15, React 19)
- [ ] Enhanced Booking Workflow
- [ ] Tour Content Management System
- [ ] Advanced User Profiles

## Phase 3: Optimization & Scale
- [ ] Performance Optimization (Core Web Vitals)
- [ ] Advanced Search & Filtering
- [ ] Real-time Chat Improvements
- [ ] Tailwind CSS v4 Migration (Deferred)

---

## Progress Overview
- Infrastructure: 95%
- Core Features: 40%
- Optimization: 10%

---

## Changelog

### [Unreleased]

#### Added
- `rehype-raw@7.0.0` for HTML parsing in markdown

#### Changed
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
