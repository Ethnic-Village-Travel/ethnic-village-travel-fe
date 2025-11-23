# Design Document - Static Marketing Pages

## Overview

This design document outlines the implementation of three static marketing pages for the Ethnic Village Travel platform:
About Us (Giới thiệu), Services (Dịch vụ), and Contact (Liên hệ). These pages will follow the existing design system,
maintain consistency with the current UI/UX patterns, and provide a professional, engaging experience for visitors.

The pages will be built using Next.js 14 App Router with TypeScript, integrate with the existing i18n system
(next-intl), and utilize the established component library and styling patterns.

## Architecture

### Page Structure

All three pages will follow a consistent architectural pattern:

```
src/app/[locale]/(marketing)/
  ├── about/
  │   └── page.tsx
  ├── services/
  │   └── page.tsx
  └── contact/
      └── page.tsx
```

### Component Structure

```
src/components/features/
  ├── about/
  │   ├── index.ts
  │   ├── about-hero.tsx
  │   ├── about-mission.tsx
  │   ├── about-values.tsx
  │   ├── about-stats.tsx
  │   └── about-cta.tsx
  ├── services/
  │   ├── index.ts
  │   ├── services-hero.tsx
  │   ├── service-card.tsx
  │   └── services-list.tsx
  └── contact/
      ├── index.ts
      ├── contact-hero.tsx
      ├── contact-info.tsx
      ├── contact-form.tsx
      └── contact-map.tsx
```

### Routing

- `/about` or `/en/about` - About Us page
- `/services` or `/en/services` - Services page
- `/contact` or `/en/contact` - Contact page

All routes will use the existing `(marketing)` layout which includes the header, footer, and chatbot.

## Components and Interfaces

### Shared Components

#### PageHero Component

A reusable hero section component for all static pages.

```typescript
interface PageHeroProps {
  title: string;
  description?: string;
  backgroundImage: string;
  className?: string;
}
```

**Features:**

- Full-width background image with overlay
- Centered title and optional description
- Responsive typography
- Consistent with existing HeroSection pattern

#### SectionContainer Component

A wrapper component for page sections with consistent spacing.

```typescript
interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray';
}
```

### About Page Components

#### AboutMission Component

Displays the company's mission statement and introduction.

```typescript
interface AboutMissionProps {
  className?: string;
}
```

**Content:**

- Mission statement
- Company introduction
- Founding story

#### AboutValues Component

Displays core values in a card grid layout.

```typescript
interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
```

**Features:**

- Grid layout (2 columns on mobile, 3-4 on desktop)
- Icon + title + description format
- Hover effects

#### AboutStats Component

Displays key statistics and achievements.

```typescript
interface StatItemProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}
```

**Metrics:**

- Years of experience
- Tours completed
- Happy customers
- Ethnic villages partnered

#### AboutCTA Component

Call-to-action section encouraging users to explore tours.

```typescript
interface AboutCTAProps {
  className?: string;
}
```

### Services Page Components

#### ServiceCard Component

Individual service card with icon, title, and description.

```typescript
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
}
```

**Features:**

- Icon/image at top
- Title and description
- Optional feature list
- Optional CTA button
- Hover effects with shadow

#### ServicesList Component

Container for organizing services into categories.

```typescript
interface ServicesListProps {
  className?: string;
}
```

**Service Categories:**

1. **Tour Booking Services**

   - Browse and book ethnic village tours
   - Multiple ethnic group options
   - Flexible date selection

2. **Custom Tour Planning**

   - Personalized itineraries
   - Group tour arrangements
   - Special requests accommodation

3. **Professional Guide Services**

   - Experienced local guides
   - Multi-language support
   - Cultural expertise

4. **Additional Services**
   - Transportation arrangements
   - Accommodation booking
   - Travel insurance

### Contact Page Components

#### ContactInfo Component

Displays contact information in an organized layout.

```typescript
interface ContactInfoProps {
  className?: string;
}

interface ContactInfoItemProps {
  icon: React.ReactNode;
  title: string;
  content: string | string[];
  link?: string;
}
```

**Information Displayed:**

- Phone number(s)
- Email address
- Physical address
- Business hours
- Social media links

#### ContactForm Component

Form for visitors to send messages.

```typescript
interface ContactFormProps {
  className?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
```

**Form Fields:**

- Name (required)
- Email (required, validated)
- Phone (required, validated)
- Subject (required)
- Message (required, min 10 characters)

**Validation:**

- Uses React Hook Form + Zod
- Real-time validation
- Error messages in selected language

**Submission:**

- Client-side validation
- Success/error toast notifications
- Form reset on success

## Data Models

### Contact Form Schema

```typescript
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Invalid phone number'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

### Service Data Model

```typescript
interface Service {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  features: string[];
  ctaLink?: string;
}
```

### Value Data Model

```typescript
interface Value {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
}
```

### Stat Data Model

```typescript
interface Stat {
  id: string;
  value: string;
  labelKey: string;
  icon?: string;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a
formal statement about what the system should do. Properties serve as the bridge between human-readable specifications
and machine-verifiable correctness guarantees._

### Property 1: Hero section renders on all pages

_For any_ static page (about, services, contact), when the page loads, a hero section with title and background image
should be displayed. **Validates: Requirements 1.1, 2.1, 3.1**

### Property 2: Responsive layout across devices

_For any_ static page and any viewport size (mobile, tablet, desktop), the content should be displayed in a responsive
layout without horizontal scrolling or broken layouts. **Validates: Requirements 4.1**

### Property 3: Internationalization consistency

_For any_ static page and any supported language (vi, en), all text content should be displayed in the selected language
using i18n keys. **Validates: Requirements 4.3**

### Property 4: Contact form validation

_For any_ contact form submission with invalid data (empty required fields, invalid email, invalid phone), the form
should display appropriate validation errors and prevent submission. **Validates: Requirements 3.5**

### Property 5: Contact form success handling

_For any_ contact form submission with valid data, the form should submit successfully, display a success message, and
reset the form fields. **Validates: Requirements 3.4**

### Property 6: Navigation consistency

_For any_ static page, the header navigation should highlight the current page and maintain consistent styling with the
rest of the site. **Validates: Requirements 4.2**

### Property 7: Component reusability

_For any_ shared component (PageHero, SectionContainer), it should be usable across multiple pages without modification.
**Validates: Requirements 5.2**

### Property 8: Accessibility compliance

_For any_ interactive element on static pages, it should provide appropriate hover states, focus indicators, and ARIA
labels. **Validates: Requirements 4.5**

## Error Handling

### Form Validation Errors

**Client-side validation:**

- Display inline error messages below each field
- Highlight invalid fields with red border
- Show error summary at top of form if multiple errors
- Use i18n for error messages

**Example error messages:**

```typescript
const errorMessages = {
  name: {
    required: t('contact.form.errors.name_required'),
    minLength: t('contact.form.errors.name_min_length'),
  },
  email: {
    required: t('contact.form.errors.email_required'),
    invalid: t('contact.form.errors.email_invalid'),
  },
  // ... other fields
};
```

### Form Submission Errors

**Network errors:**

- Display toast notification with error message
- Keep form data intact for retry
- Provide retry button

**Server errors:**

- Display user-friendly error message
- Log detailed error for debugging
- Suggest alternative contact methods

### Image Loading Errors

**Hero images:**

- Provide fallback background color
- Use Next.js Image component with placeholder
- Optimize images for performance

### Missing Translation Errors

**Fallback strategy:**

- Display key name if translation missing
- Log warning in development
- Use Vietnamese as default fallback

## Testing Strategy

### Unit Testing

**Component tests:**

- Test each component renders correctly with props
- Test responsive behavior with different viewport sizes
- Test i18n integration with different locales
- Test form validation logic
- Test error states and edge cases

**Tools:**

- Jest for test runner
- React Testing Library for component testing
- Mock i18n for translation testing

**Example test cases:**

```typescript
describe('ContactForm', () => {
  it('should display validation errors for empty fields', () => {});
  it('should display error for invalid email format', () => {});
  it('should submit form with valid data', () => {});
  it('should reset form after successful submission', () => {});
  it('should display error message on submission failure', () => {});
});

describe('PageHero', () => {
  it('should render with title and background image', () => {});
  it('should render with optional description', () => {});
  it('should apply custom className', () => {});
});

describe('ServiceCard', () => {
  it('should render with icon, title, and description', () => {});
  it('should render optional features list', () => {});
  it('should render optional CTA button', () => {});
  it('should apply hover effects', () => {});
});
```

### Integration Testing

**Page-level tests:**

- Test complete page rendering
- Test navigation between pages
- Test form submission flow
- Test responsive behavior

**Example test cases:**

```typescript
describe('About Page', () => {
  it('should render all sections', () => {});
  it('should display content in selected language', () => {});
  it('should navigate to tours page from CTA', () => {});
});

describe('Contact Page', () => {
  it('should render contact form and info', () => {});
  it('should submit form and show success message', () => {});
  it('should handle form submission errors', () => {});
});
```

### Accessibility Testing

**Manual testing:**

- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus indicators

**Automated testing:**

- Use axe-core for accessibility violations
- Test ARIA labels and roles
- Test semantic HTML structure

### Visual Regression Testing

**Snapshot testing:**

- Capture screenshots of pages at different breakpoints
- Compare against baseline images
- Detect unintended visual changes

### Property-Based Testing

We will use **fast-check** as the property-based testing library for TypeScript/JavaScript.

**Configuration:**

- Minimum 100 iterations per property test
- Each property test will be tagged with the format: `**Feature: static-pages, Property {number}: {property_text}**`

**Property test examples:**

```typescript
import fc from 'fast-check';

describe('Property Tests', () => {
  it('**Feature: static-pages, Property 1: Hero section renders on all pages**', () => {
    fc.assert(
      fc.property(fc.constantFrom('about', 'services', 'contact'), pageName => {
        // Test that hero section renders for any page
      }),
      { numRuns: 100 },
    );
  });

  it('**Feature: static-pages, Property 4: Contact form validation**', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string(),
          email: fc.string(),
          phone: fc.string(),
          subject: fc.string(),
          message: fc.string(),
        }),
        formData => {
          // Test validation logic for any form data
        },
      ),
      { numRuns: 100 },
    );
  });
});
```

## Implementation Notes

### Styling Approach

**Use existing design system:**

- Colors: primary-500, dark, gray, white
- Typography: Roboto font family
- Spacing: Tailwind spacing scale
- Shadows: custom-gray, shadow-md
- Border radius: rounded-md, rounded-lg

**Responsive breakpoints:**

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Performance Optimization

**Image optimization:**

- Use Next.js Image component
- Provide appropriate sizes and srcset
- Use WebP format with fallbacks
- Lazy load images below fold

**Code splitting:**

- Use dynamic imports for heavy components
- Lazy load contact form until needed
- Split page-specific code from shared code

**SEO optimization:**

- Add meta tags for each page
- Use semantic HTML structure
- Add structured data where appropriate
- Optimize page titles and descriptions

### Internationalization

**Message keys structure:**

```json
{
  "about": {
    "hero": {
      "title": "...",
      "description": "..."
    },
    "mission": {
      "title": "...",
      "content": "..."
    },
    "values": {
      "title": "...",
      "items": [...]
    }
  },
  "services": {
    "hero": {...},
    "list": {...}
  },
  "contact": {
    "hero": {...},
    "form": {...},
    "info": {...}
  }
}
```

### Accessibility Considerations

**Semantic HTML:**

- Use proper heading hierarchy (h1, h2, h3)
- Use semantic elements (section, article, nav)
- Add alt text for all images
- Use proper form labels

**ARIA attributes:**

- Add aria-label for icon buttons
- Use aria-describedby for form errors
- Add role attributes where needed
- Ensure proper focus management

**Keyboard navigation:**

- All interactive elements keyboard accessible
- Visible focus indicators
- Logical tab order
- Skip links for main content

### Content Management

**Static content:**

- Store in i18n message files
- Use structured data format
- Easy to update without code changes

**Dynamic content (future):**

- Consider CMS integration for easier updates
- API endpoints for contact form submission
- Database storage for form submissions
