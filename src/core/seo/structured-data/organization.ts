import { getSEOConfig } from '../config';
import type { OrganizationSchema } from '../types';
import { ensureAbsoluteUrl } from '../utils';

export interface OrganizationOptions {
  locale?: string;
  contactType?: string;
  telephone?: string;
  email?: string;
}

/**
 * Generate Organization structured data schema
 * Requirement 4.3: Homepage should have Organization schema
 *
 * @param options - Optional configuration for organization schema
 * @returns OrganizationSchema object for JSON-LD
 */
export function generateOrganizationSchema(options: OrganizationOptions = {}): OrganizationSchema {
  const config = getSEOConfig(options.locale);

  // Collect social media links
  const sameAs: string[] = [];
  if (config.socialLinks.facebook) {
    sameAs.push(config.socialLinks.facebook);
  }
  if (config.socialLinks.twitter) {
    sameAs.push(config.socialLinks.twitter);
  }
  if (config.socialLinks.instagram) {
    sameAs.push(config.socialLinks.instagram);
  }
  if (config.socialLinks.youtube) {
    sameAs.push(config.socialLinks.youtube);
  }

  const schema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.organizationName,
    url: config.siteUrl,
    logo: ensureAbsoluteUrl(config.organizationLogo, config.siteUrl),
    sameAs,
  };

  // Add contact point if provided
  if (options.contactType || options.telephone || options.email) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      contactType: options.contactType || 'customer service',
    };

    if (options.telephone) {
      schema.contactPoint.telephone = options.telephone;
    }

    if (options.email) {
      schema.contactPoint.email = options.email;
    }
  }

  return schema;
}
