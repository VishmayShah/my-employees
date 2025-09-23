import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'

export async function decodeToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const decoded = await jwtVerify(token, secret);
    return decoded.payload; // Typically contains user info like { id, role, email }
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  console.log('Middleware triggered for:', request.nextUrl.pathname);
  const token = request.cookies.get('token')?.value;
  const user: any = token ? await decodeToken(token) : null;

  const protectedRoutes = ['/admin'];
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const allowedRoles = ['admin'];

  if (isProtected && (!user || !allowedRoles.includes(user.role))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/admin/:path*'],
};
