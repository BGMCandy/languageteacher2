'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClientBrowser } from '@/lib/supabase/clients'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'info' | 'error' | 'success'>('info')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Handle error parameters from URL
    const error = searchParams.get('error')
    
    if (error) {
      setMessage(`Authentication error: ${decodeURIComponent(error)}`)
      setMessageType('error')
    }
  }, [searchParams])

  const getRedirectPath = () => {
    const redirect = searchParams.get('redirect')
    return redirect || '/'
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setMessage('')
      
      console.log('=== GOOGLE OAUTH DEBUG START ===')
      console.log('Current origin:', window.location.origin)
      console.log('Current pathname:', window.location.pathname)
      console.log('Redirect path:', getRedirectPath())
      console.log('Supabase URL from env:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Site URL from env:', process.env.NEXT_PUBLIC_SITE_URL)
      
      const supabase = createClientBrowser()
      
      // Try to bypass PKCE by using a different OAuth approach
      const oauthOptions = {
        provider: 'google' as const,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            include_granted_scopes: 'true'
          },
          skipBrowserRedirect: false
        }
      }
      
      console.log('OAuth options being sent:', oauthOptions)
      
      // Clear any existing auth state before starting OAuth
      await supabase.auth.signOut()
      
      const { data, error } = await supabase.auth.signInWithOAuth(oauthOptions)
      
      console.log('OAuth response:', { data, error })
      
      if (error) throw error
      
      console.log('OAuth initiated successfully')
      console.log('=== GOOGLE OAUTH DEBUG END ===')
      
    } catch (error) {
      console.error('Google sign in error:', error)
      setMessage('Error starting Google sign in. Please try again.')
      setMessageType('error')
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const supabase = createClientBrowser()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      // Redirect to intended destination or homepage
      router.push(getRedirectPath())
    } catch (error) {
      console.error('Email sign in error:', error)
      setMessage('Error signing in with email')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const supabase = createClientBrowser()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(getRedirectPath())}`
        }
      })
      
      if (error) throw error
      
      setMessage('Check your email for confirmation link!')
      setMessageType('success')
    } catch (error) {
      console.error('Sign up error:', error)
      setMessage('Error signing up')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const getMessageStyles = () => {
    switch (messageType) {
      case 'error':
        return 'bg-red-50 border-2 border-red-200 text-red-800'
      case 'success':
        return 'bg-green-50 border-2 border-green-200 text-green-800'
      default:
        return 'bg-blue-50 border-2 border-blue-200 text-blue-800'
    }
  }

  return (
    <div className="bg-white flex items-center justify-center px-8 py-16">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-8">
            {/* Sharp geometric logo */}
            <div className="w-12 h-12 bg-black relative">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <h1 className="text-3xl font-bold text-black tracking-wider">
              SIGN IN
            </h1>
          </div>
          <div className="h-px w-24 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 tracking-wide">
            Access your Language Teacher account
          </p>
        </div>

        {/* Form Container */}
        <div className="border-2 border-black p-12">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-4 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200 font-medium tracking-wider mb-8 disabled:opacity-50 disabled:cursor-not-allowed hover:font-fugaz"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            CONTINUE WITH GOOGLE
          </button>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-black" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-black text-sm tracking-wider font-medium">
                OR CONTINUE WITH EMAIL
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form className="space-y-6" onSubmit={handleEmailSignIn}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-3 tracking-wider uppercase">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-3 tracking-wider uppercase">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-200"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-right">
              <Link
                href="/auth/forgot"
                className="text-sm text-black hover:text-gray-600 transition-colors duration-200 tracking-wide hover:font-fugaz"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-black text-white hover:bg-gray-800 transition-all duration-200 font-medium tracking-wider border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed hover:font-fugaz"
              >
                SIGN IN
              </button>

              <button
                type="button"
                onClick={handleSignUp}
                disabled={loading}
                className="w-full py-3 px-6 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200 font-medium tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:font-fugaz"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </form>

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-4 ${getMessageStyles()}`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}
        </div>

        {/* Bottom accent */}
        <div className="text-center mt-8">
          <div className="flex justify-center space-x-4">
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-white flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 bg-black relative mb-6">
            <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
            <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
          </div>
          <h2 className="text-xl font-bold text-black tracking-wider">
            LOADING...
          </h2>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
