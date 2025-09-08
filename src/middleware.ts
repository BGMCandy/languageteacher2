import { NextRequest, NextResponse } from 'next/server'

export async function middleware(_req: NextRequest) {
  const res = NextResponse.next()
  
  // Simple middleware that just passes through for now
  // This avoids any potential issues with Supabase or environment variables
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap).*)'],
} 