import { Metadata } from 'next'
import ThaiScriptPosterClient from './thai-script-poster-client'

export const metadata: Metadata = {
  title: 'Thai Script Poster | Interactive Thai Alphabet Learning with Consonants, Vowels & Tones',
  description: 'Master Thai Script with our interactive poster featuring 44 consonants, 32 vowels, and 5 tones. Learn pronunciation, writing, and track your progress with visual character grids.',
  keywords: [
    'thai script poster',
    'thai alphabet learning',
    'thai consonants',
    'thai vowels',
    'thai tones',
    'thai language learning',
    'thai writing system',
    'thai pronunciation',
    'thai characters',
    'thai study tools',
    'interactive thai',
    'thai script grid',
    'thai language practice'
  ],
  authors: [{ name: 'Language Teacher' }],
  openGraph: {
    title: 'Thai Script Poster | Interactive Thai Alphabet Learning with Consonants, Vowels & Tones',
    description: 'Master Thai Script with our interactive poster featuring 44 consonants, 32 vowels, and 5 tones. Learn pronunciation, writing, and track your progress.',
    type: 'website',
    url: 'https://languageteacher.io/posters/thai-script',
    siteName: 'Language Teacher',
    images: [
      {
        url: 'https://languageteacher.io/og-images/thai-script-poster.jpg',
        width: 1200,
        height: 630,
        alt: 'Thai Script Poster - Interactive Thai Alphabet Learning Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thai Script Poster | Interactive Thai Alphabet Learning with Consonants, Vowels & Tones',
    description: 'Master Thai Script with our interactive poster featuring 44 consonants, 32 vowels, and 5 tones. Learn pronunciation, writing, and track your progress.',
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
    canonical: 'https://languageteacher.io/posters/thai-script'
  }
}

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Thai Script Poster - Interactive Learning Tool",
  "description": "Master Thai Script with our interactive poster featuring 44 consonants, 32 vowels, and 5 tones. Learn pronunciation, writing, and track your progress with visual character grids.",
  "url": "https://languageteacher.io/posters/thai-script",
  "mainEntity": {
    "@type": "EducationalResource",
    "name": "Thai Script Learning Tool",
    "description": "Interactive poster for learning Thai Script including consonants, vowels, and tones with pronunciation and writing practice",
    "educationalLevel": "Beginner to Advanced",
    "learningResourceType": "Interactive Tool",
    "teaches": [
      "Thai Consonants",
      "Thai Vowels",
      "Thai Tones",
      "Thai Pronunciation",
      "Thai Writing System"
    ],
    "about": {
      "@type": "Language",
      "name": "Thai",
      "description": "Thai language writing system including consonants, vowels, and tones"
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
        "name": "Thai Script Poster",
        "item": "https://languageteacher.io/posters/thai-script"
      }
    ]
  }
}

export default function ThaiScriptPosterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ThaiScriptPosterClient />
    </>
  )
}
