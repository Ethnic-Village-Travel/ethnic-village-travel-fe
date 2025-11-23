# Implementation Plan - Static Marketing Pages

- [x] 1. Set up i18n messages and shared components

  - Add translation keys for all three pages (about, services, contact) to vi.json and en.json
  - Create PageHero shared component for hero sections
  - Create SectionContainer shared component for consistent section spacing
  - _Requirements: 4.3, 5.1, 5.2_

- [x] 2. Implement About page
- [x] 2.1 Create About page route and basic structure

  - Create page.tsx file at src/app/[locale]/(marketing)/about/
  - Set up page metadata and layout
  - Import and use marketing layout
  - _Requirements: 1.1, 4.2_

- [x] 2.2 Create About page components

  - Create AboutHero component with background image and title
  - Create AboutMission component for mission statement
  - Create AboutValues component with value cards in grid layout
  - Create AboutStats component for statistics display
  - Create AboutCTA component for call-to-action section
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2.3 Integrate About components into page

  - Wire up all About components in page.tsx
  - Ensure responsive layout across breakpoints
  - Test i18n integration with language switcher
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.3_

- [x] 3. Implement Services page
- [x] 3.1 Create Services page route and basic structure

  - Create page.tsx file at src/app/[locale]/(marketing)/services/
  - Set up page metadata and layout
  - Import and use marketing layout
  - _Requirements: 2.1, 4.2_

- [x] 3.2 Create Services page components

  - Create ServicesHero component with background image and title
  - Create ServiceCard component for individual services
  - Create ServicesList component to organize services by category
  - Define service data structure with icons, titles, descriptions
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3.3 Integrate Services components into page

  - Wire up all Services components in page.tsx
  - Add service data for all categories (tour booking, custom tours, guides, additional services)
  - Ensure responsive grid layout
  - Add CTAs linking to tour listing or contact page
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 4.1_

- [x] 4. Implement Contact page
- [x] 4.1 Create Contact page route and basic structure

  - Create page.tsx file at src/app/[locale]/(marketing)/contact/
  - Set up page metadata and layout
  - Import and use marketing layout
  - _Requirements: 3.1, 4.2_

- [x] 4.2 Create contact form schema and validation

  - Create contact form Zod schema in src/libs/schemas/contact.ts
  - Define validation rules for name, email, phone, subject, message
  - Add i18n keys for validation error messages
  - _Requirements: 3.5, 5.1_

- [x] 4.3 Create Contact page components

  - Create ContactHero component with background image and title
  - Create ContactInfo component displaying contact details
  - Create ContactForm component with React Hook Form integration
  - Add form validation and error display
  - Add success/error toast notifications
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4.4 Integrate Contact components into page

  - Wire up all Contact components in page.tsx
  - Implement form submission handler (client-side for now)
  - Add business hours and social media links
  - Ensure responsive two-column layout (form + info)
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1_

- [ ] 5. Add responsive design and accessibility
- [ ] 5.1 Implement responsive layouts

  - Test all pages on mobile (< 640px)
  - Test all pages on tablet (640px - 1024px)
  - Test all pages on desktop (> 1024px)
  - Fix any layout issues or horizontal scrolling
  - _Requirements: 4.1_

- [ ] 5.2 Add accessibility features

  - Add proper heading hierarchy (h1, h2, h3) to all pages
  - Add alt text to all images
  - Add ARIA labels to interactive elements
  - Ensure keyboard navigation works properly
  - Add focus indicators to all interactive elements
  - _Requirements: 4.4, 4.5_

- [ ] 6. Optimize images and performance

  - Add hero background images to public/images/
  - Optimize images for web (compress, convert to WebP)
  - Use Next.js Image component with proper sizes
  - Add loading states where appropriate
  - _Requirements: 4.1, 4.2_

- [ ] 7. Add SEO metadata

  - Add page titles and descriptions for each page
  - Add Open Graph tags for social sharing
  - Ensure proper meta tags for both languages
  - _Requirements: 4.2, 4.3_

- [ ] 8. Final integration and polish
- [ ] 8.1 Test navigation between pages

  - Verify header navigation highlights current page
  - Test language switching on all pages
  - Verify footer links work correctly
  - _Requirements: 4.2, 4.3_

- [ ] 8.2 Cross-browser testing

  - Test on Chrome, Firefox, Safari
  - Fix any browser-specific issues
  - Verify consistent styling across browsers
  - _Requirements: 4.1, 4.2_

- [ ] 8.3 Final review and adjustments

  - Review all pages for consistency with design system
  - Check all i18n translations are correct
  - Verify all links and CTAs work properly
  - Test contact form submission flow end-to-end
  - _Requirements: 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
