# Manual Testing Checklist - Dependency Update (Next.js 15 + React 19)

## 1. Core Functionality
- [ ] Home page renders correctly with all marketing sections
- [ ] Authentication flow (Login/Logout) works as expected
- [ ] Protected routes (Personal/Admin) are correctly guarded
- [ ] Internationalization (i18n) - Switching languages (VI/EN) works across all pages
- [ ] Navigation - All links in header and footer work correctly

## 2. Feature-Specific Verification
- [ ] **Tour Listing & Detail**:
    - [ ] Tour list renders with correct filters
    - [ ] Tour detail page opens correctly (Async Params check)
    - [ ] Booking flow - Able to select tickets and proceed to checkout
- [ ] **Articles & Blog**:
    - [ ] Article list renders
    - [ ] Article detail page opens correctly (Async Params check)
- [ ] **Admin Dashboard**:
    - [ ] Dashboard charts render correctly (Recharts)
    - [ ] Data tables load and paginate correctly (TanStack Table + nuqs)
    - [ ] Edit forms for Tours/Articles/Promotions work (Async Params check)
    - [ ] Date pickers function correctly (React Day Picker)

## 3. Technical Regression
- [ ] Server-Side Rendering (SSR) - Check for hydration errors in browser console
- [ ] Client-side state - Zustand stores maintain state across navigation
- [ ] API calls - Axios instance correctly handles authentication and error codes
- [ ] Animations - Framer Motion animations trigger correctly
- [ ] Responsive design - Layout holds up on mobile/tablet breakpoints

## 4. Performance & Console
- [ ] Check browser console for React 19 / Next.js 15 warnings
- [ ] Verify image loading and optimization
- [ ] Check for any visible flash of unstyled content (FOUC)

