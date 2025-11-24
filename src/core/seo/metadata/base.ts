import type { Metadata } from 'next';

import { getSEOConfig } from '../config';
import { generateLocalizedCanonicalUrl } from '../links/canonical';
import { generateHreflangAlternates } from '../links/hreflang';
import { generateOpenGraphTags } from '../social/open-graph';
import { generateTwitterCardTags } from '../social/twitter';
import type { PageMetadata } from '../types';
import { ensureAbsoluteUrl, truncateText } from '../utils';

/**
 * Generates base metadata for any page
 *
 * Creates comprehensive SEO metadata including title, description, keywords,
 * Open Graph tags, Twitter Cards, canonical URLs, and hreflang alternates.
 * Implements automatic truncation and provides sensible defaults.
 *
 * @param data - Partial page metadata to merge with defaults
 * @param locale - Locale code for locale-specific configuration (e.g., 'vi', 'en')
 * @param path - Current page path for canonical URL and hreflang (e.g., '/about')
 * @returns Next.js Metadata object ready to be exported from page.tsx
 *
 * @example
 * ```typescript
 * // In a Next.js page component
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   return generateBaseMetadata(
 *     {
 *       title: 'About Us',
 *       description: 'Learn about our mission to connect travelers with ethnic villages',
 *       image: '/images/about-hero.jpg',
 *     },
 *     params.locale,
 *     '/about'
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Minimal usage with defaults
 * const metadata = generateBaseMetadata({}, 'vi', '/');
 * // Uses default title, description, and image from config
 * ```
 */
export function generateBaseMetadata(data: Partial<PageMetadata> = {}, locale?: string, path?: string): Metadata {
  const config = getSEOConfig(locale);

  // Generate title with truncation and site name suffix
  const title = data.title ? `${truncateText(data.title, 60)} | ${config.siteName}` : config.defaultTitle;

  // Generate description with truncation
  const description = truncateText(data.description || config.defaultDescription, 160);

  // Use provided keywords or fall back to defaults
  const keywords = data.keywords || config.defaultKeywords;

  // Ensure image URL is absolute
  const image = ensureAbsoluteUrl(data.image || config.defaultImage, config.siteUrl);

  // Generate image alt text
  const imageAlt = data.imageAlt || data.title || config.siteName;

  // Build robots configuration
  const robots = {
    index: !data.noindex,
    follow: !data.nofollow,
  };

  // Build Open Graph metadata using the dedicated generator
  const openGraph = generateOpenGraphTags(
    {
      ...data,
      description,
      image,
      imageAlt,
    },
    locale,
    config.siteUrl,
  );

  // Build Twitter Card metadata using the dedicated generator
  const twitter = generateTwitterCardTags(
    {
      ...data,
      description,
      image,
      imageAlt,
    },
    locale,
  );

  // Build complete metadata object
  const metadata: Metadata = {
    title,
    description,
    keywords,
    robots,
    openGraph,
    twitter,
  };

  // Add canonical URL if path is provided
  if (path) {
    const currentLocale = locale || config.defaultLocale;
    const canonicalUrl = generateLocalizedCanonicalUrl(path, currentLocale, config.siteUrl);

    metadata.alternates = {
      canonical: canonicalUrl,
      // Add hreflang alternates for all available locales
      ...generateHreflangAlternates(path, currentLocale, config.locales, config.siteUrl, config.defaultLocale),
    };
  }

  return metadata;
}
