import type { Metadata } from 'next';

import { getSEOConfig } from '../config';
import type { PageMetadata } from '../types';
import { ensureAbsoluteUrl } from '../utils';

export interface OpenGraphMetadata {
  title: string;
  description: string;
  url: string;
  siteName: string;
  images: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  locale: string;
  type: 'website' | 'article' | 'product';
  alternateLocales?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

/**
 * Generates Open Graph metadata for a page
 * @param data - Page metadata
 * @param locale - Current locale
 * @param url - Page URL (optional, will be constructed from config if not provided)
 * @returns Open Graph metadata object compatible with Next.js Metadata API
 */
export function generateOpenGraphTags(
  data: Partial<PageMetadata>,
  locale?: string,
  url?: string,
): Metadata['openGraph'] {
  const config = getSEOConfig(locale);
  const currentLocale = locale || config.defaultLocale;

  // Get all available locales except current one for alternates
  const alternateLocales = config.locales.filter(l => l !== currentLocale);

  // Ensure image URL is absolute
  const imageUrl = ensureAbsoluteUrl(data.image || config.defaultImage, config.siteUrl);

  // Build the page URL
  const pageUrl = url || config.siteUrl;

  // Determine the type - Next.js only supports 'website' and 'article' for og:type
  // 'product' is not a standard OpenGraph type in Next.js Metadata API
  const ogType = data.type === 'article' ? 'article' : 'website';

  const openGraphData = {
    title: data.title || config.defaultTitle,
    description: data.description || config.defaultDescription,
    url: pageUrl,
    siteName: config.siteName,
    images: [
      {
        url: imageUrl,
        alt: data.imageAlt || data.title || config.siteName,
      },
    ],
    locale: currentLocale,
    type: ogType,
    ...(alternateLocales.length > 0 && { alternateLocale: alternateLocales }),
  };

  return openGraphData;
}

/**
 * Generates Open Graph metadata with multiple images
 * @param data - Page metadata
 * @param images - Array of image URLs
 * @param locale - Current locale
 * @param url - Page URL
 * @returns Open Graph metadata with multiple images
 */
export function generateOpenGraphWithImages(
  data: Partial<PageMetadata>,
  images: string[],
  locale?: string,
  url?: string,
): Metadata['openGraph'] {
  const config = getSEOConfig(locale);
  const baseOpenGraph = generateOpenGraphTags(data, locale, url);

  // Convert all images to absolute URLs
  const absoluteImages = images
    .filter(img => img) // Remove empty strings
    .map(img => ({
      url: ensureAbsoluteUrl(img, config.siteUrl),
      alt: data.imageAlt || data.title || config.siteName,
    }));

  // Use provided images if available, otherwise fall back to default
  if (absoluteImages.length > 0) {
    return {
      ...baseOpenGraph,
      images: absoluteImages,
    };
  }

  return baseOpenGraph;
}

/**
 * Generates Open Graph metadata for product pages (tours)
 * @param data - Page metadata
 * @param price - Product price
 * @param currency - Currency code
 * @param locale - Current locale
 * @param url - Page URL
 * @returns Open Graph metadata with product-specific fields
 */
export function generateProductOpenGraph(
  data: Partial<PageMetadata>,
  price: number,
  currency: string,
  locale?: string,
  url?: string,
): Metadata['openGraph'] {
  const baseOpenGraph = generateOpenGraphTags({ ...data, type: 'product' }, locale, url);

  // Note: Next.js Metadata API doesn't directly support og:price_amount and og:price_currency
  // These would need to be added via additional meta tags if needed
  // For now, we return the base Open Graph data with product type
  return baseOpenGraph;
}

/**
 * Generates Open Graph metadata for article pages
 * Includes article-specific fields like publishedTime, modifiedTime, and authors
 * Requirements: 2.3, 12.2
 *
 * @param data - Page metadata with article-specific fields
 * @param locale - Current locale
 * @param url - Page URL
 * @returns Open Graph metadata with article-specific fields
 */
export function generateArticleOpenGraph(
  data: Partial<PageMetadata>,
  locale?: string,
  url?: string,
): Metadata['openGraph'] {
  const config = getSEOConfig(locale);
  const currentLocale = locale || config.defaultLocale;

  // Get all available locales except current one for alternates
  const alternateLocales = config.locales.filter(l => l !== currentLocale);

  // Ensure image URL is absolute
  const imageUrl = ensureAbsoluteUrl(data.image || config.defaultImage, config.siteUrl);

  // Build the page URL
  const pageUrl = url || config.siteUrl;

  // Build article-specific Open Graph data
  const openGraphData: Metadata['openGraph'] = {
    title: data.title || config.defaultTitle,
    description: data.description || config.defaultDescription,
    url: pageUrl,
    siteName: config.siteName,
    images: [
      {
        url: imageUrl,
        alt: data.imageAlt || data.title || config.siteName,
      },
    ],
    locale: currentLocale,
    type: 'article',
    ...(alternateLocales.length > 0 && { alternateLocale: alternateLocales }),
  };

  // Add article-specific fields if provided
  if (data.publishedTime) {
    openGraphData.publishedTime = data.publishedTime;
  }

  if (data.modifiedTime) {
    openGraphData.modifiedTime = data.modifiedTime;
  }

  if (data.author) {
    openGraphData.authors = [data.author];
  }

  return openGraphData;
}
