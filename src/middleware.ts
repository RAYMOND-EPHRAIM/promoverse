import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

// Paths that don't require authentication
const publicPaths = ['/auth/signin'];

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path));

  // If the path is public, allow access regardless of authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected route, redirect to signin
  if (!isAuthenticated) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 