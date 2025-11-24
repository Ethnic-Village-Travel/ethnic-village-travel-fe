import type { Metadata } from 'next';

import type { Tour } from '@/types/tour.type';

import { getSEOConfig } from '../config';
import { generateLocalizedCanonicalUrl } from '../links/canonical';
import { generateHreflangAlternates } from '../links/hreflang';
import { generateOpenGraphWithImages, generateProductOpenGraph } from '../social/open-graph';
import { generateTwitterCardWithImages } from '../social/twitter';
import { generateTouristTripSchema } from '../structured-data/tourist-trip';
import type { TourMetadata } from '../types';
import { ensureAbsoluteUrl, truncateText } from '../utils';

/**
 * Generates comprehensive metadata for tour detail pages
 * Includes tour name, description, location, duration, price metadata
 * Integrates with Open Graph and Twitter Card generators for tour-specific data
 * Integrates with TouristTrip structured data generator
 *
 * Requirements: 1.2, 2.2, 11.1
 *
 * @param tour - Tour object with all details
 * @param locale - Current locale (vi or en)
 * @returns Next.js Metadata object with tour-specific metadata and structured data
 */
export function generateTourMetadata(tour: Tour, locale: string): Metadata {
  const config = getSEOConfig(locale);
  const path = `/tour/${tour.slug}`;

  // Build tour-specific title with location and ethnic groups
  const ethnicNames = tour.ethnics?.map(e => e.name).join(', ') || '';
  const locationName = tour.locations?.[0] ? `${tour.locations[0].city}, ${tour.locations[0].province}` : '';
  const titleParts = [tour.title];
  if (ethnicNames) titleParts.push(ethnicNames);
  if (locationName) titleParts.push(locationName);

  const fullTitle = titleParts.join(' - ');
  const title = `${truncateText(fullTitle, 60)} | ${config.siteName}`;

  // Build tour description with key details
  const descriptionParts = [];
  if (tour.overview) {
    descriptionParts.push(tour.overview);
  }
  if (tour.duration) {
    descriptionParts.push(`Duration: ${tour.duration} days`);
  }
  if (tour.adultPrice) {
    descriptionParts.push(`From ${tour.adultPrice.toLocaleString()} VND`);
  }

  const fullDescription = descriptionParts.join('. ');
  const description = truncateText(fullDescription, 160);

  // Build keywords from tour attributes
  const keywords: string[] = [...config.defaultKeywords];
  if (tour.ethnics) {
    keywords.push(...tour.ethnics.map(e => e.name));
  }
  if (tour.locations) {
    keywords.push(...tour.locations.map(l => `${l.city}, ${l.province}`));
  }
  keywords.push(`${tour.duration} day tour`, 'ethnic village tour', 'cultural tour Vietnam');

  // Collect all tour images
  const images: string[] = [];
  if (tour.imageUrl) {
    images.push(tour.imageUrl);
  }

  // Ensure at least one image
  const finalImages = images.length > 0 ? images : [config.defaultImage];
  const primaryImage = ensureAbsoluteUrl(finalImages[0], config.siteUrl);

  // Generate canonical URL and hreflang alternates
  const canonicalUrl = generateLocalizedCanonicalUrl(path, locale, config.siteUrl);
  const hreflangAlternates = generateHreflangAlternates(
    path,
    locale,
    config.locales,
    config.siteUrl,
    config.defaultLocale,
  );

  // Generate Open Graph tags with product-specific data
  const openGraph = tour.adultPrice
    ? generateProductOpenGraph(
        {
          title: fullTitle,
          description,
          image: primaryImage,
          imageAlt: tour.title,
          type: 'product',
        },
        tour.adultPrice,
        'VND',
        locale,
        canonicalUrl,
      )
    : generateOpenGraphWithImages(
        {
          title: fullTitle,
          description,
          imageAlt: tour.title,
          type: 'product',
        },
        finalImages,
        locale,
        canonicalUrl,
      );

  // Generate Twitter Card tags with images
  const twitter = generateTwitterCardWithImages(
    {
      title: fullTitle,
      description,
      imageAlt: tour.title,
    },
    finalImages,
    locale,
  );

  // Generate TouristTrip structured data
  const touristTripSchema = generateTouristTripSchema(tour, locale);

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
      'script:ld+json': JSON.stringify(touristTripSchema),
    },
  };

  return metadata;
}

/**
 * Generates tour metadata from TourMetadata interface
 * Alternative function that accepts pre-processed tour metadata
 *
 * @param tourData - Tour metadata object
 * @param locale - Current locale
 * @returns Next.js Metadata object
 */
export function generateTourMetadataFromData(tourData: TourMetadata, locale: string): Metadata {
  const config = getSEOConfig(locale);
  const path = `/tour/${tourData.tourSlug}`;

  // Build title
  const titleParts = [tourData.tourName];
  if (tourData.ethnics && tourData.ethnics.length > 0) {
    titleParts.push(tourData.ethnics.join(', '));
  }
  if (tourData.location) {
    titleParts.push(tourData.location);
  }

  const fullTitle = titleParts.join(' - ');
  const title = `${truncateText(fullTitle, 60)} | ${config.siteName}`;

  // Build description
  const descriptionParts = [];
  if (tourData.description) {
    descriptionParts.push(tourData.description);
  }
  if (tourData.duration) {
    descriptionParts.push(`Duration: ${tourData.duration} days`);
  }
  if (tourData.price) {
    descriptionParts.push(`From ${tourData.price.toLocaleString()} ${tourData.currency}`);
  }

  const fullDescription = descriptionParts.join('. ');
  const description = truncateText(fullDescription, 160);

  // Build keywords
  const keywords: string[] = [...config.defaultKeywords];
  if (tourData.ethnics) {
    keywords.push(...tourData.ethnics);
  }
  if (tourData.location) {
    keywords.push(tourData.location);
  }
  keywords.push(`${tourData.duration} day tour`, 'ethnic village tour', 'cultural tour Vietnam');

  // Process images
  const images = tourData.images || [];
  const finalImages = images.length > 0 ? images : [config.defaultImage];
  const primaryImage = ensureAbsoluteUrl(finalImages[0], config.siteUrl);

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
  const openGraph = tourData.price
    ? generateProductOpenGraph(
        {
          title: fullTitle,
          description,
          image: primaryImage,
          imageAlt: tourData.tourName,
          type: 'product',
        },
        tourData.price,
        tourData.currency,
        locale,
        canonicalUrl,
      )
    : generateOpenGraphWithImages(
        {
          title: fullTitle,
          description,
          imageAlt: tourData.tourName,
          type: 'product',
        },
        finalImages,
        locale,
        canonicalUrl,
      );

  // Generate Twitter Card tags
  const twitter = generateTwitterCardWithImages(
    {
      title: fullTitle,
      description,
      imageAlt: tourData.tourName,
    },
    finalImages,
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
