import { Metadata } from 'next'
import KanjiPageClient from './kanji-page-client'

export const metadata: Metadata = {
  title: 'Japanese Kanji Characters | Learn Kanji with Meanings, Readings & Stroke Order',
  description: 'Master Japanese Kanji characters with our comprehensive learning tool. Study 2,000+ Kanji with meanings, on-yomi and kun-yomi readings, stroke order, JLPT levels, and grade classifications.',
  keywords: [
    'japanese kanji',
    'kanji characters',
    'kanji learning',
    'japanese writing',
    'kanji meanings',
    'kanji readings',
    'on-yomi',
    'kun-yomi',
    'kanji stroke order',
    'jlpt kanji',
    'kanji grade',
    'japanese language learning',
    'kanji study',
    'japanese characters'
  ],
  authors: [{ name: 'Language Teacher' }],
  openGraph: {
    title: 'Japanese Kanji Characters | Learn Kanji with Meanings, Readings & Stroke Order',
    description: 'Master Japanese Kanji characters with our comprehensive learning tool. Study 2,000+ Kanji with meanings, readings, stroke order, and JLPT levels.',
    type: 'website',
    url: 'https://languageteacher.io/characters/kanji',
    siteName: 'Language Teacher',
    images: [
      {
        url: 'https://languageteacher.io/og-images/kanji-characters.jpg',
        width: 1200,
        height: 630,
        alt: 'Japanese Kanji Characters - Comprehensive Learning Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Japanese Kanji Characters | Learn Kanji with Meanings, Readings & Stroke Order',
    description: 'Master Japanese Kanji characters with our comprehensive learning tool. Study 2,000+ Kanji with meanings, readings, stroke order, and JLPT levels.',
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
    canonical: 'https://languageteacher.io/characters/kanji'
  }
}

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Japanese Kanji Characters Learning Tool",
  "description": "Master Japanese Kanji characters with our comprehensive learning tool. Study 2,000+ Kanji with meanings, on-yomi and kun-yomi readings, stroke order, JLPT levels, and grade classifications.",
  "url": "https://languageteacher.io/characters/kanji",
  "mainEntity": {
    "@type": "EducationalResource",
    "name": "Japanese Kanji Learning System",
    "description": "Interactive tool for learning Japanese Kanji characters with comprehensive information including meanings, readings, stroke order, and classifications",
    "educationalLevel": "Beginner to Advanced",
    "learningResourceType": "Interactive Tool",
    "teaches": [
      "Japanese Kanji Characters",
      "Kanji Meanings and Definitions",
      "On-yomi and Kun-yomi Readings",
      "Kanji Stroke Order",
      "JLPT Level Classifications",
      "Grade Level Classifications",
      "Japanese Writing System"
    ],
    "about": {
      "@type": "Language",
      "name": "Japanese",
      "description": "Japanese language writing system including Kanji characters"
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
        "name": "Japanese Kanji",
        "item": "https://languageteacher.io/characters/kanji"
      }
    ]
  }
}

export default function KanjiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <KanjiPageClient />
    </>
  )
}
