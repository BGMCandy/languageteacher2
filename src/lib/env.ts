export const ENV = {
  get SUPABASE_URL() { 
    return process.env.NEXT_PUBLIC_SUPABASE_URL || ''; 
  },
  get SUPABASE_ANON() { 
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
  },
  get SITE_URL() { 
    return process.env.NEXT_PUBLIC_SITE_URL || ''; 
  },
}; 