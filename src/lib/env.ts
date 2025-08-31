function required(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

export const ENV = {
  SUPABASE_URL: required('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON: required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '',
} 