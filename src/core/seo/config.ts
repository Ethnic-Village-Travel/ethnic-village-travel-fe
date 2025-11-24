import type { SEOConfig } from './types';

// Get site URL from environment variable or use default
const getSiteUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_CLIENT_URI || process.env.NEXT_PUBLIC_SITE_URL || 'https://ethnicvillagetravel.com';
};

export const seoConfig: SEOConfig = {
  siteName: 'Ethnic Village Travel',
  siteUrl: getSiteUrl(),
  defaultLocale: 'vi',
  locales: ['vi', 'en'],
  defaultTitle: 'Ethnic Village Travel - Khám phá vẻ đẹp các làng dân tộc Việt Nam',
  defaultDescription:
    'Đặt tour du lịch văn hóa dân tộc thiểu số Việt Nam. Trải nghiệm chân thực với cộng đồng Hmong, Thái, Mường và nhiều dân tộc khác.',
  defaultKeywords: [
    'du lịch dân tộc',
    'làng dân tộc Việt Nam',
    'tour Hmong',
    'tour Thái',
    'tour Mường',
    'văn hóa dân tộc',
    'ethnic village',
    'Vietnam ethnic tours',
  ],
  defaultImage: '/images/homepage_hero.jpg',
  twitterHandle: '@EthnicVillageVN',
  organizationName: 'Ethnic Village Travel',
  organizationLogo: '/icons/logo.svg',
  socialLinks: {
    facebook: 'https://facebook.com/ethnicvillagetravel',
    instagram: 'https://instagram.com/ethnicvillagetravel',
  },
};

// Locale-specific overrides
export const localeConfig: Record<string, Partial<SEOConfig>> = {
  en: {
    defaultTitle: "Ethnic Village Travel - Discover Vietnam's Ethnic Villages",
    defaultDescription:
      'Book authentic ethnic minority cultural tours in Vietnam. Experience genuine connections with Hmong, Thai, Muong, and other ethnic communities.',
    defaultKeywords: [
      'ethnic village tours',
      'Vietnam ethnic minorities',
      'Hmong tours',
      'Thai tours',
      'Muong tours',
      'cultural tourism Vietnam',
      'authentic ethnic experiences',
    ],
  },
};

/**
 * Get SEO configuration for a specific locale
 *
 * Retrieves the SEO configuration with locale-specific overrides applied.
 * If no locale is provided or the locale doesn't have overrides, returns the base configuration.
 *
 * @param locale - Optional locale code (e.g., 'vi', 'en')
 * @returns SEO configuration object with locale-specific overrides applied
 *
 * @example
 * ```typescript
 * // Get Vietnamese configuration (default)
 * const viConfig = getSEOConfig('vi');
 * console.log(viConfig.defaultTitle); // Vietnamese title
 *
 * // Get English configuration
 * const enConfig = getSEOConfig('en');
 * console.log(enConfig.defaultTitle); // English title
 *
 * // Get base configuration
 * const baseConfig = getSEOConfig();
 * ```
 */
export function getSEOConfig(locale?: string): SEOConfig {
  if (locale && localeConfig[locale]) {
    return { ...seoConfig, ...localeConfig[locale] };
  }
  return seoConfig;
}
