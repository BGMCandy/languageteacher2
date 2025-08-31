'use client'

import { useState } from 'react'
import { createClientBrowser } from '@/lib/supabase/clients'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClientBrowser()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setMessage('')
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`
      })
      
      if (error) throw error
      
      setMessage('Check your email for a password reset link!')
    } catch (error) {
      console.error('Password reset error:', error)
      setMessage('Error sending password reset email')
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
              RESET PASSWORD
            </h1>
          </div>
          <div className="h-px w-24 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 tracking-wide">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>

        {/* Form Container */}
        <div className="border-2 border-black p-12">
          <form className="space-y-8" onSubmit={handleResetPassword}>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-black text-white hover:bg-gray-800 transition-all duration-200 font-medium tracking-wider border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed hover:font-fugaz"
            >
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-black hover:text-gray-600 transition-colors duration-200 tracking-wide font-medium hover:font-fugaz"
              >
                BACK TO SIGN IN
              </Link>
            </div>
          </form>

          {/* Message Display */}
          {message && (
            <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 text-blue-800">
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
