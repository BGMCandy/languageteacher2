'use client'

import { QuizQuestion } from '../page'

interface PracticeResultsProps {
  results: {
    total: number
    correct: number
    incorrect: number
    questions: QuizQuestion[]
  }
  onRestart: () => void
  onNewPractice: () => void
}

export default function PracticeResults({ results, onRestart, onNewPractice }: PracticeResultsProps) {
  const percentage = Math.round((results.correct / results.total) * 100)
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 80) return 'text-blue-600 dark:text-blue-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    if (score >= 60) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding performance!'
    if (score >= 80) return 'Excellent work!'
    if (score >= 70) return 'Good job!'
    if (score >= 60) return 'Keep practicing!'
    return 'More practice needed'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Practice Complete
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Here's how you performed
          </p>
        </div>

        {/* Score Summary */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                {results.total}
              </div>
              <div className="text-slate-600 dark:text-slate-400">Total Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {results.correct}
              </div>
              <div className="text-slate-600 dark:text-slate-400">Correct</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {results.incorrect}
              </div>
              <div className="text-slate-600 dark:text-slate-400">Incorrect</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className={`text-5xl font-bold ${getScoreColor(percentage)} mb-2`}>
              {percentage}%
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              {getScoreMessage(percentage)}
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Question Review
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.questions.map((question, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  question.isCorrect 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    question.isCorrect 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {question.isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="text-2xl font-bold">{question.kanji.letter}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {question.question.includes('mean') ? 'Meaning' : 'Pronunciation'}
                  </div>
                </div>
                
                <div className="ml-9 space-y-1 text-sm">
                  <div className="text-slate-700 dark:text-slate-300">
                    <span className="font-medium">Your answer:</span> {question.userAnswer}
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    <span className="font-medium">Correct answer:</span> {question.correctAnswer}
                  </div>
                  {!question.isCorrect && (
                    <div className="text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Reading:</span> {question.kanji.reading}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 shadow-lg font-semibold"
          >
            Try Again
          </button>
          <button
            onClick={onNewPractice}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-semibold"
          >
            New Practice Session
          </button>
        </div>
      </div>
    </div>
  )
} 