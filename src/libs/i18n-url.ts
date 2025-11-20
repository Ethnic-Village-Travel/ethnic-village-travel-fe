import { envConfig } from '@/core/configs/env.config';

import { routing } from '@/libs/i18n-navigation';

export const getBaseUrl = () => {
  const clientUri = envConfig.CLIENT_URI;
  const vercelProdUrl = envConfig.VERCEL_PROJECT_PRODUCTION_URL;
  const vercelUrl = envConfig.VERCEL_URL;
  if (clientUri) {
    return clientUri;
  }

  if (envConfig.isProduction && vercelProdUrl) {
    return `https://${vercelProdUrl}`;
  }

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return 'http://localhost:3000';
};

export const getI18nPath = (url: string, locale: string) => {
  if (locale === routing.defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
};
