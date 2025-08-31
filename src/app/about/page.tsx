export default function About() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-8">
            {/* Sharp geometric logo */}
            <div className="w-12 h-12 bg-black relative">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <h1 className="text-4xl font-bold text-black tracking-wider">
              ABOUT US
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 tracking-wide">
            Revolutionizing language learning through technology and innovation
          </p>
        </div>

        {/* Content */}
        <div className="border-2 border-black p-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              OUR MISSION
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Language Teacher is dedicated to making language learning accessible, engaging, and effective for everyone. We believe that technology can bridge the gap between traditional classroom learning and the modern, fast-paced world we live in.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              WHAT WE DO
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              We provide comprehensive language learning tools that combine cutting-edge technology with proven educational methodologies. Our platform offers interactive kanji posters, practice sessions, comprehensive dictionaries, and personalized learning experiences.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              OUR APPROACH
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-black mb-3 tracking-wider">
                  INTERACTIVE LEARNING
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We believe in learning by doing. Our interactive tools engage users in active learning rather than passive memorization.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-black mb-3 tracking-wider">
                  PERSONALIZED EXPERIENCE
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Every learner is unique. Our adaptive systems tailor the learning experience to individual needs and progress.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-black mb-3 tracking-wider">
                  COMPREHENSIVE RESOURCES
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  From basic vocabulary to advanced grammar, we provide a complete learning ecosystem for language mastery.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-black mb-3 tracking-wider">
                  COMMUNITY DRIVEN
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We value user feedback and continuously improve our platform based on real user experiences and needs.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              OUR STORY
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Founded by language enthusiasts and technology experts, Language Teacher emerged from a simple observation: traditional language learning methods often fail to keep pace with modern learning needs. We set out to create a solution that combines the best of both worlds.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              LOOKING FORWARD
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              As we continue to grow, we remain committed to our core mission: making language learning more accessible, effective, and enjoyable. We&apos;re constantly exploring new technologies and methodologies to enhance the learning experience.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              JOIN US
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Whether you&apos;re just starting your language learning journey or looking to enhance your existing skills, we invite you to join our community. Together, we can make language learning a rewarding and successful experience.
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="text-center mt-16">
          <div className="flex justify-center space-x-8">
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
