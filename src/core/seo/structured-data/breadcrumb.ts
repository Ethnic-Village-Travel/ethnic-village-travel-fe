import type { BreadcrumbSchema } from '../types';

/**
 * Breadcrumb item for generating breadcrumb structured data
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate BreadcrumbList structured data
 * Requirement 4.7: Generate BreadcrumbList structured data where breadcrumb navigation exists
 *
 * @param items - Array of breadcrumb items with name and URL
 * @returns BreadcrumbList schema object
 *
 * @example
 * ```typescript
 * const breadcrumbs = generateBreadcrumbSchema([
 *   { name: 'Home', url: 'https://example.com' },
 *   { name: 'Tours', url: 'https://example.com/tours' },
 *   { name: 'Hmong Village Tour', url: 'https://example.com/tours/hmong-village' }
 * ]);
 * ```
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbSchema {
  if (!items || items.length === 0) {
    throw new Error('Breadcrumb items array cannot be empty');
  }

  // Validate all items have required fields
  items.forEach((item, index) => {
    if (!item.name || typeof item.name !== 'string') {
      throw new Error(`Breadcrumb item at position ${index} must have a valid name`);
    }
    if (!item.url || typeof item.url !== 'string') {
      throw new Error(`Breadcrumb item at position ${index} must have a valid URL`);
    }
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1, // Position starts at 1, not 0
      name: item.name,
      item: item.url,
    })),
  };
}
