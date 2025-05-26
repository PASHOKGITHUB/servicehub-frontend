// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protected routes for different roles - CORRECTED PATHS
  const adminRoutes = ['/admin-dashboard'];
  const providerRoutes = ['/provider-dashboard'];
  const userRoutes = ['/user-dashboard'];
  const authRoutes = ['/login', '/register'];
  
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  const isProviderRoute = providerRoutes.some(route => path.startsWith(route));
  const isUserRoute = userRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));
  const isProtectedRoute = isAdminRoute || isProviderRoute || isUserRoute;
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Redirect to login if accessing protected routes without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to appropriate dashboard if accessing auth routes with token
  if (isAuthRoute && token) {
    // Default redirect to user dashboard - the app will handle role-based routing
    return NextResponse.redirect(new URL('/user-dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (landing page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|$).*)',
  ],
};