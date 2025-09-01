import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-32 px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main heading with geometric accent */}
          <div className="mb-16">
            <h1 className="text-6xl font-bold text-black tracking-wider mb-8">
              LANGUAGE TEACHER
            </h1>
            <div className="h-1 w-32 bg-black mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Master Japanese, Thai, and more with cutting-edge digital tools
            </p>
          </div>
          
          {/* Geometric accent elements */}
          <div className="flex justify-center space-x-8 mb-16">
            <div className="w-4 h-4 bg-black"></div>
            <div className="w-4 h-4 bg-black" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
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
      <section className="px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <h2 className="text-3xl font-semibold text-black tracking-wider mb-4">
              LEARNING TOOLS
            </h2>
            <div className="h-px w-24 bg-black mx-auto"></div>
          </div>
          
          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Kanji Poster */}
            <Link href="/kanji-poster" className="group">
              <div className="border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 min-h-[280px] flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-black group-hover:bg-white mb-6"></div>
                  <h3 className="text-xl font-bold text-black group-hover:text-white mb-4 tracking-wider">KANJI POSTER</h3>
                  <p className="text-gray-600 group-hover:text-gray-200 leading-relaxed">
                    Interactive visual learning with comprehensive character coverage
                  </p>
                </div>
                <div className="h-px w-16 bg-black group-hover:bg-white mt-6"></div>
              </div>
            </Link>

            {/* Practice */}
            <Link href="/practice" className="group">
              <div className="border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 min-h-[280px] flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-black group-hover:bg-white mb-6" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                  <h3 className="text-xl font-bold text-black group-hover:text-white mb-4 tracking-wider">PRACTICE</h3>
                  <p className="text-gray-600 group-hover:text-gray-200 leading-relaxed">
                    Test your knowledge with adaptive practice sessions
                  </p>
                </div>
                <div className="h-px w-16 bg-black group-hover:bg-white mt-6"></div>
              </div>
            </Link>

            {/* Dictionary */}
            <Link href="/dictionary" className="group">
              <div className="border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 min-h-[280px] flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-black group-hover:bg-white mb-6" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
                  <h3 className="text-xl font-bold text-black group-hover:text-white mb-4 tracking-wider">DICTIONARY</h3>
                  <p className="text-gray-600 group-hover:text-gray-200 leading-relaxed">
                    Comprehensive word lookup with detailed definitions
                  </p>
                </div>
                <div className="h-px w-16 bg-black group-hover:bg-white mt-6"></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="px-8 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="border-2 border-black p-16 text-center">
            <h2 className="text-3xl font-semibold text-black tracking-wider mb-6">
              READY TO BEGIN?
            </h2>
            <div className="h-px w-24 bg-black mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Create an account or sign in to track your progress and unlock advanced features
            </p>
            <div className="space-y-4">
              <Link 
                href="/login" 
                className="btn-4"
              >
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
      <section className="px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center space-x-8">
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
          </div>
        </div>
      </section>
    </div>
  )
}
