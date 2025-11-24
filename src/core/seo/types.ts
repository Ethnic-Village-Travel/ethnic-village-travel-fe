// Core SEO type definitions

export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultLocale: string;
  locales: string[];
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  defaultImage: string;
  twitterHandle?: string;
  facebookAppId?: string;
  organizationName: string;
  organizationLogo: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  locale?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface TourMetadata extends PageMetadata {
  tourId: number;
  tourName: string;
  tourSlug: string;
  price: number;
  currency: string;
  duration: number;
  location: string;
  ethnics: string[];
  rating?: number;
  reviewCount?: number;
  availableDates?: string[];
  images?: string[];
}

export interface ArticleMetadata extends PageMetadata {
  articleId: number;
  articleSlug: string;
  excerpt: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  tags?: string[];
  category?: string;
}

export interface StructuredDataBase {
  '@context': 'https://schema.org';
  '@type': string;
}

export interface OrganizationSchema extends StructuredDataBase {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    telephone?: string;
    email?: string;
  };
}

export interface TouristTripSchema extends StructuredDataBase {
  '@type': 'TouristTrip';
  name: string;
  description: string;
  image: string[];
  offers: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  itinerary?: {
    '@type': 'ItemList';
    itemListElement: Array<{
      '@type': 'ListItem';
      position: number;
      name: string;
      description: string;
    }>;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
  touristType?: string[];
  duration?: string;
}

export interface ArticleSchema extends StructuredDataBase {
  '@type': 'Article' | 'BlogPosting';
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export interface WebSiteSchema extends StructuredDataBase {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface BreadcrumbSchema extends StructuredDataBase {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: {
    languages: Record<string, string>;
  };
}
