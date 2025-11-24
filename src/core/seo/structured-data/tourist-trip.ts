import type { Tour } from '@/types/tour.type';

import { getSEOConfig } from '../config';
import type { TouristTripSchema } from '../types';
import { buildLocalizedUrl, processImageUrls } from '../utils';
import { formatISO8601Duration } from './helpers';

/**
 * Generate TouristTrip structured data for a tour
 * Requirements: 4.1, 4.4, 4.6, 11.2, 11.3, 11.4
 *
 * @param tour - Tour object with all details
 * @param locale - Current locale (vi or en)
 * @returns TouristTrip schema object
 */
export function generateTouristTripSchema(tour: Tour, locale: string): TouristTripSchema {
  const config = getSEOConfig(locale);
  const tourUrl = buildLocalizedUrl(`/tour/${tour.slug}`, locale, config.siteUrl);

  // Process images - ensure all are absolute URLs (Requirement 4.6)
  const images: string[] = [];
  if (tour.imageUrl) {
    images.push(tour.imageUrl);
  }
  const processedImages = processImageUrls(images, config.siteUrl);

  // Ensure at least one image (use default if none available)
  const finalImages = processedImages.length > 0 ? processedImages : [config.defaultImage];

  // Format price with currency code (Requirement 4.4)
  const price = tour.adultPrice || 0;
  const priceCurrency = 'VND';

  // Determine availability based on available dates (Requirement 11.3)
  const hasAvailableDates = tour.availableDates && tour.availableDates.length > 0;
  const availability = hasAvailableDates ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';

  const schema: TouristTripSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.overview || '',
    image: finalImages,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability,
      url: tourUrl,
    },
    duration: formatISO8601Duration(tour.duration),
  };

  // Add itinerary from timeline (Requirement 11.4)
  if (tour.timeline && tour.timeline.length > 0) {
    schema.itinerary = {
      '@type': 'ItemList',
      itemListElement: tour.timeline.map((day, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `Day ${day.day}`,
        description: day.activities.map(activity => activity.description).join('. '),
      })),
    };
  }

  // Add aggregate rating if reviews exist (Requirement 11.2)
  if (tour.avgRating && tour.ratingCount && tour.ratingCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: tour.avgRating,
      reviewCount: tour.ratingCount,
    };
  }

  // Add tourist types based on ethnics
  if (tour.ethnics && tour.ethnics.length > 0) {
    schema.touristType = tour.ethnics.map(ethnic => ethnic.name);
  }

  return schema;
}
