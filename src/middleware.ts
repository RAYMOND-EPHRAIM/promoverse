import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAdmin = token?.email === 'epharimray@gmail.com';

  // Allow access to admin routes only for admin
  if (request.nextUrl.pathname.startsWith('/api/admin') && !isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Allow access to wallet without authentication for admin
  if (request.nextUrl.pathname.startsWith('/wallet') && isAdmin) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/wallet/:path*'],
}; 