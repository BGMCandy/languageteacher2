'use client'

import Link from 'next/link'

export default function CharactersPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Character Systems</h1>
          <p className="text-gray-600 text-lg">
            Explore different writing systems and their characters.
          </p>
        </div>

        {/* Language Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Japanese Kanji */}
          <Link
            href="/characters/kanji"
            className="block bg-white border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:text-white">漢字</div>
              <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-white">Japanese Kanji</h3>
              <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                Chinese characters used in Japanese writing. Learn stroke order, readings, and meanings.
              </p>
              <div className="text-xs text-gray-500 group-hover:text-gray-400">
                ~2,000+ characters
              </div>
            </div>
          </Link>

          {/* Japanese Hiragana */}
          <Link
            href="/characters/hiragana"
            className="block bg-white border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:text-white">ひらがな</div>
              <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-white">Japanese Hiragana</h3>
              <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                Japanese phonetic characters used for native words and grammar.
              </p>
              <div className="text-xs text-gray-500 group-hover:text-gray-400">
                46 characters
              </div>
            </div>
          </Link>

          {/* Japanese Katakana */}
          <Link
            href="/characters/katakana"
            className="block bg-white border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:text-white">カタカナ</div>
              <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-white">Japanese Katakana</h3>
              <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                Japanese phonetic characters used for foreign words and emphasis.
              </p>
              <div className="text-xs text-gray-500 group-hover:text-gray-400">
                46 characters
              </div>
            </div>
          </Link>

          {/* Korean Hangul - Coming Soon */}
          <div className="block bg-gray-100 border-2 border-gray-300 p-6 opacity-60">
            <div className="text-center">
              <div className="text-4xl mb-4">한글</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Korean Hangul</h3>
              <p className="text-gray-500 text-sm mb-4">
                Korean alphabet system. Coming soon!
              </p>
              <div className="text-xs text-gray-400">
                Coming soon
              </div>
            </div>
          </div>

          {/* Chinese Characters - Coming Soon */}
          <div className="block bg-gray-100 border-2 border-gray-300 p-6 opacity-60">
            <div className="text-center">
              <div className="text-4xl mb-4">汉字</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chinese Characters</h3>
              <p className="text-gray-500 text-sm mb-4">
                Traditional and simplified Chinese characters. Coming soon!
              </p>
              <div className="text-xs text-gray-400">
                Coming soon
              </div>
            </div>
          </div>

          {/* Thai Script - Coming Soon */}
          <div className="block bg-gray-100 border-2 border-gray-300 p-6 opacity-60">
            <div className="text-center">
              <div className="text-4xl mb-4">ไทย</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Thai Script</h3>
              <p className="text-gray-500 text-sm mb-4">
                Thai alphabet and script system. Coming soon!
              </p>
              <div className="text-xs text-gray-400">
                Coming soon
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-6">Learning Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">2,000+</div>
              <div className="text-gray-600">Kanji Characters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">92</div>
              <div className="text-gray-600">Hiragana & Katakana</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">Coming Soon</div>
              <div className="text-gray-600">More Languages</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
