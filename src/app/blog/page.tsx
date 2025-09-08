import Link from 'next/link'
import { Metadata } from 'next'
import { getAllCategories, getRecentEntries, getEntriesByCategory, formatDate } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog | Language Teacher - Language Learning Articles & Reviews',
  description: 'Discover language learning tips, book reviews, travel experiences, and movie analysis on our comprehensive blog. Expert insights for Japanese, Chinese, Thai, and more.',
  keywords: 'language learning, blog, articles, book reviews, travel, movies, Japanese, Chinese, Thai, kanji, hanzi, language tips',
  openGraph: {
    title: 'Blog | Language Teacher - Language Learning Articles & Reviews',
    description: 'Discover language learning tips, book reviews, travel experiences, and movie analysis on our comprehensive blog. Expert insights for Japanese, Chinese, Thai, and more.',
    type: 'website',
    url: '/blog',
    siteName: 'Language Teacher'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Language Teacher - Language Learning Articles & Reviews',
    description: 'Discover language learning tips, book reviews, travel experiences, and movie analysis on our comprehensive blog.',
    creator: '@languageteacher'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: '/blog'
  }
}

export default function BlogPage() {
  const categories = getAllCategories()
  const recentEntries = getRecentEntries(3)
  
  // Calculate entry counts for each category
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    entryCount: getEntriesByCategory(category.slug).length
  }))

  // Structured data for the blog
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Language Teacher Blog",
    "description": "Language learning tips, book reviews, travel experiences, and movie analysis",
    "url": "https://languageteacher.io/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Language Teacher",
      "logo": {
        "@type": "ImageObject",
        "url": "https://languageteacher.io/logo.png"
      }
    },
    "blogPost": recentEntries.map(entry => ({
      "@type": "BlogPosting",
      "headline": entry.title,
      "description": entry.excerpt,
      "url": `https://languageteacher.io/blog/${entry.category}/${entry.slug}`,
      "datePublished": new Date(entry.date).toISOString(),
      "author": {
        "@type": "Person",
        "name": entry.author
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thoughts on books, travel experiences, movie reviews, and everything in between.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {categoriesWithCounts.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/${category.slug}`}
                className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-2xl mr-4`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.entryCount} {category.entryCount === 1 ? 'entry' : 'entries'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Entries */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Entries</h2>
          <div className="space-y-6">
            {recentEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/blog/${entry.category}/${entry.slug}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {categoriesWithCounts.find(cat => cat.slug === entry.category)?.title}
                    </span>
                    <span className="text-gray-500 text-sm">{entry.readTime}</span>
                  </div>
                  <time className="text-gray-500 text-sm">
                    {formatDate(entry.date)}
                  </time>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {entry.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {entry.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-6">
            Get notified when I publish new blog posts about books, travel, and movies.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
