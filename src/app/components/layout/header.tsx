'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

const Header = () => {
  const { user, loading, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white border-b-2 border-black sticky top-0 z-50 h-20">
      <div className="max-w-7xl mx-auto px-8 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Logo and Title */}
          <Link href="/">
            <div className="flex items-center space-x-6">
              {/* Sharp geometric logo */}
              <div className="w-12 h-12 bg-black relative">
                <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
                <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black tracking-wider">
                  LANGUAGE TEACHER
                </h1>
                <div className="h-0.5 w-16 bg-black mt-1"></div>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <Link href="/" className="text-black hover:text-gray-600 font-medium transition-colors duration-200 relative group hover:font-fugaz w-16 h-6 flex items-center justify-center">
              <span className="relative z-10">HOME</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link href="/kanji-poster" className="text-black hover:text-gray-600 font-medium transition-colors duration-200 relative group hover:font-fugaz w-16 h-6 flex items-center justify-center">
              <span className="relative z-10">KANJI</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link href="/practice" className="text-black hover:text-gray-600 font-medium transition-colors duration-200 relative group hover:font-fugaz w-20 h-6 flex items-center justify-center">
              <span className="relative z-10">PRACTICE</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link href="/dictionary" className="text-black hover:text-gray-600 font-medium transition-colors duration-200 relative group hover:font-fugaz w-24 h-6 flex items-center justify-center">
              <span className="relative z-10">DICTIONARY</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></div>
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-6">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</div>
                      <div className="text-black font-medium truncate max-w-48">
                        {user.email}
                      </div>
                    </div>
                    <Link
                      href="/account"
                      className="text-black hover:text-gray-600 font-medium transition-colors duration-200 hover:font-fugaz w-20 h-6 flex items-center justify-center"
                    >
                      ACCOUNT
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 font-medium hover:font-fugaz w-24 h-10 flex items-center justify-center"
                    >
                      SIGN OUT
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="hidden md:block text-black hover:text-gray-600 font-medium transition-colors duration-200 hover:font-fugaz w-20 h-6 flex items-center justify-center"
                    >
                      SIGN IN
                    </Link>
                    <Link
                      href="/login"
                      className="bg-black text-white hover:bg-gray-800 transition-all duration-200 font-medium border-2 border-black hover:font-fugaz w-36 h-14 flex items-center justify-center text-center"
                    >
                      GET STARTED
                    </Link>
                  </>
                )}
              </>
            )}
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 hover:font-fugaz w-10 h-10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header