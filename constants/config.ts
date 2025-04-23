import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

export const AppConstant = {
  name: 'Ethnic Village Travel',
  locales: ['en', 'vi'],
  defaultLocale: 'vi',
  localePrefix,
};
