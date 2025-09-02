import Link from 'next/link'

const languages = [
  {
    slug: 'japanese',
    name: 'Japanese',
    description: 'Comprehensive Japanese dictionary with 213,000+ words and 13,000+ kanji',
    wordCount: '213,000+',
    kanjiCount: '13,000+',
    available: true
  },
  {
    slug: 'chinese',
    name: 'Chinese',
    description: 'Chinese dictionary (coming soon)',
    wordCount: 'Coming soon',
    kanjiCount: 'Coming soon',
    available: false
  },
  {
    slug: 'korean',
    name: 'Korean',
    description: 'Korean dictionary (coming soon)',
    wordCount: 'Coming soon',
    kanjiCount: 'Coming soon',
    available: false
  },
  {
    slug: 'thai',
    name: 'Thai',
    description: 'Thai dictionary (coming soon)',
    wordCount: 'Coming soon',
    kanjiCount: 'Coming soon',
    available: false
  }
]

export default function DictionaryIndexPage() {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="text-center py-16 ">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {languages.map((language) => (
            <Link 
              key={language.slug}
              href={language.available ? `/dictionary/${language.slug}` : '#'}
              className={`group block ${!language.available ? 'pointer-events-none' : ''}`}
            >
              <div className={`border-2 transition-all duration-200 ${
                language.available 
                  ? 'border-black bg-white hover:bg-gray-50' 
                  : 'border-gray-200 bg-gray-100'
              }`}>
                <div className={`h-2 ${
                  language.available ? 'bg-black' : 'bg-gray-300'
                }`}></div>
                <div className="p-8">
                  <h2 className={`text-2xl font-bold mb-4 tracking-wider transition-colors ${
                    language.available 
                      ? 'text-black group-hover:text-gray-600' 
                      : 'text-gray-400'
                  }`}>
                    {language.name}
                  </h2>
                  <p className={`mb-6 leading-relaxed ${
                    language.available ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {language.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className={`tracking-wider uppercase ${
                        language.available ? 'text-gray-500' : 'text-gray-400'
                      }`}>Words:</span>
                      <span className={`font-semibold ${
                        language.available ? 'text-black' : 'text-gray-400'
                      }`}>{language.wordCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={`tracking-wider uppercase ${
                        language.available ? 'text-gray-500' : 'text-gray-400'
                      }`}>Characters:</span>
                      <span className={`font-semibold ${
                        language.available ? 'text-black' : 'text-gray-400'
                      }`}>{language.kanjiCount}</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center font-medium transition-colors ${
                    language.available 
                      ? 'text-black group-hover:text-gray-600' 
                      : 'text-gray-400'
                  }`}>
                    <span className="tracking-wider">
                      {language.available ? 'OPEN DICTIONARY' : 'COMING SOON'}
                    </span>
                    {language.available && (
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
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