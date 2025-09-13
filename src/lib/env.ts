export const ENV = {
  get SUPABASE_URL() { 
    return process.env.NEXT_PUBLIC_SUPABASE_URL || ''; 
  },
  get SUPABASE_ANON() { 
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
  },
  get SUPABASE_SERVICE_ROLE() { 
    return process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 
  },
  get OPENAI_API_KEY() { 
    return process.env.OPENAI_API_KEY || ''; 
  },
  get SITE_URL() { 
    return process.env.NEXT_PUBLIC_SITE_URL || ''; 
  },
}; 