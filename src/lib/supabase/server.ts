// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'

export function createClientServer() {
  const cookieStore = cookies()

  return createServerClient(
    ENV.SUPABASE_URL,
    ENV.SUPABASE_ANON,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Service role client for server-side operations that need elevated permissions
export function createServiceRoleClient() {
  if (!ENV.SUPABASE_SERVICE_ROLE) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createServerClient(
    ENV.SUPABASE_URL,
    ENV.SUPABASE_SERVICE_ROLE,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // No-op for service role client
        },
      },
    }
  )
}