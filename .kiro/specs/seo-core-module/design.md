# Design Document - SEO Core Module

## Overview

The SEO Core Module is a centralized system that provides comprehensive search engine optimization functionality for the
Ethnic Village Travel platform. It will be located in `src/core/seo/` and will handle dynamic metadata generation,
structured data (JSON-LD), social media tags (Open Graph, Twitter Cards), canonical URLs, hreflang tags, sitemap
generation, and robots.txt configuration.

The module is designed to be:

- **Type-safe**: Full TypeScript support with strict typing
- **Reusable**: Utility functions that can be used across all page types
- **Configurable**: Centralized configuration with environment-specific overrides
- **Extensible**: Easy to add new page types and structured data schemas
- **Performance-optimized**: Minimal runtime overhead with static generation where possible
- **i18n-aware**: Full support for Vietnamese and English locales

## Architecture

### Module Structure

```
src/core/seo/
├── index.ts                      # Main exports
├── config.ts                     # SEO configuration and defaults
├── types.ts                      # TypeScript type definitions
├── metadata/
│   ├── index.ts                  # Metadata generation utilities
│   ├── base.ts                   # Base metadata generator
│   ├── tour.ts                   # Tour-specific metadata
│   ├── article.ts                # Article-specific metadata
│   └── page.ts                   # Generic page metadata
├── structured-data/
│   ├── index.ts                  # Structured data utilities
│   ├── organization.ts           # Organization schema
│   ├── website.ts                # WebSite schema
│   ├── tourist-trip.ts           # TouristTrip schema (tours)
│   ├── article.ts                # Article/BlogPosting schema
│   ├── breadcrumb.ts             # BreadcrumbList schema
│   └── helpers.ts                # Common helpers for structured data
├── social/
│   ├── index.ts                  # Social media tag utilities
│   ├── open-graph.ts             # Open Graph tag generation
│   └── twitter.ts                # Twitter Card tag generation
├── links/
│   ├── index.ts                  # Link tag utilities
│   ├── canonical.ts              # Canonical URL generation
│   └── hreflang.ts               # Hreflang tag generation
├── sitemap/
│   ├── index.ts                  # Sitemap generation
│   ├── generator.ts              # Core sitemap logic
│   └── types.ts                  # Sitemap-specific types
├── robots/
│   ├── index.ts                  # Robots.txt generation
│   └── generator.ts              # Core robots.txt logic
└── utils/
    ├── index.ts                  # Utility exports
    ├── text.ts                   # Text processing utilities
    ├── url.ts                    # URL utilities
    └── image.ts                  # Image URL utilities
```

### Integration Points

The SEO module integrates with:

1. **Next.js Metadata API**: Uses Next.js 14's built-in metadata system
2. **i18n System**: Leverages `next-intl` for locale-aware URLs and content
3. **Tour API**: Fetches tour data for metadata and structured data
4. **Article API**: Fetches article data for metadata and structured data
5. **Environment Configuration**: Uses environment variables for site-wide settings

## Components and Interfaces

### Core Types

```typescript
// src/core/seo/types.ts

export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultLocale: string;
  locales: string[];
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  defaultImage: string;
  twitterHandle?: string;
  facebookAppId?: string;
  organizationName: string;
  organizationLogo: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  locale?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface TourMetadata extends PageMetadata {
  tourId: number;
  tourName: string;
  tourSlug: string;
  price: number;
  currency: string;
  duration: number;
  location: string;
  ethnics: string[];
  rating?: number;
  reviewCount?: number;
  availableDates?: string[];
  images?: string[];
}

export interface ArticleMetadata extends PageMetadata {
  articleId: number;
  articleSlug: string;
  excerpt: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  tags?: string[];
  category?: string;
}

export interface StructuredDataBase {
  '@context': 'https://schema.org';
  '@type': string;
}

export interface OrganizationSchema extends StructuredDataBase {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    telephone?: string;
    email?: string;
  };
}

export interface TouristTripSchema extends StructuredDataBase {
  '@type': 'TouristTrip';
  name: string;
  description: string;
  image: string[];
  offers: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  itinerary?: {
    '@type': 'ItemList';
    itemListElement: Array<{
      '@type': 'ListItem';
      position: number;
      name: string;
      description: string;
    }>;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
  touristType?: string[];
  duration?: string;
}

export interface ArticleSchema extends StructuredDataBase {
  '@type': 'Article' | 'BlogPosting';
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export interface BreadcrumbSchema extends StructuredDataBase {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: {
    languages: Record<string, string>;
  };
}
```

### Configuration System

```typescript
// src/core/seo/config.ts

import { env } from '@/libs/env';

export const seoConfig: SEOConfig = {
  siteName: 'Ethnic Village Travel',
  siteUrl: env.NEXT_PUBLIC_SITE_URL || 'https://ethnicvillagetravel.com',
  defaultLocale: 'vi',
  locales: ['vi', 'en'],
  defaultTitle: 'Ethnic Village Travel - Khám phá vẻ đẹp các làng dân tộc Việt Nam',
  defaultDescription:
    'Đặt tour du lịch văn hóa dân tộc thiểu số Việt Nam. Trải nghiệm chân thực với cộng đồng Hmong, Thái, Mường và nhiều dân tộc khác.',
  defaultKeywords: [
    'du lịch dân tộc',
    'làng dân tộc Việt Nam',
    'tour Hmong',
    'tour Thái',
    'tour Mường',
    'văn hóa dân tộc',
    'ethnic village',
    'Vietnam ethnic tours',
  ],
  defaultImage: '/images/homepage_hero.jpg',
  twitterHandle: '@EthnicVillageVN',
  organizationName: 'Ethnic Village Travel',
  organizationLogo: '/icons/logo.svg',
  socialLinks: {
    facebook: 'https://facebook.com/ethnicvillagetravel',
    instagram: 'https://instagram.com/ethnicvillagetravel',
  },
};

// Locale-specific overrides
export const localeConfig: Record<string, Partial<SEOConfig>> = {
  en: {
    defaultTitle: "Ethnic Village Travel - Discover Vietnam's Ethnic Villages",
    defaultDescription:
      'Book authentic ethnic minority cultural tours in Vietnam. Experience genuine connections with Hmong, Thai, Muong, and other ethnic communities.',
    defaultKeywords: [
      'ethnic village tours',
      'Vietnam ethnic minorities',
      'Hmong tours',
      'Thai tours',
      'Muong tours',
      'cultural tourism Vietnam',
      'authentic ethnic experiences',
    ],
  },
};

export function getSEOConfig(locale?: string): SEOConfig {
  if (locale && localeConfig[locale]) {
    return { ...seoConfig, ...localeConfig[locale] };
  }
  return seoConfig;
}
```

### Metadata Generation

```typescript
// src/core/seo/metadata/base.ts

import type { Metadata } from 'next';

import { getSEOConfig } from '../config';
import type { PageMetadata } from '../types';
import { ensureAbsoluteUrl, truncateText } from '../utils';

export function generateBaseMetadata(data: Partial<PageMetadata>, locale?: string): Metadata {
  const config = getSEOConfig(locale);

  const title = data.title ? `${truncateText(data.title, 60)} | ${config.siteName}` : config.defaultTitle;

  const description = truncateText(data.description || config.defaultDescription, 160);

  const image = ensureAbsoluteUrl(data.image || config.defaultImage, config.siteUrl);

  return {
    title,
    description,
    keywords: data.keywords || config.defaultKeywords,
    robots: {
      index: !data.noindex,
      follow: !data.nofollow,
    },
    openGraph: {
      title: data.title || config.defaultTitle,
      description,
      url: config.siteUrl,
      siteName: config.siteName,
      images: [
        {
          url: image,
          alt: data.imageAlt || data.title || config.siteName,
        },
      ],
      locale: locale || config.defaultLocale,
      type: data.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title || config.defaultTitle,
      description,
      images: [image],
      creator: config.twitterHandle,
    },
  };
}
```

### Structured Data Generation

```typescript
// src/core/seo/structured-data/tourist-trip.ts

import type { Tour } from '@/types/tour.type';

import { getSEOConfig } from '../config';
import type { TouristTripSchema } from '../types';
import { ensureAbsoluteUrl, formatISO8601Duration } from '../utils';

export function generateTouristTripSchema(tour: Tour, locale: string): TouristTripSchema {
  const config = getSEOConfig(locale);
  const tourUrl = `${config.siteUrl}/${locale}/tour/${tour.slug}`;

  const schema: TouristTripSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.overview || '',
    image: [ensureAbsoluteUrl(tour.imageUrl, config.siteUrl)],
    offers: {
      '@type': 'Offer',
      price: tour.adultPrice || 0,
      priceCurrency: 'VND',
      availability:
        tour.availableDates && tour.availableDates.length > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: tourUrl,
    },
    duration: formatISO8601Duration(tour.duration),
  };

  // Add itinerary if timeline exists
  if (tour.timeline && tour.timeline.length > 0) {
    schema.itinerary = {
      '@type': 'ItemList',
      itemListElement: tour.timeline.map((day, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `Day ${day.day}`,
        description: day.activities.map(a => a.description).join('. '),
      })),
    };
  }

  // Add aggregate rating if reviews exist
  if (tour.avgRating && tour.ratingCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: tour.avgRating,
      reviewCount: tour.ratingCount,
    };
  }

  // Add tourist types based on ethnics
  if (tour.ethnics && tour.ethnics.length > 0) {
    schema.touristType = tour.ethnics.map(e => e.name);
  }

  return schema;
}
```

## Data Models

### SEO Configuration Model

The SEO configuration is stored in `src/core/seo/config.ts` and includes:

- Site-wide defaults (name, URL, description)
- Locale-specific overrides
- Social media handles
- Organization information
- Default images and branding

### Metadata Models

Metadata models are TypeScript interfaces that define the structure of SEO data:

- `PageMetadata`: Base metadata for any page
- `TourMetadata`: Extended metadata for tour pages
- `ArticleMetadata`: Extended metadata for article pages

### Structured Data Models

Structured data models follow Schema.org specifications:

- `OrganizationSchema`: Company/organization information
- `TouristTripSchema`: Tour product information
- `ArticleSchema`: Blog post/article information
- `BreadcrumbSchema`: Navigation breadcrumbs

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a
formal statement about what the system should do. Properties serve as the bridge between human-readable specifications
and machine-verifiable correctness guarantees._

### Property 1: Metadata completeness

_For any_ page data input, the generated metadata should contain title, description, and keywords fields **Validates:
Requirements 1.1**

### Property 2: Metadata truncation respects limits

_For any_ text input exceeding length limits, truncated output should be ≤ 60 chars for titles and ≤ 160 chars for
descriptions **Validates: Requirements 1.4**

### Property 3: Default metadata fallback

_For any_ page with undefined or empty metadata fields, the output should contain default values from configuration
**Validates: Requirements 1.5**

### Property 4: Tour metadata completeness

_For any_ tour object, the generated metadata should include tour name, description, location, duration, price, and
ethnic group information **Validates: Requirements 1.2, 11.1**

### Property 5: Article metadata completeness

_For any_ article object, the generated metadata should include title, excerpt, author, and publication date
**Validates: Requirements 1.3, 12.1**

### Property 6: Open Graph tags completeness

_For any_ page data, the generated Open Graph tags should include og:title, og:description, og:image, og:url, and
og:type **Validates: Requirements 2.1**

### Property 7: Open Graph locale tags

_For any_ page with multiple available locales, the Open Graph tags should include og:locale for current locale and
og:locale:alternate for all other locales **Validates: Requirements 2.5**

### Property 8: Image URLs are absolute

_For any_ relative image URL input, the output URL in Open Graph, Twitter Card, and structured data should be absolute
(starting with http:// or https://) **Validates: Requirements 2.4, 4.6, 10.4**

### Property 9: Twitter Card tags completeness

_For any_ page data, the generated Twitter Card tags should include twitter:card, twitter:title, twitter:description,
and twitter:image **Validates: Requirements 3.1**

### Property 10: Twitter Card type selection

_For any_ page with a prominent image, the twitter:card type should be "summary_large_image", otherwise "summary"
**Validates: Requirements 3.2, 3.3**

### Property 11: Twitter handle inclusion

_For any_ configuration with a defined Twitter handle, the Twitter Card tags should include twitter:site and
twitter:creator **Validates: Requirements 3.4**

### Property 12: Structured data type correctness

_For any_ tour page, the generated JSON-LD should have @type "TouristTrip"; for any article page, @type should be
"Article" or "BlogPosting" **Validates: Requirements 4.1, 4.2**

### Property 13: Structured data date formatting

_For any_ date value in structured data, the output should be in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ) **Validates:
Requirements 4.5**

### Property 14: Structured data price formatting

_For any_ price in structured data, the output should include both numeric value and currency code (e.g., "VND")
**Validates: Requirements 4.4**

### Property 15: Canonical URL generation

_For any_ page, the generated metadata should include a canonical URL that is absolute and properly formatted
**Validates: Requirements 5.1**

### Property 16: Canonical URL consistency

_For any_ page accessible via multiple URL variations (with/without trailing slash, with query params), all should
generate the same canonical URL **Validates: Requirements 5.2**

### Property 17: Canonical URL query parameter filtering

_For any_ URL with query parameters, the canonical URL should exclude non-essential parameters (tracking, session IDs)
**Validates: Requirements 5.4**

### Property 18: Hreflang tags completeness

_For any_ page with multiple language versions, the generated hreflang tags should include entries for all available
locales plus x-default **Validates: Requirements 6.1, 6.3**

### Property 19: Hreflang self-reference

_For any_ page with locale, the hreflang tags should include a self-referential tag for the current locale **Validates:
Requirements 6.2**

### Property 20: Hreflang URLs are absolute

_For any_ hreflang tag generated, the URL should be absolute and properly formatted **Validates: Requirements 6.4**

### Property 21: Sitemap URL completeness

_For any_ set of public pages, the generated sitemap should include entries for all provided pages **Validates:
Requirements 7.1, 7.2**

### Property 22: Sitemap priority assignment

_For any_ page type, the sitemap priority should match expected values (homepage: 1.0, main sections: 0.8, detail pages:
0.6) **Validates: Requirements 7.3**

### Property 23: Sitemap change frequency assignment

_For any_ content type, the sitemap changeFrequency should match expected values (homepage: daily, tours: weekly,
articles: monthly) **Validates: Requirements 7.4**

### Property 24: Sitemap lastModified presence

_For any_ sitemap entry, the lastModified field should be present and be a valid date **Validates: Requirements 7.5**

### Property 25: Sitemap locale URLs

_For any_ sitemap with multiple locales, all URLs should include the appropriate locale prefix **Validates: Requirements
7.6**

### Property 26: Sitemap splitting for large sites

_For any_ sitemap with more than 50,000 URLs, the output should be split into multiple sitemap files with a sitemap
index **Validates: Requirements 7.7**

### Property 27: Robots.txt format validity

_For any_ generated robots.txt, the output should be valid robots.txt format with User-agent and Allow/Disallow
directives **Validates: Requirements 8.1**

### Property 28: Robots.txt default allow

_For any_ production environment robots.txt, there should be an "Allow: /" directive for user-agent "\*" **Validates:
Requirements 8.2**

### Property 29: Robots.txt admin disallow

_For any_ robots.txt, admin paths (/admin, /api, /personal) should have "Disallow" directives **Validates: Requirements
8.3**

### Property 30: Robots.txt sitemap reference

_For any_ robots.txt, there should be a "Sitemap:" directive with the sitemap URL **Validates: Requirements 8.4**

### Property 31: Robots.txt environment-specific behavior

_For any_ non-production environment, robots.txt should contain "Disallow: /" for all user agents **Validates:
Requirements 8.5**

### Property 32: Configuration required fields

_For any_ SEO configuration, it should contain all required fields: siteName, siteUrl, defaultTitle, defaultDescription,
defaultImage **Validates: Requirements 9.2**

### Property 33: Configuration locale overrides

_For any_ locale-specific configuration request, the returned config should merge locale overrides with base config
**Validates: Requirements 9.5**

### Property 34: Social media tag merging

_For any_ partial social media data merged with defaults, all required fields should be present in the output
**Validates: Requirements 10.3**

### Property 35: Text truncation word boundaries

_For any_ text truncated to a length limit, the truncation should occur at a word boundary (not mid-word) and include
ellipsis if truncated **Validates: Requirements 10.5**

### Property 36: Tour aggregate rating inclusion

_For any_ tour with reviews (avgRating and ratingCount > 0), the structured data should include aggregateRating with
ratingValue and reviewCount **Validates: Requirements 11.2**

### Property 37: Tour availability in structured data

_For any_ tour with available dates, the structured data offers should have availability set to "InStock", otherwise
"OutOfStock" **Validates: Requirements 11.3**

### Property 38: Tour images in structured data

_For any_ tour with multiple images, all images should appear in the structured data image array in the same order
**Validates: Requirements 11.4**

### Property 39: Article image in social tags

_For any_ article with a featured image, the image should appear in both Open Graph and Twitter Card tags **Validates:
Requirements 12.2**

### Property 40: Article tags as keywords

_For any_ article with tags or categories, those tags should appear in the metadata keywords array **Validates:
Requirements 12.3**

### Property 41: Article date handling

_For any_ article with both published and modified dates, the structured data should include both datePublished and
dateModified fields **Validates: Requirements 12.4**

## Error Handling

### Validation Errors

The SEO module should handle validation errors gracefully:

1. **Missing Required Data**: If required data is missing (e.g., tour without title), use fallback values and log
   warnings
2. **Invalid URLs**: If URLs are malformed, attempt to fix them or use default URLs
3. **Invalid Dates**: If dates are invalid, omit them from structured data rather than causing errors
4. **Image Loading Failures**: If images cannot be accessed, use default images

### Runtime Errors

1. **API Failures**: If tour/article APIs fail, generate basic metadata without dynamic content
2. **Configuration Errors**: If configuration is invalid, use hardcoded safe defaults
3. **Locale Errors**: If requested locale is unavailable, fall back to default locale

### Error Logging

All errors should be logged with appropriate context:

- Error type and message
- Page/component where error occurred
- Input data that caused the error
- Fallback behavior applied

## Testing Strategy

### Unit Testing

Unit tests will verify individual utility functions:

**Text Utilities:**

- `truncateText()` with various lengths and word boundaries
- `ensureAbsoluteUrl()` with relative and absolute URLs
- `formatISO8601Duration()` with different duration values

**Metadata Generation:**

- `generateBaseMetadata()` with complete and partial data
- `generateTourMetadata()` with various tour objects
- `generateArticleMetadata()` with various article objects

**Structured Data:**

- Each schema generator function with valid and edge case inputs
- JSON-LD output validation against Schema.org specs

**Configuration:**

- `getSEOConfig()` with different locales
- Configuration merging logic
- Environment variable override behavior

### Property-Based Testing

Property-based tests will verify universal properties across many random inputs using **fast-check** library
(JavaScript/TypeScript PBT library).

Each property-based test will:

- Run a minimum of 100 iterations with random inputs
- Be tagged with the format: `**Feature: seo-core-module, Property {number}: {property_text}**`
- Test one specific correctness property from the design document

**Key Property Tests:**

1. **Metadata Truncation**: Generate random long strings, verify truncation respects limits
2. **URL Absoluteness**: Generate random relative/absolute URLs, verify all outputs are absolute
3. **Required Fields**: Generate random page data, verify all required metadata fields are present
4. **Locale Handling**: Generate random locales, verify locale-specific behavior
5. **Structured Data Validity**: Generate random tours/articles, verify JSON-LD is valid
6. **Sitemap Generation**: Generate random page sets, verify all pages appear in sitemap
7. **Canonical URL Consistency**: Generate URL variations, verify same canonical output

### Integration Testing

Integration tests will verify the module works correctly with Next.js:

1. **Metadata API Integration**: Test that generated metadata works with Next.js Metadata API
2. **Sitemap Route**: Test that `/sitemap.xml` returns valid XML
3. **Robots Route**: Test that `/robots.txt` returns valid robots.txt
4. **Page Rendering**: Test that metadata appears correctly in rendered HTML
5. **Locale Routing**: Test that locale-specific URLs work correctly

### Test Coverage Goals

- Unit test coverage: >90% for utility functions
- Property test coverage: All 41 correctness properties
- Integration test coverage: All public APIs and routes
- Edge case coverage: Empty data, missing fields, invalid inputs

## Implementation Notes

### Performance Considerations

1. **Caching**: Metadata generation results should be cached where possible
2. **Static Generation**: Use Next.js static generation for sitemap and robots.txt
3. **Lazy Loading**: Only generate structured data when needed
4. **Memoization**: Memoize expensive operations like URL transformations

### Accessibility

1. **Image Alt Text**: Always provide meaningful alt text for images in metadata
2. **Semantic HTML**: Ensure structured data enhances, not replaces, semantic HTML
3. **Screen Reader Compatibility**: Metadata should not interfere with screen readers

### Security

1. **XSS Prevention**: Sanitize all user-generated content in metadata
2. **URL Validation**: Validate and sanitize all URLs to prevent injection attacks
3. **Content Security Policy**: Ensure metadata complies with CSP headers

### Internationalization

1. **Locale-Aware URLs**: All URLs should include locale prefix
2. **Translated Content**: Metadata should use translated strings from i18n system
3. **RTL Support**: Consider right-to-left languages in text processing

### Maintenance

1. **Schema.org Updates**: Monitor Schema.org for new types and properties
2. **Search Engine Guidelines**: Stay updated with Google, Bing SEO guidelines
3. **Social Platform Changes**: Monitor Open Graph and Twitter Card spec changes
4. **Performance Monitoring**: Track metadata generation performance in production
