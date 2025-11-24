import type { MetadataRoute } from 'next';
import { generateRobotsTxt } from '@/core/seo/robots';

import { getBaseUrl } from '@/libs/i18n-url';

export default function robots(): MetadataRoute.Robots {
  return generateRobotsTxt({
    siteUrl: getBaseUrl(),
  });
}
