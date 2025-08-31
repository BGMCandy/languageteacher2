'use client'

import { useAuth } from '@/contexts/AuthContext'
import SignOutButton from './SignOutButton'

export default function AccountContent() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your Language Teacher profile and preferences
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Profile Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {user.email}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    User ID
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg font-mono text-sm">
                    {user.id}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Sign In
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {new Date(user.last_sign_in_at || '').toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Learning Progress
              </h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Japanese Kanji
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700 dark:text-blue-300">Characters Studied</span>
                      <span className="text-blue-900 dark:text-blue-100 font-medium">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700 dark:text-blue-300">Mastery Level</span>
                      <span className="text-blue-900 dark:text-blue-100 font-medium">Beginner</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                    Thai Characters
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700 dark:text-green-300">Characters Studied</span>
                      <span className="text-green-900 dark:text-green-100 font-medium">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700 dark:text-green-300">Mastery Level</span>
                      <span className="text-green-900 dark:text-green-100 font-medium">Beginner</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="/kanji-poster"
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Study Kanji
              </a>
              
              <a
                href="/practice"
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Practice Mode
              </a>
              
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 