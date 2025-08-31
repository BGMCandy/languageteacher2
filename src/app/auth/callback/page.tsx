'use client'

import { useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientBrowser } from '@/lib/supabase/clients'

function AuthCallbackContent() {
  const supabase = useRef(createClientBrowser()).current
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    let alive = true
    ;(async () => {
      console.log('=== AUTH CALLBACK DEBUG START ===')
      console.log('Current URL:', window.location.href)
      console.log('Current origin:', window.location.origin)
      console.log('Current pathname:', window.location.pathname)
      
      // Log ALL search parameters
      const allParams = Object.fromEntries(params.entries())
      console.log('All search parameters:', allParams)
      
      const err = params.get('error_description') || params.get('error')
      const code = params.get('code')
      const next = params.get('next') || '/account'
      const state = params.get('state')
      
      console.log('Parsed parameters:', {
        error: err,
        code: code ? `Present (length: ${code.length})` : 'Missing',
        next,
        state: state ? 'Present' : 'Missing'
      })

      if (err) {
        console.error('OAuth error:', err)
        if (!alive) return
        router.replace(`/login?error=${encodeURIComponent(err)}`)
        return
      }

      if (code) {
        console.log('Code details:', {
          length: code.length,
          preview: code.substring(0, 20) + '...',
          endsWith: code.endsWith('=') ? 'Yes (base64)' : 'No'
        })
        
        console.log('About to exchange code for session...')
        console.log('Supabase client created:', !!supabase)
        
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        console.log('Exchange result:', {
          hasData: !!data,
          hasSession: !!data?.session,
          hasUser: !!data?.user,
          error: error ? {
            message: error.message,
            name: error.name,
            status: error.status
          } : null
        })
        
        if (error) {
          console.error('exchangeCodeForSession error:', error)
          console.error('Error details:', {
            message: error.message,
            status: error.status,
            name: error.name
          })
          if (!alive) return
          router.replace('/login?error=oauth')
          return
        }
        
        if (data?.session) {
          console.log('Session created successfully!')
          console.log('User email:', data.user?.email)
          console.log('Session expires:', data.session.expires_at)
        }
        
        if (!alive) return
        console.log('Redirecting to:', next)
        router.replace(next)
        return
      }

      // No code: direct visit or lost PKCE — if already signed in, continue.
      console.log('No code found, checking existing session...')
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Existing session:', session ? 'Found' : 'None')
      
      if (!alive) return
      const redirectTarget = session ? next : '/login'
      console.log('Redirecting to:', redirectTarget)
      router.replace(redirectTarget)
      
      console.log('=== AUTH CALLBACK DEBUG END ===')
    })()
    return () => { alive = false }
  }, [params, router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Completing Sign In
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we complete your authentication...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
          Check the browser console for debugging information
        </p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
