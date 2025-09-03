'use client'

import Link from 'next/link'

export default function PostersPage() {
  const posters = [
    { 
      id: 'kanji', 
      name: 'Japanese Kanji', 
      icon: '漢字',
      description: 'Interactive kanji poster with performance tracking',
      available: true,
      href: '/posters/kanji'
    },
    { 
      id: 'thai-script', 
      name: 'Thai Script', 
      icon: 'ไทย',
      description: 'Thai consonants, vowels, and tones poster',
      available: true,
      href: '/posters/thai-script'
    },
    { 
      id: 'hanzi', 
      name: 'Chinese Characters', 
      icon: '汉字',
      description: 'Chinese characters and vocabulary',
      available: true,
      href: '/posters/hanzi'
    },
    { 
      id: 'hangul', 
      name: 'Korean Hangul', 
      icon: '한글',
      description: 'Korean hangul characters and vocabulary',
      available: false,
      href: '#'
    },
    { 
      id: 'hiragana', 
      name: 'Japanese Hiragana', 
      icon: 'ひらがな',
      description: 'Japanese hiragana syllabary',
      available: false,
      href: '#'
    },
    { 
      id: 'katakana', 
      name: 'Japanese Katakana', 
      icon: 'カタカナ',
      description: 'Japanese katakana syllabary',
      available: false,
      href: '#'
    }
  ]

  return (
    <div className="bg-white min-h-screen flex flex-col overflow-hidden">
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-2 md:mb-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-black relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white"></div>
              </div>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-black tracking-wider mb-2 md:mb-3">POSTERS</h1>
          <div className="h-px w-16 md:w-24 bg-black mx-auto"></div>
        </div>

        {/* Language Selection */}
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-black mb-3 md:mb-4 tracking-wider">
            SELECT POSTER
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Choose a language poster to explore characters and track your progress
          </p>
        </div>

        {/* Poster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {posters.map((poster) => (
            <Link
              key={poster.id}
              href={poster.href}
              className={`block p-6 border-2 transition-all hover:font-bangers cursor-pointer ${
                poster.available
                  ? 'border-black hover:bg-black hover:text-white'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl mb-3 font-medium">{poster.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{poster.name}</h3>
                <p className="text-sm opacity-80">{poster.description}</p>
                {!poster.available && (
                  <div className="mt-3 text-xs text-gray-400">
                    Coming Soon
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">Available Posters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">Japanese Kanji</div>
              <div className="text-gray-600">2,136 Joyo Kanji with performance tracking</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">Thai Script</div>
              <div className="text-gray-600">44 Consonants, 32 Vowels, 5 Tones</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}