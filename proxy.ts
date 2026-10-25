import {NextResponse, type NextRequest} from 'next/server';

export function proxy(request: NextRequest) {
  const locale = request.nextUrl.pathname.split('/')[1];
  if (locale === 'fr' || locale === 'ar') {
    const headers = new Headers(request.headers);
    headers.set('x-wiplay-locale', locale);
    return NextResponse.next({request: {headers}});
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
