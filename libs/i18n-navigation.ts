import { AppConstant } from '@/constants/config';
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: AppConstant.locales,
  defaultLocale: AppConstant.defaultLocale,
  localePrefix: AppConstant.localePrefix,
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
