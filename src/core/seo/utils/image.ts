import { ensureAbsoluteUrl } from './url';

/**
 * Image dimensions interface
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Processes an image URL to ensure it's absolute and optionally adds dimensions
 * @param imageUrl - The image URL to process
 * @param baseUrl - The base URL for relative images
 * @param dimensions - Optional image dimensions
 * @returns Processed image URL
 */
export function processImageUrl(imageUrl: string, baseUrl: string, dimensions?: ImageDimensions): string {
  if (!imageUrl) {
    return '';
  }

  return ensureAbsoluteUrl(imageUrl, baseUrl);
}

/**
 * Validates if an image URL meets minimum size requirements
 * @param dimensions - Image dimensions to validate
 * @param minWidth - Minimum width required
 * @param minHeight - Minimum height required
 * @returns True if dimensions meet requirements
 */
export function validateImageDimensions(dimensions: ImageDimensions, minWidth: number, minHeight: number): boolean {
  return dimensions.width >= minWidth && dimensions.height >= minHeight;
}

/**
 * Gets the appropriate image dimensions for social media
 * @param platform - The social media platform ('og' for Open Graph, 'twitter' for Twitter)
 * @returns Recommended dimensions
 */
export function getSocialImageDimensions(platform: 'og' | 'twitter'): ImageDimensions {
  if (platform === 'twitter') {
    return {
      width: 1200,
      height: 630,
    };
  }

  // Open Graph default
  return {
    width: 1200,
    height: 630,
  };
}

/**
 * Processes multiple image URLs
 * @param imageUrls - Array of image URLs
 * @param baseUrl - The base URL for relative images
 * @returns Array of processed absolute URLs
 */
export function processImageUrls(imageUrls: string[], baseUrl: string): string[] {
  return imageUrls.filter(url => url).map(url => ensureAbsoluteUrl(url, baseUrl));
}

/**
 * Gets the first valid image from an array of URLs
 * @param imageUrls - Array of image URLs
 * @param baseUrl - The base URL for relative images
 * @param fallbackImage - Fallback image if no valid image found
 * @returns First valid image URL or fallback
 */
export function getFirstValidImage(imageUrls: string[], baseUrl: string, fallbackImage: string): string {
  const validImages = processImageUrls(imageUrls, baseUrl);
  return validImages.length > 0 ? validImages[0] : ensureAbsoluteUrl(fallbackImage, baseUrl);
}
