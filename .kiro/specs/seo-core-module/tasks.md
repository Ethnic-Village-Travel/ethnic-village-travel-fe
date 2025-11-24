# Implementation Plan - SEO Core Module

- [x] 1. Set up core SEO module structure and configuration

  - Create directory structure at `src/core/seo/`
  - Create TypeScript type definitions in `types.ts`
  - Implement SEO configuration system in `config.ts` with default values and locale overrides
  - Set up environment variable support for site URL and other config values
  - _Requirements: 9.2, 9.4, 9.5_

- [ ]\* 1.1 Write property test for configuration

  - **Property 32: Configuration required fields**
  - **Validates: Requirements 9.2**

- [ ]\* 1.2 Write property test for locale overrides

  - **Property 33: Configuration locale overrides**
  - **Validates: Requirements 9.5**

- [x] 2. Implement utility functions

  - Create `utils/text.ts` with text truncation function that respects word boundaries
  - Create `utils/url.ts` with absolute URL conversion and query parameter filtering
  - Create `utils/image.ts` with image URL processing utilities
  - _Requirements: 10.4, 10.5_

- [ ]\* 2.1 Write property test for text truncation

  - **Property 2: Metadata truncation respects limits**
  - **Property 35: Text truncation word boundaries**
  - **Validates: Requirements 1.4, 10.5**

- [ ]\* 2.2 Write property test for URL utilities

  - **Property 8: Image URLs are absolute**
  - **Property 17: Canonical URL query parameter filtering**
  - **Validates: Requirements 2.4, 4.6, 5.4, 10.4**

- [x] 3. Implement base metadata generation

  - Create `metadata/base.ts` with base metadata generator function
  - Implement title, description, keywords generation with truncation
  - Implement default fallback logic when metadata is missing
  - Integrate with Next.js Metadata API types
  - _Requirements: 1.1, 1.4, 1.5_

- [ ]\* 3.1 Write property test for base metadata

  - **Property 1: Metadata completeness**
  - **Property 3: Default metadata fallback**
  - **Validates: Requirements 1.1, 1.5**

- [x] 4. Implement Open Graph tag generation

  - Create `social/open-graph.ts` with Open Graph tag generator
  - Implement og:title, og:description, og:image, og:url, og:type generation
  - Implement og:locale and og:locale:alternate for multi-language support
  - Ensure all image URLs are converted to absolute URLs
  - _Requirements: 2.1, 2.4, 2.5_

- [ ]\* 4.1 Write property test for Open Graph tags

  - **Property 6: Open Graph tags completeness**
  - **Property 7: Open Graph locale tags**
  - **Validates: Requirements 2.1, 2.5**

- [x] 5. Implement Twitter Card tag generation

  - Create `social/twitter.ts` with Twitter Card generator
  - Implement twitter:card, twitter:title, twitter:description, twitter:image generation
  - Implement card type selection logic (summary_large_image vs summary)
  - Add conditional twitter:site and twitter:creator based on configuration
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]\* 5.1 Write property test for Twitter Cards

  - **Property 9: Twitter Card tags completeness**
  - **Property 10: Twitter Card type selection**
  - **Property 11: Twitter handle inclusion**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 6. Implement canonical URL and hreflang generation

  - Create `links/canonical.ts` with canonical URL generator
  - Implement query parameter filtering for canonical URLs
  - Create `links/hreflang.ts` with hreflang tag generator
  - Implement self-referential and x-default hreflang tags
  - Ensure all URLs are absolute and properly formatted
  - _Requirements: 5.1, 5.2, 5.4, 6.1, 6.2, 6.3, 6.4_

- [ ]\* 6.1 Write property test for canonical URLs

  - **Property 15: Canonical URL generation**
  - **Property 16: Canonical URL consistency**
  - **Validates: Requirements 5.1, 5.2**

- [ ]\* 6.2 Write property test for hreflang tags

  - **Property 18: Hreflang tags completeness**
  - **Property 19: Hreflang self-reference**
  - **Property 20: Hreflang URLs are absolute**
  - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

- [x] 7. Implement structured data generators - Organization and WebSite

  - Create `structured-data/helpers.ts` with common structured data utilities
  - Create `structured-data/organization.ts` with Organization schema generator
  - Create `structured-data/website.ts` with WebSite schema generator
  - Implement date formatting in ISO 8601 format
  - _Requirements: 4.3, 4.5_

- [ ]\* 7.1 Write property test for structured data date formatting

  - **Property 13: Structured data date formatting**
  - **Validates: Requirements 4.5**

- [x] 8. Implement structured data generator for tours

  - Create `structured-data/tourist-trip.ts` with TouristTrip schema generator
  - Implement price formatting with currency codes
  - Implement itinerary generation from tour timeline
  - Implement aggregate rating inclusion when reviews exist
  - Implement availability status based on available dates
  - Ensure all image URLs are absolute
  - _Requirements: 4.1, 4.4, 4.6, 11.2, 11.3, 11.4_

- [ ]\* 8.1 Write property test for TouristTrip schema

  - **Property 12: Structured data type correctness (tours)**
  - **Property 14: Structured data price formatting**
  - **Property 36: Tour aggregate rating inclusion**
  - **Property 37: Tour availability in structured data**
  - **Property 38: Tour images in structured data**
  - **Validates: Requirements 4.1, 4.4, 11.2, 11.3, 11.4**

- [x] 9. Implement structured data generator for articles

  - Create `structured-data/article.ts` with Article/BlogPosting schema generator
  - Implement author information with Person schema
  - Implement publisher information with Organization schema
  - Handle both published and modified dates
  - _Requirements: 4.2, 12.4, 12.5_

- [ ]\* 9.1 Write property test for Article schema

  - **Property 12: Structured data type correctness (articles)**
  - **Property 41: Article date handling**
  - **Validates: Requirements 4.2, 12.4**

- [x] 10. Implement breadcrumb structured data

  - Create `structured-data/breadcrumb.ts` with BreadcrumbList schema generator
  - Implement breadcrumb item generation with position and URL
  - _Requirements: 4.7_

- [x] 11. Implement tour-specific metadata generation

  - Create `metadata/tour.ts` with tour metadata generator
  - Implement tour name, description, location, duration, price metadata
  - Integrate with Open Graph and Twitter Card generators for tour-specific data
  - Integrate with TouristTrip structured data generator
  - _Requirements: 1.2, 2.2, 11.1_

- [ ]\* 11.1 Write property test for tour metadata

  - **Property 4: Tour metadata completeness**
  - **Validates: Requirements 1.2, 11.1**

- [x] 12. Implement article-specific metadata generation

  - Create `metadata/article.ts` with article metadata generator
  - Implement article title, excerpt, author, publication date metadata
  - Implement tags/categories as keywords
  - Ensure featured image appears in Open Graph and Twitter Card tags
  - Integrate with Article structured data generator
  - _Requirements: 1.3, 2.3, 12.1, 12.2, 12.3_

- [ ]\* 12.1 Write property test for article metadata

  - **Property 5: Article metadata completeness**
  - **Property 39: Article image in social tags**
  - **Property 40: Article tags as keywords**
  - **Validates: Requirements 1.3, 12.1, 12.2, 12.3**

- [x] 13. Implement sitemap generation

  - Create `sitemap/types.ts` with sitemap-specific types
  - Create `sitemap/generator.ts` with core sitemap generation logic
  - Implement priority assignment based on page type
  - Implement change frequency assignment based on content type
  - Include lastModified timestamps for all URLs
  - Implement locale-specific URL generation
  - Implement sitemap splitting for sites with >50,000 URLs
  - Create `src/app/sitemap.ts` to integrate with Next.js sitemap route
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ]\* 13.1 Write property test for sitemap generation

  - **Property 21: Sitemap URL completeness**
  - **Property 22: Sitemap priority assignment**
  - **Property 23: Sitemap change frequency assignment**
  - **Property 24: Sitemap lastModified presence**
  - **Property 25: Sitemap locale URLs**
  - **Property 26: Sitemap splitting for large sites**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7**

- [x] 14. Implement robots.txt generation

  - Create `robots/generator.ts` with robots.txt generation logic
  - Implement default allow rules for public pages
  - Implement disallow rules for admin, API, and private pages
  - Include sitemap URL reference
  - Implement environment-specific behavior (disallow all in non-production)
  - Update `src/app/robots.ts` to use the new generator
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]\* 14.1 Write property test for robots.txt

  - **Property 27: Robots.txt format validity**
  - **Property 28: Robots.txt default allow**
  - **Property 29: Robots.txt admin disallow**
  - **Property 30: Robots.txt sitemap reference**
  - **Property 31: Robots.txt environment-specific behavior**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

- [x] 15. Integrate SEO module with tour pages

  - Update `src/app/[locale]/(marketing)/tour/[slug]/page.tsx` to use tour metadata generator
  - Add generateMetadata function that fetches tour data and generates metadata
  - Add TouristTrip structured data to tour detail page
  - Add breadcrumb structured data for tour pages
  - _Requirements: 1.2, 2.2, 4.1, 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 16. Integrate SEO module with article pages

  - Update `src/app/[locale]/(marketing)/article/[slug]/page.tsx` to use article metadata generator
  - Add generateMetadata function that fetches article data and generates metadata
  - Add Article structured data to article detail page
  - Add breadcrumb structured data for article pages
  - _Requirements: 1.3, 2.3, 4.2, 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 17. Integrate SEO module with homepage

  - Update `src/app/[locale]/(marketing)/page.tsx` to use base metadata generator
  - Add Organization and WebSite structured data to homepage
  - Ensure proper Open Graph and Twitter Card tags
  - _Requirements: 4.3_

- [x] 18. Integrate SEO module with other marketing pages

  - Update about, contact, services pages with appropriate metadata
  - Add breadcrumb structured data where applicable
  - Ensure all pages have canonical URLs and hreflang tags
  - _Requirements: 1.1, 5.1, 6.1_

- [x] 19. Add SEO module exports and documentation

  - Create `src/core/seo/index.ts` with all public exports
  - Add JSDoc comments to all public functions
  - Create README.md in `src/core/seo/` with usage examples
  - Document configuration options and environment variables

- [ ] 20. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
