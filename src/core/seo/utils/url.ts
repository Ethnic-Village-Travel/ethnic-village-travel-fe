/**
 * Converts a relative URL to an absolute URL
 * @param url - The URL to convert (can be relative or absolute)
 * @param baseUrl - The base URL to use for relative URLs
 * @returns Absolute URL
 */
export function ensureAbsoluteUrl(url: string, baseUrl: string): string {
  if (!url) {
    return baseUrl;
  }

  // Already absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Remove trailing slash from baseUrl
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  // Ensure url starts with /
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  return `${cleanBaseUrl}${cleanUrl}`;
}

/**
 * Filters out non-essential query parameters from a URL
 * @param url - The URL to filter
 * @param paramsToKeep - Array of parameter names to keep (optional)
 * @returns URL with filtered query parameters
 */
export function filterQueryParameters(url: string, paramsToKeep: string[] = []): string {
  try {
    const urlObj = new URL(url);

    // Common tracking and session parameters to remove
    const paramsToRemove = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'fbclid',
      'gclid',
      'msclkid',
      'mc_cid',
      'mc_eid',
      '_ga',
      'sessionid',
      'sid',
      'ref',
      'referrer',
    ];

    // Remove non-essential parameters
    paramsToRemove.forEach(param => {
      if (!paramsToKeep.includes(param)) {
        urlObj.searchParams.delete(param);
      }
    });

    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return original URL
    return url;
  }
}

/**
 * Normalizes a URL by removing trailing slashes and ensuring consistent format
 * @param url - The URL to normalize
 * @returns Normalized URL
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);

    // Remove trailing slash from pathname (except for root)
    if (urlObj.pathname !== '/') {
      urlObj.pathname = urlObj.pathname.replace(/\/$/, '');
    }

    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, just remove trailing slash
    return url.replace(/\/$/, '');
  }
}

/**
 * Builds a URL with locale prefix
 * @param path - The path to build
 * @param locale - The locale code
 * @param baseUrl - The base URL
 * @returns Complete URL with locale prefix
 */
export function buildLocalizedUrl(path: string, locale: string, baseUrl: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const localizedPath = `/${locale}${cleanPath}`;
  return ensureAbsoluteUrl(localizedPath, baseUrl);
}
