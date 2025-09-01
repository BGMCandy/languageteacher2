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

  const getAccuracyMessage = (acc: number) => {
    if (acc >= 90) return 'EXCELLENT! YOU\'RE A KANJI MASTER!'
    if (acc >= 80) return 'GREAT JOB! YOU\'RE DOING REALLY WELL!'
    if (acc >= 70) return 'GOOD WORK! KEEP PRACTICING!'
    if (acc >= 60) return 'NOT BAD! MORE PRACTICE WILL HELP!'
    return 'KEEP STUDYING! PRACTICE MAKES PERFECT!'
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="min-h-full w-full max-w-4xl mx-auto px-8 pt-4 pb-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-6 h-6 bg-black relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white"></div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-black tracking-wider mb-2">QUIZ COMPLETE</h1>
          <div className="h-px w-24 bg-black mx-auto"></div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={onRetake}
            className="px-6 py-3 bg-black text-white font-semibold tracking-wider hover:bg-gray-800 border-2 border-black transition-all cursor-pointer"
          >
            RETRY QUIZ
          </button>
          <button
            onClick={onBackToQuiz}
            className="px-6 py-3 bg-white text-black font-semibold tracking-wider hover:bg-black hover:text-white border-2 border-black transition-all cursor-pointer"
          >
            NEW QUIZ
          </button>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div className="border-2 border-black p-4 mb-6 text-center">
            <div className="text-black">
              <strong>NOTE:</strong> YOU&apos;RE NOT SIGNED IN, SO YOUR RESULTS WEREN&apos;T SAVED.
              <br />
              <Link href="/login" className="text-black hover:underline tracking-wider">
                SIGN IN TO TRACK YOUR PROGRESS
              </Link>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="border-2 border-black p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-black mb-4">
              {accuracy}%
            </div>
            <div className="text-xl text-gray-600 mb-2 tracking-wider">
              {getAccuracyMessage(accuracy)}
            </div>
            <div className="text-lg text-gray-500 tracking-wider">
              {correctAnswers} OUT OF {totalQuestions} CORRECT
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="border-2 border-black p-4 text-center">
              <div className="text-3xl font-bold text-black">{correctAnswers}</div>
              <div className="text-sm text-black tracking-wider">CORRECT ANSWERS</div>
            </div>
            <div className="border-2 border-black p-4 text-center">
              <div className="text-3xl font-bold text-black">{totalQuestions - correctAnswers}</div>
              <div className="text-sm text-black tracking-wider">INCORRECT ANSWERS</div>
            </div>
            <div className="border-2 border-black p-4 text-center">
              <div className="text-3xl font-bold text-black">{averageTime}S</div>
              <div className="text-sm text-black tracking-wider">AVERAGE TIME</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-black mb-4 tracking-wider">QUESTION REVIEW</h3>
            <div className="space-y-4">
              {results.map((result, index) => {
                const isCorrect = result.isCorrect
                
                return (
                  <div key={index} className="border-2 border-black p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-black tracking-wider">
                        QUESTION {index + 1}: {isCorrect ? '✓' : '✗'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round(result.timeSpent / 1000)}S
                      </span>
                    </div>
                    
                    {/* Kanji Character and Question */}
                    <div className="text-center mb-4">
                      <div className="text-6xl font-bold text-black mb-2">
                        {result.kanjiCharacter}
                      </div>
                      <div className="text-sm text-gray-600 tracking-wider">
                        {result.questionText}
                      </div>
                    </div>

                    {/* Answer Comparison */}
                    <div className="space-y-3">
                      <div className="border-2 border-gray-300 p-3">
                        <div className="text-sm text-gray-600 mb-1 tracking-wider">YOUR ANSWER:</div>
                        <div className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {result.userAnswer}
                        </div>
                      </div>
                      
                      {!isCorrect && (
                        <div className="border-2 border-green-500 bg-green-50 p-3">
                          <div className="text-sm text-green-600 mb-1 tracking-wider">CORRECT ANSWER:</div>
                          <div className="font-medium text-green-600">
                            {result.correctAnswer}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>


        {/* Bottom accent */}
        <div className="flex justify-center space-x-8 mt-8">
          <div className="w-2 h-2 bg-black"></div>
          <div className="w-2 h-2 bg-black"></div>
          <div className="w-2 h-2 bg-black"></div>
        </div>
      </div>
    </div>
  )
}
