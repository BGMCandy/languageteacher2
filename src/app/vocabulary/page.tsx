'use client'

import Link from 'next/link'

export default function VocabularyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Vocabulary</h1>
          <p className="text-gray-600 text-lg">
            Explore vocabulary from different languages and writing systems.
          </p>
        </div>

        {/* Language Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Japanese Vocabulary */}
          <Link
            href="/vocabulary/japanese"
            className="block bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-black hover:shadow-lg transition-all duration-200"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">日本語</div>
              <h3 className="text-xl font-semibold text-black mb-2">Japanese Vocabulary</h3>
              <p className="text-gray-600 text-sm mb-4">
                Japanese words and phrases with readings, meanings, and kanji breakdowns.
              </p>
              <div className="text-xs text-gray-500">
                JMdict database
              </div>
            </div>
          </Link>

          {/* Korean Vocabulary - Coming Soon */}
          <div className="block bg-gray-100 border-2 border-gray-300 rounded-lg p-6 opacity-60">
            <div className="text-center">
              <div className="text-4xl mb-4">한국어</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Korean Vocabulary</h3>
              <p className="text-gray-500 text-sm mb-4">
                Korean words and phrases with pronunciation and meanings. Coming soon!
              </p>
              <div className="text-xs text-gray-400">
                Coming soon
              </div>
            </div>
          </div>

          {/* Chinese Vocabulary - Coming Soon */}
          <div className="block bg-gray-100 border-2 border-gray-300 rounded-lg p-6 opacity-60">
            <div className="text-center">
              <div className="text-4xl mb-4">中文</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chinese Vocabulary</h3>
              <p className="text-gray-500 text-sm mb-4">
                Chinese words and phrases with pinyin and meanings. Coming soon!
              </p>
              <div className="text-xs text-gray-400">
                Coming soon
              </div>
            </div>
          </div>

          {/* Thai Vocabulary - Coming Soon */}
          <div className="block bg-gray-100 border-2 border-gray-300 rounded-lg p-6 opacity-60">
            <div className="text-center">
              <div className="text-4xl mb-4">ไทย</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Thai Vocabulary</h3>
              <p className="text-gray-500 text-sm mb-4">
                Thai words and phrases with pronunciation and meanings. Coming soon!
              </p>
              <div className="text-xs text-gray-400">
                Coming soon
              </div>
            </div>
          </div>

          {/* Spanish Vocabulary - Coming Soon */}
          <div className="block bg-gray-100 border-2 border-gray-300 rounded-lg p-6 opacity-60">
            <div className="text-center">
              <div className="text-4xl mb-4">Español</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Spanish Vocabulary</h3>
              <p className="text-gray-500 text-sm mb-4">
                Spanish words and phrases with pronunciation and meanings. Coming soon!
              </p>
              <div className="text-xs text-gray-400">
                Coming soon
              </div>
            </div>
          </div>

          {/* French Vocabulary - Coming Soon */}
          <div className="block bg-gray-100 border-2 border-gray-300 rounded-lg p-6 opacity-60">
            <div className="text-center">
              <div className="text-4xl mb-4">Français</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">French Vocabulary</h3>
              <p className="text-gray-500 text-sm mb-4">
                French words and phrases with pronunciation and meanings. Coming soon!
              </p>
              <div className="text-xs text-gray-400">
                Coming soon
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-6">Vocabulary Database</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">200,000+</div>
              <div className="text-gray-600">Japanese Words</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">JMdict</div>
              <div className="text-gray-600">Dictionary Source</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">Coming Soon</div>
              <div className="text-gray-600">More Languages</div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-6">Quick Search</h2>
          <div className="max-w-md mx-auto">
            <Link
              href="/dictionary"
              className="block w-full px-6 py-4 bg-black text-white text-center rounded-lg hover:bg-gray-800 transition-colors"
            >
              Search Dictionary
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
