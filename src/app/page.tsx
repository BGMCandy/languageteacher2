import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Language Teacher
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/study" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Study</h2>
            <p className="text-gray-600">Practice with flashcards and learn new characters</p>
          </Link>

          <Link href="/practice" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Practice</h2>
            <p className="text-gray-600">Test your knowledge with practice sessions</p>
          </Link>

          <Link href="/languages" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Languages</h2>
            <p className="text-gray-600">Explore different language learning paths</p>
          </Link>
        </div>

        {/* Authentication Section */}
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
            <p className="text-gray-600 mb-6">Create an account or sign in to track your progress</p>
            <div className="space-y-3">
              <Link 
                href="/login" 
                className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In / Create Account
              </Link>
              <p className="text-sm text-gray-500">
                Free to use • No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
