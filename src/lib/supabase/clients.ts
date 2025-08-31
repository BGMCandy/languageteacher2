// lib/supabase/clients.ts
import { createBrowserClient } from '@supabase/ssr'
import { ENV } from '@/lib/env'

export function createClientBrowser() {
  const supabaseUrl = ENV.SUPABASE_URL
  const supabaseAnonKey = ENV.SUPABASE_ANON

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
