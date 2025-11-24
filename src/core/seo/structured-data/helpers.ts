import type { StructuredDataBase } from '../types';

/**
 * Format a Date object to ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
 * Requirement 4.5: Dates in structured data must be in ISO 8601 format
 */
export function formatISO8601Date(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided to formatISO8601Date');
  }

  return dateObj.toISOString();
}

/**
 * Format duration in days to ISO 8601 duration format (P{n}D)
 * Example: 3 days -> "P3D"
 */
export function formatISO8601Duration(days: number): string {
  if (days <= 0 || !Number.isFinite(days)) {
    throw new Error('Duration must be a positive finite number');
  }

  return `P${Math.floor(days)}D`;
}

/**
 * Wrap structured data in a script tag for embedding in HTML
 * Returns a JSON-LD script tag string
 */
export function wrapStructuredData(data: StructuredDataBase): string {
  return JSON.stringify(data);
}

/**
 * Validate that a structured data object has required base fields
 */
export function validateStructuredData(data: StructuredDataBase): boolean {
  return data['@context'] === 'https://schema.org' && typeof data['@type'] === 'string' && data['@type'].length > 0;
}

/**
 * Create a Person schema object
 */
export function createPersonSchema(name: string): {
  '@type': 'Person';
  name: string;
} {
  return {
    '@type': 'Person',
    name,
  };
}

/**
 * Create an ImageObject schema
 */
export function createImageObjectSchema(url: string): {
  '@type': 'ImageObject';
  url: string;
} {
  return {
    '@type': 'ImageObject',
    url,
  };
}
