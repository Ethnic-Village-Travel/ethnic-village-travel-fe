import type { MetadataRoute } from 'next';
import { seoConfig } from '@/core/seo/config';
import { generateSitemap } from '@/core/seo/sitemap';
import type { SitemapPageInput } from '@/core/seo/sitemap/types';
import { tourApi } from '@/data/apis/tour.api';
import { MOCK_ARTICLES } from '@/data/mocks/articles';

/**
 * Generates sitemap for the website
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl, locales, defaultLocale } = seoConfig;

  const pages: SitemapPageInput[] = [];

  // Homepage
  pages.push({
    path: '',
    type: 'homepage',
    lastModified: new Date(),
  });

  // Static pages
  const staticPages = ['about', 'contact', 'services'];
  for (const page of staticPages) {
    pages.push({
      path: page,
      type: 'static',
      lastModified: new Date(),
    });
  }

  // Tour listing page
  pages.push({
    path: 'tour',
    type: 'tour-listing',
    lastModified: new Date(),
  });

  // Tour detail pages - fetch from API
  try {
    const tourListResponse = await tourApi.getTourList({
      page: 0,
      size: 1000, // Get all tours for sitemap
    });

    if (tourListResponse.success && tourListResponse.data?.content) {
      for (const tour of tourListResponse.data.content) {
        pages.push({
          path: `tour/${tour.slug}`,
          type: 'tour-detail',
          lastModified: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch tours for sitemap:', error);
  }

  // Article listing page
  pages.push({
    path: 'article',
    type: 'article-listing',
    lastModified: new Date(),
  });

  // Article detail pages - using mock data for now
  for (const article of MOCK_ARTICLES) {
    pages.push({
      path: `article/${article.slug}`,
      type: 'article-detail',
      lastModified: article.date ? new Date(article.date) : new Date(),
    });
  }

  // Generate sitemap entries
  const sitemapEntries = generateSitemap(pages, {
    baseUrl: siteUrl,
    locales,
    defaultLocale,
    maxUrlsPerSitemap: 50000,
  });

  return sitemapEntries;
}
