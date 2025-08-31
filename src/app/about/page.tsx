export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Language Teacher
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empowering language learners worldwide with innovative tools and comprehensive resources
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-12">
          
          {/* Mission Section */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Language Teacher, we believe that learning a new language should be accessible, engaging, and effective. Our mission is to break down the barriers to language learning by providing innovative digital tools that make the journey both enjoyable and successful.
            </p>
          </section>

          {/* What We Do Section */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              What We Do
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-800">Interactive Learning Tools</h3>
                <p className="text-gray-700">
                  We&apos;ve developed cutting-edge tools like the Kanji Poster, which transforms traditional character learning into an interactive, visual experience that helps learners understand and remember Japanese characters more effectively.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-800">Comprehensive Resources</h3>
                <p className="text-gray-700">
                  Our platform includes extensive dictionaries, practice sessions, and study materials that cover multiple languages, providing learners with everything they need in one place.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-800">Progress Tracking</h3>
                <p className="text-gray-700">
                  Advanced analytics and progress tracking help learners stay motivated and see their improvement over time, making the learning journey more rewarding and measurable.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-800">Community Support</h3>
                <p className="text-gray-700">
                  We foster a supportive community where language learners can connect, share experiences, and motivate each other on their learning journey.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-6">
                              <p className="text-gray-700 leading-relaxed">
                  Language Teacher was born from a simple observation: traditional language learning methods often fail to engage learners and don&apos;t leverage the power of modern technology. Our founder, a passionate language learner themselves, experienced firsthand the challenges of memorizing characters and vocabulary.
                </p>
                              <p className="text-gray-700 leading-relaxed">
                  What started as a personal project to improve Japanese kanji learning has evolved into a comprehensive platform that serves learners of multiple languages. We&apos;ve combined the best of traditional learning methods with cutting-edge technology to create an experience that&apos;s both effective and enjoyable.
                </p>
              <p className="text-gray-700 leading-relaxed">
                Today, Language Teacher serves thousands of learners worldwide, helping them achieve their language goals through our innovative approach to digital language education.
              </p>
            </div>
          </section>

          {/* Technology Section */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Our Technology
            </h2>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                We leverage the latest web technologies to create a seamless, responsive learning experience:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Modern Web Platform</h4>
                  <p className="text-sm text-gray-600">Built with Next.js and React for optimal performance</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Cloud Infrastructure</h4>
                  <p className="text-sm text-gray-600">Scalable backend powered by Supabase</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Rich Data Sources</h4>
                  <p className="text-sm text-gray-600">Comprehensive dictionaries and learning materials</p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Our Team
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Language Teacher is built by a dedicated team of developers, educators, and language enthusiasts who are passionate about making language learning accessible to everyone. We combine technical expertise with deep understanding of language acquisition to create tools that truly work.
            </p>
          </section>

          {/* Values Section */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-800">Innovation</h4>
                <p className="text-gray-700">We constantly explore new ways to make language learning more effective and engaging.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-800">Accessibility</h4>
                <p className="text-gray-700">We believe quality language education should be available to everyone, regardless of their background.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-800">Quality</h4>
                <p className="text-gray-700">We maintain high standards in our content, technology, and user experience.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-800">Community</h4>
                <p className="text-gray-700">We foster a supportive environment where learners can grow together.</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-blue-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Start Your Language Journey?
            </h2>
            <p className="text-gray-700 mb-6">
              Join thousands of learners who are already using Language Teacher to achieve their language goals.
            </p>
            <a 
              href="/study" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Start Learning Today
            </a>
          </section>

        </div>
      </div>
    </div>
  )
}
