import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const HanziPosterClient = dynamic(() => import('./hanzi-poster-simple'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
    </div>
  )
})

export const metadata: Metadata = {
  title: 'Chinese Characters Poster | Interactive Hanzi Learning with Visual Grid',
  description: 'Master Chinese Characters (Hanzi) with our interactive poster featuring thousands of characters. Learn stroke order, pronunciation, meanings, and track your progress with visual character grids.',
  keywords: [
    'chinese characters poster',
    'hanzi learning',
    'chinese writing',
    'hanzi practice',
    'chinese language learning',
    'hanzi meanings',
    'chinese pronunciation',
    'mandarin characters',
    'simplified chinese',
    'traditional chinese',
    'interactive hanzi',
    'hanzi grid',
    'chinese study tools'
  ],
  authors: [{ name: 'Language Teacher' }],
  openGraph: {
    title: 'Chinese Characters Poster | Interactive Hanzi Learning with Visual Grid',
    description: 'Master Chinese Characters (Hanzi) with our interactive poster featuring thousands of characters. Learn stroke order, pronunciation, and meanings.',
    type: 'website',
    url: 'https://languageteacher.io/posters/hanzi',
    siteName: 'Language Teacher',
    images: [
      {
        url: 'https://languageteacher.io/og-images/hanzi-poster.jpg',
        width: 1200,
        height: 630,
        alt: 'Chinese Characters Poster - Interactive Hanzi Learning Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chinese Characters Poster | Interactive Hanzi Learning with Visual Grid',
    description: 'Master Chinese Characters (Hanzi) with our interactive poster featuring thousands of characters. Learn stroke order, pronunciation, and meanings.',
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
    canonical: 'https://languageteacher.io/posters/hanzi'
  }
}

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Chinese Characters Poster - Interactive Learning Tool",
  "description": "Master Chinese Characters (Hanzi) with our interactive poster featuring thousands of characters. Learn stroke order, pronunciation, meanings, and track your progress.",
  "url": "https://languageteacher.io/posters/hanzi",
  "mainEntity": {
    "@type": "EducationalResource",
    "name": "Chinese Characters Learning Tool",
    "description": "Interactive poster for learning Chinese Hanzi characters with stroke order, pronunciation, and meanings",
    "educationalLevel": "Beginner to Advanced",
    "learningResourceType": "Interactive Tool",
    "teaches": [
      "Chinese Hanzi Characters",
      "Chinese Stroke Order",
      "Mandarin Pronunciation",
      "Chinese Character Meanings",
      "Chinese Writing System"
    ],
    "about": {
      "@type": "Language",
      "name": "Chinese",
      "description": "Chinese language writing system including Hanzi characters"
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
        "name": "Chinese Characters Poster",
        "item": "https://languageteacher.io/posters/hanzi"
      }
    ]
  }
}

export default function HanziPosterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HanziPosterClient />
    </>
  )
}
