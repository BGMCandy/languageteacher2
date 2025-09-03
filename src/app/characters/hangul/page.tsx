'use client'

import { useState, useEffect } from 'react'

// Skeleton component for loading states
const SkeletonCard = () => (
  <div className="border-2 border-gray-200 p-6 animate-pulse">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-300 rounded mx-auto mb-4"></div>
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
    </div>
  </div>
)

export default function HangulPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {Array.from({ length: 24 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Korean Hangul (한글)</h1>
          <p className="text-gray-600 text-lg">
            Korean alphabet system - Coming Soon!
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🇰🇷</div>
          <h2 className="text-3xl font-bold text-black mb-4">Korean Hangul Coming Soon!</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            We&apos;re building a comprehensive Korean alphabet learning system with pronunciation guides, 
            syllable formation, and interactive practice tools.
          </p>
          
          <div className="bg-gray-100 border-2 border-gray-300 p-8 rounded-lg max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-black mb-4">What to Expect:</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li>• Complete Hangul alphabet (14 consonants + 10 vowels)</li>
              <li>• Pronunciation guides with audio</li>
              <li>• Syllable formation rules</li>
              <li>• Interactive character practice</li>
              <li>• Common Korean words and phrases</li>
              <li>• TOPIK level organization</li>
            </ul>
          </div>

          <div className="mt-8">
            <a 
              href="/characters" 
              className="inline-block px-6 py-3 bg-black text-white font-semibold tracking-wider hover:bg-gray-800 border-2 border-black transition-all cursor-pointer"
            >
              BACK TO CHARACTER SYSTEMS
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
