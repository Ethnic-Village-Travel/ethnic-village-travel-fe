import type { MetadataRoute } from 'next';

import { getSEOConfig } from '../config';

export interface RobotsConfig {
  siteUrl: string;
  environment?: string;
  allowedPaths?: string[];
  disallowedPaths?: string[];
}

/**
 * Generate robots.txt configuration for Next.js
 *
 * Implements environment-specific behavior:
 * - Production: Allow all public pages, disallow admin/api/private pages
 * - Non-production: Disallow all to prevent indexing
 *
 * @param config - Optional configuration overrides
 * @param locale - Optional locale for sitemap URL
 * @returns Next.js MetadataRoute.Robots configuration
 */
export function generateRobotsTxt(config?: Partial<RobotsConfig>, locale?: string): MetadataRoute.Robots {
  const seoConfig = getSEOConfig(locale);
  const environment = config?.environment || process.env.NODE_ENV || 'development';
  const siteUrl = config?.siteUrl || seoConfig.siteUrl;

  // In non-production environments, disallow all crawling
  if (environment !== 'production') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${siteUrl}/sitemap.xml`,
    };
  }

  // Production environment: allow public pages, disallow private areas
  const defaultDisallowedPaths = [
    '/admin',
    '/admin/*',
    '/api',
    '/api/*',
    '/personal',
    '/personal/*',
    '/_next',
    '/_next/*',
  ];

  const disallowedPaths = config?.disallowedPaths || defaultDisallowedPaths;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: disallowedPaths,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
