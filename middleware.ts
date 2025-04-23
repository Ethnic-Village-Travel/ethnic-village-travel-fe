import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './libs/i18n-navigation';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const path = request.nextUrl.pathname;

  if (path === '/sitemap.xml' || path === '/robots.txt') {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
