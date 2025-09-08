import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Language Learning Posters',
    default: 'Language Learning Posters | Interactive Character Learning Tools'
  },
  description: 'Interactive language learning posters for Japanese Kanji, Thai Script, Chinese Characters, and more. Track your progress with visual character grids and detailed information.',
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
    description: 'Interactive language learning posters for Japanese Kanji, Thai Script, Chinese Characters, and more. Track your progress with visual character grids.',
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
    description: 'Interactive language learning posters for Japanese Kanji, Thai Script, Chinese Characters, and more. Track your progress with visual character grids.',
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

export default function PostersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
