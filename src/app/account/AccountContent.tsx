'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect, useCallback } from 'react'
import { createClientBrowser } from '@/lib/supabase/clients'
import Link from 'next/link'

export default function AccountContent() {
  const { user, signOut } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loadProfile = useCallback(async () => {
    if (!user) return
    
    try {
      const supabase = createClientBrowser()
      
      // Try to get display name from profiles table first
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
      }
      
      // Set display name from profile or fall back to user metadata
      if (profile?.display_name) {
        setDisplayName(profile.display_name)
      } else {
        setDisplayName(user.user_metadata?.display_name || '')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      // Fall back to user metadata
      setDisplayName(user.user_metadata?.display_name || '')
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user, loadProfile])

  const handleUpdateDisplayName = async () => {
    if (!user || !displayName.trim()) return
    
    setIsLoading(true)
    try {
      const supabase = createClientBrowser()
      
      // Update the display_name in profiles table using the function
      const { error } = await supabase.rpc('update_display_name', {
        new_display_name: displayName.trim()
      })

      if (error) throw error

      // Update local user metadata for immediate UI update
      const { error: updateError } = await supabase.auth.updateUser({
        data: { display_name: displayName.trim() }
      })

      if (updateError) throw updateError

      setIsEditing(false)
    } catch (error) {
      console.error('Error updating display name:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-4">Account Access Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your account information.</p>
            <Link
              href="/login"
              className="inline-block bg-black text-white px-8 py-3 font-medium tracking-wider border-2 border-black hover:bg-gray-800 transition-all duration-200 hover:font-fugaz"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-8">
            {/* Sharp geometric logo */}
            <div className="w-12 h-12 bg-black relative">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <h1 className="text-4xl font-bold text-black tracking-wider">
              YOUR ACCOUNT
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 tracking-wide">
            Manage your Language Teacher profile and preferences
          </p>
        </div>

        {/* Content */}
        <div className="border-2 border-black p-12">
          {/* Profile Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              PROFILE INFORMATION
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2 tracking-wider uppercase">
                  Display Name
                </label>
                {isEditing ? (
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-200"
                      placeholder="Enter your display name"
                    />
                    <button
                      onClick={handleUpdateDisplayName}
                      disabled={isLoading}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-200 font-medium tracking-wider border-2 border-black hover:font-fugaz disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'SAVING...' : 'SAVE'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setDisplayName(user.user_metadata?.display_name || '')
                      }}
                      className="px-6 py-3 bg-white text-black hover:bg-gray-100 transition-all duration-200 font-medium tracking-wider border-2 border-black hover:font-fugaz"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="px-4 py-3 border-2 border-gray-200 bg-gray-50 text-gray-700 min-h-[52px] flex items-center">
                      {displayName || 'No display name set'}
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="ml-4 px-6 py-3 bg-white text-black hover:bg-gray-100 transition-all duration-200 font-medium tracking-wider border-2 border-black hover:font-fugaz"
                    >
                      EDIT
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2 tracking-wider uppercase">
                  Email
                </label>
                <div className="px-4 py-3 border-2 border-gray-200 bg-gray-50 text-gray-700 min-h-[52px] flex items-center">
                  {user.email}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2 tracking-wider uppercase">
                  Last Sign In
                </label>
                <div className="px-4 py-3 border-2 border-gray-200 bg-gray-50 text-gray-700 min-h-[52px] flex items-center">
                  {formatDate(user.last_sign_in_at || '')}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Progress */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              LEARNING PROGRESS
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-blue-200 p-6 bg-blue-50">
                <h3 className="text-lg font-semibold text-black mb-4 tracking-wider">JAPANESE KANJI</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600 tracking-wider uppercase">Characters Studied</span>
                    <p className="text-2xl font-bold text-black">0</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 tracking-wider uppercase">Mastery Level</span>
                    <p className="text-lg font-semibold text-black">Beginner</p>
                  </div>
                </div>
              </div>
              
              <div className="border-2 border-green-200 p-6 bg-green-50">
                <h3 className="text-lg font-semibold text-black mb-4 tracking-wider">THAI CHARACTERS</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600 tracking-wider uppercase">Characters Studied</span>
                    <p className="text-2xl font-bold text-black">0</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 tracking-wider uppercase">Mastery Level</span>
                    <p className="text-lg font-semibold text-black">Beginner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              QUICK ACTIONS
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/study"
                className="block w-full py-4 px-6 bg-blue-600 text-white text-center font-medium tracking-wider border-2 border-blue-600 hover:bg-blue-700 transition-all duration-200 hover:font-fugaz"
              >
                STUDY KANJI
              </Link>
              
              <Link
                href="/practice"
                className="block w-full py-4 px-6 bg-green-600 text-white text-center font-medium tracking-wider border-2 border-green-600 hover:bg-green-700 transition-all duration-200 hover:font-fugaz"
              >
                PRACTICE MODE
              </Link>
              
              <button
                onClick={signOut}
                className="w-full py-4 px-6 bg-red-600 text-white font-medium tracking-wider border-2 border-red-600 hover:bg-red-700 transition-all duration-200 hover:font-fugaz"
              >
                SIGN OUT
              </button>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="text-center mt-16">
          <div className="flex justify-center space-x-8">
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
          </div>
        </div>
      </div>
    </div>
  )
} 