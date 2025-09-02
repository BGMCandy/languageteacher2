'use client'
import { useEffect, useState } from 'react'
import { createClientBrowser } from '@/lib/supabase/clients'

export default function GoogleButton() {
  const [origin, setOrigin] = useState<string>('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const handleGoogle = async () => {
    const supabase = createClientBrowser()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Supabase will send user -> Google -> Supabase -> back to this URL:
        redirectTo: `${origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' }, // ensures refresh token
      },
    })
  }

  return (
    <button
      onClick={handleGoogle}
      className="rounded-md border px-4 py-2 cursor-pointer"
    >
      Continue with Google
    </button>
  )
}
