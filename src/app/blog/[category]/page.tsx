import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getEntriesByCategory, formatDate } from '@/lib/blog'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = getCategoryBySlug(category)
  const entries = getEntriesByCategory(category)
  
  if (!categoryData) {
    return {
      title: 'Category Not Found | Language Teacher Blog',
      description: 'The requested blog category could not be found.',
      robots: 'noindex'
    }
  }

  const categoryDescription = `${categoryData.description} Browse ${entries.length} ${entries.length === 1 ? 'article' : 'articles'} in the ${categoryData.title.toLowerCase()} category.`

  return {
    title: `${categoryData.title} | Language Teacher Blog`,
    description: categoryDescription,
    keywords: `${categoryData.title.toLowerCase()}, blog, articles, ${categoryData.title.toLowerCase().replace(' ', '-')}`,
    openGraph: {
      title: `${categoryData.title} | Language Teacher Blog`,
      description: categoryDescription,
      type: 'website',
      url: `/blog/${category}`,
      siteName: 'Language Teacher'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryData.title} | Language Teacher Blog`,
      description: categoryDescription
    },
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical: `/blog/${category}`
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryData = getCategoryBySlug(category)
  const entries = getEntriesByCategory(category)

  if (!categoryData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Blog
          </Link>
          
          <div className="flex items-center mb-4">
            <div className={`w-16 h-16 ${categoryData.color} rounded-lg flex items-center justify-center text-3xl mr-6`}>
              {categoryData.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{categoryData.title}</h1>
              <p className="text-xl text-gray-600 mt-2">{categoryData.description}</p>
            </div>
          </div>
        </div>

        {/* Entries List */}
        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No entries found in this category yet.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/blog/${category}/${entry.slug}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500 text-sm">{entry.readTime}</span>
                    {entry.rating && (
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
                    )}
                  </div>
                  <time className="text-gray-500 text-sm">
                    {formatDate(entry.date)}
                  </time>
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                  {entry.title}
                </h2>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {entry.excerpt}
                </p>
                
                {entry.tags && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))
          )}
        </div>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to All Categories
          </Link>
        </div>
      </div>
    </div>
  )
}
