'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import Identify from '../elements/identify'

export default function Header() {
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="h-20 bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Identify />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/quiz" 
            className={`btn-2 ${
              isActive('/quiz') ? 'active' : ''
            }`}
          >
            QUIZ
          </Link>
          <Link 
            href="/study" 
            className={`btn-2 ${
              isActive('/study') ? 'active' : ''
            }`}
          >
            STUDY
          </Link>
          <Link 
            href="/kanji-poster" 
            className={`btn-2 ${
              isActive('/kanji-poster') ? 'active' : ''
            }`}
          >
            KANJI
          </Link>

        </nav>

        {/* User Section */}
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              {/* User Info - Compact */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500 tracking-wider uppercase">Signed in as</p>
                  <p className="text-sm font-medium text-black truncate max-w-32">
                    {user.email}
                  </p>
                </div>
              </div>
              
              {/* Account Actions */}
              <div className="flex items-center space-x-3">
                <Link
                  href="/account"
                  className={`px-4 py-2 text-sm font-medium tracking-wider transition-all hover:font-fugaz border-2 ${
                    isActive('/account') 
                      ? 'bg-black text-white border-black' 
                      : 'text-black border-black hover:bg-black hover:text-white'
                  }`}
                >
                  ACCOUNT
                </Link>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm font-medium tracking-wider transition-all hover:font-fugaz bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  SIGN OUT
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn-3"
              >
                SIGN IN
              </Link>
              <Link
                href="/login"
                className="btn-4"
              >
                GET STARTED
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <div className="w-full h-0.5 bg-current"></div>
              <div className="w-full h-0.5 bg-current"></div>
              <div className="w-full h-0.5 bg-current"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white">
          <div className="px-6 py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="space-y-3">
              <Link
                href="/quiz"
                className={`block text-sm font-medium tracking-wider transition-all hover:font-fugaz ${
                  isActive('/') ? 'text-black' : 'text-gray-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Quiz
              </Link>
              <Link
                href="/kanji-poster"
                className={`block text-sm font-medium tracking-wider transition-all hover:font-fugaz ${
                  isActive('/kanji-poster') ? 'text-black' : 'text-gray-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                KANJI
              </Link>
              <Link
                href="/practice"
                className={`block text-sm font-medium tracking-wider transition-all hover:font-fugaz ${
                  isActive('/practice') ? 'text-black' : 'text-gray-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                PRACTICE
              </Link>
              <Link
                href="/dictionary"
                className={`block text-sm font-medium tracking-wider transition-all hover:font-fugaz ${
                  isActive('/dictionary') ? 'text-black' : 'text-gray-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                DICTIONARY
              </Link>
            </nav>

            {/* Mobile User Section */}
            {user && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="text-sm">
                  <p className="text-gray-500 tracking-wider uppercase">Signed in as</p>
                  <p className="font-medium text-black">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/account"
                    className={`block w-full px-4 py-2 text-sm font-medium tracking-wider transition-all hover:font-fugaz border-2 text-center ${
                      isActive('/account') 
                        ? 'bg-black text-white border-black' 
                        : 'text-black border-black hover:bg-black hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ACCOUNT
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full px-4 py-2 text-sm font-medium tracking-wider transition-all hover:font-fugaz bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    SIGN OUT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}