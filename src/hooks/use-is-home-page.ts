import { usePathname } from 'next/navigation';

/**
 * Hook to check if current route is the home page
 * Handles i18n routes (/, /en, /vi, etc.)
 *
 * @returns boolean - true if on home page, false otherwise
 */
export const useIsHomePage = (): boolean => {
  const pathname = usePathname();

  // Match home page: /, /en, /vi, or any locale prefix followed by nothing
  // This regex matches: "/" or "/locale" where locale is 2-3 characters
  return /^\/(([a-z]{2,3}))?$/.test(pathname);
};
