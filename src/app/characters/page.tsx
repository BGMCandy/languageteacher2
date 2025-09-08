import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Character Systems | Learn Japanese Kanji, Hiragana, Katakana, Thai Script & More',
  description: 'Master different writing systems including Japanese Kanji (2,000+ characters), Hiragana, Katakana, Thai Script, and more. Interactive learning with stroke order, pronunciation, and meanings.',
  keywords: [
    'japanese kanji',
    'hiragana',
    'katakana', 
    'thai script',
    'character learning',
    'writing systems',
    'japanese characters',
    'thai alphabet',
    'language learning',
    'stroke order',
    'pronunciation',
    'character meanings'
  ],
  authors: [{ name: 'Language Teacher' }],
  openGraph: {
    title: 'Character Systems | Learn Japanese, Thai & More Writing Systems',
    description: 'Master different writing systems including Japanese Kanji, Hiragana, Katakana, and Thai Script. Interactive learning with stroke order and pronunciation.',
    type: 'website',
    url: 'https://languageteacher.io/characters',
    siteName: 'Language Teacher',
    images: [
      {
        url: 'https://languageteacher.io/og-images/characters.jpg',
        width: 1200,
        height: 630,
        alt: 'Character Systems Learning - Japanese Kanji, Hiragana, Katakana, Thai Script'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Character Systems | Learn Japanese, Thai & More Writing Systems',
    description: 'Master different writing systems including Japanese Kanji, Hiragana, Katakana, and Thai Script. Interactive learning with stroke order and pronunciation.',
    creator: '@languageteacher'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://languageteacher.io/characters'
  }
}

export default function CharactersPage() {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Character Systems Learning",
    "description": "Master different writing systems including Japanese Kanji, Hiragana, Katakana, Thai Script, and more. Interactive learning with stroke order, pronunciation, and meanings.",
    "url": "https://languageteacher.io/characters",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Writing Systems",
      "description": "Collection of different writing systems for language learning",
      "numberOfItems": 6,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Japanese Kanji",
          "description": "Chinese characters used in Japanese writing with stroke order and meanings",
          "url": "https://languageteacher.io/characters/kanji"
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Japanese Hiragana",
          "description": "Japanese phonetic characters for native words and grammar",
          "url": "https://languageteacher.io/characters/hiragana"
        },
        {
          "@type": "ListItem",
          "position": 3, 
          "name": "Japanese Katakana",
          "description": "Japanese phonetic characters for foreign words and emphasis",
          "url": "https://languageteacher.io/characters/katakana"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Thai Script", 
          "description": "Thai alphabet with consonants, vowels, and tones",
          "url": "https://languageteacher.io/characters/thai-script"
        }
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://languageteacher.io"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Character Systems",
          "item": "https://languageteacher.io/characters"
        }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span aria-hidden="true">→</span></li>
              <li className="text-gray-900" aria-current="page">Character Systems</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">Character Systems</h1>
            <p className="text-gray-600 text-lg">
              Explore different writing systems and their characters. Master Japanese Kanji, Hiragana, Katakana, Thai Script, and more with interactive learning tools.
            </p>
          </header>

        {/* Language Systems Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Writing Systems">
          {/* Japanese Kanji */}
          <article className="block bg-white border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-200 group">
            <Link href="/characters/kanji" className="block">
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:text-white" aria-hidden="true">漢字</div>
                <h2 className="text-xl font-semibold text-black mb-2 group-hover:text-white">Japanese Kanji</h2>
                <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                  Chinese characters used in Japanese writing. Learn stroke order, readings, and meanings with interactive tools.
                </p>
                <div className="text-xs text-gray-500 group-hover:text-gray-400">
                  ~2,000+ characters
                </div>
              </div>
            </Link>
          </article>

          {/* Japanese Hiragana */}
          <article className="block bg-white border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-200 group">
            <Link href="/characters/hiragana" className="block">
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:text-white" aria-hidden="true">ひらがな</div>
                <h2 className="text-xl font-semibold text-black mb-2 group-hover:text-white">Japanese Hiragana</h2>
                <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                  Japanese phonetic characters used for native words and grammar. Essential for Japanese language learning.
                </p>
                <div className="text-xs text-gray-500 group-hover:text-gray-400">
                  46 characters
                </div>
              </div>
            </Link>
          </article>

          {/* Japanese Katakana */}
          <article className="block bg-white border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-200 group">
            <Link href="/characters/katakana" className="block">
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:text-white" aria-hidden="true">カタカナ</div>
                <h2 className="text-xl font-semibold text-black mb-2 group-hover:text-white">Japanese Katakana</h2>
                <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                  Japanese phonetic characters used for foreign words and emphasis. Learn pronunciation and writing.
                </p>
                <div className="text-xs text-gray-500 group-hover:text-gray-400">
                  46 characters
                </div>
              </div>
            </Link>
          </article>

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

          {/* Thai Script */}
          <article className="block bg-white border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-200 group">
            <Link href="/characters/thai-script" className="block">
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:text-white" aria-hidden="true">ไทย</div>
                <h2 className="text-xl font-semibold text-black mb-2 group-hover:text-white">Thai Script</h2>
                <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-300">
                  Thai alphabet with consonants, vowels, and tones. Learn pronunciation and writing with interactive tools.
                </p>
                <div className="text-xs text-gray-500 group-hover:text-gray-400">
                  44 consonants + 32 vowels + 5 tones
                </div>
              </div>
            </Link>
          </article>
        </section>

        {/* Quick Stats */}
        <section className="mt-12 pt-8 border-t-2 border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-6">Learning Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">2,000+</div>
              <div className="text-gray-600">Kanji Characters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">92</div>
              <div className="text-gray-600">Hiragana & Katakana</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">81</div>
              <div className="text-gray-600">Thai Characters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black mb-2">Coming Soon</div>
              <div className="text-gray-600">More Languages</div>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  )
}
