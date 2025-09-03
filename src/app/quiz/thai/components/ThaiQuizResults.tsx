'use client'

import { useState } from 'react'
import { ThaiQuizResult } from './ThaiQuiz'

interface ThaiQuizResultsProps {
  results: ThaiQuizResult[]
  onRetake: () => void
  onBackToQuiz: () => void
}

export default function ThaiQuizResults({ results, onRetake, onBackToQuiz }: ThaiQuizResultsProps) {
  const [showDetails, setShowDetails] = useState(false)

  const correctCount = results.filter(result => result.isCorrect).length
  const totalQuestions = results.length
  const accuracy = Math.round((correctCount / totalQuestions) * 100)
  const totalTime = results.reduce((sum, result) => sum + result.timeSpent, 0)
  const averageTime = Math.round(totalTime / totalQuestions)

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600'
    if (accuracy >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAccuracyMessage = (accuracy: number) => {
    if (accuracy >= 90) return 'Excellent!'
    if (accuracy >= 80) return 'Great job!'
    if (accuracy >= 70) return 'Good work!'
    if (accuracy >= 60) return 'Not bad!'
    return 'Keep practicing!'
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Thai Quiz Complete!</h1>
          <div className="h-px w-24 bg-black mx-auto"></div>
        </div>

        {/* Results Summary */}
        <div className="border-2 border-black p-8 mb-8">
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-2 ${getAccuracyColor(accuracy)}`}>
              {accuracy}%
            </div>
            <div className="text-xl font-semibold text-black mb-2">
              {getAccuracyMessage(accuracy)}
            </div>
            <div className="text-gray-600">
              {correctCount} out of {totalQuestions} questions correct
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-black mb-1">{correctCount}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black mb-1">{totalQuestions - correctCount}</div>
              <div className="text-sm text-gray-600">Incorrect Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black mb-1">{Math.round(totalTime / 1000)}s</div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
          </div>

          {/* Average Time */}
          <div className="text-center">
            <div className="text-sm text-gray-600">
              Average time per question: {Math.round(averageTime / 1000)}s
            </div>
          </div>
        </div>

        {/* Question Details Toggle */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-all cursor-pointer font-semibold tracking-wider"
          >
            {showDetails ? 'HIDE DETAILS' : 'SHOW DETAILS'}
          </button>
        </div>

        {/* Question Details */}
        {showDetails && (
          <div className="border-2 border-gray-300 p-6 mb-8">
            <h3 className="text-xl font-semibold text-black mb-4 text-center">Question Details</h3>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 ${
                    result.isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-black">
                      Question {index + 1}
                    </div>
                    <div className={`text-sm font-medium ${
                      result.isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </div>
                  </div>
                  
                  <div className="text-lg font-bold text-black mb-2">
                    {result.thaiCharacter}
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-2">
                    {result.questionText}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-600">Your Answer:</div>
                      <div className={`font-semibold ${
                        result.isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {result.userAnswer}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">Correct Answer:</div>
                      <div className="font-semibold text-green-600">
                        {result.correctAnswer}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Time: {Math.round(result.timeSpent / 1000)}s | Type: {result.questionType} | Character: {result.characterType}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onRetake}
            className="px-6 py-3 bg-white text-black font-semibold tracking-wider hover:bg-black hover:text-white border-2 border-black transition-all cursor-pointer"
          >
            RETAKE QUIZ
          </button>
          
          <button
            onClick={onBackToQuiz}
            className="px-6 py-3 bg-black text-white font-semibold tracking-wider hover:bg-gray-800 border-2 border-black transition-all cursor-pointer"
          >
            BACK TO QUIZ SETUP
          </button>
        </div>
      </div>
    </div>
  )
}
