'use client'

import { createClientBrowser } from '@/lib/supabase/clients'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClientBrowser()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
        return
      }
      
      // Redirect to login page after successful sign out
      router.push('/login')
    } catch (error) {
      console.error('Unexpected error during sign out:', error)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
    >
      Sign Out
    </button>
  )
} 