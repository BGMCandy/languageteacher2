import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { ENV } from '@/lib/env'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON, {
    cookies: {
      get: (name: string) => req.cookies.get(name)?.value,
      set: (name: string, value: string, options: Record<string, unknown>) => {
        req.cookies.set({ name, value, ...options })
        res.cookies.set({ name, value, ...options })
      },
      remove: (name: string, options: Record<string, unknown>) => {
        req.cookies.set({ name, value: '', ...options })
        res.cookies.set({ name, value: '', ...options })
      },
    },
  })

  await supabase.auth.getSession()
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 