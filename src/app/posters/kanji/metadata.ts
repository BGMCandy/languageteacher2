import { Metadata } from 'next'

export const kanjiPosterMetadata: Metadata = {
  title: 'Japanese Kanji Poster | Interactive Kanji Learning with Performance Tracking',
  description: 'Master Japanese Kanji with our interactive poster featuring 2,136 Joyo Kanji. Track your progress, learn stroke order, readings, and meanings with visual character grids and detailed information.',
  keywords: [
    'japanese kanji poster',
    'kanji learning',
    'japanese characters',
    'kanji practice',
    'japanese writing',
    'kanji stroke order',
    'japanese language learning',
    'kanji meanings',
    'kanji readings',
    'joyo kanji',
    'interactive kanji',
    'kanji grid',
    'japanese study tools'
  ],
  authors: [{ name: 'Language Teacher' }],
  openGraph: {
    title: 'Japanese Kanji Poster | Interactive Kanji Learning with Performance Tracking',
    description: 'Master Japanese Kanji with our interactive poster featuring 2,136 Joyo Kanji. Track your progress, learn stroke order, readings, and meanings.',
    type: 'website',
    url: 'https://languageteacher.io/posters/kanji',
    siteName: 'Language Teacher',
    images: [
      {
        url: 'https://languageteacher.io/og-images/kanji-poster.jpg',
        width: 1200,
        height: 630,
        alt: 'Japanese Kanji Poster - Interactive Learning with 2,136 Joyo Kanji'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Japanese Kanji Poster | Interactive Kanji Learning with Performance Tracking',
    description: 'Master Japanese Kanji with our interactive poster featuring 2,136 Joyo Kanji. Track your progress, learn stroke order, readings, and meanings.',
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
    canonical: 'https://languageteacher.io/posters/kanji'
  }
}
