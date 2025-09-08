import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEntryBySlug, getCategoryBySlug, formatDate, getRelatedEntries } from '@/lib/blog'
import ReadingProgress from '@/components/ReadingProgress'

interface BlogEntryPageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogEntryPageProps): Promise<Metadata> {
  const { category, slug } = await params
  const entry = getEntryBySlug(category, slug)
  const categoryData = getCategoryBySlug(category)
  
  if (!entry || !categoryData) {
    return {
      title: 'Entry Not Found | Language Teacher Blog',
      description: 'The requested blog entry could not be found.',
      robots: 'noindex'
    }
  }

  const publishedTime = new Date(entry.date).toISOString()
  const modifiedTime = new Date().toISOString()
  const categoryTitle = categoryData.title
  const author = entry.author || 'Language Teacher'
  const tags = entry.tags || []

  return {
    title: `${entry.title} | Language Teacher Blog`,
    description: entry.excerpt,
    keywords: tags.join(', '),
    authors: [{ name: author }],
    category: categoryTitle,
    openGraph: {
      title: entry.title,
      description: entry.excerpt,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: [author],
      section: categoryTitle,
      tags: tags,
      url: `/blog/${category}/${slug}`,
      siteName: 'Language Teacher',
      images: entry.ogImage ? [
        {
          url: entry.ogImage,
          width: 1200,
          height: 630,
          alt: entry.title
        }
      ] : [
        {
          url: 'https://languageteacher.io/og-image.jpg',
          width: 1200,
          height: 630,
          alt: entry.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.title,
      description: entry.excerpt,
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
      canonical: `/blog/${category}/${slug}`
    }
  }
}

export default async function BlogEntryPage({ params }: BlogEntryPageProps) {
  const { category, slug } = await params
  const entry = getEntryBySlug(category, slug)
  const categoryData = getCategoryBySlug(category)
  const relatedEntries = entry ? getRelatedEntries(entry, 3) : []

  if (!entry || !categoryData) {
    notFound()
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": entry.title,
    "description": entry.excerpt,
    "image": entry.ogImage || "https://languageteacher.io/og-image.jpg",
    "author": {
      "@type": "Person",
      "name": entry.author || "Language Teacher"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Language Teacher",
      "logo": {
        "@type": "ImageObject",
        "url": "https://languageteacher.io/logo.png"
      }
    },
    "datePublished": new Date(entry.date).toISOString(),
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://languageteacher.io/blog/${category}/${slug}`
    },
    "articleSection": categoryData.title,
    "keywords": entry.tags?.join(', ') || '',
    "wordCount": entry.content.split(' ').length,
    "timeRequired": entry.readTime
  }

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
            <li><span aria-hidden="true">→</span></li>
            <li><Link href={`/blog/${category}`} className="hover:text-blue-600 capitalize">
              {category.replace('-', ' ')}
            </Link></li>
            <li><span aria-hidden="true">→</span></li>
            <li className="text-gray-900" aria-current="page">{entry.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{entry.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <span>By {entry.author}</span>
            <span>•</span>
            <time>
              {formatDate(entry.date)}
            </time>
            <span>•</span>
            <span>{entry.readTime}</span>
            {entry.rating && (
              <>
                <span>•</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < entry.rating! ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {entry.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-xl text-gray-600 leading-relaxed">{entry.excerpt}</p>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none" itemScope itemType="https://schema.org/BlogPosting">
          <div 
            className="bg-white rounded-lg shadow-md p-8"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </article>

        {/* Related Posts */}
        {relatedEntries.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedEntries.map((relatedEntry) => (
                <Link
                  key={relatedEntry.slug}
                  href={`/blog/${relatedEntry.category}/${relatedEntry.slug}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {getCategoryBySlug(relatedEntry.category)?.title}
                      </span>
                      <span className="text-gray-500 text-sm">{relatedEntry.readTime}</span>
                    </div>
                    <time className="text-gray-500 text-sm">
                      {formatDate(relatedEntry.date)}
                    </time>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {relatedEntry.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {relatedEntry.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Link
            href={`/blog/${category}`}
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Link>
          
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            All Categories →
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}