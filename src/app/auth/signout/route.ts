import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createServerClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: Record<string, unknown>) => {
        cookieStore.set({ name, value, ...options })
      },
      remove: (name: string, options: Record<string, unknown>) => {
        cookieStore.set({ name, value: '', ...options })
      },
    },
  })
  
  await supabase.auth.signOut()
  
  // Use the environment variable without hardcoded fallback
  const siteUrl = ENV.SITE_URL
  if (!siteUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL environment variable is required')
  }
  
  return NextResponse.redirect(new URL('/login', siteUrl))
}
