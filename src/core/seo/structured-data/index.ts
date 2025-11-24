// Structured data utilities

// Helpers
export {
  createImageObjectSchema,
  createPersonSchema,
  formatISO8601Date,
  formatISO8601Duration,
  validateStructuredData,
  wrapStructuredData,
} from './helpers';

// Organization schema
export { generateOrganizationSchema } from './organization';
export type { OrganizationOptions } from './organization';

// WebSite schema
export { generateWebSiteSchema } from './website';
export type { WebSiteOptions } from './website';

// TouristTrip schema
export { generateTouristTripSchema } from './tourist-trip';

// Article schema
export { generateArticleSchema } from './article';
export type { ArticleSchemaOptions } from './article';

// Breadcrumb schema
export { generateBreadcrumbSchema } from './breadcrumb';
export type { BreadcrumbItem } from './breadcrumb';
