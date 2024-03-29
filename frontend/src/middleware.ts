import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse } from 'next/server';
import { cookieName, fallbackLng, languages } from './lib/i18n/settings';
import { Logger } from './lib/log/Logger';

acceptLanguage.languages(languages);

// --- Custom Matcher configuration
export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};

// --- Middleware
export function middleware(req: NextRequest) {
  const log = new Logger({ name: 'Middleware' });
  log.info('initializing...');

  // Except additional URI (icon, chrome)
  if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1)
    return NextResponse.next();

  // Set language based on
  let lng: string | undefined | null;
  log.debug(`Cookie data in Request Header: ${req.cookies.get(cookieName)?.value}`);
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;
  log.debug(`lng content: ${lng}`);

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url));
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '');
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }
  return NextResponse.next();
}
