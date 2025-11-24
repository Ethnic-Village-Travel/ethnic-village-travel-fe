import type { Metadata } from 'next';
import { getSEOConfig } from '@/core/seo/config';
import { generateBaseMetadata } from '@/core/seo/metadata/base';
import { generateOrganizationSchema } from '@/core/seo/structured-data/organization';
import { generateWebSiteSchema } from '@/core/seo/structured-data/website';

import { HomePageContent } from '@/components/features/home/home-page-content';

interface HomePageProps {
  params: {
    locale: string;
  };
}

/**
 * Generate metadata for homepage
 * Integrates SEO module with homepage
 * Requirement 4.3: Homepage should have Organization and WebSite structured data
 */
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = params;
  const config = getSEOConfig(locale);

  // Generate base metadata with Open Graph and Twitter Cards
  const metadata = generateBaseMetadata(
    {
      title: config.defaultTitle,
      description: config.defaultDescription,
      keywords: config.defaultKeywords,
      image: config.defaultImage,
      type: 'website',
      locale,
    },
    locale,
  );

  // Generate Organization structured data
  const organizationSchema = generateOrganizationSchema({ locale });

  // Generate WebSite structured data with search action
  const websiteSchema = generateWebSiteSchema({
    locale,
    includeSearchAction: true,
  });

  // Combine structured data
  const structuredDataArray = [organizationSchema, websiteSchema];

  return {
    ...metadata,
    other: {
      'script:ld+json': JSON.stringify(structuredDataArray),
    },
  };
}

export default function HomePage({ params }: HomePageProps) {
  return <HomePageContent />;
}
