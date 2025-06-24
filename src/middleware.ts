import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './lib/i18n-navigation';

const intlMiddleware = createMiddleware(routing);

function extractLocaleFromPath(pathname: string): { locale: string; pathWithoutLocale: string } {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];

  if (['en', 'vi'].includes(locale)) {
    return {
      locale,
      pathWithoutLocale: '/' + segments.slice(1).join('/') || '/',
    };
  }

  return {
    locale: 'vi',
    pathWithoutLocale: pathname,
  };
}

function hasAccess(userRoles: string[], path: string): boolean {
  if (path.startsWith('/admin')) {
    return userRoles.some(role => role.includes('ADMIN'));
  }
  return userRoles.length > 0;
}

function requiresAuth(path: string): boolean {
  return path.startsWith('/admin') || path.startsWith('/personal');
}

function getAuthData(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    const userRoles = request.cookies.get('userRoles')?.value;
    console.log('🚀 ~ getAuthData ~ userRoles:', userRoles);

    if (!accessToken || !userRoles) return null;

    return {
      accessToken,
      roles: JSON.parse(userRoles),
    };
  } catch {
    return null;
  }
}

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }

  const { locale, pathWithoutLocale } = extractLocaleFromPath(pathname);

  if (!requiresAuth(pathWithoutLocale)) {
    return intlMiddleware(request);
  }

  const authData = getAuthData(request);

  if (!authData) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!hasAccess(authData.roles, pathWithoutLocale)) {
    return NextResponse.redirect(new URL(`/${locale}/403`, request.url));
  }
  const response = intlMiddleware(request);
  if (response) {
    response.headers.set('x-user-roles', JSON.stringify(authData.roles));
  }

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
