# Project Overview & PDR - Ethnic Village Travel Frontend

## Project Vision
Ethnic Village Travel is a specialized travel booking platform dedicated to showcasing and facilitating tourism in Vietnamese ethnic villages. The platform aims to connect travelers with authentic cultural experiences while providing local communities with a sustainable tourism management tool.

## Target Users
1. **Travelers (Tourists)**: Individuals or groups looking for authentic cultural tours, information about ethnic villages, and easy booking/payment processes.
2. **Admin Staff**: Platform administrators managing tours, articles, bookings, promotions, and user roles.
3. **Guides/Employees**: Staff members assigned to specific tours and departures.

## Core Features
- **Tour Discovery**: Browse and search for tours by village, ethnic group, or category.
- **Booking Flow**: Streamlined reservation system with promotion application and payment integration.
- **Article/Blog CMS**: Rich content about ethnic cultures, travel tips, and village highlights.
- **Admin Dashboard**: Comprehensive management of tours, schedules, assignments, and analytics.
- **RBAC (Role-Based Access Control)**: Granular permission management for different staff roles.
- **Internationalization (i18n)**: Full support for Vietnamese (default) and English.
- **User Accounts**: Personal profiles, booking history, and notification management.

## Business Requirements
- Support for complex promotion logic (direct discounts, tiered pricing).
- Management of tour departures and guide assignments.
- Secure payment processing and order tracking.
- High SEO performance for marketing pages (Next.js App Router).
- Responsive design for mobile and desktop users.

## Technical Requirements
- **Framework**: Next.js 14 (App Router).
- **Language**: TypeScript (Strict mode).
- **Styling**: Tailwind CSS + shadcn/ui.
- **State Management**: Zustand (Client), TanStack Query (Server).
- **Internationalization**: next-intl for routing and messaging.
- **Validation**: Zod for form and environment variable validation.
- **Deployment**: Dockerized multi-stage build, standalone output.

## Unresolved Questions
- Specific payment gateways to be integrated (currently placeholder/generic implementation).
- Precise analytics requirements for the admin dashboard.
