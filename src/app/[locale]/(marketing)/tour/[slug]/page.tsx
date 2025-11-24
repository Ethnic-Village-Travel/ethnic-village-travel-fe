import type { Metadata } from 'next';
import { getSEOConfig } from '@/core/seo/config';
import { generateTourMetadata } from '@/core/seo/metadata/tour';
import { generateBreadcrumbSchema } from '@/core/seo/structured-data/breadcrumb';
import { tourApi } from '@/data/apis/tour.api';

import TourDetail from '@/components/features/tour/tour-detail';

interface TourDetailProps {
  params: {
    slug: string;
    locale: string;
  };
}

/**
 * Generate metadata for tour detail page
 * Integrates SEO module with tour pages
 * Requirements: 1.2, 2.2, 4.1, 11.1, 11.2, 11.3, 11.4, 11.5
 */
export async function generateMetadata({ params }: TourDetailProps): Promise<Metadata> {
  const { slug, locale } = params;

  try {
    // Fetch tour data
    const response = await tourApi.getTourDetail(slug);

    if (!response.success || !response.data) {
      // Return basic metadata if tour not found
      const config = getSEOConfig(locale);
      return {
        title: `Tour Not Found | ${config.siteName}`,
        description: config.defaultDescription,
      };
    }

    const tour = response.data;

    // Generate tour metadata with Open Graph, Twitter Cards, and TouristTrip structured data
    const metadata = generateTourMetadata(tour, locale);

    // Generate breadcrumb structured data
    const config = getSEOConfig(locale);
    const breadcrumbItems = [
      {
        name: locale === 'vi' ? 'Trang chủ' : 'Home',
        url: `${config.siteUrl}/${locale}`,
      },
      {
        name: locale === 'vi' ? 'Tours' : 'Tours',
        url: `${config.siteUrl}/${locale}/tour`,
      },
      {
        name: tour.title,
        url: `${config.siteUrl}/${locale}/tour/${tour.slug}`,
      },
    ];

    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

    // Combine TouristTrip and Breadcrumb structured data
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
      title: `Tour | ${config.siteName}`,
      description: config.defaultDescription,
    };
  }
}

export default function TourDetailPage({ params }: TourDetailProps) {
  return <TourDetail slug={params.slug} />;
}
