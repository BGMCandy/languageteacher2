import Link from 'next/link'
import FeatureCard from './components/FeatureCard'

export default function Home() {
  return (
    <div className="bg-white w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto text-center w-full">
          {/* Main heading with geometric accent */}
          <div className="mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black tracking-wider mb-8">
              LANGUAGE TEACHER
            </h1>
            <div className="h-1 w-32 bg-black mx-auto mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Master Japanese, Thai, and more with cutting-edge digital tools
            </p>
          </div>
          
          {/* Geometric accent elements */}
          <div className="flex justify-center space-x-6 sm:space-x-8 mb-16">
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
      <section className="px-4 sm:px-8 pb-32">
        <div className="max-w-6xl mx-auto w-full">
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
            <FeatureCard
              href="/kanji-poster"
              title="KANJI POSTER"
              enterFrom="left"
              verticalOffset={2}
              overlayText="漢"
              description="Interactive visual learning with comprehensive character coverage"
              imageUrl="https://media.languageteacher.io/samurai.webp"
            />

            {/* Practice */}
            <FeatureCard
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
            <FeatureCard
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
        <div className="max-w-4xl mx-auto w-full">
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
              <Link href="/login" className="btn-4 inline-block">
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
  )
}
