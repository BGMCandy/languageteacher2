'use client'

import Link from 'next/link'

export default function QuizPage() {
  const languages = [
    { 
      id: 'japanese', 
      name: 'Japanese', 
      icon: '日本語',
      description: 'Test your knowledge of kanji, hiragana, and katakana',
      available: true,
      href: '/quiz/japanese'
    },
    { 
      id: 'thai', 
      name: 'Thai', 
      icon: 'ไทย',
      description: 'Practice Thai consonants, vowels, and tones',
      available: true,
      href: '/quiz/thai'
    },
    { 
      id: 'chinese', 
      name: 'Chinese', 
      icon: '中文',
      description: 'Chinese characters and vocabulary',
      available: false,
      href: '#'
    },
    { 
      id: 'korean', 
      name: 'Korean', 
      icon: '한국어',
      description: 'Korean hangul and vocabulary',
      available: false,
      href: '#'
    },
    { 
      id: 'spanish', 
      name: 'Spanish', 
      icon: 'ES',
      description: 'Spanish vocabulary and grammar',
      available: false,
      href: '#'
    },
    { 
      id: 'french', 
      name: 'French', 
      icon: 'FR',
      description: 'French vocabulary and grammar',
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
          <h1 className="text-xl md:text-2xl font-bold text-black tracking-wider mb-2 md:mb-3">QUIZ SETUP</h1>
          <div className="h-px w-16 md:w-24 bg-black mx-auto"></div>
        </div>

        {/* Language Selection */}
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-black mb-3 md:mb-4 tracking-wider">
            SELECT LANGUAGE
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Choose a language to start your quiz
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {languages.map((language) => (
            <Link
              key={language.id}
              href={language.href}
              className={`block p-6 border-2 transition-all hover:font-bangers cursor-pointer ${
                language.available
                  ? 'border-black hover:bg-black hover:text-white'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl mb-3 font-medium">{language.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{language.name}</h3>
                <p className="text-sm opacity-80">{language.description}</p>
                {!language.available && (
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
          <h2 className="text-2xl font-bold text-black mb-6 text-center">Available Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">Japanese</div>
              <div className="text-gray-600">Kanji, Hiragana, Katakana</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">Thai</div>
              <div className="text-gray-600">Consonants, Vowels, Tones</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
