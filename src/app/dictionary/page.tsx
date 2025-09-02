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
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-8">
            {/* Sharp geometric logo */}
            <div className="w-12 h-12 bg-black relative">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <h1 className="text-4xl font-bold text-black tracking-wider">
              LANGUAGE DICTIONARIES
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 tracking-wide">
            Access comprehensive dictionaries for multiple languages with advanced search capabilities
          </p>
        </div>

        {/* Language Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {languages.map((language) => (
            <Link 
              key={language.slug}
              href={`/dictionary/${language.slug}`}
              className="group block"
            >
              <div className="border-2 border-black bg-white hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-1">
                <div className={`h-2 bg-gradient-to-r ${language.color}`}></div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-black mb-4 tracking-wider group-hover:text-blue-600 transition-colors">
                    {language.name}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {language.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 tracking-wider uppercase">Words:</span>
                      <span className="font-semibold text-black">{language.wordCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 tracking-wider uppercase">Characters:</span>
                      <span className="font-semibold text-black">{language.kanjiCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    <span className="tracking-wider">OPEN DICTIONARY</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
} 