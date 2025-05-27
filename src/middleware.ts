import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // DO NOTHING - let components handle everything
  console.log(`${request}`);
  return NextResponse.next();

}

export const config = {
  matcher: [
    // Don't run middleware at all
    '/disabled-path-that-never-matches'
  ],
};