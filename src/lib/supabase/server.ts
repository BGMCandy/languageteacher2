import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'

export async function createClientServer() {
  const cookieStore = await cookies()
  return createServerClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON, {
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
} 