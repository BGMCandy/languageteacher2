import { Metadata } from 'next'
import ThaiScriptPageClient from './thai-script-page-client'

export const metadata: Metadata = {
  title: 'Thai Script Characters | Learn Thai Consonants, Vowels & Tones',
  description: 'Master Thai Script with our comprehensive learning tool. Study 44 Thai consonants, 32 vowels, and 5 tones with pronunciation, meanings, and writing practice.',
  keywords: [
    'thai script',
    'thai consonants',
    'thai vowels',
    'thai tones',
    'thai alphabet',
    'thai language learning',
    'thai writing system',
    'thai pronunciation',
    'thai characters',
    'thai study',
    'thai language',
    'thai script learning',
    'thai alphabet learning'
  ],
  authors: [{ name: 'Language Teacher' }],
  openGraph: {
    title: 'Thai Script Characters | Learn Thai Consonants, Vowels & Tones',
    description: 'Master Thai Script with our comprehensive learning tool. Study 44 Thai consonants, 32 vowels, and 5 tones with pronunciation and meanings.',
    type: 'website',
    url: 'https://languageteacher.io/characters/thai-script',
    siteName: 'Language Teacher',
    images: [
      {
        url: 'https://languageteacher.io/og-images/thai-script-characters.jpg',
        width: 1200,
        height: 630,
        alt: 'Thai Script Characters - Comprehensive Learning Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thai Script Characters | Learn Thai Consonants, Vowels & Tones',
    description: 'Master Thai Script with our comprehensive learning tool. Study 44 Thai consonants, 32 vowels, and 5 tones with pronunciation and meanings.',
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
    canonical: 'https://languageteacher.io/characters/thai-script'
  }
}

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Thai Script Characters Learning Tool",
  "description": "Master Thai Script with our comprehensive learning tool. Study 44 Thai consonants, 32 vowels, and 5 tones with pronunciation, meanings, and writing practice.",
  "url": "https://languageteacher.io/characters/thai-script",
  "mainEntity": {
    "@type": "EducationalResource",
    "name": "Thai Script Learning System",
    "description": "Interactive tool for learning Thai Script including consonants, vowels, and tones with pronunciation and meanings",
    "educationalLevel": "Beginner to Advanced",
    "learningResourceType": "Interactive Tool",
    "teaches": [
      "Thai Consonants",
      "Thai Vowels",
      "Thai Tones",
      "Thai Pronunciation",
      "Thai Writing System",
      "Thai Alphabet"
    ],
    "about": {
      "@type": "Language",
      "name": "Thai",
      "description": "Thai language writing system including consonants, vowels, and tones"
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
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
        "name": "Character Systems",
        "item": "https://languageteacher.io/characters"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Thai Script",
        "item": "https://languageteacher.io/characters/thai-script"
      }
    ]
  }
}

export default function ThaiScriptPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ThaiScriptPageClient />
    </>
  )
}
