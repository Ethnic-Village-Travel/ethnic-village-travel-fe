import { Metadata } from 'next';
import { getSEOConfig } from '@/core/seo/config';
import { generateBaseMetadata } from '@/core/seo/metadata/base';
import { generateBreadcrumbSchema } from '@/core/seo/structured-data/breadcrumb';
import { getTranslations } from 'next-intl/server';

import { ServicesHero, ServicesList } from '@/components/features/services';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'services.meta' });
  const config = getSEOConfig(locale);

  // Generate base metadata with canonical URL and hreflang tags
  const metadata = generateBaseMetadata(
    {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
    locale,
    '/services',
  );

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    {
      name: locale === 'vi' ? 'Trang chủ' : 'Home',
      url: `${config.siteUrl}/${locale}`,
    },
    {
      name: locale === 'vi' ? 'Dịch vụ' : 'Services',
      url: `${config.siteUrl}/${locale}/services`,
    },
  ]);

  return {
    ...metadata,
    other: {
      'script:ld+json': JSON.stringify(breadcrumbSchema),
    },
  };
}

export default function ServicesPage() {
  return (
    <div className="flex w-full flex-col">
      <ServicesHero />
      <ServicesList />
    </div>
  );
}
