// Core sitemap generation logic

import type { MetadataRoute } from 'next';

import type { SitemapEntry } from '../types';
import type { PageType, SitemapConfig, SitemapGeneratorOptions, SitemapPageInput } from './types';

// Default sitemap configuration based on requirements
const DEFAULT_SITEMAP_CONFIG: SitemapConfig = {
  priority: {
    homepage: 1.0,
    'tour-listing': 0.8,
    'article-listing': 0.8,
    'tour-detail': 0.6,
    'article-detail': 0.6,
    static: 0.5,
  },
  changeFrequency: {
    homepage: 'daily',
    'tour-listing': 'daily',
    'article-listing': 'daily',
    'tour-detail': 'weekly',
    'article-detail': 'monthly',
    static: 'monthly',
  },
};

/**
 * Assigns priority value based on page type
 * Requirements: 7.3
 */
export function assignPriority(pageType: PageType): number {
  return DEFAULT_SITEMAP_CONFIG.priority[pageType];
}

/**
 * Assigns change frequency based on content type
 * Requirements: 7.4
 */
export function assignChangeFrequency(
  pageType: PageType,
): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  return DEFAULT_SITEMAP_CONFIG.changeFrequency[pageType];
}

/**
 * Generates locale-specific URL
 * Requirements: 7.6
 */
export function generateLocaleUrl(baseUrl: string, locale: string, path: string): string {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Construct URL with locale prefix
  const url = `${baseUrl}/${locale}${cleanPath ? `/${cleanPath}` : ''}`;

  return url;
}

/**
 * Generates alternate language URLs for a page
 * Requirements: 7.6
 */
export function generateAlternateLanguages(baseUrl: string, locales: string[], path: string): Record<string, string> {
  const alternates: Record<string, string> = {};

  for (const locale of locales) {
    alternates[locale] = generateLocaleUrl(baseUrl, locale, path);
  }

  return alternates;
}

/**
 * Converts SitemapPageInput to SitemapEntry
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */
export function createSitemapEntry(page: SitemapPageInput, options: SitemapGeneratorOptions): SitemapEntry {
  const { baseUrl, locales, defaultLocale } = options;
  const locale = page.locale || defaultLocale;

  const entry: SitemapEntry = {
    url: generateLocaleUrl(baseUrl, locale, page.path),
    lastModified: page.lastModified || new Date(),
    changeFrequency: assignChangeFrequency(page.type),
    priority: assignPriority(page.type),
  };

  // Add alternate languages if multiple locales exist
  if (locales.length > 1) {
    entry.alternates = {
      languages: generateAlternateLanguages(baseUrl, locales, page.path),
    };
  }

  return entry;
}

/**
 * Splits sitemap into multiple files if URL count exceeds limit
 * Requirements: 7.7
 */
export function splitSitemap(entries: SitemapEntry[], maxUrlsPerSitemap: number = 50000): SitemapEntry[][] {
  if (entries.length <= maxUrlsPerSitemap) {
    return [entries];
  }

  const chunks: SitemapEntry[][] = [];
  for (let i = 0; i < entries.length; i += maxUrlsPerSitemap) {
    chunks.push(entries.slice(i, i + maxUrlsPerSitemap));
  }

  return chunks;
}

/**
 * Generates sitemap entries from page inputs
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
 */
export function generateSitemap(pages: SitemapPageInput[], options: SitemapGeneratorOptions): MetadataRoute.Sitemap {
  const entries: SitemapEntry[] = [];

  // Generate entries for all locales
  for (const locale of options.locales) {
    for (const page of pages) {
      const entry = createSitemapEntry({ ...page, locale }, options);
      entries.push(entry);
    }
  }

  // Sort by priority (descending) and then by URL
  entries.sort((a, b) => {
    if (a.priority !== b.priority) {
      return (b.priority || 0) - (a.priority || 0);
    }
    return a.url.localeCompare(b.url);
  });

  return entries;
}

/**
 * Generates sitemap index for sites with multiple sitemaps
 * Requirements: 7.7
 */
export function generateSitemapIndex(sitemapUrls: string[]): Array<{ url: string; lastModified: Date }> {
  return sitemapUrls.map(url => ({
    url,
    lastModified: new Date(),
  }));
}
