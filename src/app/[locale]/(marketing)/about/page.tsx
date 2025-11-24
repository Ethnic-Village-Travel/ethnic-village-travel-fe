import { Metadata } from 'next';
import { getSEOConfig } from '@/core/seo/config';
import { generateBaseMetadata } from '@/core/seo/metadata/base';
import { generateBreadcrumbSchema } from '@/core/seo/structured-data/breadcrumb';
import { getTranslations } from 'next-intl/server';

import { AboutCTA, AboutHero, AboutMission, AboutStats, AboutValues } from '@/components/features/about';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about.meta' });
  const config = getSEOConfig(locale);

  // Generate base metadata with canonical URL and hreflang tags
  const metadata = generateBaseMetadata(
    {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
    locale,
    '/about',
  );

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    {
      name: locale === 'vi' ? 'Trang chủ' : 'Home',
      url: `${config.siteUrl}/${locale}`,
    },
    {
      name: locale === 'vi' ? 'Giới thiệu' : 'About',
      url: `${config.siteUrl}/${locale}/about`,
    },
  ]);

  return {
    ...metadata,
    other: {
      'script:ld+json': JSON.stringify(breadcrumbSchema),
    },
  };
}

export default function AboutPage() {
  return (
    <div className="flex w-full flex-col">
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutStats />
      <AboutCTA />
    </div>
  );
}
