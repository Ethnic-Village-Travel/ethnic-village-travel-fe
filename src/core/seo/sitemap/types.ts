// Sitemap-specific types

export type PageType = 'homepage' | 'tour-listing' | 'tour-detail' | 'article-listing' | 'article-detail' | 'static';

export interface SitemapPageInput {
  path: string;
  type: PageType;
  lastModified?: Date;
  locale?: string;
}

export interface SitemapGeneratorOptions {
  baseUrl: string;
  locales: string[];
  defaultLocale: string;
  maxUrlsPerSitemap?: number;
}

export interface SitemapConfig {
  priority: Record<PageType, number>;
  changeFrequency: Record<PageType, 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'>;
}
