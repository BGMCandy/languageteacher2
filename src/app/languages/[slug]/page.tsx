import { use } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

interface LanguagePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: LanguagePageProps): Promise<Metadata> {
  const { slug } = await params
  const languageName = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ')
  
  return {
    title: `${languageName} Language Learning | Language Teacher`,
    description: `Learn ${languageName} with interactive tools, character systems, vocabulary, and grammar. Comprehensive language learning resources for ${languageName} students.`,
    keywords: [
      `${languageName.toLowerCase()} language learning`,
      `${languageName.toLowerCase()} characters`,
      `${languageName.toLowerCase()} vocabulary`,
      `${languageName.toLowerCase()} grammar`,
      `${languageName.toLowerCase()} pronunciation`,
      'language learning tools',
      'interactive language study'
    ],
    authors: [{ name: 'Language Teacher' }],
    openGraph: {
      title: `${languageName} Language Learning | Language Teacher`,
      description: `Learn ${languageName} with interactive tools, character systems, vocabulary, and grammar. Comprehensive language learning resources.`,
      type: 'website',
      url: `https://languageteacher.io/languages/${slug}`,
      siteName: 'Language Teacher',
      images: [
        {
          url: `https://languageteacher.io/og-images/${slug}-language.jpg`,
          width: 1200,
          height: 630,
          alt: `${languageName} Language Learning - Interactive Tools and Resources`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${languageName} Language Learning | Language Teacher`,
      description: `Learn ${languageName} with interactive tools, character systems, vocabulary, and grammar. Comprehensive language learning resources.`,
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
      canonical: `https://languageteacher.io/languages/${slug}`
    }
  }
}

export default function LanguagePage({ params }: LanguagePageProps) {
  const { slug } = use(params)
  const languageName = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ')
  
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${languageName} Language Learning`,
    "description": `Learn ${languageName} with interactive tools, character systems, vocabulary, and grammar. Comprehensive language learning resources for ${languageName} students.`,
    "url": `https://languageteacher.io/languages/${slug}`,
    "mainEntity": {
      "@type": "Language",
      "name": languageName,
      "description": `Comprehensive ${languageName} language learning resources and tools`
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
          "name": "Languages",
          "item": "https://languageteacher.io/languages"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": languageName,
          "item": `https://languageteacher.io/languages/${slug}`
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span aria-hidden="true">→</span></li>
              <li><Link href="/languages" className="hover:text-blue-600">Languages</Link></li>
              <li><span aria-hidden="true">→</span></li>
              <li className="text-gray-900" aria-current="page">{languageName}</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{languageName} Language Learning</h1>
            <p className="text-xl text-gray-600">
              Comprehensive {languageName.toLowerCase()} language learning resources and interactive tools.
            </p>
          </header>

          {/* Coming Soon Content */}
          <main className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
              <p className="text-gray-600 mb-6">
                We&apos;re working on comprehensive {languageName.toLowerCase()} language learning resources. 
                This will include character systems, vocabulary, grammar, and interactive learning tools.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Character Systems</h3>
                  <p className="text-sm text-gray-600">Learn writing systems and character recognition</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Vocabulary</h3>
                  <p className="text-sm text-gray-600">Build your word bank with interactive flashcards</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Grammar</h3>
                  <p className="text-sm text-gray-600">Master sentence structure and grammar rules</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Pronunciation</h3>
                  <p className="text-sm text-gray-600">Practice speaking with audio guides</p>
                </div>
              </div>

              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
