/**
 * SEO Core Module
 *
 * A comprehensive SEO solution for Next.js applications providing:
 * - Dynamic metadata generation (title, description, keywords)
 * - Open Graph and Twitter Card tags for social media
 * - Structured data (JSON-LD) for rich search results
 * - Canonical URLs and hreflang tags for internationalization
 * - Sitemap and robots.txt generation
 *
 * @module @/core/seo
 * @see {@link https://github.com/your-org/ethnic-village-travel/tree/main/src/core/seo/README.md|Documentation}
 *
 * @example
 * ```typescript
 * import { generateBaseMetadata, generateTourMetadata } from '@/core/seo';
 *
 * // Generate basic page metadata
 * const metadata = generateBaseMetadata({
 *   title: 'About Us',
 *   description: 'Learn about our mission',
 * }, 'en');
 *
 * // Generate tour-specific metadata
 * const tourMetadata = await generateTourMetadata('hmong-village-tour', 'vi');
 * ```
 */

// Configuration
export * from './config';

// Link tags (canonical, hreflang)
export * from './links';

// Metadata generation
export * from './metadata';

// Robots.txt generation
export * from './robots';

// Sitemap generation
export * from './sitemap';

// Social media tags (Open Graph, Twitter Cards)
export * from './social';

// Structured data (JSON-LD)
export * from './structured-data';

// Type definitions
export * from './types';

// Utility functions
export * from './utils';
