import { Metadata } from 'next';
import { getSEOConfig } from '@/core/seo/config';
import { generateBaseMetadata } from '@/core/seo/metadata/base';
import { generateBreadcrumbSchema } from '@/core/seo/structured-data/breadcrumb';
import { MOCK_ARTICLES } from '@/data/mocks/articles';

import ArticleItem from '@/components/features/article/article-item';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const config = getSEOConfig(locale);

  const title = locale === 'vi' ? 'Bài viết' : 'Articles';
  const description =
    locale === 'vi'
      ? 'Khám phá các bài viết về văn hóa, truyền thống và cuộc sống của các dân tộc thiểu số Việt Nam.'
      : 'Discover articles about culture, traditions and life of ethnic minorities in Vietnam.';

  // Generate base metadata with canonical URL and hreflang tags
  const metadata = generateBaseMetadata(
    {
      title,
      description,
      type: 'website',
    },
    locale,
    '/article',
  );

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    {
      name: locale === 'vi' ? 'Trang chủ' : 'Home',
      url: `${config.siteUrl}/${locale}`,
    },
    {
      name: locale === 'vi' ? 'Bài viết' : 'Articles',
      url: `${config.siteUrl}/${locale}/article`,
    },
  ]);

  return {
    ...metadata,
    other: {
      'script:ld+json': JSON.stringify(breadcrumbSchema),
    },
  };
}

export default function ArticlesPage() {
  return (
    <>
      <section className="mb-12">
        <h2 className="mb-8 text-2xl font-bold">Bài viết đáng chú ý</h2>
        <div className="space-y-6">
          {MOCK_ARTICLES.map(article => (
            <ArticleItem key={article.id} {...article} layout="horizontal" className="max-w-full" />
          ))}
        </div>
      </section>
    </>
  );
}
