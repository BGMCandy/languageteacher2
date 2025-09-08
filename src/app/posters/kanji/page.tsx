import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const KanjiPosterClient = dynamic(() => import('./kanji-poster-client'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
    </div>
  )
})

export const metadata: Metadata = {
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

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Japanese Kanji Poster - Interactive Learning Tool",
  "description": "Master Japanese Kanji with our interactive poster featuring 2,136 Joyo Kanji. Track your progress, learn stroke order, readings, and meanings with visual character grids.",
  "url": "https://languageteacher.io/posters/kanji",
  "mainEntity": {
    "@type": "EducationalResource",
    "name": "Japanese Kanji Learning Tool",
    "description": "Interactive poster for learning Japanese Kanji characters with stroke order, readings, and meanings",
    "educationalLevel": "Beginner to Advanced",
    "learningResourceType": "Interactive Tool",
    "teaches": [
      "Japanese Kanji Characters",
      "Kanji Stroke Order",
      "Kanji Readings (On-yomi and Kun-yomi)",
      "Kanji Meanings",
      "Japanese Writing System"
    ],
    "about": {
      "@type": "Language",
      "name": "Japanese",
      "description": "Japanese language writing system including Kanji characters"
    }
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Japanese Kanji Poster",
        "item": "https://languageteacher.io/posters/kanji"
      }
    ]
  }
}

export default function KanjiPosterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <KanjiPosterClient />
    </>
  )
}
