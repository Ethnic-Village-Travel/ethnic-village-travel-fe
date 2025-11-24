import { Metadata } from 'next';
import { getSEOConfig } from '@/core/seo/config';
import { generateBaseMetadata } from '@/core/seo/metadata/base';
import { generateBreadcrumbSchema } from '@/core/seo/structured-data/breadcrumb';
import { getTranslations } from 'next-intl/server';

import TourContentSection from '@/components/features/tour/tour-list/content-section';
import FilterSection from '@/components/features/tour/tour-list/filter-section';
import { SearchBar } from '@/components/features/tour/tour-search';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'tour' });
  const config = getSEOConfig(locale);

  const title = locale === 'vi' ? 'Danh sách Tour' : 'Tour List';
  const description =
    locale === 'vi'
      ? 'Khám phá các tour du lịch dân tộc thiểu số Việt Nam. Trải nghiệm văn hóa Hmong, Thái, Mường và nhiều dân tộc khác.'
      : 'Discover ethnic minority tours in Vietnam. Experience Hmong, Thai, Muong and other ethnic cultures.';

  // Generate base metadata with canonical URL and hreflang tags
  const metadata = generateBaseMetadata(
    {
      title,
      description,
      type: 'website',
    },
    locale,
    '/tour',
  );

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    {
      name: locale === 'vi' ? 'Trang chủ' : 'Home',
      url: `${config.siteUrl}/${locale}`,
    },
    {
      name: locale === 'vi' ? 'Tour' : 'Tours',
      url: `${config.siteUrl}/${locale}/tour`,
    },
  ]);

  return {
    ...metadata,
    other: {
      'script:ld+json': JSON.stringify(breadcrumbSchema),
    },
  };
}

export default function TourList() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <SearchBar className="w-full rounded-none border-0 shadow-custom-blue" />

      <div className="flex w-full flex-col gap-6 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <FilterSection />
          <TourContentSection />
        </div>
      </div>
    </div>
  );
}
