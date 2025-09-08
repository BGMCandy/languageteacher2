import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Language Learning Games | Interactive Kanji, Thai Script & More Games',
  description: 'Learn languages through fun and interactive games. Play Kanji Invaders, memory games, typing challenges, and more educational language games.',
  keywords: [
    'language learning games',
    'kanji games',
    'japanese learning games',
    'thai script games',
    'interactive language learning',
    'educational games',
    'kanji invaders',
    'memory games',
    'typing games',
    'language practice games'
  ],
  authors: [{ name: 'Language Teacher' }],
  openGraph: {
    title: 'Language Learning Games | Interactive Educational Games',
    description: 'Learn languages through fun and interactive games. Play Kanji Invaders, memory games, typing challenges, and more educational language games.',
    type: 'website',
    url: 'https://languageteacher.io/games',
    siteName: 'Language Teacher',
    images: [
      {
        url: 'https://languageteacher.io/og-images/games.jpg',
        width: 1200,
        height: 630,
        alt: 'Language Learning Games - Interactive Educational Games'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Language Learning Games | Interactive Educational Games',
    description: 'Learn languages through fun and interactive games. Play Kanji Invaders, memory games, typing challenges, and more educational language games.',
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
    canonical: 'https://languageteacher.io/games'
  }
}

export default function GamesPage() {
  const games = [
    {
      id: 'kanji-invaders',
      name: 'Kanji Invaders',
      description: 'Space invaders-style game where you control a kanji and match it with approaching enemies',
      icon: '🎮',
      href: '/games/kanji-invaders',
      available: true
    },
    {
      id: 'kanji-memory',
      name: 'Kanji Memory',
      description: 'Memory matching game with kanji characters and their meanings',
      icon: '🧠',
      href: '#',
      available: false
    },
    {
      id: 'kanji-typing',
      name: 'Kanji Typing',
      description: 'Type the correct pronunciation for falling kanji characters',
      icon: '⌨️',
      href: '#',
      available: false
    }
  ]

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Language Learning Games",
    "description": "Learn languages through fun and interactive games. Play Kanji Invaders, memory games, typing challenges, and more educational language games.",
    "url": "https://languageteacher.io/games",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Educational Language Games",
      "description": "Collection of interactive language learning games and educational tools",
      "numberOfItems": 3,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Kanji Invaders",
          "description": "Space invaders-style game where you control a kanji and match it with approaching enemies",
          "url": "https://languageteacher.io/games/kanji-invaders"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kanji Memory",
          "description": "Memory matching game with kanji characters and their meanings",
          "url": "https://languageteacher.io/games/kanji-memory"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Kanji Typing",
          "description": "Type the correct pronunciation for falling kanji characters",
          "url": "https://languageteacher.io/games/kanji-typing"
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
          "name": "Games",
          "item": "https://languageteacher.io/games"
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
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li><span aria-hidden="true">→</span></li>
            <li className="text-gray-900" aria-current="page">Games</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-4">Language Games</h1>
          <p className="text-gray-600 text-lg">
            Learn languages through fun and interactive games. Master character recognition, vocabulary, and pronunciation with engaging educational games.
          </p>
        </header>

        {/* Games Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Educational Language Games">
          {games.map((game) => (
            <article
              key={game.id}
              className={`border-2 border-black p-6 transition-all duration-200 ${
                game.available 
                  ? 'hover:bg-gray-50' 
                  : 'opacity-50'
              }`}
            >
              {game.available ? (
                <Link href={game.href} className="block">
                  <div className="text-4xl mb-4" aria-hidden="true">{game.icon}</div>
                  <h2 className="text-xl font-bold text-black mb-2">{game.name}</h2>
                  <p className="text-gray-600 text-sm">{game.description}</p>
                  <div className="mt-4 text-sm font-medium text-blue-600">
                    Play Now →
                  </div>
                </Link>
              ) : (
                <div>
                  <div className="text-4xl mb-4" aria-hidden="true">{game.icon}</div>
                  <h2 className="text-xl font-bold text-black mb-2">{game.name}</h2>
                  <p className="text-gray-600 text-sm">{game.description}</p>
                  <div className="mt-4 text-sm font-medium text-gray-400">
                    Coming Soon
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-black text-white font-semibold tracking-wider hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}
