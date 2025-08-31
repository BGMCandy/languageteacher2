// lib/supabase/clients.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { ENV } from '@/lib/env'
import { cookies } from 'next/headers'

export function createClientBrowser() {
  return createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON)
}

export async function createClientServer() {
  const cookieStore = await cookies()
  
  return createServerClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => {
        cookieStore.set({ name, value, ...options })
      },
      remove: (name: string, options: any) => {
        cookieStore.set({ name, value: '', ...options })
      },
    },
  })
}
