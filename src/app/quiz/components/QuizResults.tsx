'use client'

import { useState, useEffect } from 'react'
import { QuizResult } from './KanjiQuiz'
import Link from 'next/link'
import { createClientBrowser } from '@/lib/supabase'

interface QuizResultsProps {
  results: QuizResult[]
  onRetake: () => void
  onBackToQuiz: () => void
}

export default function QuizResults({ results, onRetake, onBackToQuiz }: QuizResultsProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const totalQuestions = results.length
  const correctAnswers = results.filter(r => r.isCorrect).length
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100)
  const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0)
  const averageTime = Math.round(totalTime / totalQuestions / 1000) // Convert to seconds

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const supabase = createClientBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    } catch {
      setIsAuthenticated(false)
    }
  }

  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return 'text-green-600'
    if (acc >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAccuracyMessage = (acc: number) => {
    if (acc >= 90) return 'Excellent! You&apos;re a kanji master!'
    if (acc >= 80) return 'Great job! You&apos;re doing really well!'
    if (acc >= 70) return 'Good work! Keep practicing!'
    if (acc >= 60) return 'Not bad! More practice will help!'
    return 'Keep studying! Practice makes perfect!'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Quiz Complete!
        </h1>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
            <div className="text-yellow-800">
              <strong>Note:</strong> You&apos;re not signed in, so your results weren&apos;t saved. 
              <br />
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in to track your progress
              </Link>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold mb-4 ${getAccuracyColor(accuracy)}`}>
              {accuracy}%
            </div>
            <div className="text-xl text-gray-600 mb-2">
              {getAccuracyMessage(accuracy)}
            </div>
            <div className="text-lg text-gray-500">
              {correctAnswers} out of {totalQuestions} correct
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{correctAnswers}</div>
              <div className="text-sm text-blue-600">Correct Answers</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalQuestions - correctAnswers}</div>
              <div className="text-sm text-green-600">Incorrect Answers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{averageTime}s</div>
              <div className="text-sm text-purple-600">Average Time</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Question Review</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    result.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      Question {index + 1}: {result.isCorrect ? '✓' : '✗'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(result.timeSpent / 1000)}s
                    </span>
                  </div>
                  {!result.isCorrect && (
                    <div className="text-sm text-gray-600 mt-1">
                      Your answer: <span className="font-medium">{result.userAnswer}</span> | 
                      Correct: <span className="font-medium text-green-600">{result.correctAnswer}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetake}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Take Quiz Again
          </button>
          <button
            onClick={onBackToQuiz}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Back to Quiz Setup
          </button>
        </div>
      </div>
    </div>
  )
} 