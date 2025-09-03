'use client'

import Link from 'next/link'

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-4">Language Games</h1>
          <p className="text-gray-600 text-lg">
            Learn languages through fun and interactive games
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className={`border-2 border-black p-6 transition-all duration-200 ${
                game.available 
                  ? 'hover:bg-gray-50 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {game.available ? (
                <Link href={game.href} className="block">
                  <div className="text-4xl mb-4">{game.icon}</div>
                  <h3 className="text-xl font-bold text-black mb-2">{game.name}</h3>
                  <p className="text-gray-600 text-sm">{game.description}</p>
                  <div className="mt-4 text-sm font-medium text-blue-600">
                    Play Now →
                  </div>
                </Link>
              ) : (
                <div>
                  <div className="text-4xl mb-4">{game.icon}</div>
                  <h3 className="text-xl font-bold text-black mb-2">{game.name}</h3>
                  <p className="text-gray-600 text-sm">{game.description}</p>
                  <div className="mt-4 text-sm font-medium text-gray-400">
                    Coming Soon
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

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
  )
}
