'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function SignOutButton() {
  const { signOut } = useAuth()

  return (
    <button
      onClick={signOut}
      className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-all duration-200 font-medium tracking-wider border-2 border-red-600 hover:font-fugaz"
    >
      SIGN OUT
    </button>
  )
} 