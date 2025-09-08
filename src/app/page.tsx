import Link from 'next/link'
import { Metadata } from 'next'
import FeatureCardOptimized from './components/FeatureCardOptimized'

export const metadata: Metadata = {
  title: 'Language Teacher | Master Japanese, Thai & More with Interactive Learning Tools',
  description: 'Master Japanese Kanji, Thai Script, and more languages with cutting-edge digital tools. Interactive posters, practice sessions, and comprehensive dictionaries for effective language learning.',
  keywords: [
    'language learning',
    'japanese kanji',
    'thai script',
    'interactive learning',
    'language tools',
    'kanji poster',
    'thai alphabet',
    'language practice',
    'digital learning',
    'japanese language',
    'thai language'
  ],
  authors: [{ name: 'Language Teacher' }],
  openGraph: {
    title: 'Language Teacher | Master Japanese, Thai & More with Interactive Learning Tools',
    description: 'Master Japanese Kanji, Thai Script, and more languages with cutting-edge digital tools. Interactive posters, practice sessions, and comprehensive dictionaries.',
    type: 'website',
    url: 'https://languageteacher.io',
    siteName: 'Language Teacher',
    images: [
      {
        url: 'https://languageteacher.io/og-images/homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'Language Teacher - Interactive Language Learning Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Language Teacher | Master Japanese, Thai & More with Interactive Learning Tools',
    description: 'Master Japanese Kanji, Thai Script, and more languages with cutting-edge digital tools. Interactive posters, practice sessions, and comprehensive dictionaries.',
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
    canonical: 'https://languageteacher.io'
  }
}

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Language Teacher",
  "description": "Master Japanese Kanji, Thai Script, and more languages with cutting-edge digital tools. Interactive posters, practice sessions, and comprehensive dictionaries for effective language learning.",
  "url": "https://languageteacher.io",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://languageteacher.io/dictionary?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "mainEntity": {
    "@type": "EducationalOrganization",
    "name": "Language Teacher",
    "description": "Interactive language learning platform specializing in Japanese, Thai, and other languages",
    "url": "https://languageteacher.io",
    "sameAs": [
      "https://twitter.com/languageteache"
    ]
  }
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Preload critical images */}
      <link rel="preload" as="image" href="https://media.languageteacher.io/samurai.webp" />
      <link rel="preload" as="image" href="https://media.languageteacher.io/monk.webp" />
      <link rel="preload" as="image" href="https://media.languageteacher.io/teacher.webp" />
      
      {/* Critical CSS inlined for faster LCP */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for homepage above-the-fold content */
          .bg-white { background-color: #ffffff; }
          .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          .sm\\:text-5xl { font-size: 3rem; line-height: 1; }
          .lg\\:text-6xl { font-size: 3.75rem; line-height: 1; }
          .font-bold { font-weight: 700; }
          .text-black { color: #000000; }
          .tracking-wider { letter-spacing: 0.05em; }
          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .sm\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
          .text-gray-600 { color: #4b5563; }
          .max-w-2xl { max-width: 42rem; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .leading-relaxed { line-height: 1.625; }
          .text-center { text-align: center; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
          .sm\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
          .max-w-6xl { max-width: 72rem; }
          .mb-16 { margin-bottom: 4rem; }
          .mb-8 { margin-bottom: 2rem; }
          .h-1 { height: 0.25rem; }
          .w-32 { width: 8rem; }
          .bg-black { background-color: #000000; }
          .btn-3 { display: inline-block; padding: 0.75rem 1.5rem; background-color: #000000; color: #ffffff; text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border: 2px solid #000000; transition: all 0.3s ease; }
          .btn-3:hover { background-color: #ffffff; color: #000000; }
          .grid { display: grid; }
          .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .gap-8 { gap: 2rem; }
          .sm\\:gap-12 { gap: 3rem; }
          .space-x-6 > :not([hidden]) ~ :not([hidden]) { margin-left: 1.5rem; }
          .sm\\:space-x-8 > :not([hidden]) ~ :not([hidden]) { margin-left: 2rem; }
          .w-4 { width: 1rem; }
          .h-4 { height: 1rem; }
          .flex { display: flex; }
          .justify-center { justify-content: center; }
          .items-center { align-items: center; }
          @media (min-width: 640px) {
            .sm\\:text-5xl { font-size: 3rem; line-height: 1; }
            .sm\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .sm\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
            .sm\\:space-x-8 > :not([hidden]) ~ :not([hidden]) { margin-left: 2rem; }
            .sm\\:gap-12 { gap: 3rem; }
          }
          @media (min-width: 1024px) {
            .lg\\:text-6xl { font-size: 3.75rem; line-height: 1; }
            .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          }
        `
      }} />
      
      <div className="bg-white w-full h-full">
      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main heading with geometric accent */}
          <div className="mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black tracking-wider mb-8">
              LANGUAGE TEACHER
            </h1>
            <div className="h-1 w-32 bg-black mx-auto mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Master Japanese, Thai, and more with cutting-edge digital tools
            </p>
          </div>
          
          {/* Geometric accent elements */}
          <div className="flex justify-center space-x-6 sm:space-x-8 mb-16">
            <div className="w-4 h-4 bg-black"></div>
            <Link 
              href="/games" 
              className="w-4 h-4 bg-black hover:bg-purple-600 transition-colors duration-300 cursor-pointer" 
              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              title="🎮 Hidden Games"
            ></Link>
            <div className="w-4 h-4 bg-black"></div>
          </div>
          
          {/* CTA Button */}
          <Link 
            href="/login" 
            className="btn-3"
          >
            GET STARTED
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-black tracking-wider mb-4">
              LEARNING TOOLS
            </h2>
            <div className="h-px w-24 bg-black mx-auto"></div>
          </div>
          
          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Kanji Poster */}
            <FeatureCardOptimized
              href="/posters/kanji"
              title="KANJI POSTER"
              enterFrom="left"
              verticalOffset={2}
              overlayText="漢"
              description="Interactive visual learning with comprehensive character coverage"
              imageUrl="https://media.languageteacher.io/samurai.webp"
            />

            {/* Practice */}
            <FeatureCardOptimized
              href="/practice"
              title="PRACTICE"
              enterFrom="right"
              verticalOffset={2}
              overlayText="練"
              description="Test your knowledge with adaptive practice sessions"
              iconStyle={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              imageUrl="https://media.languageteacher.io/monk.webp"
            />

            {/* Dictionary */}
            <FeatureCardOptimized
              href="/dictionary"
              title="DICTIONARY"  
              enterFrom="left"
              verticalOffset={0}
              overlayText="辞"
              description="Comprehensive word lookup with detailed definitions"
              iconStyle={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}
              imageUrl="https://media.languageteacher.io/teacher.webp"
            />
          </div>
        </div>
      </section>
      
      {/* Authentication Section */}
      <section className="px-4 sm:px-8 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="group relative border-2 border-black p-6 sm:p-12 lg:p-16 text-center overflow-hidden">
            {/* background word (hover only) */}
            <div
              aria-hidden
              className="
                pointer-events-none select-none
                absolute inset-0
                flex items-end justify-end
                pr-2 sm:pr-4 pb-2
                opacity-0 group-hover:opacity-20
                transition-opacity duration-500
              "
            >
              <div
                aria-hidden
                className="
                  pointer-events-none select-none
                  absolute inset-0
                  flex items-end justify-end
                  pr-2 sm:pr-4 pb-2
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-500
                "
              >
                <div
                  className="
                    text-right leading-[0.85]
                    space-y-1 sm:space-y-2 md:space-y-3
                    translate-y-2
                    [mask-image:linear-gradient(to_top,transparent,black_20%,black)]
                  "
                >
                  {/* Thai – slightly bigger, normal tracking */}
                  <div className="font-extrabold text-black/15 text-[clamp(1.5rem,6vw,5rem)] tracking-normal">
                    เริ่มกันเลย
                  </div>

                  {/* Spanish – a touch narrower tracking to keep it tidy */}
                  <div className="font-extrabold text-black/25 text-[clamp(1.3rem,5vw,6.5rem)] tracking-tight">
                    Vamos a empezar
                  </div>

                  {/* Chinese (Traditional) – keep strong but subtle */}
                  <div className="font-extrabold text-black/35 text-[clamp(1.3rem,5vw,6.5rem)] tracking-normal">
                    開始吧
                  </div>
                  {/* Japanese – keep strong but subtle */}
                  <div className="font-extrabold text-black/45 text-[clamp(1.3rem,5vw,5.5rem)] tracking-normal">
                    始めましょう 
                  </div>
                </div>
              </div>
            </div>

            {/* content above it */}
            <h2 className="relative z-10 text-xl sm:text-2xl lg:text-3xl font-semibold text-black tracking-wider mb-6">
              READY TO BEGIN?
            </h2>
            <div className="relative z-10 h-px w-24 bg-black mx-auto mb-8"></div>
            <p className="relative z-10 text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Create an account or sign in to track your progress and unlock advanced features
            </p>
            <div className="relative z-10 space-y-4">
              <Link href="/login" className="btn-4 inline-block cursor-pointer">
                SIGN IN / CREATE ACCOUNT
              </Link>
              <div className="h-px w-32 bg-black mx-auto mt-6"></div>
              <p className="text-sm text-gray-500 tracking-wide">
                FREE TO USE • NO CREDIT CARD REQUIRED
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom accent */}
      <section className="px-4 sm:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center space-x-6 sm:space-x-8">
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
