'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import Identify from '../elements/identify'

export default function Header() {
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAlphabetsDropdownOpen, setIsAlphabetsDropdownOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => pathname === path



  // Close dropdown when route changes
  useEffect(() => {
    setIsAlphabetsDropdownOpen(false)
  }, [pathname])

  return (
    <header className="h-20 bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Identify />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center w-96">
          <div className="grid grid-cols-4 w-full gap-3">
            <Link 
              href="/quiz" 
              className={`btn-2 w-full ${
                isActive('/quiz') ? 'active' : ''
              }`}
            >
              QUIZ
            </Link>
            <Link 
              href="/dictionary" 
              className={`btn-2 w-full ${
                isActive('/dictionary') ? 'active' : ''
              }`}
            >
              DICTIONARY
            </Link>
            <Link 
              href="/progress" 
              className={`btn-2 w-full ${
                isActive('/progress') ? 'active' : ''
              }`}
            >
              PROGRESS
            </Link>
            <div 
              className="relative" 
              ref={dropdownRef}
              onMouseEnter={() => setIsAlphabetsDropdownOpen(true)}
              onMouseLeave={() => setIsAlphabetsDropdownOpen(false)}
            >
              <Link
                href="/characters"
                className={`btn-2 w-full flex items-center justify-center space-x-1 ${
                  isActive('/poster/kanji') || isActive('/characters/hanzi') || isActive('/characters/hangul') || isActive('/characters/thai-script') || isActive('/characters') ? 'active' : ''
                }`}
              >
                <span>ALPHABETS</span>
                <svg 
                  className={`w-3 h-3 transition-transform duration-200 ${isAlphabetsDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              
              {/* Dropdown Menu */}
              {isAlphabetsDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black shadow-lg z-50">
                                  <Link
                  href="/poster/kanji"
                  className={`block w-full px-3 py-2 text-xs font-medium tracking-wider transition-all hover:bg-black hover:text-white border-b border-gray-200 last:border-b-0 ${
                    isActive('/poster/kanji') ? 'bg-black text-white' : 'text-black'
                  }`}
                >
                  <span className="text-sm mr-1">漢字</span>
                  Japanese Kanji
                </Link>
                  <Link
                    href="/characters/hanzi"
                    className={`block w-full px-3 py-2 text-xs font-medium tracking-wider transition-all hover:bg-black hover:text-white border-b border-gray-200 last:border-b-0 ${
                      isActive('/characters/hanzi') ? 'bg-black text-white' : 'text-black'
                    }`}
                  >
                    <span className="text-sm mr-1">汉字</span>
                    Chinese Characters
                  </Link>
                  <Link
                    href="/characters/hangul"
                    className={`block w-full px-3 py-2 text-xs font-medium tracking-wider transition-all hover:bg-black hover:text-white border-b border-gray-200 last:border-b-0 ${
                      isActive('/characters/hangul') ? 'bg-black text-white' : 'text-black'
                    }`}
                  >
                    <span className="text-sm mr-1">한글</span>
                    Korean Hangul
                  </Link>
                  <Link
                    href="/characters/thai-script"
                    className={`block w-full px-3 py-2 text-xs font-medium tracking-wider transition-all hover:bg-black hover:text-white border-b border-gray-200 last:border-b-0 ${
                      isActive('/characters/thai-script') ? 'bg-black text-white' : 'text-black'
                    }`}
                  >
                    <span className="text-sm mr-1">ไทย</span>
                    Thai Script
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center space-x-6">
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
                    className="px-4 py-2 text-sm font-medium tracking-wider transition-all hover:font-fugaz bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
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
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 relative z-50 bg-white"
          aria-label="Toggle mobile menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <div className={`w-full h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-full h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-full h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-20 left-0 right-0 bg-white z-50 transform transition-all duration-300 ease-out ${
        isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}>
        <div className="border-b-2 border-black shadow-lg">
          <div className="px-6 py-8 space-y-8">
            {/* Mobile Navigation */}
            <nav className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-black tracking-wider uppercase">Navigation</h2>
                <div className="h-px w-16 bg-black mx-auto mt-2"></div>
              </div>
              
              <div className="space-y-4">
                <Link
                  href="/quiz"
                  className={`block w-full px-6 py-4 text-lg font-medium tracking-wider transition-all duration-200 border-2 text-center rounded-none ${
                    isActive('/quiz') 
                      ? 'bg-black text-white border-black shadow-lg' 
                      : 'text-black border-black hover:bg-black hover:text-white hover:shadow-lg'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  QUIZ
                </Link>
                <Link
                  href="/dictionary"
                  className={`block w-full px-6 py-4 text-lg font-medium tracking-wider transition-all duration-200 border-2 text-center rounded-none ${
                    isActive('/dictionary') 
                      ? 'bg-black text-white border-black shadow-lg' 
                      : 'text-black border-black hover:bg-black hover:text-white hover:shadow-lg'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  DICTIONARY
                </Link>
                <Link
                  href="/progress"
                  className={`block w-full px-6 py-4 text-lg font-medium tracking-wider transition-all duration-200 border-2 text-center rounded-none ${
                    isActive('/progress') 
                      ? 'bg-black text-white border-black shadow-lg' 
                      : 'text-black border-black hover:bg-black hover:text-white hover:shadow-lg'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  PROGRESS
                </Link>
                <div className="space-y-2">
                  <div className="text-center">
                    <h4 className="text-sm font-semibold text-gray-600 tracking-wider uppercase mb-2">Alphabets</h4>
                  </div>
                  <Link
                    href="/poster/kanji"
                    className={`block w-full px-6 py-3 text-base font-medium tracking-wider transition-all duration-200 border-2 text-center rounded-none ${
                      isActive('/poster/kanji') 
                        ? 'bg-black text-white border-black shadow-lg' 
                        : 'text-black border-black hover:bg-black hover:text-white hover:shadow-lg'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg mr-2">漢字</span>
                    Japanese Kanji
                  </Link>
                  <Link
                    href="/characters/hanzi"
                    className={`block w-full px-6 py-3 text-base font-medium tracking-wider transition-all duration-200 border-2 text-center rounded-none ${
                      isActive('/characters/hanzi') 
                        ? 'bg-black text-white border-black shadow-lg' 
                        : 'text-black border-black hover:bg-black hover:text-white hover:shadow-lg'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg mr-2">汉字</span>
                    Chinese Characters
                  </Link>
                  <Link
                    href="/characters/hangul"
                    className={`block w-full px-6 py-3 text-base font-medium tracking-wider transition-all duration-200 border-2 text-center rounded-none ${
                      isActive('/characters/hangul') 
                        ? 'bg-black text-white border-black shadow-lg' 
                        : 'text-black border-black hover:bg-black hover:text-white hover:shadow-lg'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg mr-2">한글</span>
                    Korean Hangul
                  </Link>
                  <Link
                    href="/characters/thai-script"
                    className={`block w-full px-6 py-3 text-base font-medium tracking-wider transition-all duration-200 border-2 text-center rounded-none ${
                      isActive('/characters/thai-script') 
                        ? 'bg-black text-white border-black shadow-lg' 
                        : 'text-black border-black hover:bg-black hover:text-white hover:shadow-lg'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg mr-2">ไทย</span>
                    Thai Script
                  </Link>
                </div>
              </div>
            </nav>

            {/* Mobile User Section */}
            <div className="pt-6 border-t-2 border-gray-200">
              {!user ? (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-black tracking-wider uppercase">Account</h3>
                    <div className="h-px w-16 bg-black mx-auto mt-2"></div>
                  </div>
                  <Link
                    href="/login"
                    className="block w-full px-6 py-4 text-lg font-medium tracking-wider transition-all duration-200 border-2 text-center rounded-none text-black border-black hover:bg-black hover:text-white hover:shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    SIGN IN
                  </Link>
                  <Link
                    href="/login"
                    className="block w-full px-6 py-4 text-lg font-medium tracking-wider transition-all duration-200 border-2 text-center rounded-none bg-black text-white border-black hover:bg-gray-800 hover:shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    GET STARTED
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-black tracking-wider uppercase">Account</h3>
                    <div className="h-px w-16 bg-black mx-auto mt-2"></div>
                  </div>
                  <div className="text-center pb-4 bg-gray-50 p-4 border-2 border-gray-200">
                    <p className="text-sm text-gray-600 tracking-wider uppercase">Signed in as</p>
                    <p className="font-medium text-black text-lg">{user.email}</p>
                  </div>
                  <div className="space-y-3">
                    <Link
                      href="/account"
                      className={`block w-full px-6 py-4 text-lg font-medium tracking-wider transition-all duration-200 border-2 text-center rounded-none ${
                        isActive('/account') 
                          ? 'bg-black text-white border-black shadow-lg' 
                          : 'text-black border-black hover:bg-black hover:text-white hover:shadow-lg'
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
                      className="w-full px-6 py-4 text-lg font-medium tracking-wider transition-all duration-200 bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white hover:shadow-lg rounded-none cursor-pointer"
                    >
                      SIGN OUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
