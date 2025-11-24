import type { Metadata } from 'next';

import type { Article } from '@/types/article.type';

import { getSEOConfig } from '../config';
import { generateLocalizedCanonicalUrl } from '../links/canonical';
import { generateHreflangAlternates } from '../links/hreflang';
import { generateArticleOpenGraph } from '../social/open-graph';
import { generateTwitterCardTags } from '../social/twitter';
import { generateArticleSchema } from '../structured-data/article';
import type { ArticleMetadata } from '../types';
import { ensureAbsoluteUrl, truncateText } from '../utils';

/**
 * Generates comprehensive metadata for article detail pages
 * Includes article title, excerpt, author, publication date metadata
 * Implements tags/categories as keywords
 * Ensures featured image appears in Open Graph and Twitter Card tags
 * Integrates with Article structured data generator
 *
 * Requirements: 1.3, 2.3, 12.1, 12.2, 12.3
 *
 * @param article - Article object with all details
 * @param locale - Current locale (vi or en)
 * @param options - Optional metadata overrides (author, tags, category)
 * @returns Next.js Metadata object with article-specific metadata and structured data
 */
export function generateArticleMetadata(
  article: Article,
  locale: string,
  options: {
    author?: string;
    tags?: string[];
    category?: string;
    excerpt?: string;
  } = {},
): Metadata {
  const config = getSEOConfig(locale);
  const path = `/article/${article.slug}`;

  // Build article title (Requirement 12.1)
  const fullTitle = article.title;
  const title = `${truncateText(fullTitle, 60)} | ${config.siteName}`;

  // Build article description from excerpt or content (Requirement 12.1)
  const excerpt = options.excerpt || article.content.substring(0, 200);
  const description = truncateText(excerpt, 160);

  // Build keywords from tags/categories and defaults (Requirement 12.3)
  const keywords: string[] = [...config.defaultKeywords];
  if (options.tags && options.tags.length > 0) {
    keywords.push(...options.tags);
  }
  if (options.category) {
    keywords.push(options.category);
  }
  keywords.push('ethnic village', 'Vietnam travel', 'cultural tourism');

  // Ensure featured image is absolute (Requirement 12.2)
  const featuredImage = ensureAbsoluteUrl(article.imageUrl || config.defaultImage, config.siteUrl);

  // Generate canonical URL and hreflang alternates
  const canonicalUrl = generateLocalizedCanonicalUrl(path, locale, config.siteUrl);
  const hreflangAlternates = generateHreflangAlternates(
    path,
    locale,
    config.locales,
    config.siteUrl,
    config.defaultLocale,
  );

  // Generate Open Graph tags for article (Requirement 2.3, 12.2)
  const openGraph = generateArticleOpenGraph(
    {
      title: fullTitle,
      description,
      image: featuredImage,
      imageAlt: article.title,
      type: 'article',
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      author: options.author,
    },
    locale,
    canonicalUrl,
  );

  // Generate Twitter Card tags (Requirement 12.2)
  const twitter = generateTwitterCardTags(
    {
      title: fullTitle,
      description,
      image: featuredImage,
      imageAlt: article.title,
    },
    locale,
  );

  // Generate Article structured data (Requirement 12.1)
  const articleSchema = generateArticleSchema(article, locale, {
    authorName: options.author,
    featuredImage: article.imageUrl,
    type: 'BlogPosting',
  });

  // Build complete metadata object
  const metadata: Metadata = {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
    },
    openGraph,
    twitter,
    alternates: {
      canonical: canonicalUrl,
      ...hreflangAlternates,
    },
    // Add structured data as JSON-LD script
    other: {
      'script:ld+json': JSON.stringify(articleSchema),
    },
  };

  return metadata;
}

/**
 * Generates article metadata from ArticleMetadata interface
 * Alternative function that accepts pre-processed article metadata
 *
 * @param articleData - Article metadata object
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export function generateArticleMetadataFromData(articleData: ArticleMetadata, locale: string): Metadata {
  const config = getSEOConfig(locale);
  const path = `/article/${articleData.articleSlug}`;

  // Build title
  const fullTitle = articleData.title;
  const title = `${truncateText(fullTitle, 60)} | ${config.siteName}`;

  // Build description from excerpt
  const description = truncateText(articleData.excerpt, 160);

  // Build keywords from tags and category
  const keywords: string[] = [...config.defaultKeywords];
  if (articleData.tags && articleData.tags.length > 0) {
    keywords.push(...articleData.tags);
  }
  if (articleData.category) {
    keywords.push(articleData.category);
  }
  keywords.push('ethnic village', 'Vietnam travel', 'cultural tourism');

  // Ensure image is absolute
  const featuredImage = ensureAbsoluteUrl(articleData.image || config.defaultImage, config.siteUrl);

  // Generate canonical URL and hreflang alternates
  const canonicalUrl = generateLocalizedCanonicalUrl(path, locale, config.siteUrl);
  const hreflangAlternates = generateHreflangAlternates(
    path,
    locale,
    config.locales,
    config.siteUrl,
    config.defaultLocale,
  );

  // Generate Open Graph tags
  const openGraph = generateArticleOpenGraph(
    {
      title: fullTitle,
      description,
      image: featuredImage,
      imageAlt: articleData.title,
      type: 'article',
      publishedTime: articleData.publishedDate,
      modifiedTime: articleData.modifiedDate,
      author: articleData.author,
    },
    locale,
    canonicalUrl,
  );

  // Generate Twitter Card tags
  const twitter = generateTwitterCardTags(
    {
      title: fullTitle,
      description,
      image: featuredImage,
      imageAlt: articleData.title,
    },
    locale,
  );

  // Build metadata object
  const metadata: Metadata = {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
    },
    openGraph,
    twitter,
    alternates: {
      canonical: canonicalUrl,
      ...hreflangAlternates,
    },
  };

  return metadata;
}
