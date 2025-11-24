import { buildLocalizedUrl } from '../utils/url';

/**
 * Represents a single hreflang link tag
 */
export interface HreflangTag {
  hreflang: string;
  href: string;
}

/**
 * Generates hreflang link tags for a multilingual page
 * Hreflang tags help search engines serve the correct language version
 * to users based on their location and language preferences
 *
 * @param path - The page path (without locale prefix)
 * @param currentLocale - The current page locale
 * @param availableLocales - Array of all available locales for this page
 * @param baseUrl - The base URL of the site
 * @param defaultLocale - The default locale for x-default tag
 * @returns Array of hreflang tags
 */
export function generateHreflangTags(
  path: string,
  currentLocale: string,
  availableLocales: string[],
  baseUrl: string,
  defaultLocale: string,
): HreflangTag[] {
  const tags: HreflangTag[] = [];

  // Generate hreflang tag for each available locale
  availableLocales.forEach(locale => {
    const localizedUrl = buildLocalizedUrl(path, locale, baseUrl);

    tags.push({
      hreflang: locale,
      href: localizedUrl,
    });
  });

  // Add x-default tag pointing to the default locale
  const defaultUrl = buildLocalizedUrl(path, defaultLocale, baseUrl);
  tags.push({
    hreflang: 'x-default',
    href: defaultUrl,
  });

  return tags;
}

/**
 * Generates hreflang tags as Next.js Metadata alternates format
 * This format is compatible with Next.js 14 Metadata API
 *
 * @param path - The page path (without locale prefix)
 * @param currentLocale - The current page locale
 * @param availableLocales - Array of all available locales for this page
 * @param baseUrl - The base URL of the site
 * @param defaultLocale - The default locale for x-default tag
 * @returns Object with languages mapping for Next.js Metadata
 */
export function generateHreflangAlternates(
  path: string,
  currentLocale: string,
  availableLocales: string[],
  baseUrl: string,
  defaultLocale: string,
): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};

  // Generate URL for each available locale
  availableLocales.forEach(locale => {
    const localizedUrl = buildLocalizedUrl(path, locale, baseUrl);
    languages[locale] = localizedUrl;
  });

  // Add x-default
  const defaultUrl = buildLocalizedUrl(path, defaultLocale, baseUrl);
  languages['x-default'] = defaultUrl;

  return { languages };
}

/**
 * Checks if a locale should have a hreflang tag
 * Used to filter out locales where the page is not translated
 *
 * @param locale - The locale to check
 * @param translatedLocales - Array of locales where the page is translated
 * @returns True if the locale should be included in hreflang tags
 */
export function shouldIncludeLocale(locale: string, translatedLocales: string[]): boolean {
  return translatedLocales.includes(locale);
}

/**
 * Generates hreflang tags only for translated locales
 * Omits locales where the page is not available
 *
 * @param path - The page path (without locale prefix)
 * @param currentLocale - The current page locale
 * @param allLocales - Array of all possible locales
 * @param translatedLocales - Array of locales where this page is translated
 * @param baseUrl - The base URL of the site
 * @param defaultLocale - The default locale for x-default tag
 * @returns Array of hreflang tags for translated locales only
 */
export function generateHreflangTagsForTranslated(
  path: string,
  currentLocale: string,
  allLocales: string[],
  translatedLocales: string[],
  baseUrl: string,
  defaultLocale: string,
): HreflangTag[] {
  // Filter to only include translated locales
  const availableLocales = allLocales.filter(locale => shouldIncludeLocale(locale, translatedLocales));

  // If no locales are available, return empty array
  if (availableLocales.length === 0) {
    return [];
  }

  return generateHreflangTags(path, currentLocale, availableLocales, baseUrl, defaultLocale);
}
