'use client'

import { useState, useEffect } from 'react'
import { createClientBrowser } from '@/lib/supabase/clients'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientBrowser()

  useEffect(() => {
    // Check if user has a valid session (they should be logged in after password reset)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?error=no_session')
      }
    }
    
    checkSession()
  }, [supabase.auth, router])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      setMessage('')
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })
      
      if (updateError) throw updateError
      
      setMessage('Password updated successfully! Redirecting to your account...')
      
      // Redirect to account page after a short delay
      setTimeout(() => {
        router.push('/account')
      }, 2000)
      
    } catch (error) {
      console.error('Password update error:', error)
      setError('Error updating password')
    } finally {
      setLoading(false)
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
              SET NEW PASSWORD
            </h1>
          </div>
          <div className="h-px w-24 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 tracking-wide">
            Choose a new password for your account
          </p>
        </div>

        {/* Form Container */}
        <div className="border-2 border-black p-12">
          <form className="space-y-8" onSubmit={handleUpdatePassword}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-3 tracking-wider uppercase">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-200"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-3 tracking-wider uppercase">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-200"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-black text-white hover:bg-gray-800 transition-all duration-200 font-medium tracking-wider border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed hover:font-fugaz"
            >
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-8 p-4 bg-red-50 border-2 border-red-200 text-red-800">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message Display */}
          {message && (
            <div className="mt-8 p-4 bg-green-50 border-2 border-green-200 text-green-800">
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
