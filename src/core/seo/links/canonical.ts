import { filterQueryParameters, normalizeUrl } from '../utils/url';

/**
 * Generates a canonical URL for a page
 * Canonical URLs help search engines understand the preferred version of a page
 * when multiple URLs point to similar or duplicate content
 *
 * @param url - The current page URL (can be relative or absolute)
 * @param baseUrl - The base URL of the site
 * @param paramsToKeep - Optional array of query parameters to preserve
 * @returns Canonical URL (absolute, normalized, with filtered query params)
 */
export function generateCanonicalUrl(url: string, baseUrl: string, paramsToKeep: string[] = []): string {
  // Ensure we have an absolute URL
  let canonicalUrl = url;

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    canonicalUrl = `${cleanBaseUrl}${cleanUrl}`;
  }

  // Filter out non-essential query parameters
  canonicalUrl = filterQueryParameters(canonicalUrl, paramsToKeep);

  // Normalize the URL (remove trailing slashes, ensure consistent format)
  canonicalUrl = normalizeUrl(canonicalUrl);

  return canonicalUrl;
}

/**
 * Generates a canonical URL for a localized page
 * Includes the locale prefix in the URL
 *
 * @param path - The page path (without locale prefix)
 * @param locale - The locale code (e.g., 'vi', 'en')
 * @param baseUrl - The base URL of the site
 * @param paramsToKeep - Optional array of query parameters to preserve
 * @returns Canonical URL with locale prefix
 */
export function generateLocalizedCanonicalUrl(
  path: string,
  locale: string,
  baseUrl: string,
  paramsToKeep: string[] = [],
): string {
  // Build the localized path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const localizedPath = `/${locale}${cleanPath}`;

  // Generate canonical URL
  return generateCanonicalUrl(localizedPath, baseUrl, paramsToKeep);
}
