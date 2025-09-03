'use client'

import { useState } from 'react'
import { createClientBrowser } from '@/lib/supabase'
import { ExcerptGenerator } from '@/lib/services/excerptGenerator'
import { CreateExcerptRequest } from '@/lib/types/excerpts'

interface GenerateExcerptButtonProps {
  wordId: string
  wordText: string
  wordReading?: string
  wordMeaning?: string
  className?: string
}

export default function GenerateExcerptButton({
  wordId,
  wordText,
  wordReading,
  wordMeaning,
  className = ''
}: GenerateExcerptButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [contentType, setContentType] = useState<'contextual_text' | 'dialogue' | 'story' | 'explanation'>('contextual_text')
  const [customPrompt, setCustomPrompt] = useState('')
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientBrowser()
  const generator = new ExcerptGenerator()

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      setError(null)

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Please log in to generate excerpts')
        return
      }

      const request: CreateExcerptRequest = {
        word_id: wordId,
        word_text: wordText,
        word_reading: wordReading,
        word_meaning: wordMeaning,
        difficulty_level: difficulty,
        content_type: contentType,
        custom_prompt: customPrompt || undefined
      }

      const result = await generator.generateExcerpt(request)

      if (result.success && result.excerpt) {
        // Redirect to the new excerpt
        window.location.href = `/excerpts/${result.excerpt.slug}`
      } else {
        setError(result.error || 'Failed to generate excerpt')
      }
    } catch (error) {
      console.error('Error generating excerpt:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
      >
        Generate Excerpt
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Generate Learning Excerpt</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Word: {wordText}
                </label>
                {wordReading && (
                  <p className="text-sm text-gray-600">Reading: {wordReading}</p>
                )}
                {wordMeaning && (
                  <p className="text-sm text-gray-600">Meaning: {wordMeaning}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as 'contextual_text' | 'dialogue' | 'story' | 'explanation')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="contextual_text">Contextual Text</option>
                  <option value="dialogue">Dialogue</option>
                  <option value="story">Story</option>
                  <option value="explanation">Explanation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Prompt (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Add specific instructions for the AI..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none h-20"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
