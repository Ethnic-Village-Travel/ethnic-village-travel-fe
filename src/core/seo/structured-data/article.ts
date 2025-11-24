import type { Article } from '@/types/article.type';

import { getSEOConfig } from '../config';
import type { ArticleSchema } from '../types';
import { buildLocalizedUrl, ensureAbsoluteUrl } from '../utils';
import { createImageObjectSchema, createPersonSchema, formatISO8601Date } from './helpers';

export interface ArticleSchemaOptions {
  /**
   * Author name for the article
   * If not provided, will use a default author name
   */
  authorName?: string;

  /**
   * Featured image URL for the article
   * If not provided, will use article.imageUrl or default image
   */
  featuredImage?: string;

  /**
   * Article type: 'Article' for general articles, 'BlogPosting' for blog posts
   * Default: 'BlogPosting'
   */
  type?: 'Article' | 'BlogPosting';
}

/**
 * Generate Article or BlogPosting structured data for an article
 * Requirements: 4.2, 12.4, 12.5
 *
 * @param article - Article object with all details
 * @param locale - Current locale (vi or en)
 * @param options - Optional configuration for article schema
 * @returns ArticleSchema object for JSON-LD
 */
export function generateArticleSchema(
  article: Article,
  locale: string,
  options: ArticleSchemaOptions = {},
): ArticleSchema {
  const config = getSEOConfig(locale);
  const articleUrl = buildLocalizedUrl(`/article/${article.slug}`, locale, config.siteUrl);

  // Determine article type (Requirement 4.2)
  const articleType = options.type || 'BlogPosting';

  // Process featured image - ensure absolute URL (Requirement 4.6)
  const imageUrl = options.featuredImage || article.imageUrl || config.defaultImage;
  const absoluteImageUrl = ensureAbsoluteUrl(imageUrl, config.siteUrl);

  // Format dates in ISO 8601 format (Requirement 4.5)
  const datePublished = formatISO8601Date(article.createdAt);

  // Create author Person schema (Requirement 12.5)
  const authorName = options.authorName || 'Ethnic Village Travel';
  const author = createPersonSchema(authorName);

  // Create publisher Organization schema (Requirement 12.5)
  const publisher = {
    '@type': 'Organization' as const,
    name: config.organizationName,
    logo: createImageObjectSchema(ensureAbsoluteUrl(config.organizationLogo, config.siteUrl)),
  };

  // Build the schema
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': articleType,
    headline: article.title,
    description: article.content.substring(0, 200), // Use first 200 chars as description
    image: absoluteImageUrl,
    datePublished,
    author,
    publisher,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  // Add modified date if different from published date (Requirement 12.4)
  if (article.updatedAt && article.updatedAt !== article.createdAt) {
    schema.dateModified = formatISO8601Date(article.updatedAt);
  }

  return schema;
}
