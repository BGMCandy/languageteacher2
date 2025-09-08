import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Language Learning Posters | Interactive Kanji, Thai Script, Chinese Characters & More',
  description: 'Explore interactive language learning posters for Japanese Kanji, Thai Script, Chinese Characters, and more. Track your progress with visual character grids and detailed information.',
  keywords: [
    'language learning posters',
    'japanese kanji poster',
    'thai script poster',
    'chinese characters poster',
    'interactive learning',
    'character grids',
    'language study tools',
    'visual learning',
    'kanji practice',
    'thai alphabet',
    'hanzi learning'
  ],
  authors: [{ name: 'Language Teacher' }],
  openGraph: {
    title: 'Language Learning Posters | Interactive Character Learning Tools',
    description: 'Explore interactive language learning posters for Japanese Kanji, Thai Script, Chinese Characters, and more. Track your progress with visual character grids.',
    type: 'website',
    url: 'https://languageteacher.io/posters',
    siteName: 'Language Teacher',
    images: [
      {
        url: 'https://languageteacher.io/og-images/posters.jpg',
        width: 1200,
        height: 630,
        alt: 'Language Learning Posters - Interactive Character Learning Tools'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Language Learning Posters | Interactive Character Learning Tools',
    description: 'Explore interactive language learning posters for Japanese Kanji, Thai Script, Chinese Characters, and more. Track your progress with visual character grids.',
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
    canonical: 'https://languageteacher.io/posters'
  }
}

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

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Language Learning Posters",
    "description": "Interactive language learning posters for Japanese Kanji, Thai Script, Chinese Characters, and more. Track your progress with visual character grids and detailed information.",
    "url": "https://languageteacher.io/posters",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Language Learning Tools",
      "description": "Collection of interactive language learning posters and visual tools",
      "numberOfItems": 6,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Japanese Kanji Poster",
          "description": "Interactive kanji poster with performance tracking and stroke order",
          "url": "https://languageteacher.io/posters/kanji"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Thai Script Poster",
          "description": "Thai consonants, vowels, and tones poster with pronunciation guides",
          "url": "https://languageteacher.io/posters/thai-script"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Chinese Characters Poster",
          "description": "Chinese characters and vocabulary learning with interactive features",
          "url": "https://languageteacher.io/posters/hanzi"
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
          "name": "Posters",
          "item": "https://languageteacher.io/posters"
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
      <div className="bg-white min-h-screen flex flex-col overflow-hidden">
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li><span aria-hidden="true">→</span></li>
            <li className="text-gray-900" aria-current="page">Posters</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-4 md:mb-6">
          <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-2 md:mb-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-black relative" aria-hidden="true">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white"></div>
              </div>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-black tracking-wider mb-2 md:mb-3">POSTERS</h1>
          <div className="h-px w-16 md:w-24 bg-black mx-auto"></div>
        </header>

        {/* Language Selection */}
        <section className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-black mb-3 md:mb-4 tracking-wider">
            SELECT POSTER
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Choose a language poster to explore characters and track your progress. Interactive learning tools with visual character grids and detailed information.
          </p>
        </section>

        {/* Poster Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8" aria-label="Language Learning Posters">
          {posters.map((poster) => (
            <article key={poster.id} className={`block p-6 border-2 transition-all hover:font-bangers ${
              poster.available
                ? 'border-black hover:bg-black hover:text-white'
                : 'border-gray-200 bg-gray-100 text-gray-400'
            }`}>
              {poster.available ? (
                <Link href={poster.href} className="block">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl mb-3 font-medium" aria-hidden="true">{poster.icon}</div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">{poster.name}</h3>
                    <p className="text-sm opacity-80">{poster.description}</p>
                  </div>
                </Link>
              ) : (
                <div className="text-center">
                  <div className="text-3xl md:text-4xl mb-3 font-medium" aria-hidden="true">{poster.icon}</div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{poster.name}</h3>
                  <p className="text-sm opacity-80">{poster.description}</p>
                  <div className="mt-3 text-xs text-gray-400">
                    Coming Soon
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>

        {/* Quick Stats */}
        <section className="mt-12 pt-8 border-t-2 border-gray-200">
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
        </section>
      </div>
    </div>
    </>
  )
}