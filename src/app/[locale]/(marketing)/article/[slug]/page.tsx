import type { Metadata } from 'next';
import { getSEOConfig } from '@/core/seo/config';
import { generateArticleMetadata } from '@/core/seo/metadata/article';
import { generateBreadcrumbSchema } from '@/core/seo/structured-data/breadcrumb';
import { MOCK_ARTICLES } from '@/data/mocks/articles';

import type { Article } from '@/types/article.type';

interface ArticleDetailPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

/**
 * Generate metadata for article detail page
 * Integrates SEO module with article pages
 * Requirements: 1.3, 2.3, 4.2, 12.1, 12.2, 12.3, 12.4, 12.5
 */
export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug, locale } = params;

  try {
    // Find article from mock data
    // In production, this would be: const response = await articleApi.getArticleDetail(slug);
    const mockArticle = MOCK_ARTICLES.find(a => a.slug === slug);

    if (!mockArticle) {
      // Return basic metadata if article not found
      const config = getSEOConfig(locale);
      return {
        title: `Article Not Found | ${config.siteName}`,
        description: config.defaultDescription,
      };
    }

    // Transform mock data to Article type
    const article: Article = {
      id: mockArticle.id,
      title: mockArticle.title,
      slug: mockArticle.slug,
      content: mockArticle.description || '',
      imageUrl: mockArticle.thumbnailUrl || '',
      createdAt: mockArticle.date || new Date().toISOString(),
      updatedAt: mockArticle.date || new Date().toISOString(),
    };

    // Generate article metadata with Open Graph, Twitter Cards, and Article structured data
    // Requirements: 1.3, 2.3, 12.1, 12.2, 12.3
    const metadata = generateArticleMetadata(article, locale, {
      author: mockArticle.author,
      tags: mockArticle.tags,
      excerpt: mockArticle.description,
    });

    // Generate breadcrumb structured data (Requirement 4.7)
    const config = getSEOConfig(locale);
    const breadcrumbItems = [
      {
        name: locale === 'vi' ? 'Trang chủ' : 'Home',
        url: `${config.siteUrl}/${locale}`,
      },
      {
        name: locale === 'vi' ? 'Bài viết' : 'Articles',
        url: `${config.siteUrl}/${locale}/article`,
      },
      {
        name: article.title,
        url: `${config.siteUrl}/${locale}/article/${article.slug}`,
      },
    ];

    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

    // Combine Article and Breadcrumb structured data
    const existingStructuredData = metadata.other?.['script:ld+json'];
    const structuredDataArray = [
      existingStructuredData ? JSON.parse(existingStructuredData as string) : null,
      breadcrumbSchema,
    ].filter(Boolean);

    return {
      ...metadata,
      other: {
        'script:ld+json': JSON.stringify(structuredDataArray),
      },
    };
  } catch (error) {
    // Return basic metadata on error
    const config = getSEOConfig(locale);
    return {
      title: `Article | ${config.siteName}`,
      description: config.defaultDescription,
    };
  }
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = params;

  return (
    <main>
      <h1 className="text-2xl font-bold">{slug}</h1>
    </main>
  );
}
