import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEntryBySlug, getCategoryBySlug, formatDate, getRelatedEntries } from '@/lib/blog'
import ReadingProgress from '@/components/ReadingProgress'

// Sample blog entries with full content
const blogEntries: Record<string, Record<string, any>> = {
  'book-reviews': {
    'norwegian-wood-review': {
      slug: 'norwegian-wood-review',
      title: 'Norwegian Wood by Haruki Murakami: A Review',
      excerpt: 'A deep dive into Murakami\'s melancholic masterpiece and its themes of love, loss, and coming of age.',
      content: `
        <p>Haruki Murakami's <em>Norwegian Wood</em> is a novel that captures the essence of youth, love, and the inevitable pain that comes with growing up. Set in 1960s Tokyo, the story follows Toru Watanabe as he navigates the complexities of university life, friendship, and romantic relationships.</p>

        <h2>The Story</h2>
        <p>The novel begins with Watanabe hearing "Norwegian Wood" by the Beatles, which triggers memories of his university days. The narrative unfolds as a flashback, taking us through his relationships with two very different women: the emotionally fragile Naoko and the vibrant, independent Midori.</p>

        <h2>Character Development</h2>
        <p>Murakami's characters are beautifully crafted, each with their own struggles and complexities. Watanabe serves as a relatable narrator, while Naoko represents the weight of past trauma and mental illness. Midori, in contrast, embodies hope and the possibility of moving forward.</p>

        <h2>Themes</h2>
        <p>The novel explores several profound themes:</p>
        <ul>
          <li><strong>Loss and Grief:</strong> The characters grapple with the death of loved ones and the emotional scars left behind.</li>
          <li><strong>Mental Health:</strong> Murakami sensitively portrays depression and mental illness through Naoko's character.</li>
          <li><strong>Coming of Age:</strong> The story captures the transition from adolescence to adulthood.</li>
          <li><strong>Love and Relationships:</strong> The complexity of romantic relationships and the choices we make.</li>
        </ul>

        <h2>Writing Style</h2>
        <p>Murakami's prose is simple yet profound, with a dreamlike quality that draws readers in. His ability to capture the internal monologue of his characters is particularly striking, making their emotions feel authentic and relatable.</p>

        <h2>Final Thoughts</h2>
        <p><em>Norwegian Wood</em> is not just a love story; it's a meditation on life, death, and the human condition. While it can be emotionally challenging to read, it offers profound insights into the nature of existence and the resilience of the human spirit.</p>

        <p>This novel is perfect for readers who enjoy introspective literature and are not afraid to confront difficult emotions. It's a book that stays with you long after you've turned the final page.</p>
      `,
      date: '2024-01-10',
      readTime: '6 min read',
      rating: 5,
      tags: ['fiction', 'japanese-literature', 'murakami'],
      author: 'Language Teacher',
      category: 'book-reviews'
    },
    'atomic-habits-review': {
      slug: 'atomic-habits-review',
      title: 'Atomic Habits by James Clear: Building Better Systems',
      excerpt: 'How small changes can lead to remarkable results. A practical guide to habit formation.',
      content: `
        <p>James Clear's <em>Atomic Habits</em> is a comprehensive guide to understanding and building better habits. The book is based on the premise that small, consistent changes can lead to remarkable results over time.</p>

        <h2>Key Concepts</h2>
        <p>Clear introduces the "atomic habits" concept - tiny changes that compound over time. He argues that focusing on systems rather than goals is the key to lasting change.</p>

        <h2>The Four Laws of Behavior Change</h2>
        <ol>
          <li><strong>Make it Obvious:</strong> Design your environment to make good habits visible and bad habits invisible.</li>
          <li><strong>Make it Attractive:</strong> Use temptation bundling to make habits more appealing.</li>
          <li><strong>Make it Easy:</strong> Reduce friction for good habits and increase friction for bad ones.</li>
          <li><strong>Make it Satisfying:</strong> Create immediate rewards for good habits.</li>
        </ol>

        <h2>Practical Applications</h2>
        <p>The book is filled with actionable advice and real-world examples. Clear provides specific strategies for implementing each of the four laws in your daily life.</p>

        <h2>Strengths</h2>
        <p>Clear's writing is clear and accessible, making complex psychological concepts easy to understand. The book is well-structured and includes practical exercises to help readers apply the concepts.</p>

        <h2>Areas for Improvement</h2>
        <p>While the book is excellent, some readers might find the examples repetitive. Additionally, the focus on individual habits might not address systemic issues that affect behavior change.</p>

        <h2>Verdict</h2>
        <p><em>Atomic Habits</em> is an essential read for anyone looking to improve their habits and build better systems in their life. The practical advice and clear framework make it a valuable resource for personal development.</p>
      `,
      date: '2024-01-05',
      readTime: '5 min read',
      rating: 4,
      tags: ['self-help', 'productivity', 'psychology'],
      author: 'Language Teacher',
      category: 'book-reviews'
    }
  },
  'travel': {
    'tokyo-language-learning': {
      slug: 'tokyo-language-learning',
      title: 'Learning Japanese in Tokyo: A Month of Immersion',
      excerpt: 'My experience spending a month in Tokyo focusing on Japanese language learning through daily immersion.',
      content: `
        <p>After years of studying Japanese from textbooks and online resources, I finally decided to take the plunge and spend a month in Tokyo for intensive language immersion. Here's what I learned from this incredible experience.</p>

        <h2>Why Tokyo?</h2>
        <p>Tokyo offers the perfect blend of traditional culture and modern convenience. The city's efficient public transportation system makes it easy to explore different neighborhoods, each with its own unique character and language patterns.</p>

        <h2>My Daily Routine</h2>
        <p>I structured my days around language learning:</p>
        <ul>
          <li><strong>Morning:</strong> 2 hours of formal study with textbooks and apps</li>
          <li><strong>Afternoon:</strong> Exploring different neighborhoods and practicing with locals</li>
          <li><strong>Evening:</strong> Language exchange meetups and cultural activities</li>
        </ul>

        <h2>Key Learning Strategies</h2>
        <h3>1. Immersion Through Daily Life</h3>
        <p>I made a conscious effort to use Japanese in all daily interactions - ordering food, asking for directions, shopping, and even small talk with strangers.</p>

        <h3>2. Neighborhood Exploration</h3>
        <p>Each Tokyo neighborhood has its own dialect and cultural nuances. I spent time in areas like Shibuya, Harajuku, and Asakusa to experience different aspects of Japanese culture and language.</p>

        <h3>3. Language Exchange</h3>
        <p>I attended several language exchange events where I could practice Japanese while helping others learn English. These sessions were invaluable for building confidence and making local friends.</p>

        <h2>Challenges and Breakthroughs</h2>
        <p>The biggest challenge was overcoming the fear of making mistakes. Japanese people are generally very patient and encouraging with language learners, which helped me build confidence quickly.</p>

        <p>My biggest breakthrough came in week three when I successfully navigated a complex conversation about train schedules and directions entirely in Japanese. The sense of accomplishment was incredible.</p>

        <h2>Cultural Insights</h2>
        <p>Living in Tokyo taught me that language learning is about more than just vocabulary and grammar. Understanding cultural context, body language, and social norms is equally important for effective communication.</p>

        <h2>Tips for Future Language Learners</h2>
        <ul>
          <li>Don't be afraid to make mistakes - they're part of the learning process</li>
          <li>Find a language exchange partner early in your stay</li>
          <li>Explore different neighborhoods to experience various aspects of the culture</li>
          <li>Keep a journal in your target language</li>
          <li>Take advantage of free cultural activities and events</li>
        </ul>

        <h2>Final Thoughts</h2>
        <p>My month in Tokyo was transformative. Not only did my Japanese improve significantly, but I also gained a deeper understanding of Japanese culture and made lasting friendships. I highly recommend immersion experiences for anyone serious about language learning.</p>
      `,
      date: '2024-01-15',
      readTime: '8 min read',
      tags: ['japan', 'language-learning', 'tokyo'],
      author: 'Language Teacher',
      category: 'travel'
    }
  },
  'movies': {
    'parasite-movie-analysis': {
      slug: 'parasite-movie-analysis',
      title: 'Parasite: A Masterclass in Social Commentary',
      excerpt: 'Analyzing Bong Joon-ho\'s Oscar-winning film and its powerful message about class inequality.',
      content: `
        <p>Bong Joon-ho's <em>Parasite</em> is a masterpiece that seamlessly blends genres while delivering a powerful critique of social inequality. The film's success at the 2020 Academy Awards marked a historic moment for Korean cinema and international filmmaking.</p>

        <h2>The Story</h2>
        <p>The film follows the Kim family, who live in a semi-basement apartment and struggle to make ends meet. When their son gets a job tutoring the daughter of the wealthy Park family, they see an opportunity to improve their situation through deception and manipulation.</p>

        <h2>Visual Storytelling</h2>
        <p>Bong's direction is masterful, using visual metaphors to reinforce the film's themes. The contrast between the Kims' cramped, underground living space and the Parks' spacious, elevated home is a powerful visual representation of class divide.</p>

        <h2>Social Commentary</h2>
        <p>The film explores several themes related to social inequality:</p>
        <ul>
          <li><strong>Class Struggle:</strong> The fundamental conflict between the working class and the wealthy elite</li>
          <li><strong>Economic Inequality:</strong> How poverty forces people to make desperate choices</li>
          <li><strong>Social Mobility:</strong> The illusion of upward mobility in modern society</li>
          <li><strong>Human Dignity:</strong> How economic status affects human relationships and self-worth</li>
        </ul>

        <h2>Character Analysis</h2>
        <h3>The Kim Family</h3>
        <p>Each member of the Kim family represents different aspects of the working class struggle. Their desperation and resourcefulness make them both sympathetic and morally complex characters.</p>

        <h3>The Park Family</h3>
        <p>The Parks are not portrayed as evil, but rather as oblivious to their privilege. Their ignorance of the struggles of others is perhaps more damning than active cruelty.</p>

        <h2>Symbolism and Metaphors</h2>
        <p>The film is rich with symbolic elements:</p>
        <ul>
          <li><strong>Basement vs. Mansion:</strong> Physical representation of social hierarchy</li>
          <li><strong>Rain:</strong> Symbol of both cleansing and destruction</li>
          <li><strong>Smell:</strong> A subtle but powerful indicator of class difference</li>
          <li><strong>Stairs:</strong> The difficult path of social mobility</li>
        </ul>

        <h2>Technical Excellence</h2>
        <p>The film's technical aspects are outstanding. The cinematography, editing, and sound design all work together to create a tense, atmospheric experience that keeps viewers engaged throughout.</p>

        <h2>Cultural Impact</h2>
        <p><em>Parasite</em> broke barriers for international cinema, proving that language is not a barrier to universal storytelling. Its success opened doors for more diverse voices in mainstream cinema.</p>

        <h2>Final Thoughts</h2>
        <p><em>Parasite</em> is more than just entertainment; it's a mirror held up to society, forcing us to confront uncomfortable truths about inequality and privilege. Bong Joon-ho has created a film that will be studied and discussed for years to come.</p>

        <p>This film is essential viewing for anyone interested in cinema as an art form and a tool for social commentary. It's a perfect example of how great storytelling can transcend cultural boundaries and speak to universal human experiences.</p>
      `,
      date: '2024-01-05',
      readTime: '10 min read',
      rating: 5,
      tags: ['korean-cinema', 'social-commentary', 'thriller'],
      author: 'Language Teacher',
      category: 'movies'
    }
  }
}

interface BlogEntryPageProps {
  params: {
    category: string
    slug: string
  }
}

export async function generateMetadata({ params }: BlogEntryPageProps): Promise<Metadata> {
  const entry = getEntryBySlug(params.category, params.slug)
  const category = getCategoryBySlug(params.category)
  
  if (!entry || !category) {
    return {
      title: 'Entry Not Found | Language Teacher Blog',
      description: 'The requested blog entry could not be found.',
      robots: 'noindex'
    }
  }

  const publishedTime = new Date(entry.date).toISOString()
  const modifiedTime = new Date().toISOString()
  const categoryTitle = category.title
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
      url: `/blog/${params.category}/${params.slug}`,
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
      canonical: `/blog/${params.category}/${params.slug}`
    }
  }
}

export default function BlogEntryPage({ params }: BlogEntryPageProps) {
  const entry = getEntryBySlug(params.category, params.slug)
  const category = getCategoryBySlug(params.category)
  const relatedEntries = entry ? getRelatedEntries(entry, 3) : []

  if (!entry || !category) {
    notFound()
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": entry.title,
    "description": entry.excerpt,
    "image": "https://languageteacher.io/og-image.jpg", // You should add this
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
      "@id": `https://languageteacher.io/blog/${params.category}/${params.slug}`
    },
    "articleSection": category.title,
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
            <li><Link href={`/blog/${params.category}`} className="hover:text-blue-600 capitalize">
              {params.category.replace('-', ' ')}
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
            href={`/blog/${params.category}`}
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to {params.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
