import Link from 'next/link'

const languages = [
  {
    slug: 'japanese',
    name: 'Japanese',
    description: 'Comprehensive Japanese dictionary with 213,000+ words and 13,000+ kanji',
    wordCount: '213,000+',
    kanjiCount: '13,000+',
    color: 'from-blue-500 to-purple-600'
  },
  {
    slug: 'chinese',
    name: 'Chinese',
    description: 'Chinese dictionary (coming soon)',
    wordCount: 'Coming soon',
    kanjiCount: 'Coming soon',
    color: 'from-red-500 to-orange-600'
  },
  {
    slug: 'korean',
    name: 'Korean',
    description: 'Korean dictionary (coming soon)',
    wordCount: 'Coming soon',
    kanjiCount: 'Coming soon',
    color: 'from-blue-500 to-green-600'
  }
]

export default function DictionaryIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Language Dictionaries
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access comprehensive dictionaries for multiple languages with advanced search capabilities
          </p>
        </div>

        {/* Language Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language) => (
            <Link 
              key={language.slug}
              href={`/dictionary/${language.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                <div className={`h-2 bg-gradient-to-r ${language.color} rounded-t-xl`}></div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {language.name}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {language.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Words:</span>
                      <span className="font-semibold text-gray-700">{language.wordCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Characters:</span>
                      <span className="font-semibold text-gray-700">{language.kanjiCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    <span>Open Dictionary</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Dictionary Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Search</h3>
              <p className="text-gray-600 text-sm">
                Search by word, reading, meaning, or kanji with intelligent matching
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Data</h3>
              <p className="text-gray-600 text-sm">
                Access to official JMdict and KANJIDIC2 databases with rich metadata
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
              <p className="text-gray-600 text-sm">
                Built on Supabase with optimized search indexes for lightning-fast results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 