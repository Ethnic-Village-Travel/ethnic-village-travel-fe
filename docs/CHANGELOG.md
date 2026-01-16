# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-01-17

### Added
- `rehype-raw@^7.0.0` added to dependencies for improved markdown rendering support.

### Changed
- **Dependency Update (Phase 1)**: Systematically updated 22 dependencies to their latest patch or minor versions to improve stability and security.
  - Core: `@tanstack/react-query`, `framer-motion`, `next-intl`, `zustand`
  - Forms/UI: `react-hook-form`, `lucide-react`, `recharts`, `react-day-picker`
  - Utilities: `nuqs`, `@t3-oss/env-nextjs`, `fast-check`
  - Tooling: `prettier`, `vitest`, `@ianvs/prettier-plugin-sort-imports`
- Verified project build and linting status remain healthy following updates.

### Fixed
- Resolved missing `rehype-raw` dependency error.

### Security
- Audit identified 3 pre-existing vulnerabilities in legacy packages (`quill`, `xlsx`). Mitigation strategies documented in dependency update plan.
