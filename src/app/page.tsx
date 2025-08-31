import FlashcardGrid from './components/layout/study/flashcardGrid'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Language Teacher
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Master Japanese, Thai, and other languages with our interactive flashcard system. 
          Learn characters, readings, and meanings through spaced repetition.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors">
            Japanese
          </div>
          <div className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors">
            Thai
          </div>
          <div className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors">
            More Coming Soon
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/kanji-poster"
            className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <span>🗺️</span>
            View Kanji Poster
          </Link>
          <Link 
            href="/practice"
            className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>📚</span>
            Practice Kanji
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Japanese Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Japanese Learning
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Start with the basics and progress through different difficulty levels
            </p>
          </div>
          
          <div className="space-y-12">
            {/* Kanji */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                Kanji Characters
              </h3>
              <FlashcardGrid 
                language="japanese" 
                script="kanji" 
                limit={8}
              />
            </div>

            {/* Hiragana */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                Hiragana
              </h3>
              <FlashcardGrid 
                language="japanese" 
                script="hiragana" 
                limit={8}
              />
            </div>

            {/* Katakana */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                Katakana
              </h3>
              <FlashcardGrid 
                language="japanese" 
                script="katakana" 
                limit={8}
              />
            </div>
          </div>
        </section>

        {/* Thai Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Thai Learning
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Master Thai script with consonants, vowels, and tones
            </p>
          </div>
          
          <div className="space-y-12">
            {/* Thai Consonants */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                Thai Consonants
              </h3>
              <FlashcardGrid 
                language="thai" 
                script="consonants" 
                limit={8}
              />
            </div>

            {/* Thai Vowels */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                Thai Vowels
              </h3>
              <FlashcardGrid 
                language="thai" 
                script="vowels" 
                limit={8}
              />
            </div>

            {/* Thai Tones */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                Thai Tones
              </h3>
              <FlashcardGrid 
                language="thai" 
                script="tones" 
                limit={8}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="text-center py-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Spaced Repetition</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn efficiently with scientifically proven repetition intervals
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Multiple Languages</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Support for Japanese, Thai, and more languages coming soon
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Interactive Cards</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Click to flip cards and reveal meanings, readings, and pronunciations
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
