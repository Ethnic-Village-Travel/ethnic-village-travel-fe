# SEO Core Module

Module SEO tập trung cho Ethnic Village Travel, cung cấp metadata, structured data, Open Graph, Twitter Cards, sitemap
và robots.txt.

## Cài đặt

Module đã được tích hợp sẵn trong project tại `src/core/seo/`.

## Cấu hình

Cấu hình SEO nằm trong `config.ts`:

```typescript
import { getSEOConfig, seoConfig } from '@/core/seo/config';

// Lấy config mặc định
const config = seoConfig;

// Lấy config theo locale
const viConfig = getSEOConfig('vi');
const enConfig = getSEOConfig('en');
```

## Sử dụng

### 1. Metadata cho Tour Pages

```typescript
// src/app/[locale]/(marketing)/tour/[slug]/page.tsx
import type { Metadata } from 'next';
import { generateTourMetadata } from '@/core/seo/metadata/tour';
import { tourApi } from '@/data/apis/tour.api';

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug, locale } = params;
  const response = await tourApi.getTourDetail(slug);

  if (response.success && response.data) {
    return generateTourMetadata(response.data, locale);
  }

  return {}; // Fallback
}
```

### 2. Metadata cho Article Pages

```typescript
// src/app/[locale]/(marketing)/article/[slug]/page.tsx
import { generateArticleMetadata } from '@/core/seo/metadata/article';

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug, locale } = params;
  const article = await fetchArticle(slug);

  return generateArticleMetadata(article, locale);
}
```

### 3. Structured Data - Breadcrumb

```typescript
import { generateBreadcrumbSchema } from '@/core/seo/structured-data/breadcrumb';

const breadcrumbItems = [
  { name: 'Trang chủ', url: 'https://example.com' },
  { name: 'Tours', url: 'https://example.com/tour' },
  { name: 'Tour Name', url: 'https://example.com/tour/slug' },
];

const schema = generateBreadcrumbSchema(breadcrumbItems);

// Thêm vào metadata
return {
  ...metadata,
  other: {
    'script:ld+json': JSON.stringify(schema),
  },
};
```

### 4. Sitemap

Sitemap được tự động generate tại `src/app/sitemap.ts`:

```typescript
import { generateSitemap } from '@/core/seo/sitemap';
import type { SitemapPageInput } from '@/core/seo/sitemap/types';

export default async function sitemap() {
  const pages: SitemapPageInput[] = [
    { path: '', type: 'homepage', lastModified: new Date() },
    { path: 'tour', type: 'tour-listing', lastModified: new Date() },
    // ... thêm pages
  ];

  return generateSitemap(pages, {
    baseUrl: 'https://example.com',
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
  });
}
```

### 5. Robots.txt

Robots.txt được generate tại `src/app/robots.ts`:

```typescript
import { generateRobotsTxt } from '@/core/seo/robots';

export default function robots() {
  return generateRobotsTxt({
    siteUrl: 'https://example.com',
  });
}
```

## API Reference

### Metadata Generators

- `generateBaseMetadata(data, locale)` - Base metadata cho mọi page
- `generateTourMetadata(tour, locale)` - Metadata cho tour pages
- `generateArticleMetadata(article, locale)` - Metadata cho article pages

### Structured Data Generators

- `generateOrganizationSchema(config)` - Organization schema
- `generateWebSiteSchema(config)` - WebSite schema
- `generateTouristTripSchema(tour, locale)` - TouristTrip schema
- `generateArticleSchema(article, locale)` - Article schema
- `generateBreadcrumbSchema(items)` - Breadcrumb schema

### Social Media

- `generateOpenGraphTags(data, locale)` - Open Graph tags
- `generateTwitterCardTags(data, locale)` - Twitter Card tags

### Links

- `generateCanonicalUrl(path, locale, config)` - Canonical URL
- `generateHreflangTags(path, locales, config)` - Hreflang tags

### Utilities

- `truncateText(text, maxLength, respectWordBoundaries)` - Truncate text
- `ensureAbsoluteUrl(url, baseUrl)` - Convert to absolute URL
- `cleanUrl(url, removeParams)` - Clean URL

## Ví dụ Tích hợp Đầy đủ

```typescript
// src/app/[locale]/(marketing)/tour/[slug]/page.tsx
import type { Metadata } from 'next';
import { getSEOConfig } from '@/core/seo/config';
import { generateTourMetadata } from '@/core/seo/metadata/tour';
import { generateBreadcrumbSchema } from '@/core/seo/structured-data/breadcrumb';
import { tourApi } from '@/data/apis/tour.api';

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug, locale } = params;
  const response = await tourApi.getTourDetail(slug);

  if (!response.success || !response.data) {
    return {};
  }

  const tour = response.data;
  const config = getSEOConfig(locale);

  // Generate tour metadata (includes TouristTrip structured data)
  const metadata = generateTourMetadata(tour, locale);

  // Generate breadcrumb
  const breadcrumbItems = [
    { name: 'Home', url: `${config.siteUrl}/${locale}` },
    { name: 'Tours', url: `${config.siteUrl}/${locale}/tour` },
    { name: tour.title, url: `${config.siteUrl}/${locale}/tour/${tour.slug}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  // Combine structured data
  const existingStructuredData = metadata.other?.['script:ld+json'];
  const structuredDataArray = [
    existingStructuredData ? JSON.parse(existingStructuredData as string) : null,
    breadcrumbSchema,
  ].filter(Boolean);

  return {
    ...metadata,
    other: {
      'script:ld+json': JSON.stringify(structuredDataArray),
    },
  };
}

export default function TourDetailPage({ params }) {
  return <TourDetail slug={params.slug} />;
}
```

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://ethnicvillagetravel.com
NODE_ENV=production
```

## Lưu ý

- Tất cả metadata tự động include Open Graph và Twitter Card tags
- Structured data tự động được thêm vào metadata
- URLs tự động được convert sang absolute URLs
- Text tự động được truncate theo giới hạn SEO (title: 60 chars, description: 160 chars)
- Hỗ trợ đa ngôn ngữ (vi, en) với locale-specific config

## Tài liệu Spec

Chi tiết đầy đủ về requirements, design và implementation plan xem tại:

- `.kiro/specs/seo-core-module/requirements.md`
- `.kiro/specs/seo-core-module/design.md`
- `.kiro/specs/seo-core-module/tasks.md`
