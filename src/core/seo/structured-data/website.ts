import { getSEOConfig } from '../config';
import type { WebSiteSchema } from '../types';

export interface WebSiteOptions {
  locale?: string;
  searchUrl?: string;
  includeSearchAction?: boolean;
}

/**
 * Generate WebSite structured data schema
 * Requirement 4.3: Homepage should have WebSite schema
 *
 * @param options - Optional configuration for website schema
 * @returns WebSiteSchema object for JSON-LD
 */
export function generateWebSiteSchema(options: WebSiteOptions = {}): WebSiteSchema {
  const config = getSEOConfig(options.locale);

  const schema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: config.siteUrl,
    description: config.defaultDescription,
  };

  // Add search action if enabled
  if (options.includeSearchAction !== false) {
    const locale = options.locale || config.defaultLocale;
    const searchUrl = options.searchUrl || `${config.siteUrl}/${locale}/tour`;

    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${searchUrl}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}
