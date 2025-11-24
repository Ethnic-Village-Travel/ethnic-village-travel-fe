import type { Metadata } from 'next';

import { getSEOConfig } from '../config';
import type { PageMetadata } from '../types';
import { ensureAbsoluteUrl } from '../utils';

export interface TwitterCardMetadata {
  card: 'summary' | 'summary_large_image';
  title: string;
  description: string;
  images: string[];
  site?: string;
  creator?: string;
}

/**
 * Determines the appropriate Twitter Card type based on image presence
 * @param hasProminentImage - Whether the page has a prominent image
 * @returns Twitter Card type ('summary_large_image' or 'summary')
 */
export function selectTwitterCardType(hasProminentImage: boolean): 'summary' | 'summary_large_image' {
  return hasProminentImage ? 'summary_large_image' : 'summary';
}

/**
 * Generates Twitter Card metadata for a page
 * @param data - Page metadata
 * @param locale - Current locale
 * @returns Twitter Card metadata object compatible with Next.js Metadata API
 */
export function generateTwitterCardTags(data: Partial<PageMetadata>, locale?: string): Metadata['twitter'] {
  const config = getSEOConfig(locale);

  // Ensure image URL is absolute
  const imageUrl = ensureAbsoluteUrl(data.image || config.defaultImage, config.siteUrl);

  // Determine card type based on whether we have an image
  const hasProminentImage = !!data.image;
  const cardType = selectTwitterCardType(hasProminentImage);

  const twitterData: Metadata['twitter'] = {
    card: cardType,
    title: data.title || config.defaultTitle,
    description: data.description || config.defaultDescription,
    images: [imageUrl],
  };

  // Add Twitter handle if configured
  if (config.twitterHandle) {
    return {
      ...twitterData,
      site: config.twitterHandle,
      creator: config.twitterHandle,
    };
  }

  return twitterData;
}

/**
 * Generates Twitter Card metadata with multiple images
 * @param data - Page metadata
 * @param images - Array of image URLs
 * @param locale - Current locale
 * @returns Twitter Card metadata with multiple images
 */
export function generateTwitterCardWithImages(
  data: Partial<PageMetadata>,
  images: string[],
  locale?: string,
): Metadata['twitter'] {
  const config = getSEOConfig(locale);
  const baseTwitterCard = generateTwitterCardTags(data, locale);

  // Convert all images to absolute URLs
  const absoluteImages = images.filter(img => img).map(img => ensureAbsoluteUrl(img, config.siteUrl));

  // Use provided images if available, otherwise fall back to default
  if (absoluteImages.length > 0) {
    return {
      ...baseTwitterCard,
      card: 'summary_large_image', // Use large image card when multiple images provided
      images: absoluteImages,
    };
  }

  return baseTwitterCard;
}

/**
 * Generates Twitter Card metadata with custom author
 * @param data - Page metadata
 * @param authorHandle - Twitter handle of the content author (with or without @)
 * @param locale - Current locale
 * @returns Twitter Card metadata with author information
 */
export function generateTwitterCardWithAuthor(
  data: Partial<PageMetadata>,
  authorHandle?: string,
  locale?: string,
): Metadata['twitter'] {
  const twitterCard = generateTwitterCardTags(data, locale);

  // Add author handle if provided
  if (authorHandle) {
    // Ensure handle starts with @
    const formattedHandle = authorHandle.startsWith('@') ? authorHandle : `@${authorHandle}`;
    return {
      ...twitterCard,
      creator: formattedHandle,
    };
  }

  return twitterCard;
}
